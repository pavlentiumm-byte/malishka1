"use strict";
function quickRoleSelected(role){return ['Визажист','Стилист'].includes(role)?state.role==='Бьюти-мастер'&&state.query===role:state.role===role;}
function searchShortcutsMarkup(){
  return `<div class="search-shortcuts" aria-label="${tr('Кого ищешь','Who are you looking for')}">${['Модель','Фотограф','Визажист','Стилист'].map(role=>`<button type="button" data-quick-role="${role}" aria-pressed="${quickRoleSelected(role)}">${settings.language==='en'?englishText(role):role}</button>`).join('')}<a href="#casting">${tr('Ищу команду / съёмку','Find a team / shoot')} ↗</a></div>`;
}
function activeSearchFilters(){
  const defaults={role:'Все',city:'',genre:'Все жанры',type:'Любые условия',gender:'',ageMin:'',ageMax:'',query:''};
  const names={role:tr('Роль','Role'),city:tr('Город','City'),genre:tr('Жанр','Genre'),type:tr('Условия','Terms'),gender:tr('Пол','Gender'),ageMin:tr('Возраст от','Age from'),ageMax:tr('Возраст до','Age to'),query:tr('Поиск','Search')};
  const root=document.getElementById('active-search-filters');if(!root)return;
  const keys=Object.keys(defaults).filter(k=>state[k]!==defaults[k]);
  root.innerHTML=keys.map(k=>`<button type="button" data-clear-filter="${k}" aria-label="${tr('Убрать фильтр','Remove filter')}: ${esc(names[k])}">${names[k]}: ${esc(state[k])}<span aria-hidden="true">×</span></button>`).join('')+(keys.length?`<button type="button" id="clear-search">${tr('Сбросить всё','Clear all')}</button>`:'');
  root.querySelectorAll('[data-clear-filter]').forEach(b=>b.onclick=()=>{state[b.dataset.clearFilter]=defaults[b.dataset.clearFilter];render();document.getElementById('query').focus();});
  root.querySelector('#clear-search')?.addEventListener('click',()=>{Object.assign(state,defaults);render();document.getElementById('query').focus();});
  document.querySelectorAll('[data-quick-role]').forEach(b=>{b.setAttribute('aria-pressed',String(quickRoleSelected(b.dataset.quickRole)));b.onclick=()=>{const role=b.dataset.quickRole,selected=quickRoleSelected(role);state.role=selected?'Все':['Визажист','Стилист'].includes(role)?'Бьюти-мастер':role;state.query=selected?'':['Визажист','Стилист'].includes(role)?role:'';document.getElementById('query').value=state.query;document.querySelectorAll('[data-role]').forEach(x=>x.classList.toggle('active',x.dataset.role===state.role));renderCards();};});
}
function profileSectionLinks(owner=false){
  return `<div role="navigation" class="profile-section-links" aria-label="${tr('Разделы профиля','Profile sections')}">${[['about','О профиле','About'],['work','Портфолио','Portfolio'],['schedule','Съёмки и даты','Shoots and dates'],['reviews','Отзывы','Reviews']].map(([id,ru,en])=>`<button type="button" data-profile-section="${id}">${tr(ru,en)}</button>`).join('')}${owner?`<a href="#settings">${tr('Настройки','Settings')} ↗</a>`:''}</div>`;
}
function bindProfileSections(root){root.querySelectorAll('[data-profile-section]').forEach(b=>b.onclick=()=>{const section=root.querySelector('#profile-'+b.dataset.profileSection);if(section){section.tabIndex=-1;section.focus({preventScroll:true});section.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'});}});}
