"use strict";

// Dates represent the local wall-clock time agreed by the participants.
function shootDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
let calendarDay = shootDateKey();
let calendarMonth = calendarDay.slice(0,7);
function savedShoots() {
  const value = read('shoots',[]);
  const manual=Array.isArray(value) ? value.filter(item => item && typeof item.id==='string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && typeof item.time==='string') : [];
  const derived=projectCalendarEvents();
  return [...manual.filter(item=>!derived.some(project=>project.id===item.id)),...derived];
}
function saveShoots(items) {
  try { localStorage.setItem('kadr-html-shoots',JSON.stringify(items.filter(item=>!item.projectId))); return true; }
  catch { return false; }
}
function shootPerson(id) { return people.find(person=>person.id===Number(id)); }
function calendarLocale() { return settings.language==='en' ? 'en-GB' : 'ru-RU'; }
function renderCalendar() {
  const [year,month]=calendarMonth.split('-').map(Number);
  const first=new Date(year,month-1,1,12), count=new Date(year,month,0,12).getDate();
  const offset=(first.getDay()+6)%7, today=shootDateKey(), shoots=savedShoots(),availability=ownAvailabilityDays();
  const daily=shoots.filter(item=>item.date===calendarDay).sort((a,b)=>a.time.localeCompare(b.time));
  const title=first.toLocaleDateString(calendarLocale(),{month:'long',year:'numeric'});
  let cells=Array.from({length:offset},()=>'<span class="calendar-blank" aria-hidden="true"></span>').join('');
  for(let day=1;day<=count;day++) {
    const date=`${calendarMonth}-${String(day).padStart(2,'0')}`, total=shoots.filter(item=>item.date===date).length;
    cells+=`<button class="calendar-day ${date===today?'is-today':''} ${date===calendarDay?'is-selected':''}" data-day="${date}" aria-pressed="${date===calendarDay}" aria-label="${date}, ${tr('съёмок','shoots')}: ${total}, ${availabilityLabel(availability[date])}"><span>${day}</span>${availability[date]?`<i class="availability-dot availability-${availability[date]}" title="${availabilityLabel(availability[date])}"></i>`:''}${total?`<small>${total}<span class="calendar-count-label"> ${tr('съёмки','shoots')}</span></small>`:''}</button>`;
  }
  document.getElementById('content').innerHTML=pageIntro(tr('Календарь съёмок','Shoot calendar'),tr('Твои даты, места и детали встреч — в одном месте.','Your dates, locations and meeting details in one place.'),true)+`
    <div class="calendar-toolbar"><div class="calendar-month-nav"><button id="calendar-prev" aria-label="${tr('Предыдущий месяц','Previous month')}">←</button><h2>${esc(title)}</h2><button id="calendar-next" aria-label="${tr('Следующий месяц','Next month')}">→</button></div><div class="calendar-actions"><button id="calendar-today">${tr('Сегодня','Today')}</button><button id="calendar-add" class="primary">＋ ${tr('Добавить съёмку','Add shoot')}</button></div></div>
    <div class="availability-legend">${['free','busy','tentative','confirmed'].map(s=>`<span><i class="availability-dot availability-${s}"></i>${availabilityLabel(s)}</span>`).join('')}</div><div class="calendar-layout"><section class="surface calendar-month" aria-label="${esc(title)}"><div class="calendar-week">${tr('Пн Вт Ср Чт Пт Сб Вс','Mon Tue Wed Thu Fri Sat Sun').split(' ').map(day=>`<span>${day}</span>`).join('')}</div><div class="calendar-grid">${cells}</div></section>
    <section class="surface calendar-agenda"><h2>${esc(new Date(calendarDay+'T12:00:00').toLocaleDateString(calendarLocale(),{day:'numeric',month:'long',year:'numeric'}))}</h2><p>${availabilityLabel(availability[calendarDay])}</p><div class="workflow-actions"><button id="calendar-availability">${tr('Изменить доступность','Edit availability')}</button><button id="availability-visibility">${tr('Видимость','Visibility')}</button></div>${daily.length?daily.map(item=>{
      const person=shootPerson(item.personId);
      return `<article class="shoot-entry"><span class="shoot-time">${esc(item.time)}${item.end?' — '+esc(item.end):''}</span><h3 data-user-content>${esc(item.title)}</h3>${person?`<p data-user-content>${esc(person.name)} · ${esc(person.city)}</p>`:''}${item.location?`<p data-user-content>⌖ ${esc(item.location)}</p>`:''}${item.notes?`<p class="shoot-notes" data-user-content>${esc(item.notes)}</p>`:''}<div class="shoot-actions">${item.projectId?`<button data-shoot-open="${esc(item.projectId)}">${tr('Карточка съёмки','Shoot card')}</button>`:''}${item.id.startsWith('agreement-')?`<button data-plan-board="${esc(item.id)}">${tr('Мудборд и подготовка','Moodboard and preparation')}</button><button data-plan-cancel="${esc(item.id)}">${tr('Отменить съёмку','Cancel shoot')}</button>`:''}${!item.projectId?`<button data-edit-shoot="${esc(item.id)}">${tr('Редактировать','Edit')}</button>`:''}${person?`<button data-shoot-chat="${person.id}">${tr('Открыть чат','Open chat')} ↗</button>`:''}</div></article>`;
    }).join(''):`<div class="calendar-empty"><span aria-hidden="true">＋</span><p>${tr('На этот день съёмок пока нет.','No shoots planned for this day.')}</p><button id="calendar-empty-add">${tr('Запланировать съёмку','Plan a shoot')}</button></div>`}</section></div>
    <p class="demo-banner">${tr('Личный календарь на этом устройстве. Время указывай по месту съёмки. Запись не отправляет приглашение собеседнику.','Your personal calendar on this device. Use local time at the shoot location. Saving does not send an invitation.')}</p>`;
  const content=document.getElementById('content');
  bindShootCards(content);
  bindAvailability(content,renderCalendar);
  document.getElementById("calendar-availability").onclick=()=>openAvailabilityEditor(calendarDay,renderCalendar);
  content.querySelectorAll('[data-day]').forEach(button=>button.onclick=()=>{calendarDay=button.dataset.day;renderCalendar();});
  const move=step=>{calendarDay=shootDateKey(new Date(year,month-1+step,1,12));calendarMonth=calendarDay.slice(0,7);renderCalendar();};
  document.getElementById('calendar-prev').onclick=()=>move(-1);
  document.getElementById('calendar-next').onclick=()=>move(1);
  document.getElementById('calendar-today').onclick=()=>{calendarDay=shootDateKey();calendarMonth=calendarDay.slice(0,7);renderCalendar();};
  document.getElementById('calendar-add').onclick=()=>openShootEditor();
  document.getElementById('calendar-empty-add')?.addEventListener('click',()=>openShootEditor());
  content.querySelectorAll('[data-plan-board]').forEach(button=>button.onclick=()=>{const item=savedShoots().find(s=>s.id===button.dataset.planBoard);if(item)openPlanning(item.personId,item.id.slice(10));});
  content.querySelectorAll('[data-plan-cancel]').forEach(button=>button.onclick=()=>{const item=savedShoots().find(s=>s.id===button.dataset.planCancel);if(item)cancelProposal(item.personId,item.id.slice(10));});
  content.querySelectorAll('[data-edit-shoot]').forEach(button=>button.onclick=()=>openShootEditor(button.dataset.editShoot));
  content.querySelectorAll('[data-shoot-chat]').forEach(button=>button.onclick=()=>{state.chat=Number(button.dataset.shootChat);selectTab('messages');});
}

function openShootEditor(id=null,personId=null) {
  const existing=id?savedShoots().find(item=>item.id===id):null;
  if(existing?.projectId){openShootProposal(existing.personId,existing.projectId);return;}
  if(existing?.id.startsWith('agreement-') && proposalById(existing.personId,existing.id.slice(10))) { editProposal(existing.personId,existing.id.slice(10)); return; }
  if(id&&!existing)return;
  const selectedPerson=existing?.personId??personId;
  const person=shootPerson(selectedPerson);
  const date=existing?.date || (state.tab==='calendar'?calendarDay:shootDateKey());
  showModal(`<form class="modal shoot-form" id="shoot-form" role="dialog" aria-modal="true" aria-labelledby="shoot-title">
    <button type="button" class="close" aria-label="${tr('Закрыть','Close')}">×</button><span class="eyebrow">${tr('ТВОИ ПЛАНЫ','YOUR PLANS')}</span><h2 id="shoot-title">${existing?tr('Редактировать съёмку','Edit shoot'):tr('Запланировать съёмку','Plan a shoot')}</h2>
    <label class="form-label">${tr('Название','Title')}<input name="title" required maxlength="100" value="${esc(existing?.title || (person?tr('Съёмка с ','Shoot with ')+person.name:''))}" placeholder="${tr('Например: портретная съёмка','For example: portrait shoot')}"></label>
    <label class="form-label">${tr('С кем','With whom')}<select name="personId"><option value="">${tr('Без привязки к чату','Not linked to a chat')}</option>${people.map(p=>`<option value="${p.id}" ${p.id===Number(selectedPerson)?'selected':''}>${esc(p.name)} · @${esc(personUsername(p))}</option>`).join('')}</select></label>
    <div class="shoot-date-fields"><label class="form-label">${tr('Дата','Date')}<input type="date" name="date" required min="1900-01-01" max="2100-12-31" value="${esc(date)}"></label><label class="form-label">${tr('Начало','Start')}<input type="time" name="time" required value="${esc(existing?.time || '12:00')}"></label><label class="form-label">${tr('Окончание','End')}<input type="time" name="end" value="${esc(existing?.end || '')}"></label></div>
    <label class="form-label">${tr('Место','Location')}<input name="location" maxlength="200" value="${esc(existing?.location || '')}" placeholder="${tr('Город, студия или адрес встречи','City, studio or meeting address')}"></label>
    <label class="form-label">${tr('Договорённости','Details')}<textarea name="notes" maxlength="2000" rows="3" placeholder="${tr('Идея, условия, что взять с собой…','Concept, terms, what to bring…')}">${esc(existing?.notes || '')}</textarea></label>
    <p class="shoot-hint">${tr('Время — по месту съёмки. Сохранится только в твоём календаре, без отправки приглашения.','Use local time at the shoot location. Saved only to your calendar, without sending an invitation.')}</p>
    <p id="shoot-error" role="alert"></p><div class="shoot-form-actions"><button type="submit" class="primary">${tr('Сохранить в календарь','Save to calendar')}</button>${existing?`<button type="button" id="delete-shoot">${tr('Удалить','Delete')}</button>`:''}</div>
    ${existing?`<div id="shoot-delete-confirm" hidden><p>${tr('Удалить эту съёмку из календаря?','Delete this shoot from your calendar?')}</p><button type="button" id="confirm-delete-shoot">${tr('Да, удалить','Yes, delete')}</button> <button type="button" id="cancel-delete-shoot">${tr('Отмена','Cancel')}</button></div>`:''}
  </form>`);
  const form=document.getElementById('shoot-form'),error=document.getElementById('shoot-error');
  const failed=()=>{error.textContent=tr('Не удалось сохранить календарь. Проверь доступ к хранилищу и свободное место.','Could not save the calendar. Check storage access and available space.');};
  form.onsubmit=event=>{
    event.preventDefault();
    const data=new FormData(form);
    const next={id:existing?.id || (Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)),title:String(data.get('title')).trim(),personId:data.get('personId')?Number(data.get('personId')):null,date:String(data.get('date')),time:String(data.get('time')),end:String(data.get('end')),location:String(data.get('location')).trim(),notes:String(data.get('notes')).trim()};
    if(!next.title){error.textContent=tr('Укажи название съёмки.','Enter a shoot title.');form.elements.title.focus();return;}
    if(next.end && next.end<=next.time){error.textContent=tr('Окончание должно быть позже начала в тот же день.','End time must be later than start time on the same day.');form.elements.end.focus();return;}
    const items=savedShoots();
    if(!saveShoots(existing?items.map(item=>item.id===id?next:item):[...items,next])){failed();return;}
    calendarDay=next.date;calendarMonth=next.date.slice(0,7);closeModal();
    if(state.tab==='calendar')renderCalendar();
    toast(tr('Съёмка сохранена в календарь','Shoot saved to calendar'));
  };
  if(existing){
    const confirmation=document.getElementById('shoot-delete-confirm');
    document.getElementById('delete-shoot').onclick=()=>{confirmation.hidden=false;document.getElementById('confirm-delete-shoot').focus();};
    document.getElementById('cancel-delete-shoot').onclick=()=>{confirmation.hidden=true;document.getElementById('delete-shoot').focus();};
    document.getElementById('confirm-delete-shoot').onclick=()=>{
      if(!saveShoots(savedShoots().filter(item=>item.id!==id))){failed();return;}
      closeModal();if(state.tab==='calendar')renderCalendar();toast(tr('Съёмка удалена','Shoot deleted'));
    };
  }
}
