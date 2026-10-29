"use strict";
let notificationFilter='all';
function collectActivityNotifications(){
  const items=[];
  for(const [id,messages] of Object.entries(state.messages)){
    if(SafetyStore.blocked(Number(id)))continue;
    const incoming=messages.filter(m=>m.direction==='incoming');if(!incoming.length)continue;
    const last=incoming[incoming.length-1],person=shootPerson(id);
    items.push({id:`message:${id}:${last.createdAt||incoming.length}`,kind:'chat',category:'messages',personId:Number(id),at:last.createdAt||0,read:!hasUnread(id),title:person?.name||tr('Сообщение','Message'),text:hasUnread(id)?tr('Непрочитанных демосообщений: ','Unread demo messages: ')+incoming.filter(m=>!m.read).length:tr('Демопереписка прочитана.','Demo conversation has been read.')});
  }
  const snapshot=ShootRepository.snapshot();
  for(const p of snapshot.records){
    if(p.status==='draft'||SafetyStore.blocked(p.recipientId))continue;
    const last=p.history?.[p.history.length-1];
    items.push({id:`project:${p.id}:${p.rev}`,kind:'project',category:'shoots',projectId:p.id,at:last?.at||p.updatedAt||p.sentAt||0,title:p.title,text:tr('Съёмка · ','Shoot · ')+shootStatus(p.status)});
  }
  for(const c of castingSnapshot().items){
    if(c.authorId&&SafetyStore.blocked(c.authorId))continue;
    for(const r of c.responses||[]){if(SafetyStore.blocked(r.personId))continue;
      items.push({id:`response:${c.id}:${r.id}:${r.status||'pending'}`,kind:'casting',category:'responses',castingId:c.id,at:r.updatedAt||r.createdAt||0,title:c.title,text:tr('Отклик: ','Response: ')+r.name+' · '+(responseLabels()[r.status||'pending']||r.status)});
    }
  }
  return items.sort((a,b)=>b.at-a.at);
}
function notificationRead(item){return !item.persistent&&(item.read||workflowList('notification-read-v1').includes(item.id));}
function markNotificationRead(ids){const old=workflowList('notification-read-v1');return workflowSave('notification-read-v1',[...new Set([...old,...ids])].slice(-1000));}
function openNotification(item){
  if(!item.persistent)markNotificationRead([item.id]);
  if(item.kind==='verification')openVerificationRequest();
  else if(item.kind==='project')openShootDetails(item.projectId);
  else if(item.kind==='calendar'){calendarDay=item.date;calendarMonth=item.date.slice(0,7);selectTab('calendar');}
  else if(item.kind==='casting'){Object.assign(castingFilters,{scope:'all',city:'',role:'',genre:'',date:'',format:''});const focus=()=>document.querySelector(`[data-casting-id="${CSS.escape(item.castingId)}"]`)?.scrollIntoView({block:'start'});if(state.tab==='casting'){renderCasting();focus();}else{window.addEventListener('hashchange',focus,{once:true});selectTab('casting');}}
  else{state.chat=item.personId;selectTab('messages');}
  updateReminderBadge();
}
function renderNotificationCenter(){
  const hidden=workflowList('dismissed-reminders');
  const all=collectReminders().filter(n=>n.persistent||!hidden.includes(n.id));
  const visible=all.filter(n=>notificationFilter==='all'||notificationFilter==='unread'&&!notificationRead(n)||n.category===notificationFilter);
  const filters=[['all','Все','All'],['unread','Непрочитанные','Unread'],['messages','Сообщения','Messages'],['shoots','Съёмки','Shoots'],['responses','Отклики','Responses']];
  document.getElementById('content').innerHTML=pageIntro(tr('Уведомления','Notifications'),tr('Сообщения, отклики, изменения съёмок и напоминания.','Messages, responses, shoot changes and reminders.'))+`<p class="demo-banner">${tr('Локальная лента этого браузера. Демо-события не являются ответами реальных людей. Push-уведомления не отправляются.','Local activity in this browser. Demo events are not responses from real people. Push notifications are not sent.')}</p><div class="notification-filters">${filters.map(([key,ru,en])=>`<button data-notification-filter="${key}" aria-pressed="${notificationFilter===key}">${tr(ru,en)}</button>`).join('')}</div><div class="workflow-actions"><button id="read-notifications">${tr('Отметить всё прочитанным','Mark all as read')}</button>${hidden.length?`<button id="restore-notifications">${tr('Вернуть скрытые','Restore hidden')}</button>`:''}</div><div class="reminder-list">${visible.map(n=>`<article class="surface notification-item ${notificationRead(n)?'is-read':''}"><span class="planning-status">${n.persistent?tr('Требует внимания','Needs attention'):notificationRead(n)?tr('Прочитано','Read'):tr('Новое','New')}</span><h2 data-user-content>${esc(n.title)}</h2><p data-user-content>${esc(n.text)}</p><div class="workflow-actions"><button class="primary" data-notification-open="${esc(n.id)}">${tr('Открыть','Open')}</button>${n.persistent?'':`<button data-notification-hide="${esc(n.id)}">${tr('Скрыть','Hide')}</button>`}</div></article>`).join('')||`<section class="surface"><h2>${tr('Здесь пока пусто','Nothing here yet')}</h2><p>${tr('Новые события появятся здесь по мере работы с сайтом.','New events will appear as you use the site.')}</p></section>`}</div>`;
  document.querySelectorAll('[data-notification-filter]').forEach(b=>b.onclick=()=>{notificationFilter=b.dataset.notificationFilter;renderNotificationCenter();document.querySelector(`[data-notification-filter="${notificationFilter}"]`).focus();});
  document.querySelectorAll('[data-notification-open]').forEach(b=>b.onclick=()=>{openNotification(all.find(n=>n.id===b.dataset.notificationOpen));if(state.tab==='reminders')renderNotificationCenter();});
  document.querySelectorAll('[data-notification-hide]').forEach(b=>b.onclick=()=>{if(workflowSave('dismissed-reminders',[...new Set([...hidden,b.dataset.notificationHide])])){renderNotificationCenter();updateReminderBadge();}});
  document.getElementById('read-notifications').onclick=()=>{if(markNotificationRead(all.filter(n=>!n.persistent).map(n=>n.id))){renderNotificationCenter();updateReminderBadge();}};
  document.getElementById('restore-notifications')?.addEventListener('click',()=>{if(workflowSave('dismissed-reminders',[])){renderNotificationCenter();updateReminderBadge();}});
}
