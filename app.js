"use strict";

// Ошибки внешних демоизображений не должны оставлять пустые карточки.
document.addEventListener("error", event => {
  const img=event.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
  if (!/^https:\/\/(raw\.githubusercontent\.com|images\.unsplash\.com)\//.test(img.src)) return;
  img.dataset.fallbackApplied="true";
  img.src="assets/demo/photo-unavailable.svg";
}, true);

const asset = name =>
  "assets/demo/" + name;

const people = [
  {
    id:1,name:"Анастасия",gender:"Женский",age:24,role:"Модель",
    city:"Санкт-Петербург",type:"TFP",
    tags:["Fashion","Портрет"],image:asset("team-1.jpg"),
    bio:"Люблю плёночную эстетику, естественный свет и истории, которые хочется пересматривать. Открыта к необычным идеям."
  },
  {
    id:2,name:"Михаил",gender:"Мужской",age:28,role:"Фотограф",
    city:"Санкт-Петербург",type:"TFP и коммерция",
    tags:["Портрет","Street"],image:asset("team-2.jpg"),
    bio:"Снимаю людей и настоящие эмоции. Ищу моделей для портретных историй на улицах Петербурга."
  },
  {
    id:3,name:"Елизавета",gender:"Женский",age:22,role:"Модель",
    city:"Санкт-Петербург",type:"TFP",
    tags:["Портрет","Beauty"],image:asset("ivana-square.jpg"),
    bio:"Вдохновляюсь кино и городом. Буду рада совместным съёмкам с интересной концепцией."
  },
  {
    id:4,name:"Александр",gender:"Мужской",age:31,role:"Фотограф",
    city:"Санкт-Петербург",type:"Коммерция",
    tags:["Fashion","Студия"],image:asset("bruce-mars.jpg"),
    bio:"Fashion и редакционные съёмки. Помогу с концепцией, светом и подготовкой портфолио."
  },
  {
    id:5,name:"Дарья",gender:"Женский",age:25,role:"Модель",
    city:"Санкт-Петербург",type:"TFP и коммерция",
    tags:["Lifestyle","Fashion"],image:asset("team-1.jpg"),
    bio:"За живые кадры и смелые эксперименты. Доступна для съёмок в выходные."
  },
  {
    id:6,name:"София",gender:"Женский",age:27,role:"Фотограф",
    city:"Санкт-Петербург",type:"TFP",
    tags:["Lifestyle","Портрет"],image:asset("ivana-square.jpg"),
    bio:"Сохраняю маленькие моменты. Ищу единомышленников для тёплых lifestyle-историй."
  }
];

// Вымышленные пользователи для проверки каталога, фильтров и страниц профилей.
const demoCities = ["Москва","Санкт-Петербург","Новосибирск","Екатеринбург","Казань","Красноярск","Нижний Новгород","Челябинск","Уфа","Краснодар","Тюмень"];
const demoNames = [
  ["Алина","Женский"],["Артём","Мужской"],["Вера","Женский"],["Даниил","Мужской"],
  ["Мария","Женский"],["Илья","Мужской"],["Полина","Женский"],["Никита","Мужской"],
  ["Амина","Женский"],["Тимур","Мужской"],["Ксения","Женский"],["Роман","Мужской"],
  ["Диана","Женский"],["Матвей","Мужской"],["Виктория","Женский"],["Лев","Мужской"],
  ["Аделина","Женский"],["Руслан","Мужской"],["Камилла","Женский"],["Марк","Мужской"],
  ["Светлана","Женский"],["Андрей","Мужской"],["Татьяна","Женский"],["Глеб","Мужской"],
  ["Ольга","Женский"],["Павел","Мужской"],["Наталья","Женский"],["Семён","Мужской"],
  ["Елена","Женский"],["Денис","Мужской"],["Валерия","Женский"],["Константин","Мужской"],
  ["Лейла","Женский"],["Марат","Мужской"],["Зарина","Женский"],["Эмиль","Мужской"],
  ["Ева","Женский"],["Максим","Мужской"],["Вероника","Женский"],["Вадим","Мужской"],
  ["Арина","Женский"],["Владимир","Мужской"],["Людмила","Женский"],["Олег","Мужской"]
];
const demoThemes = [
  ["Fashion","Street","Городской лукбук","Работаю с одеждой независимых брендов. Люблю архитектуру, движение и лаконичные образы."],
  ["Портрет","Студия","Свет и характер","Предпочитаю спокойные портреты и выразительный студийный свет. Обсуждаю референсы заранее."],
  ["Beauty","Fashion","Цвет и фактура","Интересны бьюти-съёмки, необычный макияж и крупные планы. Ищу визажистов для совместных проектов."],
  ["Lifestyle","Портрет","Один обычный день","Люблю живые истории без сложной постановки: прогулки, кафе и домашнюю атмосферу."],
  ["Street","Портрет","После дождя","Экспериментирую с отражениями, вечерним городом и контрастным светом."],
  ["Студия","Lifestyle","В движении","Интересны танец, спорт и динамичные кадры. Открыт к работе с творческими командами."]
];
demoNames.forEach(([name,gender],index)=>{
  const id=index+7, city=demoCities[Math.floor(index/4)];
  const theme=demoThemes[index%demoThemes.length];
  const role=index%4<2?"Модель":"Фотограф";
  const ages=[18,21,25,34,29,42,53,23,38,61,27,46];
  const femalePhotos=["team-1.jpg","ivana-square.jpg"],malePhotos=["team-2.jpg","bruce-mars.jpg"];
  const photos=gender==="Женский"?femalePhotos:malePhotos;
  people.push({id,name,gender,age:ages[index%ages.length],role,city,username:"demo_"+(role==="Модель"?"model":"photo")+"_"+id,
    type:["TFP","Коммерция","TFP и коммерция"][(index+Math.floor(index/4))%3],
    tags:theme.slice(0,2),image:asset(photos[Math.floor(index/4)%photos.length]),
    bio:theme[3]+" "+["Доступны будни после 18:00.","Съёмки по выходным, условия обсуждаем заранее.","Готовность к поездкам в соседние города.","Начинаю собирать портфолио и ищу первые коллаборации."][index%4],
    demoTheme:theme[2],demoDeals:[0,2,7,15,32,68,4,11][index%8]});
});
const demoOrganizations=[
 ["FRAME BUREAU","Агентство","Москва","Кастинги для рекламных кампаний и редакционных съёмок."],
 ["NEVA COLLECTIVE","Бренд / команда","Санкт-Петербург","Независимая команда: мода, музыка и визуальные истории."],
 ["SIBIR FORM","Компания","Новосибирск","Предметная съёмка и каталоги локальных производителей."],
 ["URAL WEAR","Бренд / команда","Екатеринбург","Съёмки новых коллекций городской одежды."],
 ["VOLGA TALENT","Агентство","Казань","Поиск новых лиц и организация творческих съёмок."],
 ["TAIGA OBJECTS","Компания","Красноярск","Визуальные истории о предметах, природе и дизайне."],
 ["NIZHNY EDIT","Бренд / команда","Нижний Новгород","Редакционные проекты о людях и городе."],
 ["FORM CAST","Агентство","Челябинск","Подбор моделей для каталогов и коммерческих проектов."],
 ["AGIDEL DESIGN","Компания","Уфа","Фотографии для дизайнерских коллекций и местных проектов."],
 ["SOUTH STORIES","Бренд / команда","Краснодар","Lifestyle-кампании на открытом воздухе."],
 ["NORTH PEOPLE","Агентство","Тюмень","Команды для портретных и рекламных съёмок."],
 ["MONO OBJECT","Компания","Москва","Каталоги аксессуаров, предметный дизайн и минимализм."]
];
demoOrganizations.forEach(([name,role,city,bio],index)=>{
  const id=51+index;
  const color=["#d9d0c3","#c3cdd1","#d0c6d5","#c2cdbf"][index%4];
  const logo='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect width="600" height="750" fill="'+color+'"/><circle cx="300" cy="340" r="145" fill="none" stroke="#303030" stroke-width="2"/><text x="300" y="370" text-anchor="middle" font-family="sans-serif" font-size="80" fill="#303030">'+name.split(" ").map(word=>word[0]).join("")+'</text><text x="300" y="570" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#303030">DEMO</text></svg>';
  people.push({id,name,role,city,age:null,gender:"Не указан",username:"demo_"+name.toLowerCase().replace(/ /g,"_"),
    type:index%3===0?"TFP и коммерция":"Коммерция",tags:demoThemes[index%6].slice(0,2),
    image:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(logo),bio,demoTheme:"Визуальная концепция",demoDeals:[0,12,28,45][index%4]});
});


// Иллюстративные фотографии: это примеры оформления, не работы владельцев профилей.
const demoPhotoIds = [
  'photo-1534528741775-53994a69daeb','photo-1524504388940-b1c1722653e1',
  'photo-1524250502761-1ac6f2e30d43','photo-1531123897727-8f129e1688ce',
  'photo-1506794778202-cad84cf45f1d','photo-1500648767791-00dcc994a43e',
  'photo-1517841905240-472988babdf9','photo-1515886657613-9f3515b0c78f',
  'photo-1483985988355-763728e1935b','photo-1490481651871-ab68de25d43d',
  'photo-1441986300917-64674bd600d8','photo-1485230895905-ec40ba36b9bc',
  'photo-1470071459604-3b5ec3a7fe05','photo-1441974231531-c6227db76b6e',
  'photo-1472396961693-142e6e269027','photo-1470770841072-f978cf4d019e',
  'photo-1449824913935-59a10b8d2000','photo-1519608487953-e999c86e7455',
  'photo-1500534623283-312aade485b7','photo-1464822759023-fed622ff2c3b'
];
function demoProjects(personId,definitions) {
  let offset=(personId*3)%demoPhotoIds.length;
  return definitions.map(([name,count],projectIndex)=>{
    const photos=Array.from({length:count},(_,i)=>({
      name:`${name} — демонстрационный кадр ${i+1}`,
      src:`assets/demo/${demoPhotoIds[(offset+i)%demoPhotoIds.length]}.jpg`
    }));
    offset=(offset+count+3)%demoPhotoIds.length;
    return {id:`demo-${personId}-${projectIndex}`,name,photos,demo:true};
  });
}
const demoPortfolioLayouts = {
  1:[['Естественный свет',8],['Городская история',5],['Детали образа',3]],
  2:[['Лица города',8],['Утренний свет',8],['За пределами студии',8],['Тихие истории',8],['Ритм улиц',8],['Летний дневник',8],['Линии и формы',8],['Наедине с природой',8],['После заката',8],['Новые лица',8]],
  3:[],
  4:[['Редакционная съёмка',8],['Новая коллекция',8],['Свет и силуэт',6],['Вне студии',4],['Первые кадры',2]],
  5:[['Пробная съёмка',2]],
  6:[['Маленькие моменты',6],['Прогулка без плана',3],['Следующая история',0]]
};
people.forEach(person=>{
  person.username ||= "kadr_"+person.id;
  person.demo=true;
  const count=person.id%5;
  const definitions=demoPortfolioLayouts[person.id] || Array.from({length:count},(_,index)=>[
    (person.demoTheme || "Творческая съёмка")+(index?" · "+(index+1):""),2+(person.id+index)%7]);
  person.projects=demoProjects(person.id,definitions);
});

function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem("kadr-html-" + key));
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

const state = {
  tab:"home",
  role:"Все",
  city:"",
  gender:"",ageMin:"",ageMax:"",
  genre:"Все жанры",
  type:"Любые условия",
  query:"",
  likes:read("likes",[]),
  saved:read("saved",[]),
  messages:read("messages",{}),
  profile:read("profile",null),
  chat:null
};

// Ранее все профили с районами относились к Санкт-Петербургу.
if (state.profile?.district && !state.profile.city) {
  state.profile = {...state.profile,city:"Санкт-Петербург"};
  delete state.profile.district;
}
if (state.profile?.type) state.profile.type = state.profile.type.replace(/Платно/g,'Коммерция').replace(/платно/g,'коммерция');
const popularCities = [
  ["Москва","мск","msk","moscow"],
  ["Санкт-Петербург","спб","питер","петербург","spb","saint petersburg","st petersburg"],
  ["Новосибирск","нск","новосиб","nsk","novosibirsk"],
  ["Екатеринбург","екб","екат","ekb","yekaterinburg","ekaterinburg"],
  ["Казань","kazan"],
  ["Красноярск","крск","krasnoyarsk"],
  ["Нижний Новгород","нн","н новгород","nizhny novgorod"],
  ["Челябинск","члб","chelyabinsk"],
  ["Уфа","ufa"],
  ["Краснодар","крд","krasnodar"],
  ["Тюмень","tyumen"]
];
function cityAliasKey(value) {
  return String(value ?? "").trim().toLocaleLowerCase("ru-RU").replace(/ё/g,"е")
    .replace(/^(?:город\s+|г\.\s*|г\s+)/u,"").replace(/[\s.\-–—]+/g,"");
}
const cityAliases = new Map(popularCities.flatMap(([name,...aliases]) =>
  [name,...aliases].map(alias => [cityAliasKey(alias),name])));
function normalizeCity(value) {
  const text = String(value ?? "").trim().replace(/\s+/g," ");
  return cityAliases.get(cityAliasKey(text)) || text;
}
function cityKey(value) {
  return normalizeCity(value).toLocaleLowerCase("ru-RU").replace(/ё/g,"е");
}
if (state.profile?.city) state.profile.city = normalizeCity(state.profile.city);
function catalogCities() {
  const cities = [...popularCities.map(([name])=>name),...catalogPeople().map(person=>normalizeCity(person.city))];
  return [...new Map(cities.filter(Boolean).map(city=>[cityKey(city),city])).values()];
}
function esc(value) {

  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
}

let toastTimer;

function toast(text) {
  document.getElementById("toast-root").innerHTML =
    '<div class="toast">' + esc(text) + '</div>';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    document.getElementById("toast-root").innerHTML = "";
  }, 3000);
}

function store(key) {
  try {
    localStorage.setItem("kadr-html-" + key, JSON.stringify(state[key]));
  } catch {
    toast("Браузер запретил сохранение. До закрытия страницы данные останутся доступны.");
  }
}

function toggle(key, id) {
  state[key] = state[key].includes(id)
    ? state[key].filter(item => item !== id)
    : [...state[key], id];
  store(key);
  renderCards();
}

