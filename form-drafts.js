"use strict";
const formDraftStates=new WeakMap();
const draftFormIds=new Set(['profile-form','shoot-form','shoot-proposal-form','casting-editor','workflow-form','creative-reference-form','creative-compose','chat-form','new-project','rename-project','social-settings','support-form','reference-form','task-form','shoot-confirm']);
function draftControls(form){return [...form.querySelectorAll('input,select,textarea')].filter(el=>!['file','password','hidden','submit','button'].includes(el.type)&&!el.dataset.datePicker&&(el.name||el.id==='message-input'||el.hasAttribute('data-role-name')||el.hasAttribute('data-role-count')));}
function draftValues(form){return draftControls(form).map(el=>({name:el.name||el.id||(el.hasAttribute('data-role-name')?'$role':'$count'),value:el.value,checked:['checkbox','radio'].includes(el.type)?el.checked:null}));}
function draftHash(value){let h=2166136261;for(const c of value){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
function clearFormDraft(form){const entry=form&&formDraftStates.get(form);if(!entry)return;try{if(localStorage.getItem(entry.key)===entry.raw)localStorage.removeItem(entry.key);entry.raw=null;entry.dirty=false;entry.suspended=false;entry.panel.querySelector('.auto-draft-status').textContent=tr('Сохранено. Новые изменения будут сохранены как черновик.','Saved. New edits will be saved as a draft.');entry.panel.querySelectorAll('button').forEach(b=>b.hidden=true);}catch{}}
function enhanceFormDrafts(root=document){
  root.querySelectorAll('form').forEach(form=>{
    if(!draftFormIds.has(form.id)||formDraftStates.has(form)||!draftControls(form).length)return;
    const contexts={'chat-form':'chat:'+state.chat,'creative-compose':'group:'+(typeof creativeSelected==='undefined'?'':creativeSelected),'new-project':'portfolio-new','rename-project':'portfolio:'+(typeof selectedProject==='undefined'?'':selectedProject),'social-settings':'socials','support-form':'support'};
    const explicit=form.dataset.draftContext||contexts[form.id];
    const base=explicit||JSON.stringify([location.hash,form.textContent,draftValues(form)]);
    const key='kadr-html-auto-draft-v1:'+form.id+':'+draftHash(base);
    const panel=document.createElement('div');panel.className='auto-draft-panel';
    panel.innerHTML=`<span class="auto-draft-status" role="status"></span><div><button type="button" data-draft-restore>${tr('Восстановить','Restore')}</button><button type="button" data-draft-remove>${tr('Удалить черновик','Delete draft')}</button></div>`;
    const entry={key,raw:null,panel,dirty:false,suspended:false};formDraftStates.set(form,entry);
    const status=panel.querySelector('.auto-draft-status'),restore=panel.querySelector('[data-draft-restore]'),remove=panel.querySelector('[data-draft-remove]');
    const hasFiles=!!form.querySelector('input[type=file]');
    const notice=()=>tr('Текст сохраняется автоматически на этом устройстве.','Text is saved automatically on this device.')+(hasFiles?tr(' Файлы нужно выбрать заново.',' Select files again when restoring.'):'');
    try{entry.raw=localStorage.getItem(key);status.textContent=entry.raw?tr('Есть незавершённый черновик. Восстановить его?','An unfinished draft is available. Restore it?'):notice();}catch{status.textContent=tr('Автосохранение недоступно.','Autosave unavailable.');}
    restore.hidden=remove.hidden=!entry.raw;
    if(form.id==='chat-form'){form.after(panel);}else{const heading=form.querySelector('h2');if(heading)heading.after(panel);else form.append(panel);}
    const save=()=>{
      if(entry.suspended||!form.isConnected)return;
      try{
        if(localStorage.getItem(key)!==entry.raw){status.textContent=tr('Черновик изменён в другой вкладке. Восстанови актуальный текст перед продолжением.','Draft changed in another tab. Restore the current draft before continuing.');restore.hidden=false;return;}
        const value=JSON.stringify({version:1,fields:draftValues(form),at:Date.now()});localStorage.setItem(key,value);entry.raw=value;entry.dirty=true;restore.hidden=true;remove.hidden=false;status.textContent=tr('Черновик сохранён.','Draft saved.')+(hasFiles?tr(' Файлы нужно выбрать заново.',' Select files again when restoring.'):'');
      }catch{status.textContent=tr('Не удалось сохранить черновик. Не закрывай форму, чтобы не потерять текст.','Could not save draft. Keep this form open to preserve your text.');}
    };
    form.addEventListener('input',event=>{if(!panel.contains(event.target))save();});
    form.addEventListener('change',event=>{if(!panel.contains(event.target))save();});
    form.addEventListener('click',event=>{if(event.target.closest('#add-casting-role,.casting-role-row button'))queueMicrotask(save);});
    restore.onclick=()=>{
      try{
        const raw=localStorage.getItem(key),data=JSON.parse(raw);
        if(data?.version!==1||!Array.isArray(data.fields)||data.fields.length>500||data.fields.some(x=>!x||typeof x.name!=='string'||typeof x.value!=='string'||(x.checked!==null&&typeof x.checked!=='boolean')))throw Error();
        entry.suspended=true;
        if(form.id==='casting-editor'){
          const target=data.fields.filter(x=>x.name==='$role').length;if(target>12)throw Error();
          const rows=form.querySelector('#casting-role-rows');while(rows.children.length>target)rows.lastElementChild.remove();while(rows.children.length<target)form.querySelector('#add-casting-role').click();
        }
        const counts={};
        for(const field of data.fields){
          const list=draftControls(form).filter(el=>(el.name||el.id||(el.hasAttribute('data-role-name')?'$role':'$count'))===field.name);
          const index=counts[field.name]||0;counts[field.name]=index+1;const el=list[index];if(!el)continue;
          el.value=el.dataset.dateEntry?displayDateInput(field.value):field.value;if(field.checked!==null)el.checked=field.checked;
          el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));
        }
        entry.raw=raw;entry.dirty=true;restore.hidden=true;remove.hidden=false;status.textContent=tr('Черновик восстановлен. Проверь данные перед сохранением.','Draft restored. Check the data before saving.');
      }catch{status.textContent=tr('Черновик недоступен или повреждён. Он не удалён.','Draft unavailable or damaged. It has not been deleted.');}finally{entry.suspended=false;}
    };
    remove.onclick=()=>{try{if(localStorage.getItem(key)!==entry.raw){status.textContent=tr('Черновик изменён в другой вкладке — сначала восстанови его.','Draft changed in another tab; restore it first.');return;}localStorage.removeItem(key);entry.raw=null;entry.dirty=false;restore.hidden=remove.hidden=true;status.textContent=tr('Черновик удалён. Новые изменения будут сохранены автоматически.','Draft deleted. New edits will be saved automatically.');}catch{status.textContent=tr('Не удалось удалить черновик.','Could not delete draft.');}};
  });
}
