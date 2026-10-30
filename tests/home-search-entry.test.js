const assert=(x,m)=>{if(!x)throw Error(m)},wait=()=>new Promise(r=>setTimeout(r,100));
for(const entry of [0,1]){
 Object.assign(state,{role:'Модель',query:'никого не найдёт',city:'несуществующий город',ageMin:'90',ageMax:'99',gender:'Мужской',genre:'неизвестный',type:'Коммерция'});
 selectTab('home');await wait();document.querySelectorAll('[data-home-search]')[entry].click();await wait();
 assert(state.tab==='search','search opens');assert(state.query===''&&state.role==='Все'&&state.city===''&&state.ageMin==='','stale filters reset');assert(document.querySelectorAll('[data-profile-card]').length>0,'full directory visible');
}
state.query='Анна';selectTab('home');await wait();selectTab('search');await wait();assert(state.query==='Анна','menu preserves search');
settings.language='en';applySettings();homeProfession('Стилист');await wait();assert(document.querySelector('[data-quick-role="Стилист"]').textContent==='Stylist','translated shortcut');assert(!document.querySelector('[data-clear-filter="role"]').textContent.includes('Бьюти'),'translated role chip');
homeProfession();await wait();state.query='Makeup';renderCards();assert(document.querySelector('[data-profile-card]'),'English specialty query');
settings.language='ru';applySettings();selectTab('home');await wait();return 'Fresh home searches, retained navigation filters and English specialties passed '+innerWidth;
