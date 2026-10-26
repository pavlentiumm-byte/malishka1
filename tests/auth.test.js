const assert=(value,message)=>{if(!value)throw Error(message);};
const before=JSON.stringify(state.profile),stored=localStorage.getItem('kadr-html-profile');
openProfile();
assert(document.querySelectorAll('[data-sign-in-provider]').length===4,'four providers shown');
let submits=0;document.querySelector('#profile-form').addEventListener('submit',()=>submits++);
for(const button of document.querySelectorAll('[data-sign-in-provider]')) {
  assert(button.type==='button'&&button.getAttribute('aria-disabled')==='true','unconnected button semantics');
  button.click();
  assert(!document.querySelector('#provider-status').hidden,'provider explanation visible');
}
assert(submits===0,'provider actions never submit registration');
assert(JSON.stringify(state.profile)===before&&localStorage.getItem('kadr-html-profile')===stored,'no fake authentication or profile');
assert(document.querySelector('#profile-form [name="name"]'),'local profile remains available');
settings.language='en';openProfile();
assert(document.querySelector('.registration-options').textContent.includes('Not connected'),'English unavailable state');
settings.language='ru';openProfile();
assert(document.querySelector('.modal').scrollWidth<=document.querySelector('.modal').clientWidth+1,'registration fits mobile');
return 'registration providers, unavailable state, no form submission, no fake account, bilingual labels, mobile layout';
