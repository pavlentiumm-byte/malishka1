"use strict";
// Independent versioned store: existing personal chats and attachments are untouched.
const CreativeStore=(()=>{
  const key='kadr-html-creative-v1',kinds=['teams','groups','boards'];
  function valid(x){return x&&typeof x.id==='string'&&typeof x.name==='string'&&Number.isInteger(x.rev)&&Array.isArray(x.members)&&x.members.every(m=>m&&Number.isInteger(m.id)&&typeof m.name==='string'&&typeof m.role==='string')&&Array.isArray(x.items)&&x.items.every(i=>i&&typeof i.id==='string'&&(i.at===undefined||Number.isFinite(i.at)&&Math.abs(i.at)<=8640000000000000));}
  function snapshot(){try{const raw=localStorage.getItem(key),data=raw?JSON.parse(raw):{version:1,teams:[],groups:[],boards:[]};if(data.version!==1||kinds.some(k=>!Array.isArray(data[k])||data[k].some(x=>!valid(x))))throw Error();return {raw,data};}catch{return {error:true};}}
  function list(kind){return snapshot().data?.[kind]||[];}
  function put(kind,record,expected=null){const snap=snapshot();if(snap.error||!kinds.includes(kind))return {error:'storage'};const previous=snap.data[kind].find(x=>x.id===record.id);if((previous?.rev??null)!==expected)return {error:'conflict'};const next={...record,rev:(previous?.rev||0)+1};if(!next.name?.trim()||next.name.length>100||!valid(next))return {error:'invalid'};snap.data[kind]=previous?snap.data[kind].map(x=>x.id===next.id?next:x):[next,...snap.data[kind]];try{if(localStorage.getItem(key)!==snap.raw)return {error:'conflict'};localStorage.setItem(key,JSON.stringify(snap.data));return {record:next};}catch{return {error:'storage'};}}
  function remove(kind,id,rev){const snap=snapshot();if(snap.error)return false;const old=snap.data[kind]?.find(x=>x.id===id);if(!old||old.rev!==rev)return false;snap.data[kind]=snap.data[kind].filter(x=>x.id!==id);try{if(localStorage.getItem(key)!==snap.raw)return false;localStorage.setItem(key,JSON.stringify(snap.data));return true;}catch{return false;}}
  function move(record,id,step){const items=[...record.items],index=items.findIndex(x=>x.id===id),next=index+step;if(index<0||next<0||next>=items.length)return record;[items[index],items[next]]=[items[next],items[index]];return {...record,items};}
  return {snapshot,list,put,remove,move};
})();
