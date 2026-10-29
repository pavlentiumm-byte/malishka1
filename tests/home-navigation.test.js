const assert=(v,m)=>{if(!v)throw Error(m)},wait=()=>new Promise(r=>setTimeout(r,100));
selectTab('home');await wait();assert(document.querySelector('.home-lead'),'home');assert(!document.querySelector('.ad-placeholder'),'ads hidden');
document.querySelector('#home-create').click();assert(document.querySelector('#home-plan'),'create options');document.querySelector('#home-plan').click();assert(document.querySelector('#shoot-form'),'calendar creation');closeModal();
openHomeShoot();document.querySelector('#home-casting').click();assert(document.querySelector('#casting-editor'),'casting editor');closeModal();
for(const route of ['home','search','casting','messages','calendar','profile','saved','more','settings']){selectTab(route);await wait();assert(document.documentElement.scrollWidth<=innerWidth+1,'overflow '+route);assert(document.querySelector('nav a.active'),'active '+route);}
selectTab('more');await wait();for(const r of ['calendar','boards','teams','locations','statistics','settings','safety','membership'])assert(document.querySelector('#content a[href="#'+r+'"]'),'missing '+r);
selectTab('home');await wait();return 'Stage 2 navigation, creation actions, More destinations and layout passed at '+innerWidth;
