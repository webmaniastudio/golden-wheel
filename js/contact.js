// js/contact.js
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();

  function init(){
    $('#contactForm')?.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const payload = {
        name: $('#cName').value.trim(),
        email: $('#cEmail').value.trim(),
        phone: $('#cPhone').value.trim(),
        subject: $('#cSubject').value.trim(),
        message: $('#cMessage').value.trim()
      };
      if (!payload.name || !payload.phone || !payload.subject || !payload.message)
        return notify('فیلدهای ضروری را تکمیل کنید','error');
      try{
        await API.contact.send(payload);
        notify('پیام شما ارسال شد. ممنونیم 💛','success');
        e.target.reset();
      }catch{
        notify('خطا در ارسال پیام','error');
      }
    });
  }

  function notify(msg,type='info'){ if(window.showNotification) showNotification(msg,type); else alert(msg); }
})();