function selectTab(tab) {
  if (location.hash === '#' + tab) { state.tab = tab; render(); }
  else location.hash = tab;
}

function options(values, selected) {
  return values.map(value =>
    '<option value="' + esc(value) + '"' + (value === selected ? " selected" : "") + ">" +
    esc(value) + "</option>"
  ).join("");
}

function render() {
  chatMediaCleanup();

  renderShell();
  if (state.tab === "home") { renderHome(); return; }
  if (state.tab === "user") { renderUserPage(); return; }
  if (state.tab === "profile") { renderProfilePage(); return; }
  if (state.tab === "portfolio") { renderPortfolio(); return; }
  if (state.tab === "settings") { renderSettings(); return; }
  if (state.tab === "calendar") { renderCalendar(); return; }

  if (state.tab === "messages") {
    renderInbox();
    return;
  }

  const title = state.tab === "search" ? "Встретимся в кадре" :
    state.tab === "likes" ? "Есть контакт" : "Твои вдохновения";

  document.getElementById("content").innerHTML = `
    <section class="intro">
      ${state.tab !== 'search' ? `<a class="back-link" href="#profile">← ${tr('Профиль','Profile')}</a><br>` : ''}
      <span class="eyebrow">ЛЮДИ. ИДЕИ. СОВПАДЕНИЯ.</span>
      <h1>${title}<em>.</em></h1>
      <p>Находи моделей и фотографов, с которыми хочется создавать.</p>
    </section>

    <section class="catalog" id="catalog">
      <div class="catalog-search">
        <input id="query" aria-label="${tr("Поиск по профилям","Search profiles")}" placeholder="${tr("Имя, юзернейм или жанр…","Name, username or genre…")}" value="${esc(state.query)}">
        <button id="filter-toggle" class="filter-toggle" type="button" aria-expanded="false" aria-controls="catalog-filters"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--surface,#fff)"/><circle cx="15" cy="17" r="3" fill="var(--surface,#fff)"/></svg><span>${tr("Фильтры","Filters")}</span><span id="filter-count" hidden></span></button>
      </div>
      <section id="catalog-filters" class="catalog-filter-panel" hidden aria-label="${tr("Фильтры поиска","Search filters")}">
      <div class="toolbar">
        <div class="tabs">
          ${["Все",...profileRoles].map(role => `
          <button data-role="${role}"
            class="${state.role === role ? "active" : ""}">${role}</button>
          `).join("")}
        </div>
        <button class="reset" id="reset">Сбросить ↺</button>
      </div>

      <div class="filters">
<select id="city-filter" aria-label="Город съёмки">
  <option value="">${tr("Все города","All cities")}</option>
  ${options(catalogCities(),state.city)}
</select>
<select id="genre"
 aria-label="Жанр съёмки">
          ${genreOptions()}
        </select>
        <select id="work-type" aria-label="Условия сотрудничества">
          ${options(["Любые условия","TFP","Коммерция"],state.type)}
        </select>
      </div>

<div class="people-filters">
  <label>${tr('Пол','Gender')}<select id="gender-filter"><option value="">${tr('Любой','Any')}</option>${options(['Женский','Мужской','Не указан'],state.gender)}</select></label>
  <label>${tr('Возраст от','Age from')}<input id="age-min" type="number" min="18" max="100" step="1" placeholder="18" value="${esc(state.ageMin)}"></label>
  <label>${tr('Возраст до','Age to')}<input id="age-max" type="number" min="18" max="100" step="1" placeholder="100" value="${esc(state.ageMax)}"></label>
</div>
<p id="age-error" role="alert"></p><button id="filter-done" type="button" class="primary">${tr("Показать результаты","Show results")}</button></section>
<div class="results">

        <span id="result-count"></span>
        <span>Сообщество · 18+</span>
      </div>

      <p class="demo-banner">${state.profile?.image && (isOrganization(state.profile.role) || state.profile.age >= 18) ? "Твой локальный профиль и демонстрационные профили." : "Демонстрационные профили."}
      TFP — совместная съёмка в обмен на фотографии.</p>

      <div class="grid" id="cards"></div>
    </section>`;

  document.getElementById("find-team")?.addEventListener("click", () => {
    document.getElementById("catalog").scrollIntoView({behavior:"smooth"});
  });

  document.querySelectorAll("[data-role]").forEach(button => {
    button.addEventListener("click", () => {
      state.role = button.dataset.role;
      document.querySelectorAll("[data-role]").forEach(item => {
        item.classList.toggle("active", item.dataset.role === state.role);
      });
      renderCards();
    });
  });

  const filterToggle=document.getElementById("filter-toggle");
  const filterPanel=document.getElementById("catalog-filters");
  function setFiltersOpen(open) {
    filterPanel.hidden=!open;
    filterToggle.setAttribute("aria-expanded",String(open));
  }
  filterToggle.onclick=()=>setFiltersOpen(filterPanel.hidden);
  document.getElementById("filter-done").onclick=()=>{
    if(document.getElementById("age-error").textContent){document.getElementById("age-min").focus();return;}
    setFiltersOpen(false);filterToggle.focus();
  };
  filterPanel.addEventListener("keydown",event=>{if(event.key==="Escape"){setFiltersOpen(false);filterToggle.focus();}});
  document.getElementById("query").addEventListener("input", event => {
    state.query = event.target.value;
    renderCards();
  });

document.getElementById("city-filter").addEventListener("change",event => {
  state.city = event.target.value;
  renderCards();
});
document.getElementById("genre").addEventListener("change", event => {
    state.genre = event.target.value;
    renderCards();
  });

  document.getElementById("work-type").addEventListener("change", event => {
    state.type = event.target.value;
    renderCards();
  });

for (const [id,key,eventName] of [['gender-filter','gender','change'],['age-min','ageMin','input'],['age-max','ageMax','input']]) {
  document.getElementById(id).addEventListener(eventName,event=>{state[key]=event.target.value;renderCards();});
}
document.getElementById("reset").addEventListener("click", () => {
    Object.assign(state,{
      role:"Все",city:"",gender:"",ageMin:"",ageMax:"",genre:"Все жанры",type:"Любые условия",query:""
    });
    render();
  });

  renderCards();
}

function renderCards(skipTeams = false) {
  const target = document.getElementById("cards");
  if (!target) return;


const activeFilterCount=[state.role!=="Все",Boolean(state.city),state.genre!=="Все жанры",state.type!=="Любые условия",Boolean(state.gender),state.ageMin!=="",state.ageMax!==""].filter(Boolean).length;
const filterCount=document.getElementById("filter-count");
filterCount.textContent=activeFilterCount;
filterCount.hidden=!activeFilterCount;
document.querySelector(".filters").hidden = false;
document.querySelector('.people-filters').hidden = false;
const minAge=state.ageMin==='' ? 18 : Number(state.ageMin), maxAge=state.ageMax==='' ? 100 : Number(state.ageMax);
const invalidAge=!Number.isInteger(minAge)||!Number.isInteger(maxAge)||minAge<18||maxAge>100||minAge>maxAge;
document.getElementById('age-error').textContent=invalidAge ? tr('Укажи возраст от 18 до 100 лет. Нижняя граница не должна быть больше верхней.','Enter ages from 18 to 100. The minimum must not exceed the maximum.') : '';

document.querySelector(".demo-banner").textContent = (state.profile?.image && (isOrganization(state.profile.role) || state.profile.age >= 18) ? "Твой локальный профиль и демонстрационные профили. " : "Демонстрационные профили. ") + "TFP — совместная съёмка в обмен на фотографии.";
const filtered = catalogPeople().filter(person => {

    const desiredRole = state.role;
    const searchable =
      `${person.name} ${personUsername(person)} ${person.specialty || ""} ${person.city} ${person.tags.join(" ")} ${settings.language === "en" ? person.tags.map(englishText).join(" ") + " " + englishText(person.city) : ""}`.toLowerCase();

    return (
      !invalidAge && (isOrganization(person.role) ? !state.ageMin && !state.ageMax && !state.gender : person.age >= minAge && person.age <= maxAge) &&
      (!state.gender || (person.gender || 'Не указан') === state.gender) &&
      (state.role === "Все" || person.role === desiredRole) &&
      (state.genre === "Все жанры" || person.tags.includes(state.genre)) &&
      (state.type === "Любые условия" ||
        person.type.toLowerCase().includes(state.type.toLowerCase())) &&
      (!state.city || cityKey(person.city || '') === cityKey(state.city)) &&
      searchable.includes(state.query.trim().toLowerCase()) &&
      (state.tab !== "likes" || state.likes.includes(person.id)) &&
      (state.tab !== "saved" || state.saved.includes(person.id))
    );
  });

  document.getElementById("result-count").textContent =
    "Найдено профилей: " + filtered.length;

  target.innerHTML = filtered.length ? filtered.map(person => `
    <article class="card" data-profile-card="${person.id}" tabindex="0" aria-label="${tr("Открыть профиль: ","Open profile: ")}${esc(person.name)}">
      <div class="photo">
        <button class="open" data-open="${person.id}"
          aria-label="Открыть профиль: ${esc(person.name)}">
          <img src="${esc(person.image)}" loading="lazy" alt="${esc(person.name)}: ${person.id === 0 ? "фото профиля" : "демонстрационный портрет"}">
        </button>

        <span class="badge">${person.id === 0 ? "Твой профиль · " : ""}${person.role}</span>

        <button class="save ${state.saved.includes(person.id) ? "on" : ""}"
          data-save="${person.id}"
          aria-label="Сохранить: ${esc(person.name)}"
          aria-pressed="${state.saved.includes(person.id)}">
          ${state.saved.includes(person.id) ? "◆" : "◇"}
        </button>

        <span class="availability">Открыт${person.role === "Модель" ? "а" : ""} к сотрудничеству</span>
      </div>

      <div class="card-info">
        <div class="name-line">
          <button class="person-name" data-user-content data-open="${person.id}">
            ${esc(person.name)}${isOrganization(person.role) ? "" : `, ${person.age}`}
          </button>
          <button class="heart ${state.likes.includes(person.id) ? "on" : ""}"
            data-like="${person.id}"
            aria-label="Лайк: ${esc(person.name)}"
            aria-pressed="${state.likes.includes(person.id)}">
            ${state.likes.includes(person.id) ? "♥" : "♡"}
          </button>
        </div>

<div class="location">⌖ ${esc(person.city)}</div>${person.specialty ? `<div class="location">${esc(person.specialty)}</div>` : ""}<div class="profile-handle" data-user-content>@${esc(personUsername(person))}</div><div class="portfolio-count">${tr("Портфолио","Portfolio")}: ${person.id === 0 ? portfolio.length : (person.projects || []).length} ${tr("проектов","projects")} · ${person.id === 0 ? portfolio.reduce((sum,p)=>sum+p.photos.length,0) : (person.projects || []).reduce((sum,p)=>sum+p.photos.length,0)} ${tr("фото","photos")}</div>

        <div class="card-foot">
          <div class="tags">
            ${person.tags.map(tag => '<span class="tag">' + tag + '</span>').join("")}
          </div>
          <span class="conditions">${person.type}</span>
        </div>
      </div>
    </article>
  `).join("") : `
    <div class="empty">
      <h3>Пока никого нет</h3>
      Попробуй изменить фильтры или сохранить понравившиеся профили.
    </div>`;

  target.querySelectorAll("[data-profile-card]").forEach(card => {
    card.addEventListener("click", event => {
      if (event.target.closest("button,a,input,select,textarea")) return;
      card.focus({preventScroll:true});
      openPerson(Number(card.dataset.profileCard));
    });
    card.addEventListener("keydown", event => {
      if (event.target !== card || !["Enter"," "].includes(event.key)) return;
      event.preventDefault();
      openPerson(Number(card.dataset.profileCard));
    });
  });

  target.querySelectorAll("[data-open]").forEach(button => {
    button.addEventListener("click", () => openPerson(Number(button.dataset.open)));
  });

  target.querySelectorAll("[data-like]").forEach(button => {
    button.addEventListener("click", () => toggle("likes",Number(button.dataset.like)));
  });

  target.querySelectorAll("[data-save]").forEach(button => {
    button.addEventListener("click", () => toggle("saved",Number(button.dataset.save)));
  });
}

let previousFocus = null;

function showModal(html) {
  previousFocus = document.activeElement;
  const root = document.getElementById("modal-root");

  root.innerHTML = '<div class="overlay">' + html + '</div>';
  document.body.style.overflow = "hidden";

  root.querySelector(".overlay").addEventListener("click", event => {
    if (event.target.classList.contains("overlay")) closeModal();
  });

  root.querySelector(".close").addEventListener("click",closeModal);
  root.querySelector(".close").focus();
}

function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
  document.body.style.overflow = "";
  if (previousFocus?.isConnected) previousFocus.focus();
}

