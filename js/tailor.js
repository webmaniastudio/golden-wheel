// js/tailor.js
(() => {
  'use strict';
  const $ = s => document.querySelector(s);

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();

  function init(){
    $('#next1')?.addEventListener('click', ()=> go(1,2));
    $('#prev2')?.addEventListener('click', ()=> go(2,1));
    $('#next2')?.addEventListener('click', ()=> go(2,3));
    $('#prev3')?.addEventListener('click', ()=> go(3,2));
    $('#tailorForm')?.addEventListener('submit', submit);
  }

  function go(a,b){
    document.querySelector(`.step[data-step="${a}"]`)?.classList.remove('active');
    document.querySelector(`.step[data-step="${b}"]`)?.classList.add('active');
  }

  async function submit(e){
    e.preventDefault();
    const payload = {
      name: $('#tName').value.trim(),
      phone: $('#tPhone').value.trim(),
      email: $('#tEmail').value.trim(),
      type: $('#tType').value,
      size: $('#tSize').value,
      fabric: $('#tFabric').value.trim(),
      desc: $('#tDesc').value.trim(),
      measures: {
        height: Number($('#tHeight').value)||null,
        weight: Number($('#tWeight').value)||null,
        bust: Number($('#tBust').value)||null,
        waist: Number($('#tWaist').value)||null
      }
    };
    if (!payload.name || !payload.phone) return notify('نام و موبایل الزامی است','error');
    try{
      await API.custom.submit(payload);
      notify('درخواست شما ثبت شد. به زودی تماس می‌گیریم 💛','success');
      e.target.reset();
      go(3,1);
    }catch{
      notify('خطا در ثبت درخواست','error');
    }
  }

  function notify(msg,type='info'){ if(window.showNotification) showNotification(msg,type); else alert(msg); }
})();