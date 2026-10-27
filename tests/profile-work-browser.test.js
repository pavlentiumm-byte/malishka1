// Prepared for the isolated WebKit harness; not yet run.
const wait=()=>new Promise(r=>setTimeout(r,160));
const assert=(v,m)=>{if(!v)throw Error(m);};
selectTab('portfolio');await wait();
for(let i=0;i<30&&portfolioBusy;i++)await wait();
let form=document.querySelector('#new-project');form.elements.name.value='Stage five';form.requestSubmit();await wait();
for(let i=0;i<30&&portfolioBusy;i++)await wait();
document.querySelector('#edit-project-details').click();await wait();form=document.querySelector('#workflow-form');form.elements.concept.value='<b>Concept</b>';form.elements.date.value='2020-01-01';form.elements.genre.value='Portrait';form.elements.rights.value='By permission';form.elements['member-2'].checked=true;form.elements['role-2'].value='Model';form.requestSubmit();await wait();
assert(document.querySelector('.portfolio-metadata').textContent.includes('<b>Concept</b>'),'metadata text escaped');assert(!document.querySelector('.portfolio-metadata b'),'no HTML injection');assert(portfolioMetadata(portfolio.find(p=>p.id===selectedProject)).members[0].confirmation==='unconfirmed','tag unconfirmed');
selectTab('profile');await wait();document.querySelector('#verification-request').click();await wait();document.querySelector('#workflow-form').requestSubmit();await wait();assert(ProfileWorkStore.snapshot().data.verification.status==='local-request','request stays local');
const p=ShootRepository.create(2,{title:'Review project',concept:'Concept',date:offsetDay(2),time:'12:00',duration:60,city:'City',location:'Studio',format:'tfp',role:'Model'},[{id:0,name:'Me',role:'Organizer'},{id:2,name:'Member',role:'Model'}]);
assert(p.record,'project created');let record=p.record;
for(const action of ['send','accept','complete']){const result=ShootRepository.transition(record.id,record.rev,action);assert(result.record,action);record=result.record;}
openShootDetails(record.id);await wait();document.querySelector('#shoot-review').click();await wait();form=document.querySelector('#workflow-form');form.elements.text.value='Test cooperation';form.requestSubmit();await wait();closeModal();selectTab('profile');await wait();assert(document.querySelector('.work-reviews').textContent.includes('Test cooperation'),'authored review in own profile');
document.querySelector('[data-review-report]').click();await wait();document.querySelector('#workflow-form').requestSubmit();await wait();assert(ProfileWorkStore.snapshot().data.reports[0].status==='draft','report not submitted');
for(const language of ['ru','en'])for(const theme of ['light','dark']){settings.language=language;settings.theme=theme;applySettings();renderProfilePage();await wait();assert(document.documentElement.scrollWidth<=innerWidth+1,'profile fits');}
return 'portfolio metadata, local tags, local verification request, completed-shoot review and draft report';