document.addEventListener("keydown",event => {
  const modal = document.querySelector('[role="dialog"]');
  if (!modal) return;

  if (event.key === "Escape") {
    closeModal();
    return;
  }

  if (event.key === "Tab") {
    const items = Array.from(modal.querySelectorAll(
      'button,input,select,textarea,a[href],[tabindex="0"]'
    )).filter(element => !element.disabled);

    const first = items[0];
    const last = items[items.length-1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

function portfolioPreview(projects) {
  return `<section class="profile-portfolio"><h2>${tr('Портфолио','Portfolio')}</h2>${projects.length ? `<div class="project-previews">${projects.map((project,i)=>`<button type="button" class="preview-project" data-preview-project="${i}">${project.photos[0] ? `<img src="${esc(project.photos[0].src)}" alt="${esc(project.name)}" loading="lazy">` : '<span class="preview-placeholder">◇</span>'}<strong data-user-content>${esc(project.name)}</strong><small>${project.photos.length} ${tr('фото','photos')}</small></button>`).join('')}</div>` : `<p>${tr('Портфолио пока не добавлено.','No portfolio yet.')}</p>`}</section>`;
}
function bindPortfolioPreview(root,projects,returnTo) {
  root.querySelectorAll('[data-preview-project]').forEach(button=>button.onclick=()=>{
    const project=projects[Number(button.dataset.previewProject)];
    showModal(`<section class="modal project-viewer" role="dialog" aria-modal="true" aria-labelledby="project-view-title"><button class="close" aria-label="${tr('Закрыть','Close')}">×</button><button id="back-to-person" class="back-link">← ${tr('К профилю','Back to profile')}</button><h2 id="project-view-title" data-user-content>${esc(project.name)}</h2>${project.demo ? `<p class="demo-banner">${tr("Демонстрационная подборка. Фотографии используются как иллюстрации.","Demo collection. Photos are used for illustration.")}</p>` : ""}<div class="project-photos">${project.photos.map(photo=>`<img src="${esc(photo.src)}" alt="${esc(photo.name)}" loading="lazy">`).join('') || `<p>${tr('В проекте пока нет фотографий.','No photos in this project yet.')}</p>`}</div></section>`);
    const back=document.getElementById('back-to-person');
    back.onclick=()=>{closeModal();returnTo();};
    document.querySelector('#modal-root .close').onclick=()=>{closeModal();returnTo();};
  });
}

function openPerson(id) {
  const person = catalogPeople().find(item => item.id === id);
  if (!person) return;

  showModal(`
    <section class="modal wide person-profile" role="dialog" aria-modal="true"
      aria-labelledby="person-title">
      <button class="close" aria-label="Закрыть">×</button>

      <div class="preview-portrait"><img class="modal-photo" src="${esc(person.image)}" alt="${esc(person.name)}"><span class="preview-label">${person.id===0?tr("Твой профиль","Your profile"):tr("Демопрофиль","Demo profile")}</span></div>
      <div class="modal-body">
        <span class="eyebrow">${esc(person.role)} · ${esc(person.city)}</span>
        <h2 id="person-title" data-user-content>${esc(person.name)}${isOrganization(person.role) ? "" : `, ${person.age}`}</h2>
        <div class="preview-handle" data-user-content>@${esc(personUsername(person))}${person.specialty ? ` · ${esc(person.specialty)}` : ""}</div>
        <p class="preview-bio" data-user-content>${esc(person.bio)}</p>
        <div class="tags">${person.tags.map(tag=>'<span class="tag">'+esc(tag)+'</span>').join("")}</div>
        <div class="preview-facts"><div><span>${tr("Сотрудничество","Collaboration")}</span><strong>${esc(person.type)}</strong></div><div><span>${person.demo?tr("Сделки · демо","Deals · demo"):tr("Успешные сделки","Successful deals")}</span><strong>${person.demo?(person.demoDeals||0):0}</strong></div></div>
        ${person.id===0?profileSocialLinks():""}
        <div class="preview-actions"><button class="primary" id="start-chat">${person.id===0?tr("Редактировать","Edit profile"):tr("Написать","Message")}</button><a class="preview-full" href="#user/${encodeURIComponent(personUsername(person))}">${tr("Профиль","Profile")}</a></div>
        <div class="preview-footer"><small>${person.id===0?tr("Виден только в этом браузере.","Visible only in this browser."):tr("Вымышленный профиль. Фото и статистика — примеры.","Fictional profile. Photos and statistics are examples.")}</small>${reportButton(person)}</div>
      </div>
      ${portfolioPreview(person.id === 0 ? portfolio : (person.projects || []))}
    </section>`);

  bindReportButtons(document.getElementById('modal-root'));
  bindPortfolioPreview(document.getElementById('modal-root'),person.id === 0 ? portfolio : (person.projects || []),()=>openPerson(id));
  document.getElementById("start-chat").addEventListener("click", () => {
    if (person.id === 0) { closeModal(); openProfile(); return; }
    state.chat = person.id;
    closeModal();
    selectTab("messages");
  });
}

const profileRoles = ["Фотограф","Модель","Бьюти-мастер","Команда","Агентство","Бренд / компания"];
const organizationRoles = ["Команда","Агентство","Бренд / компания"];
const beautySpecialties = ["Визажист","Парикмахер-стилист","Мастер по наращиванию волос","Мастер ногтевого сервиса","Бровист","Лэшмейкер","Мастер по гриму","Универсальный бьюти-мастер"];
const legacyOrganizationRoles = {"Бренд":"Бренд / компания","Компания":"Бренд / компания","Бренд / команда":"Команда","Творческая команда":"Команда","Студия":"Бренд / компания"};
for (const person of [...people,...(state.profile?[state.profile]:[])]) {
  if (Object.prototype.hasOwnProperty.call(legacyOrganizationRoles,person.role)) person.role=legacyOrganizationRoles[person.role];
}
beautySpecialties.forEach((specialty,index)=>{
  const source=people[index+6],id=63+index;
  people.push({...source,id,username:"demo_beauty_"+id,role:"Бьюти-мастер",specialty,
    tags:["Beauty","Fashion","Свадебная"],bio:specialty+". Подготовка образов для съёмок, мероприятий и творческих проектов. Условия и референсы обсуждаем заранее.",
    projects:demoProjects(id,[["Образы для съёмки",3+(index%4)]])});
});
const isOrganization = role => organizationRoles.includes(role);

const genreGroups = [
  {name:["Люди и события","People & events"],items:[["Портрет","Portrait"],["Свадебная","Wedding"],["Семейная","Family"],["Детская","Children"],["Беременность","Maternity"],["Love story","Love story"],["Репортаж","Reportage"],["Концертная","Concert"],["Спортивная","Sports"]]},
  {name:["Мода и реклама","Fashion & advertising"],items:[["Fashion","Fashion"],["Beauty","Beauty"],["Lifestyle","Lifestyle"],["Предметная","Product"],["Фуд-фото","Food"],["Рекламная","Advertising"],["Ювелирная","Jewelry"],["Деловой портрет","Business portrait"]]},
  {name:["Места и природа","Places & nature"],items:[["Интерьерная","Interior"],["Архитектурная","Architecture"],["Недвижимость","Real estate"],["Пейзаж","Landscape"],["Путешествия","Travel"],["Животные","Animals"],["Макро","Macro"]]},
  {name:["Творческие направления","Creative photography"],items:[["Street","Street"],["Студия","Studio"],["Fine art","Fine art"],["Чёрно-белая","Black & white"],["Плёночная","Film"],["Подводная","Underwater"],["Аэрофотосъёмка","Aerial"]]}
];
const genres = genreGroups.flatMap(group=>group.items.map(([name])=>name));
const extraGenres=genres.filter(name=>!["Fashion","Портрет","Lifestyle","Beauty","Street","Студия"].includes(name));
people.forEach((person,index)=>{
  person.tags=[...new Set([...person.tags,extraGenres[index%extraGenres.length]])];
});
function genreOptions() {
  return '<option value="Все жанры">'+tr("Все жанры","All genres")+'</option>'+genreGroups.map(group=>
    `<optgroup label="${esc(tr(...group.name))}">${group.items.map(([name,en])=>`<option value="${esc(name)}" ${state.genre===name?"selected":""}>${tr(name,en)}</option>`).join("")}</optgroup>`).join("");
}

function catalogPeople() {
  return state.profile?.image && (isOrganization(state.profile.role) || state.profile.age >= 18)
    ? [{...state.profile,id:0},...people] : people;
}

function openProfile() {
  const profile = state.profile || {};
  let photo = profile.image || "";
  let loading = false;
  showModal(`
    <form class="modal" id="profile-form" role="dialog" aria-modal="true" aria-labelledby="profile-title">
      <button type="button" class="close" aria-label="Закрыть">×</button>
      <span class="eyebrow">ТВОЁ МЕСТО ВКАДРЕ</span>
      <h2 id="profile-title">${state.profile ? "Твой профиль" : "Давай знакомиться."}</h2>
      <p>Расскажи о себе и о съёмках, которые тебя вдохновляют.</p>
      <img id="profile-preview" class="profile-preview" alt="Фото твоего профиля" ${photo ? `src="${esc(photo)}"` : "hidden"}>
<button type="button" id="edit-crop" class="crop-edit" ${photo ? "" : "hidden"}>Кадрировать фото</button>
<section id="crop-panel" hidden aria-label="Кадрирование фотографии">
  <p>Передвигай фото мышью или пальцем. Можно также использовать стрелки на клавиатуре.</p>
  <canvas id="crop-canvas" width="600" height="750" tabindex="0" aria-label="Область кадрирования. Стрелки перемещают фото."></canvas>
  <label class="form-label">Приближение<input id="crop-zoom" type="range" min="1" max="3" step="0.01" value="1"></label>
  <div class="crop-actions"><button type="button" id="apply-crop" class="primary">Применить</button><button type="button" id="cancel-crop">Отмена</button></div>
  <small>Портретный кадр 4:5. Нажми «Применить», затем сохрани профиль.</small>
</section>
      <label class="form-label">Фото для карточки
        <input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp">
      </label>
      <small>JPG, PNG или WebP, до 10 МБ. Фото автоматически уменьшается для сохранения.</small>
      <label class="form-label"><span id="profile-name-label">Твоё имя</span>
        <input name="name" required maxlength="40" value="${esc(profile.name || "")}" placeholder="Как тебя зовут?">
      </label>
      <label class="form-label">${tr("Юзернейм","Username")}
        <input name="username" required minlength="3" maxlength="30" pattern="[A-Za-z0-9_]{3,30}" autocomplete="username" value="${esc(personUsername({...profile,id:0}))}" placeholder="your_name">
      </label>
      <small>${tr("3–30 латинских букв, цифр или _. Без @.","3–30 Latin letters, numbers or _. Without @.")}</small>
      <label class="form-label">Возраст

        <input name="age" type="number" min="18" max="100" step="1" required value="${esc(profile.age || "")}" placeholder="От 18 лет">
      </label>
<label class="form-label">${tr('Пол','Gender')}
  <select name="gender">${options(['Не указан','Женский','Мужской'],profile.gender || 'Не указан')}</select>
</label>
<label class="form-label">Твоя роль

        <select name="role">${options(profileRoles,profile.role || "Модель")}</select>
      </label>
      <label class="form-label" id="specialty-field">${tr("Специализация","Specialty")}
        <select name="specialty"><option value="">${tr("Выбери специализацию","Choose a specialty")}</option>${options(beautySpecialties,profile.specialty || "")}</select>
      </label>
      <label class="form-label">Город

        <input name="city" list="profile-cities" required maxlength="80" autocomplete="address-level2" placeholder="В каком городе ты снимаешь?" value="${esc(profile.city || '')}">
      </label>
      <datalist id="profile-cities">${catalogCities().map(city=>`<option value="${esc(city)}"></option>`).join("")}</datalist>
      <fieldset class="profile-genres"><legend>Жанры съёмки — выбери хотя бы один</legend>
        ${genreGroups.map(group=>`<details class="genre-group"><summary>${tr(...group.name)}</summary><div>${group.items.map(([tag,en])=>`<label><input type="checkbox" name="tags" value="${esc(tag)}" ${(profile.tags||[]).includes(tag)?"checked":""}>${tr(tag,en)}</label>`).join("")}</div></details>`).join("")}
      </fieldset>
      <label class="form-label">Условия сотрудничества
        <select name="type">${options(["TFP","Коммерция","TFP и коммерция"],profile.type || "TFP")}</select>
      </label>
      <small>TFP — совместная съёмка в обмен на фотографии.</small>
      <label class="form-label">О себе
        <textarea name="bio" maxlength="500" placeholder="Опыт, идеи и пожелания к съёмкам…">${esc(profile.bio || "")}</textarea>
      </label>
      <label class="consent"><input type="checkbox" required ${(profile.age >= 18 || isOrganization(profile.role)) ? "checked" : ""}>Мне исполнилось 18 лет. Я понимаю, что это демонстрационный прототип.</label>
      <p id="profile-error" role="alert"></p>
      <button type="submit" class="primary">Сохранить профиль →</button>
      <small>Профиль появится в каталоге только в этом браузере. Другие люди его пока не видят.</small>
    </form>`);
  const form = document.getElementById("profile-form");
  function updateProfileFields() {
    const organization = isOrganization(form.elements.role.value);
    form.querySelector("#profile-name-label").textContent = organization ? tr("Название организации","Organization name") : tr("Твоё имя","Your name");
    form.elements.name.placeholder = organization ? tr("Как называется ваша организация?","What is your organization called?") : tr("Как тебя зовут?","What is your name?");
    for (const field of ["age","gender"]) {
      form.elements[field].closest("label").hidden = organization;
      form.elements[field].disabled = organization;
    }
form.elements.age.required = !organization;
    const beauty = form.elements.role.value === "Бьюти-мастер";
    form.querySelector("#specialty-field").hidden = !beauty;
    form.elements.specialty.disabled = !beauty;
    form.elements.specialty.required = beauty;
  }
  form.elements.role.addEventListener("change", updateProfileFields);
  updateProfileFields();
  form.elements.city.addEventListener("change", () => { form.elements.city.value = normalizeCity(form.elements.city.value); });
  const error = document.getElementById("profile-error");

  const submit = form.querySelector('[type="submit"]');
  const cropPanel = form.querySelector("#crop-panel");
  const cropCanvas = form.querySelector("#crop-canvas");
  const zoom = form.querySelector("#crop-zoom");
  const cropButton = form.querySelector("#edit-crop");
  let cropImage = null;
  let cropX = 0, cropY = 0, cropScale = 1;
  let drag = null;
  function drawCrop() {
    if (!cropImage) return;
    const base = Math.max(cropCanvas.width / cropImage.width,cropCanvas.height / cropImage.height);
    cropScale = base * Number(zoom.value);
    cropX = Math.min(0,Math.max(cropCanvas.width - cropImage.width * cropScale,cropX));
    cropY = Math.min(0,Math.max(cropCanvas.height - cropImage.height * cropScale,cropY));
    const ctx = cropCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,cropCanvas.width,cropCanvas.height);
    ctx.drawImage(cropImage,cropX,cropY,cropImage.width * cropScale,cropImage.height * cropScale);
  }
  function startCrop(img) {
    cropImage = img;
    zoom.value = "1";
    const scale = Math.max(cropCanvas.width/img.width,cropCanvas.height/img.height);
    cropX = (cropCanvas.width-img.width*scale)/2;
    cropY = (cropCanvas.height-img.height*scale)/2;
    cropPanel.hidden = false;
    drawCrop();
    cropCanvas.focus();
  }
  zoom.addEventListener("input", () => {
    const oldScale = cropScale;
    const newScale = Math.max(cropCanvas.width/cropImage.width,cropCanvas.height/cropImage.height)*Number(zoom.value);
    cropX = cropCanvas.width/2-(cropCanvas.width/2-cropX)*newScale/oldScale;
    cropY = cropCanvas.height/2-(cropCanvas.height/2-cropY)*newScale/oldScale;
    drawCrop();
  });
  cropCanvas.addEventListener("pointerdown", event => {
    if (drag || !cropImage) return;
    drag = {id:event.pointerId,x:event.clientX,y:event.clientY};
    cropCanvas.setPointerCapture(event.pointerId);
  });
  cropCanvas.addEventListener("pointermove", event => {
    if (!drag || drag.id !== event.pointerId) return;
    const rect = cropCanvas.getBoundingClientRect();
    cropX += (event.clientX-drag.x)*cropCanvas.width/rect.width;
    cropY += (event.clientY-drag.y)*cropCanvas.height/rect.height;
    drag.x = event.clientX; drag.y = event.clientY;
    drawCrop();
  });
  ["pointerup","pointercancel","lostpointercapture"].forEach(type => cropCanvas.addEventListener(type,() => { drag = null; }));
  cropCanvas.addEventListener("keydown", event => {
    const moves = {ArrowLeft:[-15,0],ArrowRight:[15,0],ArrowUp:[0,-15],ArrowDown:[0,15]};
    if (!moves[event.key]) return;
    event.preventDefault();
    cropX += moves[event.key][0]; cropY += moves[event.key][1]; drawCrop();
  });
  form.querySelector("#apply-crop").addEventListener("click", () => {
    photo = cropCanvas.toDataURL("image/jpeg",0.88);
    const preview = form.querySelector("#profile-preview");
    preview.src = photo;
    preview.hidden = false;
    cropButton.hidden = false;
    cropPanel.hidden = true;
    error.textContent = "";
    cropButton.focus();
  });
  form.querySelector("#cancel-crop").addEventListener("click", () => {
    cropPanel.hidden = true;
    form.querySelector("#profile-photo").value = "";
    form.querySelector("#profile-photo").focus();
  });
  cropButton.addEventListener("click", async () => {
    if (loading) return;
    if (cropImage) { startCrop(cropImage); return; }
    loading = true;
    try {
      const img = new Image();
      await new Promise((resolve,reject) => { img.onload = resolve; img.onerror = reject; img.src = photo; });
      if (form.isConnected) startCrop(img);
    } catch { error.textContent = "Не удалось открыть фото. Загрузи его заново."; }
    finally { loading = false; }
  });
  form.querySelector("#profile-photo").addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;
    error.textContent = "";
    if (!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
      error.textContent = "Выбери JPG, PNG или WebP размером до 10 МБ.";
      event.target.value = "";
      return;
    }
    loading = true;
    event.target.disabled = true;
    submit.disabled = true;
    submit.textContent = "Подготовка фото…";
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      await new Promise((resolve,reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      if (form.isConnected) startCrop(img);
    } catch {
      error.textContent = "Не удалось прочитать фото. Попробуй другой файл.";
    } finally {
      URL.revokeObjectURL(url);
      loading = false;
      event.target.disabled = false;
      submit.disabled = false;
      submit.textContent = "Сохранить профиль →";
    }
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (loading) return;
    if (!cropPanel.hidden) { error.textContent = 'Примени кадрирование или нажми «Отмена» перед сохранением.'; cropCanvas.focus(); return; }
    const data = new FormData(form);
    const next = {
      specialty:data.get("role")==="Бьюти-мастер" ? String(data.get("specialty") || "") : "",
      username:String(data.get("username") || "").trim().toLowerCase(),
      name:String(data.get("name")).trim(), age:isOrganization(data.get("role")) ? null : Number(data.get("age")),
      gender:isOrganization(data.get("role")) ? "Не указан" : String(data.get("gender")),role:String(data.get("role")), city:normalizeCity(data.get("city")),
      tags:data.getAll("tags"), type:String(data.get("type")),
      bio:String(data.get("bio")).trim(), image:photo
    };
    if (!/^[a-z0-9_]{3,30}$/.test(next.username) || people.some(person => personUsername(person) === next.username)) {
      error.textContent = tr("Юзернейм занят или неверно заполнен. Используй 3–30 латинских букв, цифр или _.","Username is taken or invalid. Use 3–30 Latin letters, numbers or _."); return;
    }
    if (next.role === "Бьюти-мастер" && !beautySpecialties.includes(next.specialty)) { error.textContent=tr("Выбери специализацию.","Choose a specialty."); return; }
    if (!next.name ||
 (!isOrganization(next.role) && (!Number.isInteger(next.age) || next.age < 18 || next.age > 100)) || !next.city || next.city.length > 80) {
      error.textContent = isOrganization(next.role) ? tr("Заполни название организации и город.","Enter the organization name and city.") : "Заполни имя, возраст от 18 до 100 лет и город."; return;
    }
    if (!photo || !next.tags.length) {
      error.textContent = !photo ? "Добавь фото для своей карточки." : "Выбери хотя бы один жанр съёмки."; return;
    }
    try {
      localStorage.setItem("kadr-html-profile",JSON.stringify(next));
    } catch {
      error.textContent = "Не удалось сохранить профиль: хранилище браузера недоступно или заполнено. Попробуй фото меньшего размера."; return;
    }
    state.profile = next;
    Object.assign(state,{role:"Все",city:"",gender:"",ageMin:"",ageMax:"",genre:"Все жанры",type:"Любые условия",query:""});
    closeModal();
    selectTab("search");
    toast("Профиль сохранён и появился в твоём каталоге");
  });
}

document.getElementById("profile-button").addEventListener("click",() => state.profile ? selectTab("profile") : openProfile());

function hasUnread(id) {
  return (state.messages[id] || []).some(message=>message.direction==="incoming" && !message.read);
}
function hasAnyUnread() { return Object.keys(state.messages).some(hasUnread); }
function markConversationRead(id) {
  if (!hasUnread(id)) return;
  state.messages={...state.messages,[id]:state.messages[id].map(message=>message.direction==="incoming"?{...message,read:true}:message)};
  try { localStorage.setItem("kadr-html-messages",JSON.stringify(state.messages)); } catch {}
}
function lastMessagePreview(id) {
  const messages=state.messages[id] || [], last=messages[messages.length-1];
  if(!last)return tr("Начать диалог","Start a conversation");
  const text=last.text || (last.kind==="audio"?tr("Голосовое сообщение","Voice message"):last.attachment?tr("Фотография","Photo"):"");
  return (last.direction==="incoming"?"":tr("Вы: ","You: "))+text;
}
function contactRows() {
  return [...people].sort((a,b)=>{
    const aList=state.messages[a.id]||[],bList=state.messages[b.id]||[];
    return Number(hasUnread(b.id))-Number(hasUnread(a.id)) ||
      (bList[bList.length-1]?.createdAt||0)-(aList[aList.length-1]?.createdAt||0) ||
      Number(bList.length>0)-Number(aList.length>0) || a.id-b.id;
  }).map(person=>`<button class="contact ${state.chat===person.id?"active":""}" data-contact="${person.id}" aria-label="${esc(person.name)}${hasUnread(person.id)?tr(" — непрочитанные сообщения"," — unread messages"):""}">
    <img src="${esc(person.image)}" alt="" loading="lazy"><div class="contact-copy"><strong data-user-content>${esc(person.name)}</strong><small data-user-content>${esc(lastMessagePreview(person.id))}</small></div>
    ${hasUnread(person.id)?'<span class="unread-dot" aria-hidden="true"></span>':""}</button>`).join("");
}
function refreshContactRows() {
  const contacts=document.querySelector(".contacts");
  if(!contacts)return;
  contacts.innerHTML=contactRows();
  contacts.querySelectorAll("[data-contact]").forEach(button=>button.onclick=()=>{
    state.chat=Number(button.dataset.contact);renderInbox();
  });
}
function seedDemoIncoming() {
  if(read("demo-incoming-v1",false))return;
  const next={...state.messages};
  [[2,"Привет! Обсудим идею портретной съёмки?"],[5,"Есть референсы для съёмки на выходных. Посмотрим?"],[6,"Привет! В каком формате хочешь поснимать?"]].forEach(([id,text],index)=>{
    if(!(next[id]||[]).length)next[id]=[{text,direction:"incoming",read:false,demo:true,createdAt:Date.now()-index*60000,time:"12:0"+index}];
  });
  try {
    localStorage.setItem("kadr-html-messages",JSON.stringify(next));
    localStorage.setItem("kadr-html-demo-incoming-v1","true");
    state.messages=next;
  } catch {}
}
function renderInbox() {
  if(state.chat!==null)markConversationRead(state.chat);
  renderShell();

  document.getElementById("content").innerHTML = `
    <section class="intro">
      <span class="eyebrow">ХОРОШИЕ ИДЕИ НАЧИНАЮТСЯ С ПРИВЕТА</span>
      <h1>На одной волне<em>.</em></h1>
      <p>Обсуди идею своей следующей съёмки.</p>
    </section>

    <section class="inbox">
      <div class="contacts">
        ${contactRows()}
      </div>
      <div class="chat" id="chat"></div>
    </section>`;

  document.querySelectorAll("[data-contact]").forEach(button => {
    button.addEventListener("click", () => {
      state.chat = Number(button.dataset.contact);
      renderInbox();
    });
  });

  renderChat();
}

let chatMediaCleanup = () => {};
async function chatAttachmentStore(key,blob) {
  const db=await openPortfolioDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('data',blob===undefined?'readonly':'readwrite');
    const store=tx.objectStore('data');
    const request=blob===undefined?store.get(key):blob===null?store.delete(key):store.put(blob,key);
    tx.oncomplete=()=>resolve(request.result);
    tx.onabort=tx.onerror=()=>reject(tx.error||new Error('Storage unavailable'));
  });
}
function messageStatus(status='sent') {
  const names={sending:tr('Отправляется','Sending'),sent:tr('Отправлено · сохранено в этом браузере','Sent · saved in this browser'),read:tr('Прочитано · демонстрационный статус','Read · demo status'),failed:tr('Не отправлено','Not sent')};
  const icon=status==='sending'?'<span class="message-spinner" aria-hidden="true"></span>':status==='failed'?'<span aria-hidden="true">!</span>':`<svg viewBox="0 0 24 16" width="10" height="6.6667" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 8 4 4L16 2"/>${status==='read'?'<path d="m11 10 2 2L23 2"/>':''}</svg>`;
  return `<span class="message-status ${status}" role="img" aria-label="${names[status]}" title="${names[status]}">${icon}</span>`;
}

