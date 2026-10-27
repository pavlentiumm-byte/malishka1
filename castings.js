"use strict";

const castingFilters = {city:'', role:'', genre:'', date:'', format:'', scope:'active'};
const responseLabels = () => ({pending:tr('На рассмотрении','Pending'), invited:tr('Приглашён в команду','Invited to team'), accepted:tr('Принят в команду','Accepted'), declined:tr('Отклонён','Declined')});
function paidFormat(value) { return ['paid','Оплата','Paid','Коммерция'].includes(value) ? 'paid' : ['discuss','Обсуждается'].includes(value) ? 'discuss' : 'TFP'; }
function formatLabel(value) { return paidFormat(value)==='paid' ? tr('Оплата','Paid') : paidFormat(value)==='discuss' ? tr('Обсуждается','To discuss') : 'TFP'; }
function filterCastings(items, filters, today=shootDateKey()) {
  const contains=(value,query)=>String(value||'').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  return items.filter(item => (!item.authorId || !SafetyStore.blocked(item.authorId)) && (!filters.city || contains(item.city||item.location,filters.city)) &&
    (!filters.role || contains(castingRoles(item).map(r=>r.name).join(' '),filters.role)) && (!filters.genre || contains(item.genre,filters.genre)) && (!filters.date || item.date===filters.date) &&
    (!filters.format || paidFormat(item.format)===filters.format) &&
    (filters.scope!=='active' || (!item.closed && item.date>=today && (!item.deadline || item.deadline>=today))) &&
    (filters.scope!=='mine' || (item.responses||[]).some(r=>r.personId===0)));
}
function updateCasting(id, transform) {
  return mutateCasting(id, transform);
}
function responseMarkup(casting,response) {
  if(SafetyStore.blocked(response.personId))return "";
  const person=response.personId===0?state.profile:shootPerson(response.personId);
  const profile=person ? (response.personId===0?'#profile':'#user/'+encodeURIComponent(personUsername(person))) : null;
  return `<article class="casting-response"><div><strong>${esc(response.name)}</strong><span class="planning-status">${responseLabels()[response.status||'pending']}</span></div><p>${esc(response.text)}</p><p>${esc(response.role||'')}</p><div class="workflow-actions">
    ${profile?`<a href="${profile}">${tr('Профиль','Profile')} ↗</a>`:''}
    ${response.personId>0?`<button data-response-chat="${response.personId}">${tr('Обсудить','Discuss')}</button>`:''}
    <button data-response-status="invited" data-casting="${esc(casting.id)}" data-response="${esc(response.id)}" ${['invited','accepted'].includes(response.status)||!castingIsOpen(casting)?'disabled':''}>${tr('Пригласить','Invite')}</button>
    ${response.status==='invited'?`<button data-response-status="accepted" data-casting="${esc(casting.id)}" data-response="${esc(response.id)}" ${!castingIsOpen(casting)?'disabled':''}>${tr('Принять приглашение · демо','Accept invitation · demo')}</button>`:''}
    <button data-response-status="declined" data-casting="${esc(casting.id)}" data-response="${esc(response.id)}" ${response.status==='declined'?'disabled':''}>${tr('Отклонить','Decline')}</button>
    ${response.status&&response.status!=='pending'?`<button data-response-status="pending" data-casting="${esc(casting.id)}" data-response="${esc(response.id)}">${tr('На рассмотрение','Reconsider')}</button>`:''}
  </div></article>`;
}
function castingCard(item) {
  const expired=item.date<shootDateKey() || (item.deadline && item.deadline<shootDateKey()), own=(item.responses||[]).find(r=>r.personId===0);
  return `<article class="surface casting-card"><span class="eyebrow">${esc(castingRoles(item).map(r=>r.name+' · '+(item.responses||[]).filter(p=>p.status==='accepted'&&(p.role||castingRoles(item)[0].name)===r.name).length+'/'+r.count).join(', '))} · ${formatLabel(item.format)}</span><h2>${esc(item.title)}</h2><p>${esc(item.date)} · ${esc(item.time)}</p><p>${esc(item.city||'')} ${esc(item.location)}</p><p>${esc(item.terms)}</p>${castingExtraMarkup(item)}<p>${tr('Автор','Author')}: ${esc(item.author)}</p>
    ${item.demo?`<span class="planning-status">${tr('Пример объявления','Example announcement')}</span>`:''}
    ${item.closed||expired?`<p class="planning-status">${item.closed?tr('Набор закрыт','Recruitment closed'):tr('Срок набора истёк','Recruitment period ended')}</p>`:''}
    ${own?`<p>${tr('Твой отклик','Your response')}: <strong>${responseLabels()[own.status||'pending']}</strong></p>`:''}
    <div class="workflow-actions"><button data-respond="${esc(item.id)}" ${item.closed||expired||own?'disabled':''}>${own?tr('Отклик сохранён','Response saved'):tr('Откликнуться','Respond')}</button><button data-close-casting="${esc(item.id)}">${item.closed?tr('Открыть набор','Reopen'):tr('Закрыть набор','Close recruitment')}</button></div>
    <div class="workflow-actions"><button data-report-casting="${esc(item.id)}">${tr('Пожаловаться','Report')}</button><button data-edit-casting="${esc(item.id)}">${tr('Редактировать','Edit')}</button><button data-delete-casting="${esc(item.id)}">${tr('Удалить','Delete')}</button></div><details><summary>${tr('Отклики','Responses')} (${(item.responses||[]).length})</summary>${(item.responses||[]).length?(item.responses||[]).map(r=>responseMarkup(item,r)).join(''):`<p>${tr('Откликов пока нет.','No responses yet.')}</p>`}</details></article>`;
}
function renderCasting() {
  const snapshot=castingSnapshot(),items=snapshot.items;
  const content=document.getElementById('content');
  content.innerHTML=pageIntro(tr('Поиск команды','Find a team'),tr('Найди съёмку или собери людей для своей идеи.','Find a shoot or bring people together for your idea.'))+`
    ${snapshot.error?`<p role="alert">${esc(snapshot.error)}</p>`:''}<div class="workflow-actions"><button class="primary" id="new-casting">＋ ${tr('Создать объявление','Create announcement')}</button><button id="demo-castings">${tr('Добавить примеры для просмотра','Add examples to explore')}</button></div>
    <p class="demo-banner">${tr('Локальная демонстрация: здесь можно попробовать действия автора и участника. Статусы видны в «Моих откликах», но другим людям не отправляются.','Local demo: try both organizer and participant actions. Statuses appear in My responses but are not sent to other people.')}</p>
    <form id="casting-filters" class="surface casting-filters">
      ${workflowField('city',tr('Город','City'),'text',castingFilters.city,false)}${workflowField('role',tr('Роль','Role'),'text',castingFilters.role,false)}${workflowField('genre',tr('Жанр','Genre'),'text',castingFilters.genre,false)}
      <label class="form-label">${tr('Дата','Date')}<input name="date" type="date" value="${esc(castingFilters.date)}"></label>
      <label class="form-label">${tr('Условия','Terms')}<select name="format"><option value="">${tr('Любые','Any')}</option><option value="TFP" ${castingFilters.format==='TFP'?'selected':''}>TFP</option><option value="paid" ${castingFilters.format==='paid'?'selected':''}>${tr('Оплата','Paid')}</option><option value="discuss" ${castingFilters.format==='discuss'?'selected':''}>${tr('Обсуждается','To discuss')}</option></select></label>
      <label class="form-label">${tr('Показать','Show')}<select name="scope">${[['active',tr('Актуальные','Active')],['all',tr('Все объявления','All announcements')],['mine',tr('Мои отклики','My responses')]].map(([id,label])=>`<option value="${id}" ${castingFilters.scope===id?'selected':''}>${label}</option>`).join('')}</select></label>
      <button type="button" id="reset-casting-filters">${tr('Сбросить','Reset')}</button>
    </form><p id="casting-count" role="status"></p><div class="casting-grid" id="casting-results"></div>`;
  const draw=()=>{const filtered=filterCastings(castingSnapshot().items,castingFilters);document.getElementById('casting-count').textContent=tr('Объявлений: ','Announcements: ')+filtered.length;document.getElementById('casting-results').innerHTML=filtered.length?filtered.map(castingCard).join(''):`<section class="surface"><h2>${tr('Пока ничего не найдено','No matches yet')}</h2><p>${items.length?tr('Измени фильтры или покажи все объявления.','Change the filters or show all announcements.'):tr('Создай объявление или добавь примеры, чтобы попробовать отклики.','Create an announcement or add examples to try responding.')}</p></section>`;bindCastingActions(content);};
  const form=document.getElementById('casting-filters');form.onsubmit=e=>e.preventDefault();form.oninput=()=>{Object.assign(castingFilters,Object.fromEntries(new FormData(form)));draw();};form.onchange=form.oninput;
  document.getElementById('reset-casting-filters').onclick=()=>{Object.assign(castingFilters,{city:'',role:'',genre:'',date:'',format:'',scope:'active'});renderCasting();};
  document.getElementById('new-casting').onclick=()=>openCastingEditor();
  document.getElementById('demo-castings').onclick=seedCastingExamples;draw();
}
function bindCastingActions(root) {
  bindCastingEditorActions(root);
  root.querySelectorAll("[data-report-casting]").forEach(b=>b.onclick=()=>{const item=castingSnapshot().items.find(x=>x.id===b.dataset.reportCasting);if(item)openSafetyReport("casting",item.id,item.title);});
  root.querySelectorAll('[data-close-casting]').forEach(b=>b.onclick=()=>{if(updateCasting(b.dataset.closeCasting,p=>({...p,closed:!p.closed})))renderCasting();});
  root.querySelectorAll('[data-response-chat]').forEach(b=>b.onclick=()=>{state.chat=Number(b.dataset.responseChat);selectTab('messages');});
  root.querySelectorAll('[data-response-status]').forEach(b=>b.onclick=()=>{if(changeCastingResponse(b.dataset.casting,b.dataset.response,b.dataset.responseStatus))renderCasting();});
  root.querySelectorAll('[data-respond]').forEach(b=>b.onclick=()=>{const item=workflowList('castings').find(p=>p.id===b.dataset.respond);if(!item||!castingIsOpen(item))return;
    workflowForm(tr('Отклик на съёмку','Shoot response'),castingRoleSelect(item)+workflowField('name',tr('Твоё имя','Your name'),'text',state.profile?.name||'')+workflowField('text',tr('Роль, опыт и как связаться','Role, experience and contact')),tr('Сохранить отклик','Save response'),data=>{const current=workflowList('castings').find(p=>p.id===item.id);if(!current||!castingIsOpen(current)||(current.responses||[]).some(r=>r.personId===0)){toast(tr('Набор закрыт или отклик уже существует.','Recruitment is closed or you have already responded.'));return;}if(!castingRoles(current).some(r=>r.name===data.role)){toast(tr('Список ролей изменился. Открой форму заново.','Roles changed. Reopen the form.'));return;}if(updateCasting(item.id,p=>({...p,responses:[...(p.responses||[]),{...data,id:workflowId(),personId:0,status:'pending'}]}))){closeModal();renderCasting();}});
  });
}
function seedCastingExamples() {
  const snapshot=castingSnapshot();if(snapshot.error){toast(snapshot.error);return;}const day=offsetDay(7),existing=snapshot.items;
  const sample=[{id:'example-portrait',title:'Портретная история в студии',city:'Санкт-Петербург',location:'Студия — согласуем вместе',role:'Визажист',format:'TFP',author:'Михаил',terms:'Совместная творческая съёмка. Референсы и расходы обсуждаем заранее.',responses:[{id:'example-response',name:'Дарья',personId:5,text:'Готова обсудить образы и подготовку к съёмке.',status:'pending'}]}, {id:'example-fashion',title:'Лукбук локального бренда',city:'Москва',location:'Студия в центре',role:'Модель',format:'paid',author:'Александр',terms:'Оплачиваемая съёмка. Гонорар и права использования обсуждаем до подтверждения.',responses:[]}].filter(s=>!existing.some(p=>p.id===s.id)).map(s=>({...s,date:day,time:'12:00',closed:false,demo:true}));
  if(!sample.length){toast(tr('Примеры уже добавлены. Выбери «Все объявления».','Examples already added. Select All announcements.'));return;}
  if(saveCastingSnapshot(snapshot,[...sample,...existing])){Object.assign(castingFilters,{city:'',role:'',genre:'',date:'',format:'',scope:'active'});renderCasting();}
}
