"use strict";

const castingFilters = {city:'', role:'', date:'', format:'', scope:'active'};
const responseLabels = () => ({pending:tr('На рассмотрении','Pending'), invited:tr('Приглашён в команду','Invited to team'), declined:tr('Отклонён','Declined')});
function paidFormat(value) { return ['paid','Оплата','Paid','Коммерция'].includes(value) ? 'paid' : 'TFP'; }
function formatLabel(value) { return paidFormat(value)==='paid' ? tr('Оплата','Paid') : 'TFP'; }
function filterCastings(items, filters, today=shootDateKey()) {
  const contains=(value,query)=>String(value||'').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  return items.filter(item => (!filters.city || contains(item.city||item.location,filters.city)) &&
    (!filters.role || contains(item.role,filters.role)) && (!filters.date || item.date===filters.date) &&
    (!filters.format || paidFormat(item.format)===filters.format) &&
    (filters.scope!=='active' || (!item.closed && item.date>=today)) &&
    (filters.scope!=='mine' || (item.responses||[]).some(r=>r.personId===0)));
}
function updateCasting(id, transform) {
  const items=workflowList('castings');
  if(!items.some(p=>p.id===id))return false;
  return workflowSave('castings',items.map(p=>p.id===id?transform(p):p));
}
function responseMarkup(casting,response) {
  const person=response.personId===0?state.profile:shootPerson(response.personId);
  const profile=person ? (response.personId===0?'#profile':'#user/'+encodeURIComponent(personUsername(person))) : null;
  return `<article class="casting-response"><div><strong>${esc(response.name)}</strong><span class="planning-status">${responseLabels()[response.status||'pending']}</span></div><p>${esc(response.text)}</p><div class="workflow-actions">
    ${profile?`<a href="${profile}">${tr('Профиль','Profile')} ↗</a>`:''}
    ${response.personId>0?`<button data-response-chat="${response.personId}">${tr('Обсудить','Discuss')}</button>`:''}
    <button data-response-status="invited" data-casting="${esc(casting.id)}" data-response="${esc(response.id)}" ${response.status==='invited'||casting.closed?'disabled':''}>${tr('Пригласить','Invite')}</button>
    <button data-response-status="declined" data-casting="${esc(casting.id)}" data-response="${esc(response.id)}" ${response.status==='declined'?'disabled':''}>${tr('Отклонить','Decline')}</button>
    ${response.status&&response.status!=='pending'?`<button data-response-status="pending" data-casting="${esc(casting.id)}" data-response="${esc(response.id)}">${tr('На рассмотрение','Reconsider')}</button>`:''}
  </div></article>`;
}
function castingCard(item) {
  const expired=item.date<shootDateKey(), own=(item.responses||[]).find(r=>r.personId===0);
  return `<article class="surface casting-card"><span class="eyebrow">${esc(item.role)} · ${formatLabel(item.format)}</span><h2>${esc(item.title)}</h2><p>${esc(item.date)} · ${esc(item.time)}</p><p>${esc(item.city||'')} ${esc(item.location)}</p><p>${esc(item.terms)}</p><p>${tr('Автор','Author')}: ${esc(item.author)}</p>
    ${item.demo?`<span class="planning-status">${tr('Пример объявления','Example announcement')}</span>`:''}
    ${item.closed||expired?`<p class="planning-status">${item.closed?tr('Набор закрыт','Recruitment closed'):tr('Дата съёмки прошла','Shoot date has passed')}</p>`:''}
    ${own?`<p>${tr('Твой отклик','Your response')}: <strong>${responseLabels()[own.status||'pending']}</strong></p>`:''}
    <div class="workflow-actions"><button data-respond="${esc(item.id)}" ${item.closed||expired||own?'disabled':''}>${own?tr('Отклик сохранён','Response saved'):tr('Откликнуться','Respond')}</button><button data-close-casting="${esc(item.id)}">${item.closed?tr('Открыть набор','Reopen'):tr('Закрыть набор','Close recruitment')}</button></div>
    <details><summary>${tr('Отклики','Responses')} (${(item.responses||[]).length})</summary>${(item.responses||[]).length?(item.responses||[]).map(r=>responseMarkup(item,r)).join(''):`<p>${tr('Откликов пока нет.','No responses yet.')}</p>`}</details></article>`;
}
function renderCasting() {
  const items=workflowList('castings');
  const content=document.getElementById('content');
  content.innerHTML=pageIntro(tr('Поиск команды','Find a team'),tr('Найди съёмку или собери людей для своей идеи.','Find a shoot or bring people together for your idea.'))+`
    <div class="workflow-actions"><button class="primary" id="new-casting">＋ ${tr('Создать объявление','Create announcement')}</button><button id="demo-castings">${tr('Добавить примеры для просмотра','Add examples to explore')}</button></div>
    <p class="demo-banner">${tr('Локальная демонстрация: здесь можно попробовать действия автора и участника. Статусы видны в «Моих откликах», но другим людям не отправляются.','Local demo: try both organizer and participant actions. Statuses appear in My responses but are not sent to other people.')}</p>
    <form id="casting-filters" class="surface casting-filters">
      ${workflowField('city',tr('Город','City'),'text',castingFilters.city,false)}${workflowField('role',tr('Роль','Role'),'text',castingFilters.role,false)}
      <label class="form-label">${tr('Дата','Date')}<input name="date" type="date" value="${esc(castingFilters.date)}"></label>
      <label class="form-label">${tr('Условия','Terms')}<select name="format"><option value="">${tr('Любые','Any')}</option><option value="TFP" ${castingFilters.format==='TFP'?'selected':''}>TFP</option><option value="paid" ${castingFilters.format==='paid'?'selected':''}>${tr('Оплата','Paid')}</option></select></label>
      <label class="form-label">${tr('Показать','Show')}<select name="scope">${[['active',tr('Актуальные','Active')],['all',tr('Все объявления','All announcements')],['mine',tr('Мои отклики','My responses')]].map(([id,label])=>`<option value="${id}" ${castingFilters.scope===id?'selected':''}>${label}</option>`).join('')}</select></label>
      <button type="button" id="reset-casting-filters">${tr('Сбросить','Reset')}</button>
    </form><p id="casting-count" role="status"></p><div class="casting-grid" id="casting-results"></div>`;
  const draw=()=>{const filtered=filterCastings(workflowList('castings'),castingFilters);document.getElementById('casting-count').textContent=tr('Объявлений: ','Announcements: ')+filtered.length;document.getElementById('casting-results').innerHTML=filtered.length?filtered.map(castingCard).join(''):`<section class="surface"><h2>${tr('Пока ничего не найдено','No matches yet')}</h2><p>${items.length?tr('Измени фильтры или покажи все объявления.','Change the filters or show all announcements.'):tr('Создай объявление или добавь примеры, чтобы попробовать отклики.','Create an announcement or add examples to try responding.')}</p></section>`;bindCastingActions(content);};
  const form=document.getElementById('casting-filters');form.onsubmit=e=>e.preventDefault();form.oninput=()=>{Object.assign(castingFilters,Object.fromEntries(new FormData(form)));draw();};form.onchange=form.oninput;
  document.getElementById('reset-casting-filters').onclick=()=>{Object.assign(castingFilters,{city:'',role:'',date:'',format:'',scope:'active'});renderCasting();};
  document.getElementById('new-casting').onclick=()=>workflowForm(tr('Новое объявление','New announcement'),shootFields()+workflowField('city',tr('Город','City'))+workflowField('role',tr('Кого ищешь','Who do you need'))+workflowField('author',tr('Имя автора','Author name'),'text',state.profile?.name||''),tr('Сохранить объявление','Save announcement'),data=>{if(workflowSave('castings',[{...data,format:paidFormat(data.format),id:workflowId(),responses:[],closed:false},...workflowList('castings')])){closeModal();Object.assign(castingFilters,{city:'',role:'',date:'',format:'',scope:'active'});renderCasting();}});
  document.getElementById('demo-castings').onclick=seedCastingExamples;draw();
}
function bindCastingActions(root) {
  root.querySelectorAll('[data-close-casting]').forEach(b=>b.onclick=()=>{if(updateCasting(b.dataset.closeCasting,p=>({...p,closed:!p.closed})))renderCasting();});
  root.querySelectorAll('[data-response-chat]').forEach(b=>b.onclick=()=>{state.chat=Number(b.dataset.responseChat);selectTab('messages');});
  root.querySelectorAll('[data-response-status]').forEach(b=>b.onclick=()=>{if(updateCasting(b.dataset.casting,p=>({...p,responses:(p.responses||[]).map(r=>r.id===b.dataset.response?{...r,status:b.dataset.responseStatus}:r)})))renderCasting();});
  root.querySelectorAll('[data-respond]').forEach(b=>b.onclick=()=>{const item=workflowList('castings').find(p=>p.id===b.dataset.respond);if(!item||item.closed||item.date<shootDateKey())return;
    workflowForm(tr('Отклик на съёмку','Shoot response'),workflowField('name',tr('Твоё имя','Your name'),'text',state.profile?.name||'')+workflowField('text',tr('Роль, опыт и как связаться','Role, experience and contact')),tr('Сохранить отклик','Save response'),data=>{const current=workflowList('castings').find(p=>p.id===item.id);if(!current||current.closed||(current.responses||[]).some(r=>r.personId===0)){toast(tr('Набор закрыт или отклик уже существует.','Recruitment is closed or you have already responded.'));return;}if(updateCasting(item.id,p=>({...p,responses:[...(p.responses||[]),{...data,id:workflowId(),personId:0,status:'pending'}]}))){closeModal();renderCasting();}});
  });
}
function seedCastingExamples() {
  const day=offsetDay(7),existing=workflowList('castings');
  const sample=[{id:'example-portrait',title:'Портретная история в студии',city:'Санкт-Петербург',location:'Студия — согласуем вместе',role:'Визажист',format:'TFP',author:'Михаил',terms:'Совместная творческая съёмка. Референсы и расходы обсуждаем заранее.',responses:[{id:'example-response',name:'Дарья',personId:5,text:'Готова обсудить образы и подготовку к съёмке.',status:'pending'}]}, {id:'example-fashion',title:'Лукбук локального бренда',city:'Москва',location:'Студия в центре',role:'Модель',format:'paid',author:'Александр',terms:'Оплачиваемая съёмка. Гонорар и права использования обсуждаем до подтверждения.',responses:[]}].filter(s=>!existing.some(p=>p.id===s.id)).map(s=>({...s,date:day,time:'12:00',closed:false,demo:true}));
  if(!sample.length){toast(tr('Примеры уже добавлены. Выбери «Все объявления».','Examples already added. Select All announcements.'));return;}
  if(workflowSave('castings',[...sample,...existing])){Object.assign(castingFilters,{city:'',role:'',date:'',format:'',scope:'active'});renderCasting();}
}
function offsetDay(days) { const date=new Date();date.setDate(date.getDate()+days);return shootDateKey(date); }