function renderChat() {
  chatMediaCleanup();
  const target=document.getElementById('chat');
  const person=people.find(item=>item.id===state.chat);
  if(!person){target.innerHTML=`<div class="empty"><h3>${tr('Начни знакомство','Start a conversation')}</h3>${tr('Выбери собеседника, чтобы открыть демонстрационный диалог.','Choose someone to open a demo conversation.')}</div>`;return;}
  let disposed=false, draft=null, recorder=null, stream=null, timer=null, busy=false, requesting=false, pendingBubble=null;
  const urls=new Set();
  const objectURL=blob=>{const url=URL.createObjectURL(blob);urls.add(url);return url;};
  function releaseDraft(){if(draft?.url){URL.revokeObjectURL(draft.url);urls.delete(draft.url);}draft=null;}
  function stopTracks(){stream?.getTracks().forEach(track=>track.stop());stream=null;clearInterval(timer);timer=null;}
  chatMediaCleanup=()=>{disposed=true;if(recorder&&recorder.state!=='inactive'){recorder.onstop=null;recorder.stop();}stopTracks();urls.forEach(url=>URL.revokeObjectURL(url));urls.clear();};
  markConversationRead(person.id);
  const messages=state.messages[person.id]||[];
  target.innerHTML=`<div class="chat-header"><strong data-user-content>${esc(person.name)}</strong><small>${person.role} · ${esc(person.city)}</small><button type="button" id="plan-shoot" class="calendar-chat-button">＋ ${tr("Запланировать съёмку","Plan a shoot")}</button><button type="button" id="demo-read" class="demo-read">${tr("Демо: отметить прочитанными","Demo: mark as read")}</button></div>
    <div class="messages" id="message-list"><p class="chat-notice">${tr('Демо-диалог. Сообщения и вложения сохраняются только в этом браузере и не отправляются другим людям.','Demo chat. Messages and attachments are stored only in this browser and are not sent to other people.')}</p>
    ${messages.map((message,i)=>`<div class="bubble ${message.direction==="incoming"?"incoming":""}">${message.attachment ? `<div data-attachment="${i}" class="chat-attachment">${tr('Загрузка вложения…','Loading attachment…')}</div>` : ''}${message.text?`<div data-user-content>${esc(message.text)}</div>`:''}<small class="message-meta">${esc(message.time)}${message.direction==="incoming"?"":messageStatus(message.status === "read" ? "read" : "sent")}</small></div>`).join('')}</div>
    <div id="chat-draft" class="chat-draft" hidden></div><p id="chat-media-status" class="chat-media-status" role="status"></p>
    <form class="chat-form" id="chat-form"><input type="file" id="chat-photo" accept="image/jpeg,image/png,image/webp" hidden>
    <button type="button" id="attach-photo" aria-label="${tr('Прикрепить фото','Attach photo')}" title="${tr('Прикрепить фото','Attach photo')}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m8 12 7-7a4 4 0 0 1 6 6L10 22a6 6 0 0 1-8-8L13 3a2 2 0 0 1 3 3L5 17"/></svg></button>

    <input id="message-input" aria-label="${tr('Сообщение','Message')}" placeholder="${tr('Сообщение или подпись…','Message or caption…')}" maxlength="2000" autocomplete="off"><button type="button" id="record-voice" aria-label="${tr('Записать голосовое','Record voice message')}" title="${tr('Записать голосовое','Record voice message')}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/></svg></button><button id="send-message" type="submit" aria-label="${tr('Отправить сообщение','Send message')}"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M3 3.5 22 12 3 20.5l2-7 10-1.5-10-1.5z"/></svg></button></form>`;
  document.getElementById('plan-shoot').onclick=()=>openShootEditor(null,person.id);
  const list=document.getElementById('message-list'),status=document.getElementById('chat-media-status'),preview=document.getElementById('chat-draft');
  const photoInput=document.getElementById('chat-photo'),attach=document.getElementById('attach-photo'),record=document.getElementById('record-voice'),send=document.getElementById('send-message');
  const supported=!!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  if(!supported){record.disabled=true;record.title=tr('Запись недоступна здесь. Открой приложение в браузере по localhost и разреши микрофон.','Recording is unavailable here. Open the app in a browser on localhost and allow microphone access.');}
function controls(){
  const hasContent=!!document.getElementById('message-input').value.trim()||!!draft;
  attach.disabled=busy||requesting||!!draft||!!recorder;
  record.disabled=!supported||busy||requesting||!!draft;
  send.disabled=busy||requesting||!!recorder;
  record.hidden=hasContent&&!recorder&&!requesting;
  send.hidden=!record.hidden;
  record.classList.toggle('recording',!!recorder);
}
document.getElementById('message-input').addEventListener('input',controls);
controls();

  function showDraft(){
    preview.hidden=!draft;
    if(!draft){preview.innerHTML='';controls();return;}
    preview.innerHTML=`${draft.kind==='image'?`<img src="${draft.url}" alt="${tr('Фото перед отправкой','Photo preview')}">`:`<audio controls preload="metadata" src="${draft.url}"></audio>`}<button type="button" id="remove-draft">${tr('Убрать вложение','Remove attachment')}</button>`;
    document.getElementById('remove-draft').onclick=()=>{if(busy)return;releaseDraft();showDraft();status.textContent='';};controls();
  }
  target.querySelectorAll('[data-attachment]').forEach(async element=>{
    const message=messages[Number(element.dataset.attachment)];
    try{
      const blob=await chatAttachmentStore(message.attachment);
      if(disposed)return;
      if(!(blob instanceof Blob))throw Error('Missing file');
      const url=objectURL(blob);element.textContent='';
      if(message.kind==='image'){
        const button=document.createElement('button');button.type='button';button.className='chat-image-button';
        const img=document.createElement('img');img.src=url;img.alt=tr('Прикреплённая фотография','Attached photo');button.append(img);element.append(button);
        button.onclick=()=>showModal(`<section class="modal portfolio-lightbox" role="dialog" aria-modal="true" aria-label="${tr('Просмотр фотографии','Photo viewer')}"><button class="close" aria-label="${tr('Закрыть','Close')}">×</button><img src="${url}" alt="${tr('Прикреплённая фотография','Attached photo')}"></section>`);
      }else{const audio=document.createElement('audio');audio.controls=true;audio.preload='metadata';audio.src=url;element.append(audio);}
    }catch{if(!disposed)element.textContent=tr('Вложение недоступно в этом браузере.','Attachment unavailable in this browser.');}
  });
document.getElementById('demo-read').onclick=()=>{
  if(busy)return;
  const next={...state.messages,[person.id]:(state.messages[person.id]||[]).map(message=>message.direction==='incoming'?message:{...message,status:'read'})};
  try{
    localStorage.setItem('kadr-html-messages',JSON.stringify(next));state.messages=next;
    list.querySelectorAll('.message-status.sent').forEach(element=>{element.outerHTML=messageStatus('read');});
    status.textContent=tr('Демонстрация: собеседник прочитал сохранённые сообщения.','Demo: the recipient read the saved messages.');
  }catch{status.textContent=tr('Не удалось сохранить статус прочтения.','Could not save read status.');}
};
list.scrollTop=list.scrollHeight;

  attach.onclick=()=>photoInput.click();
  photoInput.onchange=async()=>{
    const file=photoInput.files[0];photoInput.value='';if(!file||busy||draft||recorder)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){status.textContent=tr('Выбери JPG, PNG или WebP до 10 МБ.','Choose JPG, PNG or WebP up to 10 MB.');return;}
    busy=true;controls();status.textContent=tr('Подготовка фото…','Preparing photo…');
    const url=URL.createObjectURL(file);
    try{
      const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
      const scale=Math.min(1,1600/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
      const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.85));if(!blob)throw Error('Decode error');
      if(disposed)return;draft={kind:'image',blob,url:objectURL(blob)};status.textContent=tr('Фото готово. Добавь подпись или отправь сразу.','Photo ready. Add a caption or send it now.');
    }catch{if(!disposed)status.textContent=tr('Не удалось открыть фото. Попробуй другой файл.','Could not open photo. Try another file.');}
    finally{URL.revokeObjectURL(url);busy=false;if(!disposed)showDraft();}
  };
  record.onclick=async()=>{
    if(recorder){if(recorder.state==='recording')recorder.stop();stopTracks();return;}
    if(busy||requesting||draft)return;
    requesting=true;controls();status.textContent=tr('Разреши доступ к микрофону…','Allow microphone access…');
    try{
      const acquired=await navigator.mediaDevices.getUserMedia({audio:true});
      if(disposed){acquired.getTracks().forEach(track=>track.stop());return;}
      stream=acquired;
      const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(type=>MediaRecorder.isTypeSupported(type));
      recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{});
      const current=recorder,chunks=[];let cancelled=false;
      current.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
      current.onerror=()=>{cancelled=true;stopTracks();recorder=null;status.textContent=tr('Не удалось записать звук. Попробуй ещё раз.','Could not record audio. Try again.');preview.hidden=true;record.innerHTML=micIcon;controls();};
      current.onstop=()=>{
        stopTracks();recorder=null;if(disposed)return;
        record.innerHTML=micIcon;record.setAttribute('aria-label',tr('Записать голосовое','Record voice message'));
        const blob=new Blob(chunks,{type:current.mimeType||mime||'audio/webm'});
        if(!cancelled&&blob.size){draft={kind:'audio',blob,url:objectURL(blob)};status.textContent=tr('Прослушай запись перед отправкой.','Listen before sending.');}
        else if(!cancelled)status.textContent=tr('Запись пустая. Попробуй ещё раз.','Recording is empty. Try again.');
        showDraft();
      };
      current.start();record.textContent='■';record.setAttribute('aria-label',tr('Остановить запись','Stop recording'));
      preview.hidden=false;preview.innerHTML=`<button type="button" id="cancel-recording">${tr('Отменить запись','Cancel recording')}</button>`;
      document.getElementById('cancel-recording').onclick=()=>{cancelled=true;status.textContent='';if(current.state!=='inactive')current.stop();stopTracks();};
      const started=Date.now();
      const tick=()=>{const seconds=Math.floor((Date.now()-started)/1000);status.textContent=tr('Запись: ','Recording: ')+seconds+' / 60 '+tr('сек. Нажми ■, чтобы остановить.','sec. Press ■ to stop.');if(seconds>=60&&current.state==='recording'){current.stop();stopTracks();}};
      tick();timer=setInterval(tick,250);
    }catch{stopTracks();recorder=null;if(!disposed)status.textContent=tr('Микрофон недоступен. Разреши доступ в браузере. Если предпросмотр блокирует запись, открой приложение в Safari или Chrome.','Microphone unavailable. Allow access in your browser. If the preview blocks recording, open the app in Safari or Chrome.');}
    finally{requesting=false;if(!disposed)controls();}
  };
  const micIcon=record.innerHTML;
  document.getElementById('chat-form').onsubmit=async event=>{
    event.preventDefault();if(busy||requesting||recorder)return;
    const input=document.getElementById('message-input'),text=input.value.trim();if(!text&&!draft)return;
busy=true;controls();let attachment;
pendingBubble?.remove();
pendingBubble=document.createElement('div');pendingBubble.className='bubble pending-message';
pendingBubble.innerHTML=`${draft?`<div>${draft.kind==='image'?tr('Фотография','Photo'):tr('Голосовое сообщение','Voice message')}</div>`:''}${text?`<div data-user-content>${esc(text)}</div>`:''}<small class="message-meta">${messageStatus('sending')}</small>`;
list.append(pendingBubble);list.scrollTop=list.scrollHeight;

    try{
      await new Promise(resolve=>requestAnimationFrame(()=>resolve()));
      const message={text,status:'sent',direction:"outgoing",createdAt:Date.now(),time:new Date().toLocaleTimeString(settings.language==='en'?'en-GB':'ru-RU',{hour:'2-digit',minute:'2-digit'})};
      if(draft){attachment='chat-'+crypto.randomUUID();await chatAttachmentStore(attachment,draft.blob);message.attachment=attachment;message.kind=draft.kind;}
      const next={...state.messages,[person.id]:[...(state.messages[person.id]||[]),message]};
      localStorage.setItem('kadr-html-messages',JSON.stringify(next));state.messages=next;
      if(!disposed){refreshContactRows();renderShell();renderChat();document.getElementById('message-input').focus();}
    }catch{
      if(attachment)try{await chatAttachmentStore(attachment,null);}catch{}
      if(!disposed){
        pendingBubble.querySelector('.message-meta').innerHTML=messageStatus('failed');
        status.textContent=tr('Не удалось сохранить сообщение. Освободи место или разреши хранилище браузера и попробуй снова.','Could not save message. Free up space or allow browser storage and try again.');busy=false;controls();}
    }
  };
}

