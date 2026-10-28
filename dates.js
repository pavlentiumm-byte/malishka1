"use strict";
// Human-facing text dates are converted to ISO only at the form/storage boundary.
function parseFlexibleDate(value){
  const text=String(value||'').trim();if(!text)return '';
  let year,month,day,match;
  if((match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(text))){[,year,month,day]=match;}
  else if((match=/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/.exec(text))){[,day,month,year]=match;}
  else if((match=/^(\d{2})(\d{2})(\d{4})$/.exec(text))){[,day,month,year]=match;}
  else return null;
  const iso=`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
  if(Number(year)<1900||Number(year)>2100||isNaN(Date.parse(iso))||new Date(iso).toISOString().slice(0,10)!==iso)return null;
  return iso;
}
function displayDateInput(value){const iso=parseFlexibleDate(value);return iso?iso.slice(8,10)+'.'+iso.slice(5,7)+'.'+iso.slice(0,4):String(value||'');}
function dateInputError(input){
  const iso=parseFlexibleDate(input.value);
  if(iso===null)return tr('Введи существующую дату: ДД.ММ.ГГГГ, например 28.10.2026.','Enter a valid date: DD.MM.YYYY, for example 28.10.2026.');
  if(!iso)return input.required?tr('Укажи дату.','Enter a date.'):'';
  if(input.min&&iso<input.min)return tr('Дата должна быть не раньше ','Date must be on or after ')+displayDateInput(input.min)+'.';
  if(input.max&&iso>input.max)return tr('Дата должна быть не позже ','Date must be on or before ')+displayDateInput(input.max)+'.';
  return '';
}
function enhanceDateInputs(root=document){
  root.querySelectorAll('input[type="date"]:not([data-date-picker])').forEach(input=>{
    const value=input.value;input.type='text';input.dataset.dateEntry='true';input.inputMode='numeric';input.maxLength=10;input.placeholder=tr('ДД.ММ.ГГГГ','DD.MM.YYYY');input.autocomplete='off';input.value=displayDateInput(value);
    const wrapper=document.createElement('span');wrapper.className='date-entry';input.before(wrapper);wrapper.append(input);
    const icon=document.createElement('span');icon.className='date-picker-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML=interfaceIcon('calendar');wrapper.append(icon);
    const picker=document.createElement('input');picker.type='date';picker.dataset.datePicker='true';picker.className='date-calendar';picker.setAttribute('aria-label',tr('Выбрать дату в календаре','Choose date from calendar'));wrapper.append(picker);
    const sync=()=>{picker.value=parseFlexibleDate(input.value)||'';picker.min=input.min;picker.max=input.max;picker.disabled=input.disabled;};
    const validate=()=>{input.setCustomValidity(dateInputError(input));sync();};
    input.addEventListener('input',validate);input.addEventListener('change',validate);input.addEventListener('blur',()=>{if(!dateInputError(input))input.value=displayDateInput(input.value);});
    picker.addEventListener('focus',sync);picker.addEventListener('pointerdown',sync);
    picker.addEventListener('change',()=>{input.value=displayDateInput(picker.value);input.setCustomValidity('');input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));input.focus();});sync();
  });
  root.querySelectorAll('input[data-date-entry]').forEach(input=>{const picker=input.parentElement.querySelector('[data-date-picker]');if(picker&&picker.disabled!==input.disabled)picker.disabled=input.disabled;});
}
document.addEventListener('formdata',event=>{
  event.target.querySelectorAll('input[data-date-entry][name]:not(:disabled)').forEach(input=>{const iso=parseFlexibleDate(input.value);event.formData.set(input.name,iso===null?input.value.trim():iso);});
},true);
document.addEventListener('submit',event=>{
  const invalid=[...event.target.querySelectorAll('input[data-date-entry]:not(:disabled)')].find(input=>{input.setCustomValidity(dateInputError(input));return !input.checkValidity();});
  if(invalid){event.preventDefault();event.stopImmediatePropagation();invalid.reportValidity();invalid.focus();}
},true);
