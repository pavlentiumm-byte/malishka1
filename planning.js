"use strict";

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
  if(taskForm)taskForm.dataset.draftContext='task:'+personId+':'+id;
  if(taskForm)taskForm.onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(taskForm));if(!data.title.trim()||!data.owner.trim()){root.querySelector('#planning-error').textContent=tr('Укажи задачу и ответственного.','Enter the task and its owner.');return;}if((proposalById(personId,id)?.tasks||[]).length>=40){root.querySelector('#planning-error').textContent=tr('Не больше 40 задач на съёмку.','Up to 40 tasks per shoot.');return;}if(mutate(current=>({...current,tasks:[...(current.tasks||[]),{id:workflowId(),title:data.title.trim(),owner:data.owner.trim(),done:false}]})))clearFormDraft(taskForm);};
  const referenceForm=root.querySelector('#reference-form');
  if(referenceForm)referenceForm.dataset.draftContext='reference:'+personId+':'+id;
  if(referenceForm)referenceForm.onsubmit=async e=>{e.preventDefault();const data=new FormData(referenceForm),file=data.get('image'),url=String(data.get('url')).trim(),title=String(data.get('title')).trim(),error=root.querySelector('#planning-error');
    if(!title){error.textContent=tr('Добавь подпись.','Add a caption.');return;}
    if((proposalById(personId,id)?.references||[]).length>=8){error.textContent=tr('Не больше 8 референсов на съёмку.','Up to 8 references per shoot.');return;}
    if((!file?.size&&!url)||(url&&!safeReferenceUrl(url))){error.textContent=tr('Выбери изображение или укажи ссылку http/https.','Choose an image or enter an http/https link.');return;}
    const button=referenceForm.querySelector('[type="submit"]');button.disabled=true;error.textContent=tr('Сохраняем…','Saving…');
    try { const ref={id:workflowId(),title,url:url?safeReferenceUrl(url):null,image:file?.size?await compressReference(file):null};if(!referenceForm.isConnected)return;if(mutate(current=>({...current,references:[...(current.references||[]),ref]})))clearFormDraft(referenceForm); }
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
  if(state.profile)reminders.push({id:'profile-verification',kind:'verification',persistent:true,title:tr('Верифицируй профиль','Verify your profile'),text:tr('Профиль пока не подтверждён. В демоверсии можно подготовить локальную заявку; настоящая проверка ещё не подключена.','Your profile is not verified. You can prepare a local request in this demo; actual verification is not connected yet.')});
  for(const shoot of savedShoots()) {
    const time=new Date(shoot.date+'T'+shoot.time).getTime();
    scheduled.add(shoot.id);
    if(time>=now&&time<=now+86400000)reminders.push({id:'shoot:'+shoot.id+':'+shoot.date+':'+shoot.time,title:shoot.title,text:tr('Съёмка в ближайшие 24 часа','Shoot within the next 24 hours')+' · '+shoot.date+' '+shoot.time,date:shoot.date,kind:'calendar',category:'shoots'});
  }
  for(const [personId,messages] of Object.entries(state.messages)) for(const message of messages) {
    const p=message.proposal;if(!p||p.status==='cancelled')continue;
    const time=new Date(p.date+'T'+p.time).getTime();
    if(p.status==='agreed'&&!scheduled.has('agreement-'+p.id)&&time>=now&&time<=now+86400000)reminders.push({id:'agreement:'+p.id+':'+p.date+':'+p.time,title:p.title,text:tr('Съёмка скоро — добавь её в календарь','Shoot coming up — add it to the calendar'),personId:Number(personId),kind:'chat',category:'shoots'});
  }
  if(typeof collectActivityNotifications==='function')reminders.push(...collectActivityNotifications());
  return reminders;
}
function renderReminders() {
  if(typeof renderNotificationCenter==='function'){renderNotificationCenter();return;}
  const reminders=collectReminders(),dismissed=workflowList('dismissed-reminders'),visible=reminders.filter(r=>r.persistent||!dismissed.includes(r.id));
  const content=document.getElementById('content');
  content.innerHTML=pageIntro(tr('Напоминания','Reminders'),tr('Ближайшие съёмки и важные даты.','Upcoming shoots and important dates.'))+`<p class="demo-banner">${tr('Напоминания проверяются при открытии сайта и раз в минуту, пока он открыт. Время — по часам этого устройства. В закрытом браузере уведомления не отправляются.','Reminders are checked when you open the site and every minute while it is open. Times use this device’s clock. No notifications are sent while the browser is closed.')}</p><div class="reminder-list">${visible.length?visible.map(r=>`<article class="surface"><span class="eyebrow">${esc(r.text)}</span><h2>${esc(r.title)}</h2><div class="workflow-actions"><button class="primary" data-open-reminder="${esc(r.id)}">${r.kind==='verification'?tr('Перейти к верификации','Verify profile'):r.kind==='calendar'?tr('В календарь','Open calendar'):tr('Открыть чат','Open chat')}</button>${r.persistent?'':`<button data-dismiss-reminder="${esc(r.id)}">${tr('Скрыть','Dismiss')}</button>`}</div></article>`).join(''):`<section class="surface"><h2>${tr('Всё спокойно','All caught up')}</h2><p>${tr('Здесь появятся съёмки на ближайшие 24 часа. Добавить съёмку можно в календаре твоего профиля.','Shoots within the next 24 hours will appear here. Add a shoot in the calendar in your profile.')}</p></section>`}</div>${dismissed.length?`<button id="restore-reminders">${tr('Вернуть скрытые напоминания','Restore dismissed reminders')}</button>`:''}`;
  content.querySelectorAll('[data-open-reminder]').forEach(b=>b.onclick=()=>{const r=visible.find(item=>item.id===b.dataset.openReminder);if(r.kind==='verification'){openVerificationRequest();}else if(r.kind==='calendar'){calendarDay=r.date;calendarMonth=r.date.slice(0,7);selectTab('calendar');}else{state.chat=r.personId;selectTab('messages');}});
  content.querySelectorAll('[data-dismiss-reminder]').forEach(b=>b.onclick=()=>{if(workflowSave('dismissed-reminders',[...new Set([...workflowList('dismissed-reminders'),b.dataset.dismissReminder])])){renderReminders();updateReminderBadge();}});
  content.querySelector('#restore-reminders')?.addEventListener('click',()=>{if(workflowSave('dismissed-reminders',[])){renderReminders();updateReminderBadge();}});
}
function updateReminderBadge() {
  const link=document.getElementById('reminders-link');if(!link)return;
  const dismissed=workflowList('dismissed-reminders'),count=collectReminders().filter(r=>r.persistent||(!dismissed.includes(r.id)&&(typeof notificationRead!=='function'||!notificationRead(r)))).length;
  link.innerHTML=`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>${count?`<span class="reminder-count">${count}</span>`:''}`;
  link.setAttribute('aria-label',tr('Уведомления','Notifications')+(count?': '+count:''));link.title=tr('Уведомления','Notifications');
}
