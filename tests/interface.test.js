const wait=()=>new Promise(r=>setTimeout(r,120));
const assert=(value,message)=>{if(!value)throw Error(message);};
const fill=(form,values)=>{for(const [key,value] of Object.entries(values))form.elements.namedItem(key).value=value;form.requestSubmit();};
const fits=label=>{
  assert(document.documentElement.scrollWidth<=innerWidth+1,label+' page overflow '+document.documentElement.scrollWidth+'/'+innerWidth);
  const modal=document.querySelector('.modal');if(modal)assert(modal.scrollWidth<=modal.clientWidth+1,label+' modal overflow');
  const header=document.querySelector('header'),logo=document.querySelector('.header-location'),actions=document.querySelector('.header-actions');
  assert(logo.getBoundingClientRect().right<=actions.getBoundingClientRect().left+1,label+' header collision');
  assert(header.getBoundingClientRect().right<=innerWidth+1,label+' header overflow');
};
assert(typeof openProposal==='undefined','proposal creation removed');
assert(!document.querySelector('nav a[href="#calendar"]'),'calendar absent from primary nav');
assert(document.querySelector('nav a[href="#profile"]'),'profile in primary nav');
for(const route of ['home','search','casting','messages','profile','calendar','portfolio','saved','settings','membership','reminders']) {
  selectTab(route);await wait();fits(route);
  assert(!document.querySelector('#plan-shoot'),'no proposal button on '+route);
}
selectTab('profile');await wait();assert(document.querySelector('.profile-tools a[href="#calendar"]'),'calendar discoverable in profile');
document.querySelector('.profile-tools a[href="#calendar"]').click();await wait();
assert(state.tab==='calendar','profile calendar link works');
document.querySelector('#calendar-add').click();await wait();fits('calendar form');
fill(document.querySelector('#shoot-form'),{title:'Тестовая съёмка',date:offsetDay(3),time:'13:00',location:'Студия',notes:'Личная запись'});await wait();
assert(document.querySelector('.shoot-entry').textContent.includes('Тестовая съёмка'),'manual calendar creation works');
selectTab('membership');await wait();
assert(!document.querySelector('[href*="checkout"]'),'no accidental checkout');
document.querySelector('[value="portfolio"]').click();document.querySelector('#membership-preferences').requestSubmit();
assert(read('membership-preferences',[]).includes('portfolio'),'preferences persist');renderMembership();assert(document.querySelector('[value="portfolio"]').checked,'preferences restored');
selectTab('settings');await wait();assert(document.querySelector('.subscription-settings a'),'Pro in settings');
document.querySelector('[data-section="appearance"]').open=true;
document.querySelector('[name="theme-setting"][value="dark"]').click();await wait();
assert(settings.theme==='dark'&&document.documentElement.dataset.theme==='dark','theme toggle works');fits('dark settings');
openProfile();await wait();fits('registration');
assert(document.querySelectorAll('.file-control').length>=1,'file input upgraded');
assert(document.querySelector('#profile-photo').classList.contains('file-native'),'original file input preserved');
const canvas=document.createElement('canvas');canvas.width=100;canvas.height=120;canvas.getContext('2d').fillRect(0,0,100,120);
const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
const transfer=new DataTransfer();transfer.items.add(new File([blob],'portrait.png',{type:'image/png'}));
const input=document.querySelector('#profile-photo');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));await wait();await wait();
assert(!document.querySelector('#crop-panel').hidden,'photo upload still opens cropper');
assert(document.querySelector('.file-name').textContent==='portrait.png','filename displayed');
document.querySelector('#apply-crop').click();await wait();assert(!document.querySelector('#profile-preview').hidden,'crop result previews');
closeModal();
state.chat=2;selectTab('messages');await wait();fits('selected chat');assert(!document.querySelector('#plan-shoot'),'proposal absent in chat');
selectTab('search');await wait();openPerson(2);await wait();fits('person preview');assert(!document.querySelector('.preview-actions').textContent.includes('Предложить'),'proposal absent in person preview');closeModal();
// Full profile and English labels exercise long text and theme-independent widths.
selectTab('user/'+personUsername(people[1]));await wait();fits('full profile');
settings.language='en';applySettings();selectTab('membership');await wait();fits('English Pro');
settings.language='ru';settings.theme='light';applySettings();selectTab('profile');await wait();fits('final profile');
return 'responsive routes, header, hidden calendar, removed proposals, calendar creation, Pro preferences, theme, file upload and cropping; width '+innerWidth;
