// js/checkout.js
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function init(){
    const cart = API.cart.get();
    if (!cart.length){ $('#coEmpty').hidden = false; return; }
    $('#coEmpty').hidden = true;
    renderItems(cart);
    updateTotals();

    $('#coForm')?.addEventListener('submit', completeOrder);
    $$('input[name="ship"]').forEach(r=> r.addEventListener('change', updateTotals));
  }

  function renderItems(cart){
    const wrap = $('#coItems'); wrap.innerHTML = '';
    const frag = document.createDocumentFragment();
    cart.forEach(it=>{
      const row = document.createElement('div');
      row.className = 'co-item';
      row.innerHTML = `
        <img src="${it.image}" alt="">
        <div style="flex:1">
          <div class="title">${escapeHTML(it.title)}</div>
          <div style="color:var(--text-tertiary);font-size:12px">${variantText(it.variant)} | ${toFa(it.qty||1)}×</div>
        </div>
        <b style="color:var(--gold)">${formatPrice(it.price||0)}</b>
      `;
      frag.appendChild(row);
    });
    wrap.appendChild(frag);
  }

  function updateTotals(){
    const cart = API.cart.get();
    const subtotal = cart.reduce((s,it)=> s + (it.price||0)*(it.qty||1), 0);
    const ship = getShipPrice();
    const coupon = Number(localStorage.getItem('gw_coupon_off')||0);
    const total = Math.max(0, subtotal + ship - coupon);
    $('#coSubtotal').textContent = formatPrice(subtotal);
    $('#coShip').textContent = formatPrice(ship);
    $('#coTotal').textContent = formatPrice(total);
  }
  function getShipPrice(){
    const v = (document.querySelector('input[name="ship"]:checked')||{}).value || 'normal';
    if (v==='fast') return 45000;
    if (v==='courier') return 65000;
    return 0;
  }

  async function completeOrder(e){
    e.preventDefault();
    // اعتبارسنجی مختصر
    const name = $('#coName').value.trim();
    const phone = $('#coPhone').value.trim();
    const address = $('#coAddress').value.trim();
    const city = $('#coCity').value.trim();
    if (!name || !phone || !address || !city) return notify('اطلاعات را کامل کنید','error');

    const cart = API.cart.get();
    const payload = {
      items: cart,
      shipping: {
        method: (document.querySelector('input[name="ship"]:checked')||{}).value,
        price: getShipPrice()
      },
      summary: {
        subtotal: cart.reduce((s,it)=> s + (it.price||0)*(it.qty||1), 0),
        discount: Number(localStorage.getItem('gw_coupon_off')||0)
      },
      customer: { name, phone, address, city, zip: $('#coZip').value.trim() }
    };

    try{
      const res = await API.order.create(payload);
      API.cart.clear(); localStorage.removeItem('gw_coupon_off');
      notify('سفارش ثبت شد ✅','success');
      setTimeout(()=> location.href='dashboard.html#orders', 600);
    }catch(err){
      notify('خطا در ثبت سفارش','error');
    }
  }

  function notify(msg,type='info'){ if(window.showNotification) showNotification(msg,type); else alert(msg); }
  function escapeHTML(s=''){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;' }[m])); }
  function toFa(n){ const map='۰۱۲۳۴۵۶۷۸۹'; return String(n).replace(/\d/g,d=>map[d]); }
  function formatPrice(n){ return toFa((n||0).toLocaleString()) + ' تومان'; }
  function variantText(v){ if(!v) return ''; const arr=[]; if(v.size) arr.push('سایز: '+v.size); if(v.color) arr.push('رنگ: '+v.color); if(v.course) arr.push('دوره'); return arr.join(' | '); }
})();