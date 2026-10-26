"use strict";

// Local registration preview. No provider is connected and no identity is stored.
// Real sign-in must start on a server with configured provider applications.
const signInProviders = [
  {id:'google',name:'Google',mark:'G'},
  {id:'yandex',name:'Яндекс',en:'Yandex',mark:'Я'},
  {id:'telegram',name:'Telegram',mark:'↗'},
  {id:'vk',name:'VK',mark:'VK'}
];
function registrationOptionsMarkup() {
  return `<section class="registration-options" aria-labelledby="registration-options-title">
    <h3 id="registration-options-title">${tr('Войти или зарегистрироваться','Sign in or sign up')}</h3>
    <p class="registration-intro">${tr('Через аккаунт Google, Яндекса, Telegram или VK.','With your Google, Yandex, Telegram or VK account.')}</p>
    <div class="sign-in-providers">${signInProviders.map(provider=>`<button type="button" class="provider-button" data-sign-in-provider="${provider.id}" aria-disabled="true" aria-describedby="provider-availability"><span class="provider-mark provider-mark-${provider.id}" aria-hidden="true">${provider.mark}</span><span>${tr(provider.name,provider.en||provider.name)}</span><small>${tr('Не подключено','Not connected')}</small></button>`).join('')}</div>
    <p id="provider-availability" class="registration-hint">${tr('В локальной демоверсии вход через сервисы пока недоступен. Можно заполнить профиль ниже и попробовать сайт без авторизации.','Provider sign-in is not available in this local demo. Fill in the profile below to try the site without signing in.')}</p>
    <p id="provider-status" class="provider-status" role="status" aria-live="polite" hidden></p>
    <div class="registration-divider"><span>${tr('Локальный демопрофиль','Local demo profile')}</span></div>
  </section>`;
}
function bindRegistrationOptions(root) {
  root.querySelectorAll('[data-sign-in-provider]').forEach(button=>button.addEventListener('click',()=>{
    const provider=signInProviders.find(item=>item.id===button.dataset.signInProvider);
    if(!provider)return;
    const status=root.querySelector('#provider-status');
    status.hidden=false;
    status.textContent=tr('Вход через '+provider.name+' ещё не подключён. Аккаунт не создан. Продолжи заполнение локального профиля ниже.','Sign-in with '+(provider.en||provider.name)+' is not connected yet. No account was created. Continue with the local profile below.');
  }));
}
