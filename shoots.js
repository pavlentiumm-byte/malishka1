"use strict";

function shootStatus(status) {
  return ({draft:tr('Черновик','Draft'),pending:tr('На согласовании','Awaiting approval'),confirmed:tr('Подтверждена','Confirmed'),cancelled:tr('Отменена','Cancelled'),completed:tr('Завершена','Completed')})[status]||tr('Неизвестный статус','Unknown status');
}
function shootFormat(format) { return ({tfp:'TFP',paid:tr('Оплачиваемая съёмка','Paid shoot'),discuss:tr('Обсуждается','To be discussed')})[format]||'—'; }
function shootFieldName(field) {
  return ({title:tr('Название','Title'),concept:tr('Концепция','Concept'),date:tr('Дата','Date'),time:tr('Начало','Start'),duration:tr('Продолжительность, мин','Duration, min'),city:tr('Город','City'),location:tr('Место','Location'),format:tr('Формат сотрудничества','Collaboration format'),amount:tr('Размер оплаты','Payment amount'),currency:tr('Валюта','Currency'),role:tr('Роль участника','Participant role'),requirements:tr('Дополнительные условия','Additional terms'),comment:tr('Комментарий','Comment')})[field]||field;
}
function shootError(result) {
  if(result.error==='validation')return tr('Проверь поле «','Check the “')+shootFieldName(result.field||'title')+tr('».','” field.');
  const messages={quota:tr('Не удалось сохранить: хранилище браузера недоступно или заполнено. Данные формы остаются здесь.','Could not save: browser storage is unavailable or full. Your form data remains here.'),storage:tr('Не удалось прочитать данные съёмок. Существующие данные не изменены.','Could not read shoot data. Existing data was not changed.'),schema:tr('Версия данных съёмок не поддерживается. Сохранение остановлено, чтобы не потерять записи.','Unsupported shoot data version. Saving is blocked to preserve existing records.'),corrupt:tr('Некоторые записи съёмок повреждены. Они не удалены; сохранение остановлено.','Some shoot records are damaged. They have not been deleted; saving is blocked.'),conflict:tr('Карточка изменилась в другой вкладке. Закрой форму и открой актуальную версию перед редактированием.','This card changed in another tab. Close the form and reopen the latest version before editing.'),missing:tr('Карточка не найдена.','Card not found.'),transition:tr('Действие недоступно для текущего статуса. Обнови карточку.','This action is unavailable for the current status. Refresh the card.'),reason:tr('Укажи причину, до 1000 символов.','Enter a reason, up to 1000 characters.')};
  return messages[result.error]||tr('Не удалось сохранить изменения.','Could not save changes.');
}
function shootDemoNotice() { return tr('Локальная демонстрация. Предложения и ответы остаются в этом браузере. Подтверждение получателя можно проверить в деморежиме — это не ответ реального человека.','Local demo. Proposals and replies stay in this browser. You can try recipient confirmation in demo mode; it is not a real person’s reply.'); }