function proposalById(personId,id) { return (state.messages[personId]||[]).find(m=>m.proposal?.id===id)?.proposal; }
function proposalShoot(p,personId,existing={}) { return {...existing,id:'agreement-'+p.id,title:p.title,date:p.date,time:p.time,end:existing.date===p.date&&existing.time===p.time?existing.end||'':'',personId,location:p.location,notes:p.participants+'\n'+formatLabel(p.format)+' · '+p.terms}; }
// Roll back both stores if a calendar write fails; never update in-memory state on failure.
function persistProposal(personId,nextProposal) {
  if(!proposalById(personId,nextProposal.id))return false;
  const before=state.messages,next={...before,[personId]:(before[personId]||[]).map(m=>m.proposal?.id===nextProposal.id?{...m,proposal:nextProposal}:m)};
  const shoots=savedShoots(),linked=shoots.find(s=>s.id==='agreement-'+nextProposal.id);
  const nextShoots=nextProposal.status==='cancelled'?shoots.filter(s=>s.id!=='agreement-'+nextProposal.id):shoots.map(s=>s.id==='agreement-'+nextProposal.id?proposalShoot(nextProposal,personId,s):s);
  if(!workflowSave('messages',next))return false;
  if(linked&&!saveShoots(nextShoots)) { workflowSave('messages',before);toast(tr('Календарь не сохранился. Изменения отменены.','Calendar could not be saved. Changes were reverted.'));return false; }
  state.messages=next;return true;
}
function proposalCard(p) {
  const cancelled=p.status==='cancelled',tasks=p.tasks||[],refs=p.references||[];
  return `<article class="agreement-card ${cancelled?'is-cancelled':''}"><span class="eyebrow">${cancelled?tr('Съёмка отменена','Shoot cancelled'):p.status==='agreed'?tr('Договорённость · отмечено тобой','Agreement · marked by you'):tr('Предложение съёмки','Shoot proposal')}</span><h3>${esc(p.title)}</h3><p>${esc(p.date)} · ${esc(p.time)}</p><p>${esc(p.location)}</p><p>${esc(p.participants)}</p><p>${formatLabel(p.format)} · ${esc(p.terms)}</p>
    ${cancelled?`<p>${tr('Причина','Reason')}: ${esc(p.cancelReason)}</p>`:''}
    <p class="planning-status">${tr('Референсов','References')}: ${refs.length} · ${tr('Подготовка','Preparation')}: ${tasks.filter(t=>t.done).length}/${tasks.length}</p>
    <div class="workflow-actions">${!cancelled?(p.status==='proposed'?`<button data-agree="${esc(p.id)}">${tr('Мы договорились','We have agreed')}</button>`:`<button data-agreement-calendar="${esc(p.id)}">${tr('В календарь','Add to calendar')}</button>`):''}
    <button data-planning="${esc(p.id)}">${tr('Мудборд и подготовка','Moodboard and preparation')}</button>
    ${!cancelled?`<button data-edit-proposal="${esc(p.id)}">${tr('Изменить','Edit')}</button><button data-cancel-proposal="${esc(p.id)}">${tr('Отменить съёмку','Cancel shoot')}</button>`:''}</div>
    ${(p.history||[]).length?`<details><summary>${tr('История изменений','Change history')}</summary>${p.history.map(h=>`<p>${esc(h.date)} · ${esc(h.text)}</p>`).join('')}</details>`:''}</article>`;
}
function proposalHistory(p,text) { return [...(p.history||[]),{date:new Date().toLocaleString(calendarLocale()),text}]; }
function refreshPlanningView() { if(state.tab==='calendar')renderCalendar();else if(state.tab==='messages')renderChat(); }
function editProposal(personId,id) {
  const p=proposalById(personId,id);if(!p||p.status==='cancelled')return;
  workflowForm(tr('Изменить условия съёмки','Change shoot details'),workflowField('title',tr('Идея','Concept'),'text',p.title)+workflowField('date',tr('Дата','Date'),'date',p.date)+workflowField('time',tr('Время','Time'),'time',p.time)+workflowField('location',tr('Место','Location'),'text',p.location)+`<label class="form-label">${tr('Формат','Format')}<select name="format"><option value="TFP" ${paidFormat(p.format)==='TFP'?'selected':''}>TFP</option><option value="paid" ${paidFormat(p.format)==='paid'?'selected':''}>${tr('Оплата','Paid')}</option></select></label>`+workflowField('terms',tr('Условия','Terms'),'text',p.terms)+workflowField('participants',tr('Участники','Participants'),'text',p.participants)+`<p>${tr('Отмечай изменения после обсуждения с командой. Связанная запись календаря обновится.','Record changes after discussing with the team. The linked calendar entry will update.')}</p>`,tr('Сохранить изменения','Save changes'),data=>{const current=proposalById(personId,id);if(!current||current.status==='cancelled')return;const text=tr('Изменены условия: ','Details changed: ')+current.date+' '+current.time+' → '+data.date+' '+data.time+'; '+current.location+' → '+data.location+'; '+data.terms;
    if(persistProposal(personId,{...current,...data,history:proposalHistory(current,text)})){if(state.tab==='calendar'){calendarDay=data.date;calendarMonth=data.date.slice(0,7);}closeModal();refreshPlanningView();}});
}
function cancelProposal(personId,id) {
  const p=proposalById(personId,id);if(!p||p.status==='cancelled')return;
  workflowForm(tr('Отменить съёмку','Cancel shoot'),`<p>${tr('Съёмка исчезнет из календаря. Карточка и причина отмены останутся в чате.','The shoot will be removed from the calendar. The card and cancellation reason will remain in chat.')}</p>`+workflowField('reason',tr('Причина отмены','Cancellation reason')),tr('Подтвердить отмену','Confirm cancellation'),data=>{const current=proposalById(personId,id);if(current&&persistProposal(personId,{...current,status:'cancelled',cancelReason:data.reason,history:proposalHistory(current,tr('Отменено: ','Cancelled: ')+data.reason)})){closeModal();refreshPlanningView();}});
}
function bindAgreements(root,personId) {
  root.querySelectorAll('[data-agree]').forEach(b=>b.onclick=()=>{const p=proposalById(personId,b.dataset.agree);if(!p||p.status!=='proposed')return;workflowForm(tr('Подтвердить договорённость','Confirm agreement'),workflowField('participants',tr('Участники','Participants'),'text',p.participants)+`<p>${tr('Отметь после обсуждения с участниками. Это не подтверждение от собеседника.','Mark after discussing with participants. This is not confirmation from the other person.')}</p>`,tr('Сохранить','Save'),data=>{const current=proposalById(personId,p.id);if(current&&persistProposal(personId,{...current,...data,status:'agreed'})){closeModal();renderChat();}});});
  root.querySelectorAll('[data-agreement-calendar]').forEach(b=>b.onclick=()=>{const p=proposalById(personId,b.dataset.agreementCalendar);if(!p||p.status!=='agreed')return;const items=savedShoots(),existing=items.find(s=>s.id==='agreement-'+p.id);if(!existing&&!saveShoots([...items,proposalShoot(p,personId)])){toast(tr('Не удалось сохранить календарь','Could not save calendar'));return;}calendarDay=p.date;calendarMonth=p.date.slice(0,7);selectTab('calendar');});
  root.querySelectorAll('[data-edit-proposal]').forEach(b=>b.onclick=()=>editProposal(personId,b.dataset.editProposal));
  root.querySelectorAll('[data-cancel-proposal]').forEach(b=>b.onclick=()=>cancelProposal(personId,b.dataset.cancelProposal));
  root.querySelectorAll('[data-planning]').forEach(b=>b.onclick=()=>openPlanning(personId,b.dataset.planning));
}

