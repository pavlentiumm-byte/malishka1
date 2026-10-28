"use strict";

function interfaceIcon(name) {
  const paths={
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    casting:'<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v3h4v-3"/>',
    messages:'<path d="M12 3C7.03 3 3 6.81 3 11.5c0 1.65.48 3.19 1.31 4.49L3 21l5.28-1.76A9.49 9.49 0 0 0 12 20c4.97 0 9-3.81 9-8.5S16.97 3 12 3Z"/><path d="M7 9h9M7 13h6"/>',
    profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18M8 15h3M14 15h2"/>',
    settings:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="var(--bg)"/><circle cx="15" cy="12" r="2" fill="var(--bg)"/><circle cx="9" cy="18" r="2" fill="var(--bg)"/>',
    upload:'<path d="M12 16V3m-4 4 4-4 4 4M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>',
    spark:'<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z"/>'
  };
  return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.profile}</svg>`;
}

function profileToolsMarkup() {
  return `<section class="profile-tools" aria-label="${tr('Личные инструменты','Personal tools')}">
    <a class="surface profile-tool" href="#shoots">${interfaceIcon('casting')}<span><strong>${tr('Мои съёмки','My shoots')}</strong><small>${tr('Черновики и договорённости','Drafts and agreements')}</small></span><span aria-hidden="true">↗</span></a>
    <a class="surface profile-tool" href="#calendar">${interfaceIcon('calendar')}<span><strong>${tr('Мой календарь','My calendar')}</strong><small>${tr('Даты и планы съёмок','Shoot dates and plans')}</small></span><span aria-hidden="true">↗</span></a>
    <a class="surface profile-tool" href="#boards">${interfaceIcon("casting")}<span><strong>${tr("Мудборды и команды","Moodboards and teams")}</strong><small>${tr("Референсы и совместная подготовка","References and team preparation")}</small></span><span aria-hidden="true">↗</span></a>
    <a class="surface profile-tool" href="#locations">${interfaceIcon("search")}<span><strong>${tr("Студии и локации","Studios and locations")}</strong><small>${tr("Демонстрационный каталог","Demo directory")}</small></span><span aria-hidden="true">↗</span></a>
    <a class="surface profile-tool" href="#statistics">${interfaceIcon("spark")}<span><strong>${tr("Твоя статистика","Your statistics")}</strong><small>${tr("Локальные показатели","Local counts")}</small></span><span aria-hidden="true">↗</span></a>
    <a class="surface profile-tool" href="#membership">${interfaceIcon('spark')}<span><strong>${tr('ВКадре Pro','ВКадре Pro')}</strong><small>${tr('Идея будущей подписки','Explore a future subscription')}</small></span><span aria-hidden="true">↗</span></a>
  </section>`;
}

function renderMembership() {
  const features=[
    ['portfolio',tr('Больше места для портфолио','More room for your portfolio'),tr('Больше проектов и фотографий, обложки и порядок подборок.','More projects and photos, custom covers and collection ordering.')],
    ['insights',tr('Статистика интереса','Audience insights'),tr('Просмотры профиля и работ, переходы к контактам — в понятной сводке.','A clear overview of profile and work views and contact clicks.')],
    ['templates',tr('Шаблоны объявлений','Announcement templates'),tr('Сохраняй повторяющиеся условия и быстрее собирай новое объявление.','Reuse recurring terms to create new announcements faster.')],
    ['collections',tr('Подборки участников','Talent collections'),tr('Раскладывай избранные профили по проектам и добавляй личные заметки.','Organize saved profiles by project and add private notes.')]
  ];
  const saved=read('membership-preferences',[]),selected=Array.isArray(saved)?saved:[];
  document.getElementById('content').innerHTML=pageIntro(tr('Больше пространства для работы','More space for your work'),tr('Базовое общение остаётся бесплатным. Pro — идея подписки для тех, кто снимает регулярно.','Core communication stays free. Pro is a subscription concept for people who shoot regularly.'),true)+`
    <div class="membership-grid"><section class="surface membership-card"><span class="eyebrow">${tr('ДЛЯ ЗНАКОМСТВА И ОБЩЕНИЯ','FOR CONNECTIONS AND CONVERSATION')}</span><h2>${tr('Базовый','Basic')}</h2><p class="plan-price">${tr('Бесплатно','Free')}</p><p>${tr('Всё, чтобы найти своих и начать работать вместе.','Everything you need to meet people and start working together.')}</p><ul><li>${tr('Профиль и портфолио','Profile and portfolio')}</li><li>${tr('Поиск людей и объявления','People search and announcements')}</li><li>${tr('Чаты и отклики','Chats and responses')}</li><li>${tr('Избранное и личный календарь','Saved profiles and a personal calendar')}</li></ul><span class="plan-state">${tr('Доступно в демоверсии','Available in the demo')}</span></section>
    <section class="surface membership-card membership-pro"><span class="eyebrow">${tr('ДЛЯ РЕГУЛЯРНЫХ СЪЁМОК','FOR REGULAR SHOOTS')}</span><h2>ВКадре Pro <span class="concept-badge">${tr('Концепция','Concept')}</span></h2><p class="plan-price">${tr('Цена пока не определена','Pricing to be decided')}</p><p>${tr('Предлагаем платить за удобство работы и дополнительные инструменты.','A proposed subscription for workflow tools and added convenience.')}</p><ul>${features.map(([,title])=>`<li>${title}</li>`).join('')}</ul><span class="plan-state">${tr('Подписка и оплата пока не подключены','Subscription and payments are not connected')}</span></section></div>
    <section class="surface membership-feedback"><h2>${tr('Что сделало бы Pro полезным для тебя?','What would make Pro useful to you?')}</h2><p>${tr('Отметь интересные возможности. Выбор сохранится только на этом устройстве — это не покупка и не заявка.','Choose the features you like. Your selection stays on this device; this is not a purchase or an application.')}</p><form id="membership-preferences"><div class="membership-feature-grid">${features.map(([id,title,description])=>`<label class="feature-choice"><input type="checkbox" name="feature" value="${id}" ${selected.includes(id)?'checked':''}><span><strong>${title}</strong><small>${description}</small></span></label>`).join('')}</div><div class="form-actions"><button class="primary" type="submit">${tr('Сохранить выбор','Save preferences')}</button><p id="membership-status" role="status"></p></div></form></section>`;
  document.getElementById('membership-preferences').onsubmit=event=>{event.preventDefault();const values=new FormData(event.currentTarget).getAll('feature');document.getElementById('membership-status').textContent=workflowSave('membership-preferences',values)?tr('Выбор сохранён на этом устройстве.','Preferences saved on this device.'):tr('Не удалось сохранить выбор.','Could not save your preferences.');};
}

// Keep original input nodes and their change handlers: cropping/upload logic stays intact.
function enhanceFileInputs(root=document) {
  root.querySelectorAll('input[type="file"]:not([hidden])').forEach(input=>{
    if(input.dataset.fileEnhanced)return;
    input.dataset.fileEnhanced='true';
    const wrapper=document.createElement('span');wrapper.className='file-control';
    const button=document.createElement('button');button.type='button';button.className='file-choose';
    const name=document.createElement('span');name.className='file-name';name.setAttribute('aria-live','polite');
    const isImage=(input.accept||'').includes('image');
    button.innerHTML=interfaceIcon('upload')+`<span>${isImage?tr('Выбрать фото','Choose photo'):tr('Выбрать файл','Choose file')}</span>`;
    input.before(wrapper);wrapper.append(input,button,name);input.classList.add('file-native');input.tabIndex=-1;
    const refresh=()=>{button.disabled=input.disabled;name.textContent=input.files?.length?(input.files.length===1?input.files[0].name:tr('Выбрано файлов: ','Files selected: ')+input.files.length):tr('Файл не выбран','No file selected');name.title=name.textContent;};
    button.onclick=event=>{event.preventDefault();event.stopPropagation();if(!input.disabled)input.click();};
    wrapper.addEventListener('click',event=>{if(event.target!==input){event.preventDefault();event.stopPropagation();}});
    input.addEventListener('change',refresh);refresh();
  });
  root.querySelectorAll('input[data-file-enhanced]').forEach(input=>{const button=input.parentElement.querySelector('.file-choose');if(button&&button.disabled!==input.disabled)button.disabled=input.disabled;});
}
function startInterfaceEnhancements() {
  enhanceFileInputs();
  const observer=new MutationObserver(()=>enhanceFileInputs());
  observer.observe(document.getElementById('content'),{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});
  observer.observe(document.getElementById('modal-root'),{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});
}

function inboxActionsMarkup() {
  return `<details class="inbox-actions"><summary aria-label="${tr('Действия с чатами','Chat actions')}" title="${tr('Действия с чатами','Chat actions')}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></summary><div class="inbox-action-menu"><button type="button" id="inbox-create-group">${interfaceIcon('messages')}<span>${tr('Создать групповой чат','Create group chat')}</span></button><a href="#groups">${interfaceIcon('profile')}<span>${tr('Мои группы','My groups')}</span></a></div></details>`;
}
function bindInboxActions() {
  const actions=document.querySelector('.inbox-actions');
  if(!actions)return;
  actions.querySelector('#inbox-create-group').onclick=()=>{actions.open=false;actions.querySelector('summary').focus();openCreativeEditor('groups');};
  actions.querySelector('a').onclick=()=>{actions.open=false;};
  actions.querySelector('summary').addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();actions.open=true;actions.querySelector('button').focus();}});
  actions.addEventListener('focusout',()=>{setTimeout(()=>{if(actions.isConnected&&!actions.contains(document.activeElement))actions.open=false;},0);});
}
document.addEventListener('click',event=>{const actions=document.querySelector('.inbox-actions[open]');if(actions&&!actions.contains(event.target))actions.open=false;});
document.addEventListener('keydown',event=>{const actions=document.querySelector('.inbox-actions[open]');if(event.key==='Escape'&&actions){actions.open=false;actions.querySelector('summary').focus();}});


function paletteChoicesMarkup(){
  const choices=[['sage','Классика','Classic','Нейтральная основа, мягкий шалфей','Neutral base, soft sage'],['sand','Тёплый песок','Warm sand','Молочный фон и спокойные кофейные оттенки','Ivory surfaces and quiet coffee tones'],['slate','Холодный сланец','Cool slate','Светлый серо-голубой и глубокий графит','Pale blue-gray and deep graphite']];
  return `<fieldset class="setting-control palette-field"><legend>${tr('Цветовая палитра','Color palette')}</legend><div class="palette-options">${choices.map(([id,ru,en,descRu,descEn])=>`<label class="palette-choice"><input type="radio" name="palette-setting" value="${id}" ${settings.palette===id?'checked':''}><span class="palette-choice-body"><span class="palette-sample palette-sample-${id}" aria-hidden="true"><i></i><i></i><i></i><i></i></span><strong>${tr(ru,en)}</strong><small>${tr(descRu,descEn)}</small></span></label>`).join('')}</div><p class="palette-hint">${tr('Выбери палитру, затем сравни её в светлом и тёмном режиме. Выбор применяется ко всему сайту.','Choose a palette, then compare its light and dark modes. Your choice applies across the site.')}</p></fieldset>`;
}
