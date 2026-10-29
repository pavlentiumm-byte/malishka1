"use strict";
function chatShootSummary(personId){
  const records=ShootRepository.snapshot().records.filter(p=>p.recipientId===personId&&['confirmed','pending'].includes(p.status)).sort((a,b)=>(a.status==='confirmed'?0:1)-(b.status==='confirmed'?0:1)||(a.date+a.time).localeCompare(b.date+b.time));
  if(!records.length)return '';
  const row=p=>`<div class="chat-project-row"><span class="shoot-status shoot-status-${p.status}">${shootStatus(p.status)}</span><strong data-user-content>${esc(p.title)}</strong><p>${esc(displayDateInput(p.date))} · ${esc(p.time)} · ${esc(p.location||p.city||tr('Место уточняется','Location to be agreed'))}</p><p>${shootFormat(p.format)}${p.format==='paid'?` · ${esc(p.amount)} ${esc(p.currency)}`:''}</p><button class="ui-secondary" data-shoot-open="${esc(p.id)}">${tr('Условия и участники','Terms and participants')} ↗</button></div>`;
  return `<section class="chat-project-summary" aria-label="${tr('Текущие договорённости','Current agreements')}">${row(records[0])}${records.length>1?`<details><summary>${tr('Другие договорённости','Other agreements')} · ${records.length-1}</summary>${records.slice(1).map(row).join('')}</details>`:''}</section>`;
}