function safeReferenceUrl(value) {
  try { const url=new URL(value);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:null; } catch { return null; }
}
function referenceMarkup(ref,readOnly=false) {
  const url=safeReferenceUrl(ref.url),image=typeof ref.image==='string'&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(ref.image)?ref.image:null;
  return `<figure class="reference-card">${image?`<img src="${image}" alt="${esc(ref.title)}" loading="lazy">`:`<div class="reference-link-icon" aria-hidden="true">↗</div>`}<figcaption>${url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(ref.title)} ↗</a>`:`<strong>${esc(ref.title)}</strong>`}${!readOnly?`<button type="button" data-remove-reference="${esc(ref.id)}" aria-label="${tr('Удалить референс','Remove reference')} ${esc(ref.title)}">×</button>`:''}</figcaption></figure>`;
}
function openPlanning(personId,id) {
  const p=proposalById(personId,id);if(!p)return;const readOnly=p.status==='cancelled';
  showModal(`<section class="modal wide planning-modal" role="dialog" aria-modal="true" aria-labelledby="planning-title"><button class="close" type="button" aria-label="${tr('Закрыть','Close')}">×</button><span class="eyebrow">${tr('ПОДГОТОВКА К СЪЁМКЕ','SHOOT PREPARATION')}</span><h2 id="planning-title">${esc(p.title)}</h2><p>${esc(p.date)} · ${esc(p.location)}</p>${readOnly?`<p>${tr('Съёмка отменена. Материалы сохранены для просмотра.','Shoot cancelled. Materials are retained for viewing.')}</p>`:''}
    <h3>${tr('Мудборд','Moodboard')}</h3><p>${tr('Свет, образы, макияж и настроение. До 8 референсов: изображения или ссылки.','Lighting, outfits, makeup and mood. Up to 8 references: images or links.')}</p>
    <div class="moodboard-grid">${(p.references||[]).map(ref=>referenceMarkup(ref,readOnly)).join('')||`<p>${tr('Добавь первые референсы для команды.','Add the first references for the team.')}</p>`}</div>
    ${!readOnly?`<form id="reference-form" class="planning-inline-form">${workflowField('title',tr('Подпись','Caption'))}${workflowField('url',tr('Ссылка на референс','Reference link'),'url','',false)}<label class="form-label">${tr('Или изображение','Or an image')}<input type="file" name="image" accept="image/jpeg,image/png,image/webp"></label><button type="submit" class="primary">${tr('Добавить референс','Add reference')}</button></form>`:''}
    <h3>${tr('План подготовки','Preparation checklist')}</h3><ul class="preparation-list">${(p.tasks||[]).map(task=>`<li><label><input type="checkbox" data-task-toggle="${esc(task.id)}" ${task.done?'checked':''} ${readOnly?'disabled':''}><span class="${task.done?'task-done':''}">${esc(task.title)}<small>${tr('Ответственный','Owner')}: ${esc(task.owner)}</small></span></label>${!readOnly?`<button type="button" data-task-remove="${esc(task.id)}" aria-label="${tr('Удалить задачу','Remove task')} ${esc(task.title)}">×</button>`:''}</li>`).join('')||`<li>${tr('Пока нет задач. Начни со студии, образов или реквизита.','No tasks yet. Start with the studio, outfits or props.')}</li>`}</ul>
    ${!readOnly?`<form id="task-form" class="planning-inline-form">${workflowField('title',tr('Что сделать','Task'))}${workflowField('owner',tr('Кто отвечает','Owner'),'text',state.profile?.name||'')}<button type="submit" class="primary">${tr('Добавить задачу','Add task')}</button></form>`:''}<p id="planning-error" role="alert"></p><p class="shoot-hint">${tr('Материалы и отметки хранятся только в этом браузере.','Materials and completion status stay in this browser.')}</p></section>`);
  const root=document.getElementById('modal-root');
  const mutate=transform=>{const current=proposalById(personId,id);if(!current||current.status==='cancelled')return false;if(persistProposal(personId,transform(current))){refreshPlanningView();openPlanning(personId,id);return true;}return false;};
  root.querySelectorAll('[data-task-toggle]').forEach(b=>b.onchange=()=>{if(!mutate(current=>({...current,tasks:(current.tasks||[]).map(task=>task.id===b.dataset.taskToggle?{...task,done:b.checked}:task)})))b.checked=!b.checked;});
  root.querySelectorAll('[data-task-remove]').forEach(b=>b.onclick=()=>mutate(current=>({...current,tasks:(current.tasks||[]).filter(task=>task.id!==b.dataset.taskRemove)})));
  root.querySelectorAll('[data-remove-reference]').forEach(b=>b.onclick=()=>mutate(current=>({...current,references:(current.references||[]).filter(ref=>ref.id!==b.dataset.removeReference)})));
  const taskForm=root.querySelector('#task-form');
  if(taskForm)taskForm.onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(taskForm));if(!data.title.trim()||!data.owner.trim()){root.querySelector('#planning-error').textContent=tr('Укажи задачу и ответственного.','Enter the task and its owner.');return;}if((proposalById(personId,id)?.tasks||[]).length>=40){root.querySelector('#planning-error').textContent=tr('Не больше 40 задач на съёмку.','Up to 40 tasks per shoot.');return;}mutate(current=>({...current,tasks:[...(current.tasks||[]),{id:workflowId(),title:data.title.trim(),owner:data.owner.trim(),done:false}]}));};
  const referenceForm=root.querySelector('#reference-form');
  if(referenceForm)referenceForm.onsubmit=async e=>{e.preventDefault();const data=new FormData(referenceForm),file=data.get('image'),url=String(data.get('url')).trim(),title=String(data.get('title')).trim(),error=root.querySelector('#planning-error');
    if(!title){error.textContent=tr('Добавь подпись.','Add a caption.');return;}
    if((proposalById(personId,id)?.references||[]).length>=8){error.textContent=tr('Не больше 8 референсов на съёмку.','Up to 8 references per shoot.');return;}
    if((!file?.size&&!url)||(url&&!safeReferenceUrl(url))){error.textContent=tr('Выбери изображение или укажи ссылку http/https.','Choose an image or enter an http/https link.');return;}
    const button=referenceForm.querySelector('[type="submit"]');button.disabled=true;error.textContent=tr('Сохраняем…','Saving…');
    try { const ref={id:workflowId(),title,url:url?safeReferenceUrl(url):null,image:file?.size?await compressReference(file):null};if(!referenceForm.isConnected)return;mutate(current=>({...current,references:[...(current.references||[]),ref]})); }
    catch(err){if(error.isConnected)error.textContent=err.message;}
    finally{if(button.isConnected){button.disabled=false;if(error.textContent===tr('Сохраняем…','Saving…'))error.textContent='';}}
  };
}
function compressReference(file) {
  return new Promise((resolve,reject)=>{
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){reject(new Error(tr('Выбери JPG, PNG или WebP до 10 МБ.','Choose JPG, PNG or WebP up to 10 MB.')));return;}
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{try{const scale=Math.min(1,960/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',0.75));}catch{reject(new Error(tr('Не удалось обработать изображение.','Could not process the image.')));}finally{URL.revokeObjectURL(url);}};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error(tr('Не удалось открыть изображение.','Could not open the image.')));};img.src=url;
  });
}

function collectReminders(now=Date.now()) {
  const reminders=[],scheduled=new Set();
  for(const shoot of savedShoots()) {
    const time=new Date(shoot.date+'T'+shoot.time).getTime();
    scheduled.add(shoot.id);
    if(time>=now&&time<=now+86400000)reminders.push({id:'shoot:'+shoot.id+':'+shoot.date+':'+shoot.time,title:shoot.title,text:tr('Съёмка в ближайшие 24 часа','Shoot within the next 24 hours')+' · '+shoot.date+' '+shoot.time,date:shoot.date,kind:'calendar'});
  }
  for(const [personId,messages] of Object.entries(state.messages)) for(const message of messages) {
    const p=message.proposal;if(!p||p.status==='cancelled')continue;
    const time=new Date(p.date+'T'+p.time).getTime();
    if(p.status==='agreed'&&!scheduled.has('agreement-'+p.id)&&time>=now&&time<=now+86400000)reminders.push({id:'agreement:'+p.id+':'+p.date+':'+p.time,title:p.title,text:tr('Съёмка скоро — добавь её в календарь','Shoot coming up — add it to the calendar'),personId:Number(personId),kind:'chat'});
    if(p.status==='proposed'&&time>=now&&now-(message.createdAt||now)>=86400000)reminders.push({id:'proposal:'+p.id,title:p.title,text:tr('Предложение больше суток без договорённости','Proposal awaiting agreement for over a day'),personId:Number(personId),kind:'chat'});
  }
  return reminders;
}
function renderReminders() {
  const reminders=collectReminders(),dismissed=workflowList('dismissed-reminders'),visible=reminders.filter(r=>!dismissed.includes(r.id));
  const content=document.getElementById('content');
  content.innerHTML=pageIntro(tr('Напоминания','Reminders'),tr('Ближайшие съёмки и предложения, к которым стоит вернуться.','Upcoming shoots and proposals to follow up on.'))+`<p class="demo-banner">${tr('Напоминания проверяются при открытии сайта и раз в минуту, пока он открыт. Время — по часам этого устройства. В закрытом браузере уведомления не отправляются.','Reminders are checked when you open the site and every minute while it is open. Times use this device’s clock. No notifications are sent while the browser is closed.')}</p><div class="reminder-list">${visible.length?visible.map(r=>`<article class="surface"><span class="eyebrow">${esc(r.text)}</span><h2>${esc(r.title)}</h2><div class="workflow-actions"><button class="primary" data-open-reminder="${esc(r.id)}">${r.kind==='calendar'?tr('В календарь','Open calendar'):tr('Открыть чат','Open chat')}</button><button data-dismiss-reminder="${esc(r.id)}">${tr('Скрыть','Dismiss')}</button></div></article>`).join(''):`<section class="surface"><h2>${tr('Всё спокойно','All caught up')}</h2><p>${tr('Здесь появятся съёмки на ближайшие 24 часа и предложения без договорённости дольше суток.','Shoots within the next 24 hours and proposals awaiting agreement for over a day will appear here.')}</p></section>`}</div>${dismissed.length?`<button id="restore-reminders">${tr('Вернуть скрытые напоминания','Restore dismissed reminders')}</button>`:''}`;
  content.querySelectorAll('[data-open-reminder]').forEach(b=>b.onclick=()=>{const r=visible.find(item=>item.id===b.dataset.openReminder);if(r.kind==='calendar'){calendarDay=r.date;calendarMonth=r.date.slice(0,7);selectTab('calendar');}else{state.chat=r.personId;selectTab('messages');}});
  content.querySelectorAll('[data-dismiss-reminder]').forEach(b=>b.onclick=()=>{if(workflowSave('dismissed-reminders',[...new Set([...workflowList('dismissed-reminders'),b.dataset.dismissReminder])])){renderReminders();updateReminderBadge();}});
  content.querySelector('#restore-reminders')?.addEventListener('click',()=>{if(workflowSave('dismissed-reminders',[])){renderReminders();updateReminderBadge();}});
}
function updateReminderBadge() {
  const link=document.getElementById('reminders-link');if(!link)return;
  const dismissed=workflowList('dismissed-reminders'),count=collectReminders().filter(r=>!dismissed.includes(r.id)).length;
  link.innerHTML=`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>${count?`<span class="reminder-count">${count}</span>`:''}`;
  link.setAttribute('aria-label',tr('Напоминания','Reminders')+(count?': '+count:''));link.title=tr('Напоминания','Reminders');
}
