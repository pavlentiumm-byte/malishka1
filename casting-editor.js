"use strict";
// Keep the original array storage and unknown fields when editing old announcements.
function castingSnapshot() {
  try {
    const raw=localStorage.getItem('kadr-html-castings');
    const items=raw===null?[]:JSON.parse(raw);
    if(!Array.isArray(items)||items.some(p=>!p||typeof p!=='object'||!p.id||(p.responses&&(!Array.isArray(p.responses)||p.responses.some(r=>!r||typeof r!=='object')))||(p.roles&&(!Array.isArray(p.roles)||p.roles.some(r=>!r||typeof r.name!=='string'||!Number.isInteger(r.count)||r.count<1)))||(p.references&&(!Array.isArray(p.references)||p.references.some(r=>!r||typeof r!=='object')))))throw Error();
    return {items,raw};
  } catch { return {items:[],error:tr('Не удалось прочитать объявления. Исходные данные сохранены; запись заблокирована.','Cannot read announcements. Original data is preserved; writing is blocked.')}; }
}
function saveCastingSnapshot(snapshot,items) {
  if(snapshot.error){toast(snapshot.error);return false;}
  try {
    if(localStorage.getItem('kadr-html-castings')!==snapshot.raw){toast(tr('Объявления изменились. Обнови страницу.','Announcements changed. Refresh the page.'));return false;}
    return workflowSave('castings',items);
  } catch {toast(tr('Хранилище недоступно.','Storage unavailable.'));return false;}
}
function mutateCasting(id,transform) {
  const snapshot=castingSnapshot();
  if(snapshot.error){toast(snapshot.error);return false;}
  if(!snapshot.items.some(p=>p.id===id))return false;
  return saveCastingSnapshot(snapshot,snapshot.items.map(p=>p.id===id?{...transform(p),revision:(p.revision||0)+1}:p));
}
function castingRoles(item) {
  return Array.isArray(item.roles)&&item.roles.length?item.roles:[{name:item.role||'',count:1}];
}
function castingIsOpen(item,today=shootDateKey()) {
  return !item.closed&&item.date>=today&&(!item.deadline||item.deadline>=today);
}
function castingRoleSelect(item) {
  return `<label class="form-label">${tr('Роль в команде','Team role')}<select name="role">${castingRoles(item).map(r=>`<option>${esc(r.name)}</option>`).join('')}</select></label>`;
}
function changeCastingResponse(id,responseId,status) {
  const item=castingSnapshot().items.find(p=>p.id===id),response=item?.responses?.find(r=>r.id===responseId);
  if(!response||!['pending','invited','accepted','declined'].includes(status))return false;
  if(['invited','accepted'].includes(status)&&!castingIsOpen(item))return false;
  if(status==='accepted') {
    if(response.status!=='invited')return false;
    const role=response.role||castingRoles(item)[0].name;
    const slot=castingRoles(item).find(r=>r.name===role);
    const used=item.responses.filter(r=>r.id!==responseId&&r.status==='accepted'&&(r.role||castingRoles(item)[0].name)===role).length;
    if(!slot||used>=slot.count){toast(tr('Все места на эту роль заняты.','All places for this role are filled.'));return false;}
  }
  return mutateCasting(id,p=>({...p,responses:p.responses.map(r=>r.id===responseId?{...r,status}:r)}));
}
function castingExtraMarkup(item) {
  return `<div class="casting-description" data-user-content>${item.genre?`<p>${tr('Жанр','Genre')}: ${esc(item.genre)}</p>`:''}${item.description?`<p>${esc(item.description)}</p>`:''}${item.requirements?`<p>${tr('Требования','Requirements')}: ${esc(item.requirements)}</p>`:''}${item.budget?`<p>${tr('Бюджет','Budget')}: ${esc(item.budget)} ${esc(item.currency||'RUB')}</p>`:''}${item.deadline?`<p>${tr('Отклики до','Apply by')}: ${esc(item.deadline)}</p>`:''}<div class="casting-reference-grid">${(item.references||[]).map(r=>referenceMarkup(r,true)).join('')}</div></div>`;
}
function validateCasting(data,roles,today=shootDateKey()) {
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
  if(!data.title?.trim()||!data.description?.trim()||!data.city?.trim()||!data.location?.trim()||!data.genre?.trim()||!data.author?.trim())return tr('Заполни обязательные поля.','Complete required fields.');
  if(!validDate(data.date)||data.date<today||!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time))return tr('Укажи будущую дату и время съёмки.','Enter a future shoot date and time.');
  if(data.deadline&&(!validDate(data.deadline)||data.deadline>data.date||data.deadline<today))return tr('Срок откликов должен быть между сегодняшним днём и датой съёмки.','Application deadline must be between today and the shoot date.');
  if(!roles.length||roles.length>12||roles.some(r=>!r.name.trim()||!Number.isInteger(r.count)||r.count<1||r.count>50)||new Set(roles.map(r=>r.name.trim().toLocaleLowerCase())).size!==roles.length)return tr('Укажи разные роли и от 1 до 50 мест для каждой.','Enter distinct roles with 1–50 places each.');
  if(!['TFP','paid','discuss'].includes(data.format))return tr('Выбери формат.','Choose a format.');
  if(data.format==='paid'&&(!/^\d{1,9}(\.\d{1,2})?$/.test(data.budget)||Number(data.budget)<=0))return tr('Укажи положительный бюджет, до двух знаков после точки.','Enter a positive budget with up to two decimal places.');
  return '';
}
function openCastingEditor(id=null) {
  const snapshot=castingSnapshot();if(snapshot.error){toast(snapshot.error);return;}
  const item=id?snapshot.items.find(p=>p.id===id):{title:'',date:'',time:'12:00',format:'TFP',author:state.profile?.name||'',responses:[]};
  if(!item)return;
  let references=[...(item.references||[])],busy=false;
  const field=(key,ru,en,type='text',required=true)=>workflowField(key,tr(ru,en),type,item[key]||'',required);
  const area=(key,ru,en,required=false)=>`<label class="form-label">${tr(ru,en)}<textarea name="${key}" rows="3" maxlength="4000" ${required?'required':''}>${esc(item[key]||'')}</textarea></label>`;
  showModal(`<form id="casting-editor" class="modal shoot-form" role="dialog" aria-modal="true" aria-labelledby="casting-editor-title"><button type="button" class="close" aria-label="${tr('Закрыть','Close')}">×</button><h2 id="casting-editor-title">${id?tr('Изменить объявление','Edit announcement'):tr('Новое объявление','New announcement')}</h2><p class="demo-banner">${tr('Локальный черновик объявления. Другие люди его не увидят.','Local announcement demo. Other people will not see it.')}</p>${field('title','Название','Title')}${area('description','Описание и концепция','Description and concept',true)}${field('genre','Жанр','Genre')}<div class="shoot-date-fields">${field('city','Город','City')}${field('location','Место','Location')}${field('date','Дата','Date','date')}${field('time','Время','Time','time')}</div><fieldset><legend>${tr('Кого ищем','Team roles')}</legend><div id="casting-role-rows"></div><button type="button" id="add-casting-role">＋ ${tr('Добавить роль','Add role')}</button></fieldset><label class="form-label">${tr('Формат','Format')}<select name="format">${['TFP','paid','discuss'].map(f=>`<option value="${f}" ${paidFormat(item.format)===f?'selected':''}>${formatLabel(f)}</option>`).join('')}</select></label><div id="casting-payment" class="shoot-date-fields">${field('budget','Общий бюджет','Total budget','number',false)}<label class="form-label">${tr('Валюта','Currency')}<select name="currency">${['RUB','USD','EUR'].map(c=>`<option ${item.currency===c?'selected':''}>${c}</option>`).join('')}</select></label></div>${area('terms','Условия и расходы','Terms and expenses')}${area('requirements','Требования к участникам','Participant requirements')}${field('deadline','Срок откликов (включительно)','Application deadline (inclusive)','date',false)}${field('author','Автор','Author')}<fieldset><legend>${tr('Референсы · до 6','References · up to 6')}</legend><label class="form-label">${tr('Ссылка на референс (необязательно)','Reference link (optional)')}<input name="referenceUrl" type="url" maxlength="2000" placeholder="https://"></label><div id="casting-reference-preview" class="casting-reference-grid"></div><label class="form-label">${tr('Добавить изображения','Add images')}<input id="casting-images" type="file" accept="image/jpeg,image/png,image/webp" multiple></label><p>${tr('JPG, PNG, WebP, до 10 МБ каждый. Изображения уменьшаются перед сохранением.','JPG, PNG, WebP, up to 10 MB each. Images are resized before saving.')}</p></fieldset><p id="casting-editor-error" role="alert"></p><button class="primary" type="submit">${tr('Сохранить объявление','Save announcement')}</button></form>`);
  const form=document.getElementById('casting-editor'),rows=form.querySelector('#casting-role-rows'),error=form.querySelector('#casting-editor-error');
  form.dataset.draftContext='casting:'+(id||'new');
  const addRole=(role={name:'',count:1})=>{if(rows.children.length>=12)return;const row=document.createElement('div');row.className='casting-role-row';row.innerHTML=`<label class="form-label">${tr('Специальность','Specialty')}<input data-role-name required maxlength="100" value="${esc(role.name)}"></label><label class="form-label">${tr('Мест','Places')}<input data-role-count type="number" min="1" max="50" step="1" required value="${esc(role.count)}"></label><button type="button" aria-label="${tr('Удалить роль','Remove role')}">×</button>`;row.querySelector('button').onclick=()=>{row.remove();};rows.append(row);};
  castingRoles(item).forEach(addRole);form.querySelector('#add-casting-role').onclick=()=>addRole();
  const budget=form.elements.budget;budget.min='0.01';budget.step='0.01';budget.max='999999999.99';
  const payment=()=>{const paid=form.elements.format.value==='paid';form.querySelector('#casting-payment').hidden=!paid;budget.required=paid;budget.disabled=!paid;};form.elements.format.onchange=payment;payment();
  const drawRefs=()=>{form.querySelector('#casting-reference-preview').innerHTML=references.map((r,i)=>`<div>${referenceMarkup(r,true)}<button type="button" data-remove-ref="${i}">${tr('Убрать','Remove')}</button></div>`).join('');form.querySelectorAll('[data-remove-ref]').forEach(b=>b.onclick=()=>{references.splice(Number(b.dataset.removeRef),1);drawRefs();});};drawRefs();
  form.querySelector('#casting-images').onchange=async e=>{const files=[...e.target.files];if(references.length+files.length>6){error.textContent=tr('Можно добавить до 6 изображений.','Add up to 6 images.');e.target.value='';return;}busy=true;form.querySelector('[type=submit]').disabled=true;error.textContent=tr('Обрабатываем изображения…','Processing images…');try{const added=[];for(const file of files)added.push({id:workflowId(),title:file.name,image:await compressReference(file)});if(form.isConnected){references.push(...added);drawRefs();error.textContent='';}}catch(err){error.textContent=err.message;}finally{busy=false;form.querySelector('[type=submit]').disabled=false;e.target.value='';}};
  const finishDraft=!id?bindCastingDraft(form,rows,addRole,payment):()=>{};
  form.onsubmit=e=>{e.preventDefault();if(busy)return;const data=Object.fromEntries(new FormData(form));for(const key in data)data[key]=String(data[key]).trim();const roles=[...rows.children].map(row=>({name:row.querySelector('[data-role-name]').value.trim(),count:Number(row.querySelector('[data-role-count]').value)}));error.textContent=validateCasting(data,roles);if(error.textContent)return;
    const current=castingSnapshot();if(current.error){error.textContent=current.error;return;}const latest=current.items.find(p=>p.id===id);if(id&&JSON.stringify(latest)!==JSON.stringify(item)){error.textContent=tr('Объявление изменено в другой вкладке. Закрой форму и открой её заново.','Announcement changed in another tab. Close and reopen this form.');return;}
    if((item.responses||[]).some(r=>r.status==='accepted'&&!roles.some(role=>role.name===(r.role||castingRoles(item)[0].name)))){error.textContent=tr('Нельзя убрать роль с принятыми участниками.','Cannot remove a role with accepted participants.');return;}
    if(roles.some(role=>(item.responses||[]).filter(r=>r.status==='accepted'&&(r.role||castingRoles(item)[0].name)===role.name).length>role.count)){error.textContent=tr('Мест не может быть меньше числа принятых участников.','Places cannot be fewer than accepted participants.');return;}
    if(data.referenceUrl){const url=safeReferenceUrl(data.referenceUrl);if(!url||references.length>=6){error.textContent=tr('Укажи безопасную ссылку; всего можно сохранить 6 референсов.','Enter a safe link; up to 6 references are allowed.');return;}}
    const savedReferences=data.referenceUrl?[...references,{id:workflowId(),title:data.referenceUrl,url:safeReferenceUrl(data.referenceUrl)}]:references;delete data.referenceUrl;
    const record={...item,...data,roles,role:roles.map(r=>r.name).join(', '),budget:data.format==='paid'?data.budget:'',references:savedReferences,id:id||workflowId(),revision:(item.revision||0)+1,updatedAt:Date.now()};
    if(saveCastingSnapshot(current,id?current.items.map(p=>p.id===id?record:p):[record,...current.items])){clearFormDraft(form);finishDraft();closeModal();Object.assign(castingFilters,{city:'',role:'',genre:'',date:'',format:'',scope:'all'});renderCasting();}else error.textContent=tr('Не удалось сохранить. Форма и изображения остались открыты.','Could not save. Form and images remain open.');
  };
}
function bindCastingEditorActions(root) {
  root.querySelectorAll('[data-edit-casting]').forEach(b=>b.onclick=()=>openCastingEditor(b.dataset.editCasting));
  root.querySelectorAll('[data-delete-casting]').forEach(b=>b.onclick=()=>{const snapshot=castingSnapshot(),item=snapshot.items.find(p=>p.id===b.dataset.deleteCasting);if(!item)return;workflowForm(tr('Удалить объявление?','Delete announcement?'),`<p>${esc(item.title)}</p><p>${tr('Объявление, референсы и отклики будут удалены из этого браузера. Отменить удаление нельзя.','The announcement, references and responses will be removed from this browser. This cannot be undone.')}</p>`,tr('Удалить объявление','Delete announcement'),()=>{if(saveCastingSnapshot(snapshot,snapshot.items.filter(p=>p.id!==item.id))){closeModal();renderCasting();}});});
}