function openShootProposal(personId,id=null) {
  const person=shootPerson(personId),existing=id?ShootRepository.get(id):null;
  if(SafetyStore.blocked(personId)){toast(tr("Профиль заблокирован. Разблокируй его в настройках безопасности.","Profile blocked. Unblock it in safety settings."));return;}
  if(!person||id&&!existing||existing&&['completed','cancelled'].includes(existing.status))return;
  const value=existing||{title:'',concept:'',date:'',time:'12:00',duration:60,city:person.city||'',location:'',format:'discuss',amount:'',currency:'RUB',role:person.role||'',requirements:'',comment:''};
  const input=(name,type='text',required=true,max=250)=>`<label class="form-label">${shootFieldName(name)}<input name="${name}" type="${type}" ${required?'required':''} maxlength="${max}" ${type==='date'?'min="1900-01-01" max="2100-12-31"':''} ${name==='duration'?'min="15" max="1440" step="15"':''} ${name==='amount'?'min="0.01" max="999999999" step="0.01"':''} value="${esc(value[name]??'')}"></label>`;
  const area=(name,required=false)=>`<label class="form-label">${shootFieldName(name)}<textarea name="${name}" maxlength="2000" rows="3" ${required?'required':''}>${esc(value[name]||'')}</textarea></label>`;
  showModal(`<form class="modal shoot-proposal-form" id="shoot-proposal-form" role="dialog" aria-modal="true" aria-labelledby="shoot-proposal-title"><button type="button" class="close" aria-label="${tr('Закрыть','Close')}">×</button><span class="eyebrow">${tr('СЪЁМКА ВМЕСТЕ','A SHOOT TOGETHER')}</span><h2 id="shoot-proposal-title">${existing?tr('Редактировать предложение','Edit proposal'):tr('Предложить съёмку','Propose a shoot')}</h2><p data-user-content>${tr('Приглашённый участник','Invited participant')}: ${esc(person.name)}</p>
    <p class="shoot-local-note">${shootDemoNotice()}</p>
    ${input('title','text',true,100)}${area('concept',true)}
    <div class="shoot-fields-grid">${input('date','date')}${input('time','time')}${input('duration','number')}${input('role','text',true,100)}${input('city','text',true,100)}${input('location')}</div>
    <label class="form-label">${shootFieldName('format')}<select name="format">${['tfp','paid','discuss'].map(format=>`<option value="${format}" ${value.format===format?'selected':''}>${shootFormat(format)}</option>`).join('')}</select></label>
    <div class="shoot-fields-grid" id="shoot-payment-fields" ${value.format!=='paid'?'hidden':''}>${input('amount','number',false,20)}<label class="form-label">${shootFieldName('currency')}<select name="currency">${['RUB','USD','EUR'].map(currency=>`<option ${value.currency===currency?'selected':''}>${currency}</option>`).join('')}</select></label></div>
    ${!existing?creativeTeamSelect():''}${area('requirements')}${area('comment')}
    ${existing?.status==='confirmed'?`<p class="shoot-change-warning">${tr('Изменение условий отменит прежнее подтверждение. Съёмка вернётся на согласование и временно исчезнет из календаря до нового принятия.','Changing the terms invalidates the previous confirmation. The shoot returns to approval and leaves the calendar until accepted again.')}</p>`:''}
    <p id="shoot-proposal-error" role="alert"></p><div class="form-actions shoot-editor-actions"><button type="submit" class="primary">${existing&&existing.status!=='draft'?tr('Сохранить изменения','Save changes'):tr('Проверить предложение','Review proposal')}</button><button type="button" class="ui-secondary" id="shoot-save-draft" ${existing&&existing.status!=='draft'?'hidden':''}>${tr('Сохранить черновик','Save draft')}</button><button type="button" class="ui-secondary" id="shoot-discard-edit">${tr('Отмена','Cancel')}</button></div><small>${tr('«Отмена» закрывает форму без сохранения новых изменений. Черновики доступны в профиле → Мои съёмки.','Cancel closes the form without saving new changes. Drafts are available in Profile → My shoots.')}</small></form>`);
  const form=document.getElementById('shoot-proposal-form'),error=form.querySelector('#shoot-proposal-error');
  bindProposalAvailability(form,personId);
  const payment=()=>{const paid=form.elements.format.value==='paid';form.querySelector('#shoot-payment-fields').hidden=!paid;form.elements.amount.required=paid;form.elements.amount.disabled=!paid;};payment();form.elements.format.onchange=payment;
  form.querySelector('#shoot-discard-edit').onclick=()=>{closeModal();if(existing)openShootDetails(existing.id);};
  const save=review=>{
    const data=Object.fromEntries(new FormData(form));data.currency=form.elements.currency.value;data.duration=Number(data.duration);if(data.format!=='paid')data.amount='';
    if(review){const invalid=ShootRepository.validation(data,true);if(invalid){error.textContent=shootError({error:'validation',field:invalid});form.elements[invalid]?.focus();return;}}
    const participants=creativeParticipants(form.elements.creativeTeam?.value,[{id:0,name:state.profile?.name||tr('Ты','You'),role:state.profile?.role||tr('Организатор','Organizer')},{id:person.id,name:person.name,role:data.role}]);
    const result=existing?ShootRepository.edit(existing.id,existing.rev,data):ShootRepository.create(person.id,data,participants);
    if(!result.ok){error.textContent=shootError(result);return;}
    closeModal();refreshShootViews();openShootDetails(result.record.id);
    toast(review?tr('Изменения сохранены','Changes saved'):tr('Черновик сохранён','Draft saved'));
  };
  form.onsubmit=event=>{event.preventDefault();save(true);};form.querySelector('#shoot-save-draft').onclick=()=>save(false);
}
function shootHistoryMarkup(record) {
  const actions={created:tr('Создан черновик','Draft created'),edited:tr('Условия изменены','Terms changed'),reapproval:tr('Изменение условий — требуется новое подтверждение','Terms changed — confirmation required again'),send:tr('Предложение добавлено в чат','Proposal added to chat'),accept:tr('Предложение принято локально','Proposal accepted locally'),decline:tr('Предложение отклонено локально','Proposal declined locally'),cancel:tr('Съёмка отменена','Shoot cancelled'),complete:tr('Съёмка отмечена завершённой','Shoot marked completed'),discuss:tr('Получатель перешёл к обсуждению (демо)','Recipient opened discussion (demo)')};
  return `<details class="shoot-history"><summary>${tr('История условий и статусов','Terms and status history')} (${record.history.length})</summary><ol>${record.history.map(h=>`<li><time datetime="${new Date(h.at).toISOString()}">${esc(new Date(h.at).toLocaleString(calendarLocale()))}</time><strong>${actions[h.action]||esc(h.action)}</strong><small>${h.actor==='recipient-demo'?tr('Демо-действие получателя','Demo recipient action'):tr('Действие организатора на этом устройстве','Organizer action on this device')}</small>${h.note?`<p data-user-content>${esc(h.note)}</p>`:''}${h.changes.length?`<ul>${h.changes.map(c=>`<li><span>${esc(shootFieldName(c.field))}</span><del data-user-content>${esc(c.from||'—')}</del><span data-user-content> → ${esc(c.to||'—')}</span></li>`).join('')}</ul>`:''}</li>`).join('')}</ol></details>`;
}
function shootCardMarkup(record,compact=false) {
  if(!record)return `<p>${tr('Карточка съёмки недоступна.','Shoot card unavailable.')}</p>`;
  return `<article class="shoot-project-card" data-shoot-card="${esc(record.id)}"><div class="shoot-card-heading"><span class="shoot-status shoot-status-${record.status}">${shootStatus(record.status)}</span><span class="shoot-local-label">${tr('Локально','Local')}</span></div><h3 data-user-content>${esc(record.title||tr('Без названия','Untitled'))}</h3><p data-user-content>${esc(record.concept||tr('Концепция пока не заполнена.','Concept not filled in yet.'))}</p><dl class="shoot-facts"><div><dt>${tr('Когда','When')}</dt><dd>${esc(record.date||'—')} · ${esc(record.time||'—')}<small>${record.duration} ${tr('мин','min')}</small></dd></div><div><dt>${tr('Где','Where')}</dt><dd data-user-content>${esc([record.city,record.location].filter(Boolean).join(', ')||'—')}</dd></div><div><dt>${tr('Условия','Terms')}</dt><dd>${shootFormat(record.format)}${record.format==='paid'?` · ${esc(record.amount||'—')} ${esc(record.currency)}`:''}</dd></div></dl>
    <ul class="shoot-participants">${record.participants.map(p=>`<li><a href="${p.id===0?'#profile':'#user/'+encodeURIComponent(personUsername(shootPerson(p.id)||{id:p.id}))}" data-user-content>${esc(p.name)}</a><span data-user-content>${esc(p.role||'—')}</span></li>`).join('')}</ul>
    ${!compact?`${record.requirements?`<h4>${tr('Дополнительные условия','Additional terms')}</h4><p data-user-content>${esc(record.requirements)}</p>`:''}${record.comment?`<h4>${tr('Комментарий','Comment')}</h4><p data-user-content>${esc(record.comment)}</p>`:''}`:''}
    ${record.reason?`<p class="shoot-change-warning" data-user-content>${tr('Причина отмены','Cancellation reason')}: ${esc(record.reason)}</p>`:''}
    ${compact?`<button type="button" class="ui-secondary" data-shoot-open="${esc(record.id)}">${tr('Открыть карточку','Open shoot card')} ↗</button>`:''}</article>`;
}
function openShootDetails(id,recipientDemo=false) {
  const record=ShootRepository.get(id);if(!record){toast(shootError({error:'missing'}));return;}
  const pending=record.status==='pending',editable=['draft','pending','confirmed'].includes(record.status);
  showModal(`<section class="modal shoot-detail" role="dialog" aria-modal="true" aria-labelledby="shoot-detail-title"><button type="button" class="close" aria-label="${tr('Закрыть','Close')}">×</button><h2 id="shoot-detail-title">${tr('Карточка съёмки','Shoot card')}</h2><p class="shoot-local-note">${shootDemoNotice()}</p>${shootCardMarkup(record)}
    <div class="shoot-detail-actions"><button id="shoot-group">${tr('Групповой чат','Group chat')}</button>${record.status==='completed'?`<button id="shoot-review">${tr('Тестовый отзыв','Test review')}</button>`:''}<button id="shoot-board">${tr('Мудборд','Moodboard')}</button>${record.status==='draft'?`<button class="primary" type="button" data-shoot-action="send">${tr('Добавить предложение в чат','Add proposal to chat')}</button>`:''}${editable?`<button class="ui-secondary" type="button" id="shoot-edit">${tr('Редактировать условия','Edit terms')}</button>`:''}${record.sentAt?`<button class="ui-secondary" type="button" id="shoot-discuss">${tr('Обсудить в чате','Discuss in chat')}</button>`:''}${['confirmed','completed'].includes(record.status)?`<button class="ui-secondary" type="button" id="shoot-go-calendar">${tr('Показать в календаре','Show in calendar')}</button>`:''}${record.status==='confirmed'?`<button class="ui-secondary" type="button" id="shoot-complete">${tr('Завершить съёмку','Complete shoot')}</button>`:''}${editable?`<button class="ui-secondary" type="button" id="shoot-cancel">${tr('Отменить съёмку','Cancel shoot')}</button>`:''}</div>
    ${pending?`<details class="shoot-recipient-demo" ${recipientDemo?'open':''}><summary>${tr('Проверить действия получателя · демо','Try recipient actions · demo')}</summary><p>${tr('Ты управляешь обеими сторонами только для проверки. Настоящий ответ участника появится после подключения сервера.','You control both sides only for testing. Real participant replies require a server.')}</p><div class="shoot-detail-actions"><button type="button" class="primary" data-shoot-action="accept">${tr('Принять · локально','Accept · locally')}</button><button type="button" class="ui-secondary" id="shoot-decline">${tr('Отклонить · локально','Decline · locally')}</button><button type="button" class="ui-secondary" data-shoot-action="discuss">${tr('Обсудить · локально','Discuss · locally')}</button></div></details>`:''}
    <p id="shoot-action-error" role="alert"></p>${shootHistoryMarkup(record)}</section>`);
  const root=document.getElementById('modal-root');
  root.querySelectorAll('[data-shoot-action]').forEach(button=>button.onclick=()=>{
    const action=button.dataset.shootAction,result=ShootRepository.transition(id,record.rev,action);
    if(!result.ok){root.querySelector('#shoot-action-error').textContent=shootError(result);return;}
    closeModal();refreshShootViews();
    if(['send','discuss'].includes(action)){state.chat=record.recipientId;selectTab('messages');if(action==='discuss')setTimeout(()=>document.getElementById('message-input')?.focus(),0);}
    else openShootDetails(id);
  });
  root.querySelector('#shoot-edit')?.addEventListener('click',()=>openShootProposal(record.recipientId,id));
  root.querySelector('#shoot-discuss')?.addEventListener('click',()=>{closeModal();state.chat=record.recipientId;selectTab('messages');});
  root.querySelector('#shoot-review')?.addEventListener('click',()=>openShootReview(record.id));
  root.querySelector('#shoot-group').onclick=()=>openCreativeProject('groups',record.id);
  root.querySelector('#shoot-board').onclick=()=>openCreativeProject('boards',record.id);
  root.querySelector('#shoot-go-calendar')?.addEventListener('click',()=>{closeModal();calendarDay=record.date;calendarMonth=record.date.slice(0,7);selectTab('calendar');});
  root.querySelector('#shoot-cancel')?.addEventListener('click',()=>confirmShootAction(record,'cancel'));
  root.querySelector('#shoot-decline')?.addEventListener('click',()=>confirmShootAction(record,'decline'));
  root.querySelector('#shoot-complete')?.addEventListener('click',()=>confirmShootAction(record,'complete'));
}
function confirmShootAction(record,action) {
  const title=action==='complete'?tr('Завершить съёмку?','Complete this shoot?'):action==='decline'?tr('Отклонить предложение локально?','Decline this proposal locally?'):tr('Отменить съёмку?','Cancel this shoot?');
  showModal(`<form class="modal" id="shoot-confirm" role="dialog" aria-modal="true" aria-labelledby="shoot-confirm-title"><button type="button" class="close" aria-label="${tr('Закрыть','Close')}">×</button><h2 id="shoot-confirm-title">${title}</h2><p data-user-content>${esc(record.title)}</p><p>${action==='complete'?tr('После завершения условия станут доступны только для чтения. Это локальная отметка, а не подтверждение участия другими людьми.','After completion, the terms become read-only. This is a local mark, not confirmation by other participants.'):tr('Запись останется в истории. Подтверждённое событие исчезнет из календаря.','The record remains in history. The confirmed event leaves the calendar.')}</p>${action!=='complete'?`<label class="form-label">${tr('Причина','Reason')}<textarea name="reason" required maxlength="1000" rows="3"></textarea></label>`:''}<p id="shoot-confirm-error" role="alert"></p><div class="form-actions"><button type="submit" class="primary">${tr('Подтвердить','Confirm')}</button><button type="button" class="ui-secondary" id="shoot-confirm-back">${tr('Назад','Back')}</button></div></form>`);
  const form=document.getElementById('shoot-confirm');form.querySelector('#shoot-confirm-back').onclick=()=>openShootDetails(record.id,action==='decline');
  form.onsubmit=event=>{event.preventDefault();const result=ShootRepository.transition(record.id,record.rev,action,String(new FormData(form).get('reason')||''));if(!result.ok){form.querySelector('#shoot-confirm-error').textContent=shootError(result);return;}closeModal();refreshShootViews();openShootDetails(record.id);};
}
function bindShootCards(root) { root.querySelectorAll('[data-shoot-open]').forEach(button=>button.onclick=()=>openShootDetails(button.dataset.shootOpen)); }
function refreshShootViews() {
  if(state.tab==='shoots')renderMyShoots();
  else if(state.tab==='calendar')renderCalendar();
  else if(state.tab==='messages')renderInbox();
  updateReminderBadge();
}
function conversationMessages(personId,projects=ShootRepository.snapshot().records) {
  const saved=Array.isArray(state.messages[personId])?state.messages[personId]:[];
  const cards=projects.filter(p=>p.recipientId===Number(personId)&&p.sentAt>0).map(p=>({shootId:p.id,text:tr('Съёмка: ','Shoot: ')+p.title,direction:'outgoing',createdAt:p.sentAt,time:new Date(p.sentAt).toLocaleTimeString(calendarLocale(),{hour:'2-digit',minute:'2-digit'}),status:'sent'}));
  return [...saved,...cards].sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
}
function projectCalendarEvents() {
  return ShootRepository.snapshot().records.filter(p=>['confirmed','completed'].includes(p.status)&&!ShootRepository.validation(p,true)).map(p=>{
    const endDate=new Date(p.date+'T'+p.time);endDate.setMinutes(endDate.getMinutes()+p.duration);
    const sameDay=shootDateKey(endDate)===p.date;
    return {id:'project-'+p.id,projectId:p.id,personId:p.recipientId,title:p.title,date:p.date,time:p.time,end:sameDay?`${String(endDate.getHours()).padStart(2,'0')}:${String(endDate.getMinutes()).padStart(2,'0')}`:'',location:[p.city,p.location].join(', '),notes:p.participants.map(person=>person.name+' · '+person.role).join('\n')+'\n'+shootFormat(p.format)+(p.format==='paid'?' · '+p.amount+' '+p.currency:'')+'\n'+p.requirements+(sameDay?'':'\n'+tr('Окончание: ','Ends: ')+endDate.toLocaleString(calendarLocale()))};
  });
}
function renderMyShoots() {
  const data=ShootRepository.snapshot();
  document.getElementById('content').innerHTML=pageIntro(tr('Мои съёмки','My shoots'),tr('Черновики, согласование и история совместных проектов.','Drafts, approvals and your project history.'),true)+`<p class="demo-banner">${shootDemoNotice()}</p>${data.error?`<p class="shoot-store-error" role="alert">${shootError(data)}</p>`:''}<div class="workflow-actions"><a class="primary" href="#search">${tr('Найти участника','Find a participant')} ↗</a><a class="ui-secondary" href="#calendar">${tr('Мой календарь','My calendar')}</a></div><div class="shoot-project-grid">${data.records.length?data.records.map(p=>shootCardMarkup(p,true)).join(''):`<section class="surface empty"><h3>${tr('Начни с идеи','Start with an idea')}</h3><p>${tr('Открой профиль специалиста и нажми «Предложить съёмку». Здесь сохранятся черновики и карточки проектов.','Open a specialist’s profile and select Propose a shoot. Your drafts and project cards will be saved here.')}</p></section>`}</div>`;
  bindShootCards(document.getElementById('content'));
}