// Разделы прототипа. Данные и настройки остаются в этом браузере.
const settings = {...{theme:"light",language:"ru"},...read("settings",{})};
if (!["light","dark"].includes(settings.theme)) settings.theme = "light";
if (!["ru","en"].includes(settings.language)) settings.language = "ru";

const tr = (ru,en) => settings.language === "en" ? en : ru;
const routes = ["calendar","home","search","messages","profile","portfolio","saved","likes","settings"];
const labels = () => ({calendar:tr("Календарь съёмок","Shoot calendar"),user:tr("Профиль пользователя","User profile"),home:tr("Главная","Home"),search:tr("Найти своих","Find your people"),messages:tr("Чаты","Chats"),profile:tr("Профиль","Profile"),portfolio:tr("Портфолио","Portfolio"),saved:tr("Избранное","Saved"),likes:tr("Симпатии","Likes"),settings:tr("Настройки","Settings")});
function applySettings() {
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.lang = settings.language;
  document.title = tr("ВКадре — модели, фотографы и творческие команды","ВКадре — models, photographers and creative teams");
}
function pageIntro(title,description,back=false) {
  return `<section class="intro">${back ? `<a class="back-link" href="#profile">← ${tr("Профиль","Profile")}</a>` : `<span class="eyebrow">ВКАДРЕ / ${tr("ТВОРЧЕСКОЕ СООБЩЕСТВО","CREATIVE COMMUNITY")}</span>`}<h1>${title}<em>.</em></h1><p>${description}</p></section>`;
}
function renderShell() {
  const names = labels();
  const active = ["portfolio","saved","likes"].includes(state.tab) ? "profile" : state.tab;
  document.querySelector("nav").innerHTML = [["search","⌕"],["messages",'<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M20 11.5a8 8 0 0 1-8 8 9 9 0 0 1-3.5-.7L4 20l1.2-4.5A9 9 0 0 1 4.5 12a8 8 0 0 1 8-8H13a7 7 0 0 1 7 7z"/><path d="M8 10h8M8 14h5"/></svg>'],["calendar",'<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18M8 15h3M14 15h2"/></svg>']].map(([id,icon]) => `<a href="#${id}" class="${active === id ? "active" : ""}" ${active === id ? 'aria-current="page"' : ""}><span class="nav-message-icon" aria-hidden="true">${icon}${id==="messages"&&hasAnyUnread()?'<i class="nav-unread-dot"></i>':""}</span>${names[id]}${id==="messages"&&hasAnyUnread()?`<span class="sr-only">${tr("Есть непрочитанные сообщения","Unread messages")}</span>`:""}</a>`).join("");
const nested = ["portfolio","saved","likes"].includes(state.tab);
const breadcrumbs = document.querySelector(".breadcrumbs");
breadcrumbs.setAttribute("aria-label",tr("Навигация по разделам","Section navigation"));
breadcrumbs.innerHTML = `<a href="#home">${tr("Сообщество","Community")}</a><span aria-hidden="true"> / </span>${nested ? `<a href="#profile">${names.profile}</a><span aria-hidden="true"> / </span>` : ""}<a id="current-tab" href="${state.tab === "user" ? esc(location.hash) : "#"+state.tab}" aria-current="page">${names[state.tab]}</a>`;
breadcrumbs.querySelectorAll("a").forEach(link => link.addEventListener("click",event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const route = link.getAttribute("href").slice(1);
  if (route === state.tab) {
    event.preventDefault();
    if (route === "portfolio") selectedProject = null;
    render(); window.scrollTo(0,0);
  }
}));

  const profileButton = document.getElementById("profile-button");
  profileButton.textContent = state.profile ? tr("Профиль","Profile") : tr("Войти / зарегистрироваться","Log in / Sign up");
  profileButton.classList.toggle("active",active === "profile");
  const settingsLink = document.getElementById("settings-link");
  settingsLink.classList.toggle("active",state.tab === "settings");
  settingsLink.setAttribute("aria-label",tr("Настройки","Settings"));
  settingsLink.setAttribute("title",tr("Настройки","Settings"));
  if (state.tab === "settings") settingsLink.setAttribute("aria-current","page");
  else settingsLink.removeAttribute("aria-current");

}
function renderHome() {
  document.getElementById("content").innerHTML = pageIntro(tr("Твои люди. Твои съёмки","Your people. Your shoots"),tr("Место встречи моделей, фотографов и творческих команд. В твоём городе и за его пределами. 18+.","A meeting place for models, photographers and creative teams. In your city and beyond. 18+.")) + `
  <section class="home-hero"><span class="eyebrow">${tr("ЗНАКОМСТВА, ИЗ КОТОРЫХ РОЖДАЕТСЯ ТВОРЧЕСТВО","CONNECTIONS THAT INSPIRE CREATIVITY")}</span><h2>${tr("Разные города.<br>Общее видение.","Different cities.<br>Shared vision.")}</h2><p>${tr("Найди команду для идеи, покажи свои работы и начни разговор о следующей съёмке.","Find a team for your idea, share your work and start a conversation about your next shoot.")}</p><a class="primary" href="#search">${tr("Найти свою команду ↗","Find your team ↗")}</a></section>
  <div class="section-heading"><h2>${tr("Внутри ВКадре","Inside ВКадре")}</h2><span>${tr("Новости проекта","Project news")}</span></div>
  <div class="info-grid"><article class="surface"><span class="eyebrow">${tr("ОБНОВЛЕНИЕ","UPDATE")}</span><h3>${tr("Больше места для твоих работ","More room for your work")}</h3><p>${tr("Собирай портфолио из проектов: до 10 подборок, по 8 фотографий в каждой.","Build your portfolio with up to 10 projects and 8 photos per project.")}</p><a href="#portfolio">${tr("Открыть портфолио →","Open portfolio →")}</a></article>
  <article class="surface"><span class="eyebrow">${tr("О ПРОЕКТЕ","ABOUT")}</span><h3>${tr("От знакомства к совместной съёмке","From a connection to a shared shoot")}</h3><p>${tr("ВКадре помогает находить людей по роли, жанру и условиям сотрудничества. Здесь есть место и творческим TFP-проектам, и коммерческим заказам.","ВКадре helps you find people by role, genre and collaboration terms, for both creative TFP projects and commercial work.")}</p></article>
  <article class="surface"><span class="eyebrow">${tr("АКЦИИ И СОБЫТИЯ","OFFERS AND EVENTS")}</span><h3>${tr("Скоро здесь будет больше","More coming soon")}</h3><p>${tr("Здесь появятся предложения партнёров, анонсы съёмок и новости сообщества. Активных акций пока нет.","Partner offers, shoot announcements and community news will appear here. There are no active offers yet.")}</p></article></div>
  <section class="ad-placeholder"><span class="eyebrow">${tr("МЕСТО ДЛЯ ПАРТНЁРОВ","PARTNER SPACE")}</span><h3>${tr("Твой бренд может быть здесь","Your brand could be here")}</h3><p>${tr("Будущий рекламный блок для студий, брендов и творческих проектов. Сейчас реклама не размещена.","A future advertising space for studios, brands and creative projects. No ads are currently placed.")}</p></section>`;
}
function renderProfilePage() {
  const p = state.profile;
  document.getElementById("content").innerHTML = pageIntro(tr("Твоё пространство","Your space"),tr("Профиль, работы и люди, которых хочется сохранить.","Your profile, your work and people worth remembering.")) + `
  <section class="surface profile-summary">${p?.image ? `<img class="profile-avatar" src="${esc(p.image)}" alt="${tr("Фото профиля","Profile photo")}">` : '<div class="avatar-placeholder" aria-hidden="true">◉</div>'}<div><span class="eyebrow">${tr("МОЙ ПРОФИЛЬ","MY PROFILE")}</span><h2 data-user-content>${esc(p?.name || tr("Давай знакомиться","Let's meet"))}${p?.age && !isOrganization(p.role) ? `, ${p.age}` : ""}</h2><p>${p ? `${esc(p.role)}${p.city ? ` · ${esc(p.city)}` : ""}` : tr("Расскажи о себе, чтобы найти свою команду.","Introduce yourself to find your team.")}</p><p data-user-content>${esc(p?.bio || "")}</p>${profileSocialLinks()}${p ? profileIdentity({...p,id:0}) : ""}<button class="primary" id="edit-profile">${p ? tr("Редактировать профиль","Edit profile") : tr("Создать профиль","Create profile")}</button></div></section>
  ${portfolioPreview(portfolio)}<div class="info-grid profile-links"><a class="surface" href="#portfolio"><span class="eyebrow">${portfolio.length} / 10 ${tr("проектов","projects")}</span><h3>${tr("Портфолио ↗","Portfolio ↗")}</h3><p>${tr("До 10 проектов, по 8 фотографий в каждом.","Up to 10 projects with 8 photos each.")}</p></a><a class="surface" href="#saved"><span class="eyebrow">${state.saved.length}</span><h3>${tr("Избранное ◇","Saved ◇")}</h3><p>${tr("Профили, к которым хочется вернуться.","Profiles you want to revisit.")}</p></a><a class="surface" href="#likes"><span class="eyebrow">${state.likes.length}</span><h3>${tr("Симпатии ♡","Likes ♡")}</h3><p>${tr("Люди, которым ты поставил лайк.","People you have liked.")}</p></a></div>
  <p class="demo-banner">${tr("Профиль и портфолио пока доступны только в этом браузере.","Your profile and portfolio are currently available only in this browser.")}</p>`;
  bindPortfolioPreview(document.getElementById('content'),portfolio,()=>{});
  document.getElementById("edit-profile").addEventListener("click",openProfile);
}
const MAX_PROJECTS = 10, MAX_PROJECT_PHOTOS = 8;
let portfolio = [];
let portfolioBusy = true;
let selectedProject = null;
let portfolioError = false;
let portfolioDB;
function migratePortfolio(photos) {
  const projects = [];
  for (let i=0;i<photos.length;i+=MAX_PROJECT_PHOTOS) {
    projects.push({id:'import-'+i,name:projects.length ? `Мои работы ${projects.length+1}` : 'Мои работы',photos:photos.slice(i,i+MAX_PROJECT_PHOTOS)});
  }
  return projects;
}
function openPortfolioDB() {
  if (!portfolioDB) portfolioDB = new Promise((resolve,reject) => {
    const request = indexedDB.open('vkadre-portfolio',1);
    request.onupgradeneeded = () => request.result.createObjectStore('data');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Database blocked'));
  });
  return portfolioDB;
}
async function portfolioStorage(mode,value) {
  const db = await openPortfolioDB();
  return new Promise((resolve,reject) => {
    const tx = db.transaction('data',mode);
    const store = tx.objectStore('data');
    const request = mode === 'readonly' ? store.get('projects') : store.put(value,'projects');
    tx.oncomplete = () => resolve(request.result);
    tx.onerror = tx.onabort = () => reject(tx.error || new Error('Storage error'));
  });
}
async function loadPortfolio() {
  try {
    const saved = await portfolioStorage('readonly');
    if (Array.isArray(saved)) portfolio = saved;
    else {
      const legacy = read('portfolio',[]);
      portfolio = migratePortfolio(Array.isArray(legacy) ? legacy : []);
      await portfolioStorage('readwrite',portfolio);
    }
  } catch { portfolioError = true; }
  finally {
    portfolioBusy = false;
    if(state.tab === 'portfolio') renderPortfolio();
    else if(state.tab === 'profile') renderProfilePage();
    else if(state.tab === 'user') renderUserPage();
  }
}
async function persistPortfolio(next) {
  if(next.length > MAX_PROJECTS || next.some(project => project.photos.length > MAX_PROJECT_PHOTOS)) {
    toast(tr('Лимит: 10 проектов, по 8 фотографий в каждом.','Limit: 10 projects, 8 photos each.')); return false;
  }
  try { await portfolioStorage('readwrite',next); portfolio = next; return true; }
  catch { toast(tr('Не удалось сохранить портфолио. Проверь свободное место и доступ браузера к хранилищу.','Could not save portfolio. Check available space and browser storage access.')); return false; }
}
async function updatePortfolio(next) {
  if(portfolioBusy || portfolioError) return false;
  portfolioBusy = true; renderPortfolio();
  const success = await persistPortfolio(next);
  portfolioBusy = false;
  if(state.tab === 'portfolio') renderPortfolio();
  else if(state.tab === 'profile') renderProfilePage();
    else if(state.tab === 'user') renderUserPage();
  return success;
}
function renderPortfolio() {
  const content = document.getElementById('content');
  const project = portfolio.find(item => item.id === selectedProject);
  const disabled = portfolioBusy || portfolioError;
  const notice = portfolioError ? tr('Не удалось открыть хранилище фотографий. Обнови страницу и проверь настройки браузера. Старые фотографии не удалены.','Could not open photo storage. Reload and check browser settings. Existing photos have not been deleted.') : portfolioBusy ? tr('Подождите, сохраняем или загружаем работы…','Please wait, loading or saving your work…') : '';
  if (!project) {
    content.innerHTML = pageIntro(tr('Портфолио','Portfolio'),tr('До 10 проектов, до 8 фотографий в каждом. Собери отдельную историю для каждой съёмки.','Up to 10 projects, with up to 8 photos each. Tell a separate story for every shoot.'),true) + `
    <form id="new-project" class="surface portfolio-toolbar"><label class="form-label">${tr('Название нового проекта','New project name')}<input name="name" maxlength="80" required placeholder="${tr('Например: Город на плёнку','For example: City on film')}" ${disabled || portfolio.length>=10 ? 'disabled' : ''}></label><button class="primary" ${disabled || portfolio.length>=10 ? 'disabled' : ''}>${tr('Создать проект','Create project')}</button><p>${portfolio.length} / 10 ${tr('проектов','projects')}</p><p role="status">${notice || (portfolio.length>=10 ? tr('Все 10 проектов созданы. Можно редактировать существующие.','All 10 projects are created. You can edit existing projects.') : '')}</p></form>
    <div class="portfolio-grid">${portfolio.map(item => `<article class="surface portfolio-item"><button class="project-cover" data-project="${esc(item.id)}">${item.photos[0] ? `<img src="${esc(item.photos[0].src)}" alt="">` : '<span aria-hidden="true">＋</span>'}<strong data-user-content>${esc(item.name)}</strong><small>${item.photos.length} / 8 ${tr('фото','photos')}</small></button></article>`).join('') || `<div class="empty">${tr('Создай первую подборку и добавь любимые работы.','Create your first project and add your favourite work.')}</div>`}</div>`;
    document.getElementById('new-project').onsubmit = async event => {
      event.preventDefault();
      if(disabled || portfolio.length>=10) return;
      const input = event.currentTarget.elements.name;
      const name = input.value.trim();
      if(!name) { input.setCustomValidity(tr('Введи название проекта.','Enter a project name.')); input.reportValidity(); return; }
      const item = {id:crypto.randomUUID(),name,photos:[]};
      if(await updatePortfolio([...portfolio,item])) { selectedProject=item.id; if(state.tab==='portfolio') renderPortfolio(); }
    };
    document.getElementById('new-project').oninput = event => event.target.setCustomValidity('');
    content.querySelectorAll('[data-project]').forEach(button => button.onclick = () => {selectedProject=button.dataset.project;renderPortfolio();});
    return;
  }
  content.innerHTML = pageIntro(esc(project.name),tr('Первая фотография — обложка проекта. Меняй порядок кнопками под фото.','The first photo is the project cover. Use the buttons below to reorder photos.')) + `
  <button class="back-link" id="all-projects">← ${tr('Все проекты','All projects')}</button>
  <form id="rename-project" class="surface portfolio-toolbar"><label class="form-label">${tr('Название проекта','Project name')}<input name="name" required maxlength="80" value="${esc(project.name)}" ${disabled?'disabled':''}></label><button ${disabled?'disabled':''} class="primary">${tr('Сохранить название','Save name')}</button><button type="button" id="delete-project" ${disabled?'disabled':''}>${tr('Удалить проект','Delete project')}</button></form>
  <section class="surface portfolio-toolbar"><label class="upload-label">${tr('Добавить фотографии','Add photos')}<input id="portfolio-upload" type="file" accept="image/jpeg,image/png,image/webp" multiple ${disabled || project.photos.length>=8?'disabled':''}></label><p>${tr('До 8 фото в проекте · JPG, PNG, WebP · до 10 МБ каждое.','Up to 8 photos per project · JPG, PNG, WebP · up to 10 MB each.')}</p><p id="portfolio-status" role="status">${notice || `${project.photos.length} / 8`}</p></section>
  <div class="portfolio-grid">${project.photos.map((item,i) => `<article class="surface portfolio-item"><button class="portfolio-open" data-view="${i}" aria-label="${tr('Открыть фото','Open photo')} ${i+1}"><img src="${esc(item.src)}" alt="${esc(item.name)}" loading="lazy"></button><div class="portfolio-caption"><span>${i===0?tr('Обложка','Cover'):i+1}</span><div><button data-move="${i}" data-direction="-1" ${disabled||i===0?'disabled':''} aria-label="${tr('Передвинуть раньше','Move earlier')}">←</button><button data-move="${i}" data-direction="1" ${disabled||i===project.photos.length-1?'disabled':''} aria-label="${tr('Передвинуть позже','Move later')}">→</button><button data-delete="${i}" ${disabled?'disabled':''} aria-label="${tr('Удалить фото','Delete photo')}">×</button></div></div></article>`).join('') || `<div class="empty">${tr('Добавь фотографии в этот проект.','Add photos to this project.')}</div>`}</div><p class="demo-banner">${tr('Фотографии хранятся в этом браузере. Сохраняй оригиналы отдельно.','Photos are stored in this browser. Keep your originals separately.')}</p>`;
  // Название проекта — пользовательский текст, не переводим его.
  content.querySelector('h1').setAttribute('data-user-content','');
  const replace = changed => portfolio.map(item => item.id===project.id ? changed : item);
  document.getElementById('all-projects').onclick = () => {selectedProject=null;renderPortfolio();};
  document.getElementById('rename-project').oninput = event => event.target.setCustomValidity('');
  document.getElementById('rename-project').onsubmit = async event => {
    event.preventDefault();
    const input=event.currentTarget.elements.name,name=input.value.trim();
    if(!name) { input.setCustomValidity(tr('Введи название проекта.','Enter a project name.'));input.reportValidity();return; }
    if(await updatePortfolio(replace({...project,name}))) toast(tr('Название сохранено','Name saved'));
  };
  document.getElementById('delete-project').onclick = () => {
    showModal(`<section class="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title"><button class="close" aria-label="${tr('Закрыть','Close')}">×</button><h2 id="delete-title">${tr('Удалить проект?','Delete project?')}</h2><p>${tr('Подборка и все фотографии в ней будут удалены из портфолио.','The project and all its photos will be removed from your portfolio.')}</p><button class="primary" id="confirm-project-delete">${tr('Удалить','Delete')}</button></section>`);
    document.getElementById('confirm-project-delete').onclick = async () => {closeModal();if(await updatePortfolio(portfolio.filter(item=>item.id!==project.id))) {if(selectedProject===project.id)selectedProject=null;if(state.tab==='portfolio')renderPortfolio();}};
  };
  content.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>{
    const item=project.photos[Number(button.dataset.view)];
    showModal(`<section class="modal portfolio-lightbox" role="dialog" aria-modal="true" aria-label="${tr('Просмотр фотографии','Photo viewer')}"><button class="close" aria-label="${tr('Закрыть','Close')}">×</button><img src="${esc(item.src)}" alt="${esc(item.name)}"></section>`);
  });
  content.querySelectorAll('[data-move]').forEach(button=>button.onclick=async()=>{
    const i=Number(button.dataset.move),j=i+Number(button.dataset.direction),photos=[...project.photos];
    if(j<0||j>=photos.length)return;
    [photos[i],photos[j]]=[photos[j],photos[i]];
    await updatePortfolio(replace({...project,photos}));
  });
  content.querySelectorAll('[data-delete]').forEach(button=>button.onclick=async()=>{
    const previous=[...project.photos];
    if(!await updatePortfolio(replace({...project,photos:project.photos.filter((_,i)=>i!==Number(button.dataset.delete))})))return;
    if(state.tab!=='portfolio'||selectedProject!==project.id)return;
    const status=document.getElementById('portfolio-status'); status.textContent=tr('Фото удалено. ','Photo deleted. ');
    const undo=document.createElement('button');undo.textContent=tr('Вернуть','Undo');
    undo.onclick=()=>updatePortfolio(replace({...project,photos:previous}));status.append(undo);undo.focus();
  });
  document.getElementById('portfolio-upload').onchange=async event=>{
    const files=[...event.target.files];
    if(!files.length||portfolioBusy)return;
    if(project.photos.length+files.length>8){toast(tr('В одном проекте может быть не больше 8 фото.','A project can contain up to 8 photos.'));event.target.value='';return;}
    if(files.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024)){toast(tr('Выбери JPG, PNG или WebP до 10 МБ каждый.','Choose JPG, PNG or WebP files up to 10 MB each.'));event.target.value='';return;}
    portfolioBusy=true;renderPortfolio();
    try {
      const added=[];
      for(const file of files){
        const url=URL.createObjectURL(file);
        try {
          const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
          const scale=Math.min(1,1200/Math.max(img.width,img.height)),canvas=document.createElement('canvas');
          canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
          const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
          added.push({name:file.name,src:canvas.toDataURL('image/jpeg',0.8)});
        } finally {URL.revokeObjectURL(url);}
      }
      if(await persistPortfolio(replace({...project,photos:[...project.photos,...added]})))toast(tr('Фотографии добавлены','Photos added'));
    }catch{toast(tr('Не удалось прочитать фото. Проект не изменён.','Could not read a photo. The project is unchanged.'));}
    finally{portfolioBusy=false;if(state.tab==='portfolio')renderPortfolio();else if(state.tab==='profile')renderProfilePage();}
  };
}

