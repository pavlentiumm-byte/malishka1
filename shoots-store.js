"use strict";

// Single-record adapter boundary for a future API. No identities or tokens are stored.
// Chat cards and calendar entries are projections: one atomic write updates both views.
const ShootRepository = (() => {
  const key='kadr-html-projects-v1';
  const states=['draft','pending','confirmed','cancelled','completed'];
  const formats=['tfp','paid','discuss'];
  const limits={title:100,concept:2000,date:10,time:5,city:100,location:250,amount:20,currency:3,role:100,requirements:2000,comment:2000};
  const timestamp=value=>Number.isFinite(value)&&value>=0&&value<=8640000000000000;
  const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const text=(value,max=2000)=>typeof value==='string'?value.slice(0,max):'';
  function normalize(value) {
    if(!object(value)||typeof value.id!=='string'||!/^shoot-[a-zA-Z0-9-]+$/.test(value.id)||!Number.isInteger(value.recipientId)||value.recipientId<=0||!states.includes(value.status)||!Number.isInteger(value.rev)||value.rev<1)return null;
    const record={id:value.id,rev:value.rev,recipientId:value.recipientId,status:value.status,format:formats.includes(value.format)?value.format:'discuss',duration:Number.isInteger(value.duration)?value.duration:60};
    for(const [field,max] of Object.entries(limits))record[field]=text(value[field],max);
    record.currency=['RUB','USD','EUR'].includes(record.currency)?record.currency:'RUB';
    record.response=['pending','accepted','declined'].includes(value.response)?value.response:'pending';
    record.reason=text(value.reason,1000);
    for(const field of ['createdAt','updatedAt','sentAt'])record[field]=timestamp(value[field])?value[field]:0;
    record.participants=Array.isArray(value.participants)?value.participants.filter(p=>object(p)&&Number.isInteger(p.id)&&p.id>=0).slice(0,50).map(p=>({id:p.id,name:text(p.name,100),role:text(p.role,100)})):[];
    record.history=Array.isArray(value.history)?value.history.filter(h=>object(h)&&timestamp(h.at)&&typeof h.action==='string').map(h=>({at:h.at,action:text(h.action,30),actor:text(h.actor,30),from:text(h.from,20),to:text(h.to,20),revision:Number.isInteger(h.revision)?h.revision:1,note:text(h.note,1000),changes:Array.isArray(h.changes)?h.changes.filter(c=>object(c)&&typeof c.field==='string').map(c=>({field:text(c.field,30),from:text(c.from,2000),to:text(c.to,2000)})):[]})):[];
    return record;
  }
  function snapshot() {
    try {
      const raw=localStorage.getItem(key);
      if(raw===null)return {revision:0,records:[],error:null};
      const data=JSON.parse(raw);
      if(!object(data)||data.schemaVersion!==1||!Array.isArray(data.records)||!Number.isInteger(data.revision))return {revision:0,records:[],error:'schema'};
      const records=data.records.map(normalize),ids=new Set(records.filter(Boolean).map(p=>p.id));
      return {revision:data.revision,records:records.filter(Boolean),error:records.some(p=>!p)||ids.size!==records.length?'corrupt':null};
    } catch { return {revision:0,records:[],error:'storage'}; }
  }
  function validDate(value) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
    const date=new Date(value+'T12:00:00');
    return !Number.isNaN(date.getTime())&&date.getFullYear()>=1900&&date.getFullYear()<=2100&&`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`===value;
  }
  function validation(record,complete=false) {
    for(const [field,max] of Object.entries(limits))if(typeof record[field]!=='string'||record[field].length>max)return field;
    if(record.date&&!validDate(record.date))return 'date';
    if(record.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(record.time))return 'time';
    if(!Number.isInteger(record.duration)||record.duration<15||record.duration>1440)return 'duration';
    if(!formats.includes(record.format))return 'format';
    if(complete) {
      for(const field of ['title','concept','date','time','city','location','role'])if(!record[field].trim())return field;
      if(record.format==='paid'&&(!/^\d{1,9}(\.\d{1,2})?$/.test(record.amount)||Number(record.amount)<=0))return 'amount';
    }
    return null;
  }
  function write(snapshot,records) {
    if(snapshot.error)return {ok:false,error:snapshot.error};
    try {
      localStorage.setItem(key,JSON.stringify({schemaVersion:1,revision:snapshot.revision+1,records}));
      return {ok:true};
    } catch { return {ok:false,error:'quota'}; }
  }
  function fields(value) {
    const record={};
    for(const field of Object.keys(limits))record[field]=typeof value[field]==='string'?value[field].trim():'';
    record.duration=Number(value.duration);record.format=value.format;
    record.currency=['RUB','USD','EUR'].includes(value.currency)?value.currency:'RUB';
    if(record.format!=='paid')record.amount='';
    return record;
  }
  function create(recipientId,value,participants) {
    const store=snapshot();if(store.error)return {ok:false,error:store.error};
    if(!Number.isInteger(recipientId)||recipientId<1)return {ok:false,error:'recipient'};
    const now=Date.now(),record={...fields(value),id:'shoot-'+now.toString(36)+'-'+Math.random().toString(36).slice(2),recipientId,status:'draft',response:'pending',rev:1,createdAt:now,updatedAt:now,sentAt:0,reason:'',participants,history:[]};
    const invalid=validation(record);if(invalid)return {ok:false,error:'validation',field:invalid};
    record.history.push({at:now,action:'created',actor:'organizer',from:'',to:'draft',revision:1,note:'',changes:[]});
    const safe=normalize(record);if(!safe)return {ok:false,error:'validation'};
    const result=write(store,[safe,...store.records]);return {...result,record:result.ok?safe:null};
  }
  function edit(id,expectedRevision,value) {
    const store=snapshot(),old=store.records.find(p=>p.id===id);
    if(store.error)return {ok:false,error:store.error};
    if(!old)return {ok:false,error:'missing'};
    if(old.rev!==expectedRevision)return {ok:false,error:'conflict'};
    if(['cancelled','completed'].includes(old.status))return {ok:false,error:'transition'};
    const record={...old,...fields(value)};
    const invalid=validation(record,old.status!=='draft');if(invalid)return {ok:false,error:'validation',field:invalid};
    const changes=[...Object.keys(limits),'duration','format'].filter(field=>String(old[field])!==String(record[field])).map(field=>({field,from:String(old[field]),to:String(record[field])}));
    if(!changes.length)return {ok:true,record:old};
    record.participants=old.participants.map(p=>p.id===old.recipientId?{...p,role:record.role}:p);
    const reapproval=old.status==='confirmed'&&changes.some(change=>change.field!=='comment');record.status=reapproval?'pending':old.status;
    record.response=reapproval?'pending':old.response;record.updatedAt=Date.now();record.rev++;
    record.history=[...old.history,{at:record.updatedAt,action:reapproval?'reapproval':'edited',actor:'organizer',from:old.status,to:record.status,revision:record.rev,note:'',changes}];
    const result=write(store,store.records.map(p=>p.id===id?record:p));return {...result,record:result.ok?record:null};
  }
  function transition(id,expectedRevision,action,note='') {
    const store=snapshot(),old=store.records.find(p=>p.id===id);
    if(store.error)return {ok:false,error:store.error};
    if(!old)return {ok:false,error:'missing'};
    if(old.rev!==expectedRevision)return {ok:false,error:'conflict'};
    const allowed={send:['draft'],accept:['pending'],decline:['pending'],cancel:['draft','pending','confirmed'],complete:['confirmed'],discuss:['pending']};
    if(!allowed[action]?.includes(old.status))return {ok:false,error:'transition'};
    if(action==='send'||action==='accept'){const invalid=validation(old,true);if(invalid)return {ok:false,error:'validation',field:invalid};}
    if(['decline','cancel'].includes(action)&&(!note.trim()||note.length>1000))return {ok:false,error:'reason'};
    const nextState={send:'pending',accept:'confirmed',decline:'cancelled',cancel:'cancelled',complete:'completed',discuss:'pending'}[action];
    const now=Date.now(),record={...old,status:nextState,updatedAt:now,rev:old.rev+1};
    if(action==='send')record.sentAt=now;
    if(action==='accept')record.response='accepted';
    if(action==='decline')record.response='declined';
    if(['decline','cancel'].includes(action))record.reason=note.trim();
    record.history=[...old.history,{at:now,action,actor:['accept','decline','discuss'].includes(action)?'recipient-demo':'organizer',from:old.status,to:nextState,revision:record.rev,note:note.trim(),changes:[]}];
    const result=write(store,store.records.map(p=>p.id===id?record:p));return {...result,record:result.ok?record:null};
  }
  return {key,snapshot,normalize,validation,validDate,create,edit,transition,get:id=>snapshot().records.find(p=>p.id===id)||null};
})();
