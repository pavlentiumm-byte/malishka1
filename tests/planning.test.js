// Run with: swift -module-cache-path /tmp/vkadre-test-cache tests/run.swift
const memory = {};
let storageFails = false, calendarFails = false, shoots = [], selectedTab = '';
const localStorage = {setItem(key,value) { if(storageFails)throw Error('quota'); memory[key]=value; }};
function read(key,fallback) { return memory['kadr-html-'+key] ? JSON.parse(memory['kadr-html-'+key]) : fallback; }
function tr(ru,en) { return ru; }
function toast() {}
function esc(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
function shootDateKey(date=new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
function calendarLocale() { return 'ru-RU'; }
function savedShoots() { return shoots; }
function saveShoots(items) { if(calendarFails)return false;shoots=items;return true; }
function selectTab(tab) { selectedTab=tab; }
const state={messages:{},profile:null};
const settings={language:'ru'};
let calendarDay='',calendarMonth='';
function assert(value,message) { if(!value)throw Error(message); }
function runPlanningTests() {
  const items=[
    {id:'a',city:'Москва',role:'Модель',date:'2026-11-12',format:'Оплата',responses:[{personId:0}]},
    {id:'b',city:'Санкт-Петербург',role:'Визажист',date:'2026-11-12',format:'TFP',closed:true},
    {id:'c',location:'Москва, студия',role:'Модель',date:'2020-01-01',format:'Paid'},
    {id:'d',city:'Москва',role:'Фотограф',date:'2026-11-14',format:'TFP'}
  ];
  const base={city:'',role:'',date:'',format:'',scope:'active'};
  assert(filterCastings(items,base,'2026-10-26').length===2,'active excludes past and closed');
  assert(filterCastings(items,{...base,city:'мОСК',role:'мод',date:'2026-11-12',format:'paid'},'2026-10-26')[0].id==='a','combined filters and legacy paid label');
  assert(filterCastings(items,{...base,scope:'all'},'2026-10-26').length===4,'all includes archived');
  assert(filterCastings(items,{...base,scope:'mine'},'2026-10-26').length===1,'my responses filters by participant');
  assert(filterCastings(items,{...base,scope:'all',city:'Москва',format:'paid'},'2026-10-26').length===2,'old location-only announcements remain searchable');
  assert(safeReferenceUrl('javascript:alert(1)')===null,'reject executable URL');
  assert(safeReferenceUrl('data:text/html,test')===null,'reject data links');
  assert(safeReferenceUrl('https://name:password@example.com')===null,'reject credentials');
  assert(safeReferenceUrl('https://example.com/ref')==='https://example.com/ref','allow web reference');
  assert(!referenceMarkup({id:'x',title:'<img>',image:'data:text/html,bad',url:'javascript:alert(1)'}).includes('<img>'),'escape reference title');
  assert(!referenceMarkup({id:'x',title:'x',url:'javascript:alert(1)'}).includes('href='),'unsafe reference cannot become link');

  const proposal={id:'p1',title:'Portrait',date:'2026-11-12',time:'12:00',location:'Studio',terms:'Photos',format:'TFP',participants:'A, B',status:'agreed'};
  assert(sendWorkflowMessage(2,proposal,'Proposal'),'proposal saves');
  assert(JSON.parse(memory['kadr-html-messages'])[2][0].proposal.id==='p1','proposal persists');
  const button={dataset:{agreementCalendar:'p1'}};
  bindAgreements({querySelectorAll:s=>s==='[data-agreement-calendar]'?[button]:[]},2);
  button.onclick();button.onclick();
  assert(shoots.length===1,'calendar addition is idempotent');
  assert(selectedTab==='calendar','addition opens calendar');
  const changed={...proposal,date:'2026-11-14',time:'15:30',location:'Park',tasks:[{id:'t1',done:true}],references:[{id:'r1',url:'https://example.com'}]};
  assert(persistProposal(2,changed),'reschedule succeeds');
  assert(shoots[0].date==='2026-11-14'&&shoots[0].location==='Park','reschedule synchronizes calendar');
  const before=state.messages,stored=memory['kadr-html-messages'];
  calendarFails=true;
  assert(!persistProposal(2,{...changed,date:'2026-11-15'}),'calendar failure rejects edit');
  assert(state.messages===before&&memory['kadr-html-messages']===stored,'calendar failure rolls messages back');
  calendarFails=false;storageFails=true;
  assert(!persistProposal(2,{...changed,date:'2026-11-16'}),'message storage failure rejects edit');
  assert(shoots[0].date==='2026-11-14'&&state.messages===before,'failure does not mutate calendar or state');
  storageFails=false;
  assert(persistProposal(2,{...changed,status:'cancelled',cancelReason:'Weather'}),'cancel succeeds');
  assert(shoots.length===0,'cancel removes calendar event');
  const cancelled=proposalById(2,'p1');
  assert(cancelled.cancelReason==='Weather'&&cancelled.tasks.length===1&&cancelled.references.length===1,'cancel preserves reason and materials');
  button.onclick();assert(shoots.length===0,'cancelled shoot cannot be re-added');

  const now=new Date('2026-11-12T10:00:00').getTime();
  shoots=[{id:'agreement-p2',title:'Upcoming',date:'2026-11-12',time:'12:00'}, {id:'past',date:'2026-11-12',time:'09:00'},{id:'later',date:'2026-11-20',time:'12:00'}];
  state.messages={2:[{proposal:{...proposal,id:'p2'},createdAt:now-172800000},{proposal:{...proposal,id:'pending',status:'proposed'},createdAt:now-90000000},{proposal:{...proposal,id:'cancelled',status:'cancelled'},createdAt:now-90000000}]};
  const reminders=collectReminders(now);
  assert(reminders.length===1,'reminders exclude past, distant, cancelled, retired proposals and duplicates');
  assert(!reminders.some(r=>r.id==='proposal:pending'),'retired proposals do not generate reminders');
  assert(reminders.some(r=>r.kind==='calendar'),'upcoming shoot reminder');
  workflowSave('castings',[{id:'job',responses:[{id:'r1',status:'pending',personId:0}]}]);
  assert(updateCasting('job',p=>({...p,responses:p.responses.map(r=>({...r,status:'invited'}))})),'invite saves');
  assert(workflowList('castings')[0].responses[0].status==='invited','response status persists');
  assert(!updateCasting('missing',p=>p),'missing announcement not mutated');
  workflowSave('availability',['2099-12-01','2000-01-01']);
  assert(availabilityMarkup(0).includes('2099-12-01')&&!availabilityMarkup(0).includes('2000-01-01'),'availability hides past');
  assert(!availabilityMarkup(2).includes('2099-12-01'),'own dates not leaked to other profile');
  assert(releaseNotesMarkup().includes('Команда и подготовка'),'new release notes visible');
  settings.language='en';assert(releaseNotesMarkup().includes('Team and shoot preparation'),'English release notes');
}