const socialNetworks = [
  {id:"vk",name:"ВКонтакте",example:"https://vk.com/username",hosts:["vk.com","vk.ru"]},
  {id:"telegram",name:"Telegram",example:"https://t.me/username",hosts:["t.me"]},
  {id:"instagram",name:"Instagram",example:"https://www.instagram.com/username",hosts:["instagram.com"]},
{id:"tiktok",name:"TikTok",example:"https://www.tiktok.com/@username",hosts:["tiktok.com","vm.tiktok.com","vt.tiktok.com"]},
  {id:"max",name:"MAX",example:"https://max.ru/u/username",hosts:["max.ru"]},
  {id:"wfolio",name:"Wfolio",example:"https://username.wfolio.pro",hosts:[],customDomain:true},
  {id:"youtube",name:"YouTube",example:"https://www.youtube.com/@username",hosts:["youtube.com","youtu.be"]}
];
function normalizeSocialUrl(value, network) {
  const text = String(value || "").trim();
  if (!text) return "";
  const url = new URL(text);
  const host = url.hostname.toLowerCase().replace(/^www\./,"");
  if (url.protocol !== "https:" || url.username || url.password || url.port ||
      (network.customDomain ? !host.includes(".") : !network.hosts.includes(host)) || (!network.customDomain && url.pathname === "/")) throw new Error("Invalid social URL");
  return url.href;
}
function profileSocialLinks() {
  const links = socialNetworks.map(network => {
    try {
      const url = normalizeSocialUrl(settings.socials?.[network.id], network);
      return url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${network.name} ↗</a>` : "";
    } catch { return ""; }
  }).join("");
  return links ? `<div class="profile-socials" role="group" aria-label="${tr("Соцсети","Social media")}">${links}</div>` : "";
}
function renderSettings() {

  document.getElementById("content").innerHTML = pageIntro(tr("Настройки","Settings"),tr("Сделай ВКадре удобным для себя.","Make ВКадре feel like home.")) + `<section class="surface settings-panel"><h2>${tr("Внешний вид","Appearance")}</h2><fieldset class="setting-control"><legend>${tr("Тема оформления","Theme")}</legend><div class="segmented-control">
<label><input type="radio" name="theme-setting" value="light" ${settings.theme==="light"?"checked":""}><span>☀ ${tr("Светлая","Light")}</span></label>
<label><input type="radio" name="theme-setting" value="dark" ${settings.theme==="dark"?"checked":""}><span>☾ ${tr("Тёмная","Dark")}</span></label>
</div></fieldset><fieldset class="setting-control"><legend>${tr("Язык интерфейса","Interface language")}</legend><div class="segmented-control">
<label><input type="radio" name="language-setting" value="ru" ${settings.language==="ru"?"checked":""}><span>Русский</span></label>
<label><input type="radio" name="language-setting" value="en" ${settings.language==="en"?"checked":""}><span>English</span></label>
</div></fieldset>
<p>${tr("Имена, описания профилей и сообщения сохраняются на языке автора.","Names, profile descriptions and messages remain in their original language.")}</p></section><section class="surface settings-panel"><h2>${tr("О приложении","About the app")}</h2><p>${tr("ВКадре · Творческое сообщество · 18+. Сейчас это локальный прототип. Профиль, портфолио, сообщения и настройки сохраняются в этом браузере.","ВКадре · Creative community · 18+. This is a local prototype. Your profile, portfolio, messages and settings are stored in this browser.")}</p></section>`;
  document.querySelector(".settings-panel").insertAdjacentHTML("afterend", `
    <form id="social-settings" class="surface settings-panel">
      <h2>${tr("Соцсети","Social media")}</h2>
      <p>${tr("Добавь ссылки на свои страницы — они появятся в твоём профиле. Чтобы убрать ссылку, очисти поле и сохрани изменения.","Add links to your pages to display them on your profile. To remove a link, clear its field and save.")}</p>
      ${socialNetworks.map(network => `<label class="form-label">${network.name}<input type="url" name="${network.id}" maxlength="500" placeholder="${network.example}" value="${esc(settings.socials?.[network.id] || "")}"></label>`).join("")}
      <p id="social-settings-status" role="status" aria-live="polite"></p>
      <button class="primary" type="submit">${tr("Сохранить соцсети","Save social links")}</button>
    </form>`);
  document.getElementById("social-settings").onsubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById("social-settings-status");
    const socials = {};
    for (const network of socialNetworks) {
      const input = form.elements.namedItem(network.id);
      try { socials[network.id] = normalizeSocialUrl(input.value, network); }
      catch {
        status.textContent = tr("Проверь ссылку для ","Check the link for ") + network.name + tr(". Пример: ",". Example: ") + network.example;
        input.focus();
        return;
      }
    }
    try { localStorage.setItem("kadr-html-settings",JSON.stringify({...settings,socials})); }
    catch {
      status.textContent = tr("Не удалось сохранить ссылки. Проверь доступ к хранилищу браузера.","Could not save links. Check browser storage access.");
      return;
    }
    settings.socials = socials;
    status.textContent = tr("Соцсети сохранены и отображаются в твоём профиле.","Social links saved and displayed on your profile.");
  };
  setupSettingsSections();
  for (const [name,key] of [["theme-setting","theme"],["language-setting","language"]]) document.querySelectorAll(`input[name="${name}"]`).forEach(input => input.onchange = event => {
    settings[key] = event.target.value;
    try { localStorage.setItem("kadr-html-settings",JSON.stringify(settings)); }
    catch { toast(tr("Настройка применена, но браузер не разрешил её сохранить.","Setting applied, but browser storage is unavailable.")); }
    const expanded = [...document.querySelectorAll(".settings-section[open]")].map(el=>el.dataset.section);
    const drafts = Object.fromEntries(new FormData(document.getElementById("social-settings")));
    applySettings(); render();
    document.querySelectorAll(".settings-section").forEach(el=>{el.open=expanded.includes(el.dataset.section);});
    for (const [id,value] of Object.entries(drafts)) document.getElementById("social-settings").elements.namedItem(id).value = value;
    document.querySelector(`input[name="${name}"][value="${settings[key]}"]`).focus();
  });

}
function personUsername(person) {
  return person.username?.toLowerCase() || (person.id === 0 ? "my_profile" : "kadr_" + person.id);
}
function profileIdentity(person) {
  return `<div class="profile-identity">${person.specialty ? `<p>${esc(person.specialty)}</p>` : ""}<span data-user-content>@${esc(personUsername(person))}</span><div class="experience-stat"><strong>${person.demo ? (person.demoDeals || 0) : 0}</strong><span>${person.demo ? tr("сделок · демо","deals · demo") : tr("успешных сделок на сайте","successful deals on the site")}</span></div><small>${person.demo ? tr("Пример статистики вымышленного пользователя.","Sample statistics for a fictional user.") : tr("Подтверждённых сделок пока нет. Счётчик будет расти после подтверждения завершённых съёмок обеими сторонами.","No confirmed deals yet. The count will increase when both parties confirm a completed shoot.")}</small></div>`;
}
function reportButton(person) {
  return person.id === 0 ? "" : `<button type="button" class="report-link" data-report="${person.id}">⚑ ${tr("Пожаловаться","Report profile")}</button>`;
}
function bindReportButtons(root) {
  root.querySelectorAll("[data-report]").forEach(button=>button.onclick=()=>openReport(Number(button.dataset.report)));
}
function openReport(id) {
  const person = catalogPeople().find(p=>p.id===id);
  if (!person || id===0) return;
  showModal(`<form class="modal" id="report-form" role="dialog" aria-modal="true" aria-labelledby="report-title">
  <button class="close" type="button" aria-label="${tr("Закрыть","Close")}">×</button>
  <h2 id="report-title">${tr("Жалоба на профиль","Report profile")}</h2><p data-user-content>@${esc(personUsername(person))}</p>
  <label class="form-label">${tr("Причина","Reason")}<select name="reason" required><option value="">${tr("Выбери причину","Choose a reason")}</option>${[["spam","Спам","Spam"],["fraud","Мошенничество","Fraud"],["abuse","Оскорбления","Harassment"],["impersonation","Чужие фото или личность","Impersonation"],["other","Другое","Other"]].map(([id,ru,en])=>`<option value="${id}">${tr(ru,en)}</option>`).join("")}</select></label>
  <label class="form-label">${tr("Что произошло?","What happened?")}<textarea name="details" required minlength="10" maxlength="2000"></textarea></label>
  <p>${tr("Пока можно сохранить черновик жалобы на этом устройстве. Отправка модераторам ещё не подключена.","You can save a report draft on this device. Delivery to moderators is not connected yet.")}</p>
  <p id="report-status" role="status"></p><button class="primary" type="submit">${tr("Сохранить черновик","Save draft")}</button></form>`);
  document.getElementById("report-form").onsubmit=event=>{
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    const reports=read("reports",[]);
    try {
      localStorage.setItem("kadr-html-reports",JSON.stringify([...(Array.isArray(reports)?reports:[]),{user:personUsername(person),reason:data.get("reason"),details:String(data.get("details")).trim(),createdAt:new Date().toISOString(),status:"draft"}]));
      closeModal();toast(tr("Черновик жалобы сохранён. Он ещё не отправлен.","Report draft saved. It has not been sent."));
    } catch { document.getElementById("report-status").textContent=tr("Не удалось сохранить черновик.","Could not save draft."); }
  };
}
function renderUserPage() {
  let username;
  try { username=decodeURIComponent(location.hash.slice(6)).toLowerCase(); } catch { username=""; }
  const person=catalogPeople().find(p=>personUsername(p)===username);
  const content=document.getElementById("content");
  if (!person) {content.innerHTML=pageIntro(tr("Профиль не найден","Profile not found"),tr("Проверь адрес или вернись к поиску.","Check the address or return to search."))+'<a class="primary" href="#search">'+tr("К поиску","Back to search")+'</a>';return;}
  const projects=person.id===0?portfolio:(person.projects||[]);
  content.innerHTML=`<a class="back-link" href="#search">← ${tr("К поиску","Back to search")}</a>
  <section class="surface full-profile"><img class="full-profile-photo" src="${esc(person.image)}" alt="${esc(person.name)}">
  <div><span class="eyebrow">${esc(person.role)} · ${esc(person.city)}</span><h1 data-user-content>${esc(person.name)}</h1>
  ${profileIdentity(person)}<p data-user-content>${esc(person.bio||"")}</p><div class="tags">${[...person.tags,person.type].map(tag=>`<span class="tag">${esc(tag)}</span>`).join("")}</div>
  ${person.id===0?profileSocialLinks():""}<div class="profile-actions"><button class="primary" id="user-contact">${person.id===0?tr("Редактировать профиль","Edit profile"):tr("Обсудить съёмку","Discuss a shoot")}</button>${reportButton(person)}</div>
  <small>${person.id===0?tr("Профиль доступен только в этом браузере.","Profile is available only in this browser."):tr("Демонстрационный профиль. Фотографии — иллюстрации.","Demo profile. Photos are illustrations.")}</small></div></section>
  <h2>${tr("Портфолио","Portfolio")}</h2>${portfolioPreview(projects)}`;
  bindReportButtons(content);
  bindPortfolioPreview(content,projects,()=>{closeModal();renderUserPage();});
  document.getElementById("user-contact").onclick=()=>{if(person.id===0)openProfile();else{state.chat=person.id;selectTab("messages");}};
}
function setupSettingsSections() {
  const content=document.getElementById("content");
  [...content.querySelectorAll(".settings-panel")].forEach((panel,index)=>{
    const title=panel.querySelector("h2");
    const details=document.createElement("details");
    details.className="surface settings-panel settings-section";
    details.dataset.section=["appearance","socials","about"][index];
    const summary=document.createElement("summary");summary.textContent=title.textContent;title.remove();
    panel.replaceWith(details);details.append(summary,panel);panel.classList.remove("surface","settings-panel");panel.classList.add("settings-section-body");
  });
  const about=content.querySelector('[data-section="about"]');
  about.insertAdjacentHTML("beforebegin",`
  <details class="surface settings-panel settings-section" data-section="support"><summary>${tr("Техническая поддержка","Technical support")}</summary><div class="settings-section-body">
  <div class="support-contacts"><div><strong>Email</strong><span>support@example.com</span><small>${tr("Адрес-заглушка","Placeholder address")}</small></div><div><strong>Telegram</strong><span>@support_username</span><small>${tr("Юзернейм-заглушка","Placeholder username")}</small></div></div><p>${tr("Контакты поддержки пока не опубликованы. Сохрани описание проблемы, чтобы передать его команде.","Support contacts have not been published yet. Save a description of your issue to share with the team.")}</p>
  <form id="support-form"><label class="form-label">${tr("Описание проблемы","Issue description")}<textarea name="message" required maxlength="4000" placeholder="${tr("Что произошло и как это повторить?","What happened and how can it be reproduced?")}"></textarea></label><button class="primary" type="submit">${tr("Скачать обращение","Download support request")}</button></form>
  <p>${tr("Файл не отправляется автоматически.","The file is not sent automatically.")}</p></div></details>
  <details class="surface settings-panel settings-section" data-section="security"><summary>${tr("Безопасность","Security")}</summary><div class="settings-section-body">
  <h3>${tr("Пароль и вход","Password and sign-in")}</h3><p>${tr("Сервер аккаунтов пока не подключён. Пароль, восстановление доступа, двухфакторная защита и управление сеансами станут доступны после его подключения.","The account server is not connected yet. Passwords, account recovery, two-factor authentication and session management will become available once it is connected.")}</p>
  <button type="button" disabled>${tr("Изменить пароль — скоро","Change password — coming soon")}</button>
  <h3>${tr("Данные на этом устройстве","Data on this device")}</h3><p>${tr("Профиль, сообщения и черновики хранятся в этом браузере. Не используй общий компьютер для личной переписки.","Your profile, messages and drafts are stored in this browser. Avoid shared computers for private conversations.")}</p>
  </div></details>`);
  document.getElementById("support-form").onsubmit=event=>{
    event.preventDefault();
    const message=String(new FormData(event.currentTarget).get("message")).trim();
    if(!message)return;
    const blob=new Blob(["ВКадре — обращение в поддержку\n"+new Date().toISOString()+"\n\n"+message],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="vkadre-support.txt";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
}

const teams = [
  {name:"LINE STUDIO",kind:["Бренд одежды","Clothing brand"],title:["Модель для съёмки новой коллекции","Model for a new collection shoot"],detail:["Пример брифа: съёмка лукбука в студии, 4 часа. Ищем модель 18+ и фотографа с опытом fashion. Дата, гонорар и права использования обсуждаются отдельно.","Sample brief: a four-hour studio lookbook shoot. Looking for a model aged 18+ and a fashion photographer. Date, fee and usage rights to be agreed separately."]},
  {name:"FORMA OBJECTS",kind:["Предметный дизайн","Object design"],title:["Фотограф для предметной съёмки","Product photographer wanted"],detail:["Пример брифа: фотографии предметов интерьера для каталога. Нужны примеры предметных работ. Объём, сроки и бюджет обсуждаются отдельно.","Sample brief: interior objects for a product catalogue. Product photography examples are required. Scope, timeline and budget to be agreed separately."]},
  {name:"NORTH COFFEE",kind:["Городской проект","Local project"],title:["Команда для lifestyle-съёмки","Team for a lifestyle shoot"],detail:["Пример брифа: фотограф и модели 18+ для съёмки в кофейне. Живые кадры для социальных сетей. Гонорар и условия обсуждаются отдельно.","Sample brief: a photographer and models aged 18+ for a coffee shop shoot. Candid social media images. Fee and terms to be agreed separately."]}
];
function renderTeams() {
  renderCards(true);
}
window.addEventListener("hashchange", () => {
  closeModal();
  const route = location.hash.slice(1);
  state.tab = route.startsWith("user/") ? "user" : routes.includes(route) ? route : "home";
  render(); window.scrollTo(0,0);
});

// Перевод подписей существующих экранов; пользовательский текст не переводится.
const interfaceEnglish = {
"Агентство":"Agency","Команда":"Team","Бренд / компания":"Brand / company","Бьюти-мастер":"Beauty professional","Визажист":"Makeup artist","Парикмахер-стилист":"Hair stylist","Мастер по наращиванию волос":"Hair extension specialist","Мастер ногтевого сервиса":"Nail technician","Бровист":"Brow artist","Лэшмейкер":"Lash artist","Мастер по гриму":"Special effects makeup artist","Универсальный бьюти-мастер":"Multidisciplinary beauty professional",
"Женский":"Female","Мужской":"Male","Не указан":"Not specified",
"Город":"City","Город съёмки":"Shoot location","В каком городе ты снимаешь?":"Which city do you shoot in?","Творческое сообщество · 18+":"Creative community · 18+","Сообщество · 18+":"Community · 18+","Санкт-Петербург":"Saint Petersburg",
"ВКадре — главная":"ВКадре — home","Главное меню":"Main navigation","⌖ Санкт-Петербург":"⌖ Saint Petersburg","ТВОЁ ПРОСТРАНСТВО":"YOUR SPACE","Сообщество /":"Community /","Твой следующий классный кадр — здесь":"Your next great shot starts here","Знакомься, вдохновляйся и создавай вместе.":"Connect, get inspired and create together.","◉ Хорошие кадры начинаются с хороших знакомств.":"◉ Great shots start with great connections.","Создавай вместе ↗":"Create together ↗",
"Встретимся в кадре":"Meet in the frame","Есть контакт":"A connection","Твои вдохновения":"Your inspiration","ЛЮДИ. ИДЕИ. СОВПАДЕНИЯ.":"PEOPLE. IDEAS. CONNECTIONS.","Находи моделей и фотографов, с которыми хочется создавать.":"Find models and photographers you want to create with.","Все":"All","Модели":"Models","Фотографы":"Photographers","Бренды и команды":"Brands & teams","Сбросить ↺":"Reset ↺","Имя или жанр…":"Name or genre…","Поиск по профилям":"Search profiles","Жанр съёмки":"Photography genre","Все жанры":"All genres","Портрет":"Portrait","Студия":"Studio","Условия сотрудничества":"Collaboration terms","Любые условия":"Any terms","Коммерция":"Commercial","TFP и коммерция":"TFP and commercial","Санкт-Петербург · 18+":"Saint Petersburg · 18+","Демонстрационные профили. TFP — совместная съёмка в обмен на фотографии.":"Demo profiles. TFP means collaborating in exchange for photos.","Твой локальный профиль и демонстрационные профили. TFP — совместная съёмка в обмен на фотографии.":"Your local profile and demo profiles. TFP means collaborating in exchange for photos.","Модель":"Model","Фотограф":"Photographer","Открыта к сотрудничеству":"Available for collaboration","Открыт к сотрудничеству":"Available for collaboration","Твой профиль · Модель":"Your profile · Model","Твой профиль · Фотограф":"Your profile · Photographer","Пока никого нет":"No profiles yet","Попробуй изменить фильтры или сохранить понравившиеся профили.":"Try changing filters or saving profiles you like.","Закрыть":"Close","Твой профиль. Виден только в этом браузере.":"Your profile. Visible only in this browser.","Вымышленный профиль. Все фотографии — иллюстрации, а не реальные работы этого человека.":"Fictional profile. All photos are illustrations, not actual work by this person.","Редактировать профиль":"Edit profile","Обсудить съёмку ↗":"Discuss a shoot ↗",
"ТВОЁ МЕСТО ВКАДРЕ":"YOUR PLACE IN THE FRAME","Твой профиль":"Your profile","Давай знакомиться.":"Let's meet.","Расскажи о себе и о съёмках, которые тебя вдохновляют.":"Tell us about yourself and the shoots that inspire you.","Фото твоего профиля":"Your profile photo","Кадрировать фото":"Crop photo","Кадрирование фотографии":"Photo cropping","Передвигай фото мышью или пальцем. Можно также использовать стрелки на клавиатуре.":"Move the photo with a mouse or touch. You can also use the arrow keys.","Область кадрирования. Стрелки перемещают фото.":"Crop area. Use arrow keys to move the photo.","Приближение":"Zoom","Применить":"Apply","Отмена":"Cancel","Портретный кадр 4:5. Нажми «Применить», затем сохрани профиль.":"Portrait crop, 4:5. Choose Apply, then save your profile.","Фото для карточки":"Profile photo","JPG, PNG или WebP, до 10 МБ. Фото автоматически уменьшается для сохранения.":"JPG, PNG or WebP, up to 10 MB. Photos are resized automatically.","Твоё имя":"Your name","Как тебя зовут?":"What is your name?","Возраст":"Age","От 18 лет":"18 or older","Твоя роль":"Your role","Жанры съёмки — выбери хотя бы один":"Photography genres — choose at least one","TFP — совместная съёмка в обмен на фотографии.":"TFP means collaborating in exchange for photos.","О себе":"About you","Опыт, идеи и пожелания к съёмкам…":"Experience, ideas and shoot preferences…","Мне исполнилось 18 лет. Я понимаю, что это демонстрационный прототип.":"I am 18 or older. I understand this is a demo prototype.","Сохранить профиль →":"Save profile →","Профиль появится в каталоге только в этом браузере. Другие люди его пока не видят.":"Your profile will appear in this browser's catalogue only. Other people cannot see it yet.","Выбери JPG, PNG или WebP размером до 10 МБ.":"Choose JPG, PNG or WebP up to 10 MB.","Подготовка фото…":"Preparing photo…","Не удалось открыть фото. Загрузи его заново.":"Could not open the photo. Upload it again.","Не удалось прочитать фото. Попробуй другой файл.":"Could not read the photo. Try another file.","Примени кадрирование или нажми «Отмена» перед сохранением.":"Apply the crop or choose Cancel before saving.","Заполни имя, возраст от 18 до 100 лет и город.":"Enter your name, age from 18 to 100 and city.","Добавь фото для своей карточки.":"Add a profile photo.","Выбери хотя бы один жанр съёмки.":"Choose at least one photography genre.","Не удалось сохранить профиль: хранилище браузера недоступно или заполнено. Попробуй фото меньшего размера.":"Could not save your profile: browser storage is unavailable or full. Try a smaller photo.","Профиль сохранён и появился в твоём каталоге":"Profile saved and added to your catalogue","Браузер запретил сохранение. До закрытия страницы данные останутся доступны.":"Browser storage is unavailable. Data will remain available until this page is closed.",
"ХОРОШИЕ ИДЕИ НАЧИНАЮТСЯ С ПРИВЕТА":"GREAT IDEAS START WITH HELLO","На одной волне":"On the same wavelength","Обсуди идею своей следующей съёмки.":"Discuss your next shoot idea.","Начни знакомство":"Start a conversation","Выбери собеседника, чтобы открыть демонстрационный диалог.":"Choose someone to open a demo conversation.","Демо-диалог. Сообщения сохраняются только в этом браузере. Они не отправляются другим людям; автоматических ответов нет.":"Demo conversation. Messages are stored only in this browser. They are not sent to anyone; there are no automatic replies.","Сообщение":"Message","Начни с идеи для съёмки…":"Start with a shoot idea…","Отправить сообщение":"Send message",

};
function englishText(text) {
  const clean = text.trim().replace(/\s+/g," ");
  if (interfaceEnglish[clean]) return text.replace(text.trim(),interfaceEnglish[clean]);
  if (/^Найдено профилей: \d+$/.test(clean)) return clean.replace("Найдено профилей:","Profiles found:");
  const role = clean.match(/^(Модель|Фотограф|Бьюти-мастер|Команда|Агентство|Бренд \/ компания) · (ПЕТЕРБУРГ|Санкт-Петербург|.+)$/);
  if (role) return `${interfaceEnglish[role[1]]} · ${interfaceEnglish[role[2]] || (/(ПЕТЕРБУРГ|Санкт-Петербург)/.test(role[2]) ? "Saint Petersburg" : role[2])}`;
  for (const [ru,en] of [["Открыть профиль:","Open profile:"],["Сохранить:","Save:"],["Лайк:","Like:"]]) if(clean.startsWith(ru)) return clean.replace(ru,en);
  return text;
}
genreGroups.forEach(group=>group.items.forEach(([ru,en])=>{interfaceEnglish[ru]=en;}));
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
function translateInterface() {
  const walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest("script,style,textarea,[data-user-content]")) continue;
    const current = node.nodeValue;
    let entry = originalText.get(node);
    if (!entry || current !== entry.last) entry = {original:current,last:current};
    const next = settings.language === "en" ? englishText(entry.original) : entry.original;
    if (next !== current) node.nodeValue = next;
    entry.last = next; originalText.set(node,entry);
  }
  document.querySelectorAll("[placeholder],[aria-label]").forEach(element => {
    const cache = originalAttributes.get(element) || {};
    for (const attr of ["placeholder","aria-label"]) {
      if (!element.hasAttribute(attr)) continue;
      const value = element.getAttribute(attr);
      if (!cache[attr] || value !== cache[attr].last) cache[attr] = {original:value,last:value};
      const next = settings.language === "en" ? englishText(cache[attr].original) : cache[attr].original;
      if (next !== value) element.setAttribute(attr,next);
      cache[attr].last = next;
    }
    originalAttributes.set(element,cache);
  });
}
const translationObserver = new MutationObserver(translateInterface);
translationObserver.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["placeholder","aria-label"]});

seedDemoIncoming();
// Однократный повтор показа индикатора после изменения его размера.
if (!read("unread-dot-preview-v2",false)) {
  const next={...state.messages,2:[...(state.messages[2]||[]),{
    text:"Демо: новое сообщение для проверки индикатора.",
    direction:"incoming",read:false,demo:true,createdAt:Date.now(),
    time:new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})
  }]};
  try {
    localStorage.setItem("kadr-html-messages",JSON.stringify(next));
    localStorage.setItem("kadr-html-unread-dot-preview-v2","true");
    state.messages=next;
  } catch {}
}
applySettings();

state.tab = location.hash.startsWith('#user/') ? 'user' : routes.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
render();
loadPortfolio();
