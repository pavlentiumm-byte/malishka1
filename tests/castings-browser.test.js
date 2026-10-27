// Run in the isolated WebKit test store, never in a user's browser profile.
const wait=()=>new Promise(r=>setTimeout(r,180));
const assert=(v,m)=>{if(!v)throw Error(m);};
const fits=()=>{assert(document.documentElement.scrollWidth<=innerWidth+1,'page fits');const m=document.querySelector('.modal');if(m)assert(m.scrollWidth<=m.clientWidth+1,'form fits');};
selectTab('casting');await wait();document.querySelector('#new-casting').click();await wait();
let form=document.querySelector('#casting-editor');
for(const [k,v] of Object.entries({title:'Browser casting',description:'Concept',genre:'Portrait',city:'Moscow',location:'Studio',date:offsetDay(7),time:'12:00',author:'Local author',format:'paid',budget:'1000',deadline:offsetDay(3),referenceUrl:'https://example.com/reference'}))form.elements[k].value=v;
form.elements.format.dispatchEvent(new Event('change'));
form.querySelector('[data-role-name]').value='Model';form.querySelector('#add-casting-role').click();form.querySelectorAll('[data-role-name]')[1].value='Makeup';form.querySelectorAll('[data-role-count]')[1].value='2';fits();
form.requestSubmit();await wait();let item=castingSnapshot().items.find(p=>p.title==='Browser casting');assert(item&&item.roles.length===2&&item.references.length===1,'create full announcement');
document.querySelector(`[data-respond="${item.id}"]`).click();await wait();form=document.querySelector('#workflow-form');form.elements.name.value='Local participant';form.elements.text.value='Experience';form.requestSubmit();await wait();
let response=castingSnapshot().items.find(p=>p.id===item.id).responses[0];
document.querySelector(`[data-response="${response.id}"][data-response-status="invited"]`).click();await wait();document.querySelector(`[data-response="${response.id}"][data-response-status="accepted"]`).click();await wait();assert(castingSnapshot().items.find(p=>p.id===item.id).responses[0].status==='accepted','accept invitation');
document.querySelector(`[data-edit-casting="${item.id}"]`).click();await wait();form=document.querySelector('#casting-editor');form.elements.title.value='Edited casting';form.requestSubmit();await wait();assert(castingSnapshot().items.find(p=>p.id===item.id).title==='Edited casting','edit');
for(const language of ['ru','en'])for(const theme of ['light','dark']){settings.language=language;settings.theme=theme;applySettings();renderCasting();await wait();fits();openCastingEditor(item.id);await wait();fits();closeModal();}
renderCasting();document.querySelector(`[data-delete-casting="${item.id}"]`).click();await wait();closeModal();assert(castingSnapshot().items.some(p=>p.id===item.id),'dismiss delete preserves record');
document.querySelector(`[data-delete-casting="${item.id}"]`).click();await wait();document.querySelector('#workflow-form').requestSubmit();await wait();assert(!castingSnapshot().items.some(p=>p.id===item.id),'confirmed delete');
return 'casting create/edit/respond/accept/delete, roles, references, themes and languages; width '+innerWidth;
