// Intended for the isolated WebKit harness; not yet executed.
const wait=()=>new Promise(r=>setTimeout(r,150));
const assert=(v,m)=>{if(!v)throw Error(m);};
const fits=()=>{assert(document.documentElement.scrollWidth<=innerWidth+1,'page overflow');const modal=document.querySelector('.modal');if(modal)assert(modal.scrollWidth<=modal.clientWidth+1,'modal overflow');};
selectTab('teams');await wait();document.querySelector('#creative-new').click();await wait();
let form=document.querySelector('#workflow-form');form.elements.name.value='Browser team';form.elements['member-2'].checked=true;form.elements['role-2'].value='Model';form.requestSubmit();await wait();
let team=CreativeStore.list('teams').find(t=>t.name==='Browser team');assert(team?.members[0].id===2,'create team');document.querySelector('#creative-use-team').click();await wait();assert(document.querySelector('[name=creativeTeam]').value===team.id,'team selected in proposal');closeModal();
selectTab('groups');await wait();document.querySelector('#creative-new').click();await wait();form=document.querySelector('#workflow-form');form.elements.name.value='Browser group';form.elements['member-2'].checked=true;form.requestSubmit();await wait();
form=document.querySelector('#creative-compose');form.elements.text.value='<b>literal text</b>';form.requestSubmit();await wait();assert(document.querySelector('.creative-messages').textContent.includes('<b>literal text</b>'),'message escaped');assert(!document.querySelector('.creative-messages b'),'no HTML injection');
selectTab('boards');await wait();document.querySelector('#creative-new').click();await wait();form=document.querySelector('#workflow-form');form.elements.name.value='Browser board';form.requestSubmit();await wait();
for(const title of ['First','Second']){document.querySelector('#creative-add-reference').click();await wait();form=document.querySelector('#creative-reference-form');form.elements.title.value=title;form.elements.url.value='https://example.com';form.elements.comment.value='Comment '+title;form.requestSubmit();await wait();}
const board=CreativeStore.list('boards').find(b=>b.name==='Browser board');document.querySelector(`[data-ref-move="${board.items[1].id}"][data-step="-1"]`).click();await wait();assert(CreativeStore.list('boards').find(b=>b.id===board.id).items[0].title==='Second','reorder references');
for(const language of ['ru','en'])for(const theme of ['light','dark']){settings.language=language;settings.theme=theme;applySettings();renderCreative('boards');await wait();fits();}
document.querySelector('#creative-delete').click();await wait();closeModal();assert(CreativeStore.list('boards').some(b=>b.id===board.id),'dismiss delete preserves board');
return 'teams, proposal roster, group text, linked references, comments, reordering, themes; width '+innerWidth;
