"use strict";
const availabilityKey='kadr-html-availability-v1';
function validAvailabilityDate(value) {
  return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&value>='1900-01-01'&&value<='2100-12-31'&&!isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
}
function availabilitySnapshot() {
  try {
    const raw=localStorage.getItem(availabilityKey);
    if(raw===null){const legacy=JSON.parse(localStorage.getItem('kadr-html-availability')||'[]');if(!Array.isArray(legacy))throw Error();return {raw,version:1,visibility:'private',days:Object.fromEntries(legacy.filter(validAvailabilityDate).map(date=>[date,'free']))};}
    const value=JSON.parse(raw);
    if(value.version!==1||!['private','free','statuses'].includes(value.visibility)||!value.days||Array.isArray(value.days)||typeof value.days!=='object'||Object.entries(value.days).some(([d,s])=>!validAvailabilityDate(d)||!['free','busy','tentative'].includes(s)))throw Error();
    return {...value,raw};
  }catch{return {error:tr('Не удалось прочитать расписание. Исходные данные сохранены.','Cannot read availability. Original data is preserved.'),days:{},visibility:'private'};}
}
function saveAvailability(snapshot,days,visibility) {
  try {
    if(snapshot.error||localStorage.getItem(availabilityKey)!==snapshot.raw)throw Error();
    if(!['private','free','statuses'].includes(visibility)||Object.entries(days).some(([d,s])=>!validAvailabilityDate(d)||!['free','busy','tentative'].includes(s)))throw Error();
    localStorage.setItem(availabilityKey,JSON.stringify({version:1,days,visibility}));return true;
  }catch{toast(tr('Расписание не сохранено: оно изменилось или хранилище недоступно. Открой форму заново.','Availability was not saved: it changed or storage is unavailable. Reopen the form.'));return false;}
}
function availabilityLabel(status) {
  return ({free:tr('Свободен','Available'),busy:tr('Занят','Busy'),tentative:tr('Предварительно','Tentative'),confirmed:tr('Подтверждённая съёмка','Confirmed shoot'),unknown:tr('Не указано','Not specified'),hidden:tr('Расписание скрыто','Schedule hidden')})[status]||tr('Не указано','Not specified');
}
// Public projection contains dates/statuses only, never project titles, people or addresses.
function availabilityProjection(snapshot,confirmed=[],viewer=false) {
  if(snapshot.error||(!viewer&&snapshot.visibility==='private'))return {};
  const days={...snapshot.days};for(const date of confirmed)days[date]='confirmed';
  return Object.fromEntries(Object.entries(days).filter(([,status])=>viewer||snapshot.visibility==='statuses'||status==='free'));
}
function confirmedAvailabilityDates() {
  if(typeof ShootRepository==='undefined')return [];
  return ShootRepository.snapshot().records.filter(p=>p.status==='confirmed'||p.status==='completed').flatMap(p=>{
    const start=new Date(p.date+'T'+p.time),end=new Date(start.getTime()+p.duration*60000-1);
    return [...new Set([p.date,shootDateKey(end)])];
  });
}
function ownAvailabilityDays(viewer=true) {return availabilityProjection(availabilitySnapshot(),confirmedAvailabilityDates(),viewer);}
function availabilityMarkup(personId) {
  if(personId!==0)return `<section class="availability-block"><h3>${tr('Доступность','Availability')}</h3><p>${tr('Специалист не предоставил расписание. Уточни дату в переписке.','This specialist has not shared a schedule. Discuss the date in chat.')}</p></section>`;
  const snapshot=availabilitySnapshot(),days=ownAvailabilityDays(),publicDays=ownAvailabilityDays(false);
  const tags=values=>Object.entries(values).filter(([d])=>d>=shootDateKey()).sort(([a],[b])=>a.localeCompare(b)).slice(0,60).map(([d,s])=>`<span class="tag">${esc(d)} · ${availabilityLabel(s)}</span>`).join('')||`<p>${tr('Даты не указаны','No dates listed')}</p>`;
  return `<section class="availability-block"><h3>${tr('Доступность','Availability')}</h3>${snapshot.error?`<p role="alert">${esc(snapshot.error)}</p>`:''}<div class="tags">${tags(days)}</div><div class="workflow-actions"><button class="ui-secondary" id="add-availability">${tr('Изменить дату','Edit a date')}</button><button class="ui-secondary" id="availability-visibility">${tr('Видимость расписания','Schedule visibility')}</button></div><details><summary>${tr('Как расписание выглядит для других · предпросмотр','How others see the schedule · preview')}</summary>${snapshot.visibility==='private'?`<p>${availabilityLabel('hidden')}</p>`:`<div class="tags">${tags(publicDays)}</div>`}<p>${tr('Только даты и статусы. Названия, адреса и участники не показываются. В этой демонстрации данные остаются в браузере.','Dates and statuses only. Titles, addresses and participants are hidden. In this demo data remains in your browser.')}</p></details></section>`;
}
function openAvailabilityEditor(date=shootDateKey(),rerender=()=>renderCalendar()) {
  const snapshot=availabilitySnapshot();if(snapshot.error){toast(snapshot.error);return;}
  const options=[['','Не указано','Not specified'],['free','Свободен','Available'],['busy','Занят','Busy'],['tentative','Предварительно','Tentative']];
  workflowForm(tr('Доступность на дату','Availability for a date'),workflowField('date',tr('Дата','Date'),'date',date)+`<label class="form-label">${tr('Статус','Status')}<select name="availabilityStatus">${options.map(([s,ru,en])=>`<option value="${s}" ${snapshot.days[date]===s?'selected':''}>${tr(ru,en)}</option>`).join('')}</select></label><p>${tr('Подтверждённые съёмки отмечаются автоматически и имеют приоритет над ручным статусом.','Confirmed shoots appear automatically and take priority over manual status.')}</p>`,tr('Сохранить','Save'),data=>{
    if(!validAvailabilityDate(data.date))return;
    const days={...snapshot.days};if(data.availabilityStatus)days[data.date]=data.availabilityStatus;else delete days[data.date];
    if(saveAvailability(snapshot,days,snapshot.visibility)){closeModal();rerender();}
  });
  const form=document.getElementById('workflow-form');form.elements.date.min='1900-01-01';form.elements.date.onchange=()=>{form.elements.availabilityStatus.value=snapshot.days[form.elements.date.value]||'';};
}
function openAvailabilityVisibility(rerender) {
  const snapshot=availabilitySnapshot();if(snapshot.error){toast(snapshot.error);return;}
  workflowForm(tr('Видимость расписания','Schedule visibility'),`<label class="form-label">${tr('Что показывать в профиле','What to show in your profile')}<select name="visibility">${[['private','Только мне','Only me'],['free','Только свободные даты','Available dates only'],['statuses','Даты и статусы','Dates and statuses']].map(([v,ru,en])=>`<option value="${v}" ${snapshot.visibility===v?'selected':''}>${tr(ru,en)}</option>`).join('')}</select></label><p>${tr('Детали съёмок всегда скрыты. Это настройка локального предпросмотра, а не публикация расписания.','Shoot details are always hidden. This controls a local preview; it does not publish your schedule.')}</p>`,tr('Сохранить','Save'),data=>{if(saveAvailability(snapshot,snapshot.days,data.visibility)){closeModal();rerender();}});
}
function bindAvailability(root,rerender) {
  root.querySelector('#add-availability')?.addEventListener('click',()=>openAvailabilityEditor(shootDateKey(),rerender));
  root.querySelector('#availability-visibility')?.addEventListener('click',()=>openAvailabilityVisibility(rerender));
}
function bindProposalAvailability(form,personId) {
  const hint=document.createElement('p');hint.className='shoot-hint';hint.setAttribute('role','status');form.elements.date.closest('.shoot-fields-grid').after(hint);
  const update=()=>{const date=form.elements.date.value,status=ownAvailabilityDays()[date];hint.textContent=tr('Расписание специалиста недоступно: уточни дату в чате.','The specialist’s schedule is unavailable: discuss the date in chat.')+(status?` ${tr('Твоя доступность','Your availability')}: ${availabilityLabel(status)}.`:'');};
  form.elements.date.addEventListener('input',update);update();
}
