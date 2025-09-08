// js/dashboard.js
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const T_AUTH='gw_auth', T_USER='gw_user', T_ORDERS='gw_orders', T_CART='gw_cart';

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function init(){
    if (!isLogged()){ location.href='auth.html'; return; }

    const u = getUser();
    // هدر
    $('#uName').textContent = u.name || 'کاربر';
    $('#uEmail').textContent = u.email || '';
    $('#uAvatar').textContent = (u.name||'')[0] || 'ک';

    // فرم پروفایل
    $('#pName').value = u.name || '';
    $('#pEmail').value = u.email || '';
    $('#pPhone').value = u.phone || '';
    $('#pAvatar').value = u.avatar || '';

    $('#profileForm')?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const nu = {
        id: u.id,
        name: $('#pName').value.trim(),
        email: $('#pEmail').value.trim().toLowerCase(),
        phone: $('#pPhone').value.trim(),
        avatar: $('#pAvatar').value.trim()
      };
      save(T_USER, nu);
      if (window.showNotification) showNotification('پروفایل ذخیره شد','success');
      // بروزرسانی نمایش
      $('#uName').textContent = nu.name || 'کاربر';
      $('#uEmail').textContent = nu.email || '';
      $('#uAvatar').textContent = (nu.name||'')[0] || 'ک';
      window.dispatchEvent(new CustomEvent('auth:login', { detail: { user:nu } }));
    });

    // خروج
    $('#logoutBtn')?.addEventListener('click', ()=>{
      try{ localStorage.removeItem(T_AUTH); localStorage.removeItem(T_USER); }catch{}
      window.dispatchEvent(new CustomEvent('auth:logout'));
      showNotification?.('با موفقیت خارج شدید', 'success');
      setTimeout(()=> location.href='index.html', 300);
    });

    // داده‌ها
    renderOrders();
    renderCourses();
  }

  function renderOrders(){
    const orders = load(T_ORDERS, []);
    $('#ordersCount').textContent = toFa(orders.length);
    if (!orders.length){
      $('#ordersList').innerHTML = '';
      $('#noOrders').hidden = false;
      return;
    }
    $('#noOrders').hidden = true;
    const frag = document.createDocumentFragment();
    orders.forEach(o=>{
      const box = document.createElement('div');
      box.className = 'order-item';
      box.innerHTML = `
        <div class="order-head">
          <div>کد سفارش: <b>${o.id}</b></div>
          <div>${formatDate(o.ts)} | <span>${o.status||'پرداخت شده'}</span></div>
        </div>
        <div class="order-items" id="oi-${o.id}"></div>
        <div class="order-total">مبلغ: ${formatPrice(o.total||0)}</div>
      `;
      const wrap = box.querySelector(`#oi-${o.id}`);
      (o.items||[]).forEach(it=>{
        const row = document.createElement('div');
        row.className = 'order-row';
        row.innerHTML = `
          <img src="${it.image}" alt="">
          <div style="flex:1">
            <div class="title">${escapeHTML(it.title)}</div>
            <div class="meta">${it.variant?.size?`سایز: ${it.variant.size} `:''}${it.variant?.color?` | رنگ: ${it.variant.color}`:''}</div>
          </div>
          <div style="text-align:left"><b>${toFa(it.qty||1)}×</b><div class="meta">${formatPrice(it.price||0)}</div></div>
        `;
        wrap.appendChild(row);
      });
      frag.appendChild(box);
    });
    $('#ordersList').innerHTML = '';
    $('#ordersList').appendChild(frag);
  }

  function renderCourses(){
    const orders = load(T_ORDERS, []);
    // همه آیتم‌هایی که variant.course === true یا عنوان شامل "دوره" است
    const courses = [];
    orders.forEach(o=>{
      (o.items||[]).forEach(it=>{
        if (it.variant?.course || /دوره|Course/i.test(it.title)) courses.push(it);
      });
    });

    $('#coursesCount').textContent = toFa(courses.length);
    if (!courses.length){
      $('#coursesList').innerHTML = '';
      $('#noCourses').hidden = false;
      return;
    }
    $('#noCourses').hidden = true;
    const frag = document.createDocumentFragment();
    courses.forEach(c=>{
      const row = document.createElement('div');
      row.className = 'course-item';
      row.innerHTML = `
        <img src="${c.image}" alt="">
        <div style="flex:1">
          <h4 class="title">${escapeHTML(c.title)}</h4>
          <div class="meta" style="color:var(--text-tertiary);font-size:12px">${formatPrice(c.price||0)}</div>
        </div>
        <div class="action"><a href="academy.html" title="مشاهده جزئیات">رفتن به آکادمی</a></div>
      `;
      frag.appendChild(row);
    });
    $('#coursesList').innerHTML = '';
    $('#coursesList').appendChild(frag);
  }

  // Helpers
  function isLogged(){
    try{ const a=JSON.parse(localStorage.getItem(T_AUTH)||'null'); const u=JSON.parse(localStorage.getItem(T_USER)||'null'); return !!(a&&a.token&&u&&u.id); }catch{ return false; }
  }
  function getUser(){ try{ return JSON.parse(localStorage.getItem(T_USER)||'null'); }catch{ return null; } }
  function load(k, def){ try{ return JSON.parse(localStorage.getItem(k) || JSON.stringify(def)); }catch{ return def; } }
  function save(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
  function escapeHTML(s=''){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m])); }
  function toFa(n){ const map='۰۱۲۳۴۵۶۷۸۹'; return String(n).replace(/\d/g,d=>map[d]); }
  function formatPrice(n){ return toFa((n||0).toLocaleString()) + ' تومان'; }
  function formatDate(ts){ try{ return new Date(ts||Date.now()).toLocaleDateString('fa-IR'); }catch{ return ''; } }

})();