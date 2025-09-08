// js/cart.js
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function init(){
    render();
    $('#applyCoupon')?.addEventListener('click', applyCoupon);
  }

  function render(){
    const list = $('#cartList');
    const empty = $('#emptyCart');
    const cart = API.cart.get();
    if (!cart.length){
      list.innerHTML = '';
      empty.hidden = false;
      updateSummary(cart);
      return;
    }
    empty.hidden = true;
    const frag = document.createDocumentFragment();
    cart.forEach((it, idx) => frag.appendChild(itemView(it, idx)));
    list.innerHTML = ''; list.appendChild(frag);
    updateSummary(cart);
  }

  function itemView(it, idx){
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${it.image}" alt="">
      <div>
        <div class="cart-title">${escapeHTML(it.title)}</div>
        <div class="cart-meta">${variantText(it.variant)}</div>
        <div class="cart-qty">
          <button data-act="dec">-</button>
          <b>${toFa(it.qty||1)}</b>
          <button data-act="inc">+</button>
        </div>
      </div>
      <div>
        <div class="cart-price">${formatPrice(it.price||0)}</div>
        <button class="cart-remove" title="حذف"><i class="fas fa-trash"></i></button>
      </div>
    `;
    el.querySelector('[data-act="inc"]').addEventListener('click', ()=> changeQty(idx, +1));
    el.querySelector('[data-act="dec"]').addEventListener('click', ()=> changeQty(idx, -1));
    el.querySelector('.cart-remove').addEventListener('click', ()=> removeItem(idx));
    return el;
  }

  function changeQty(idx, d){
    const cart = API.cart.get();
    const it = cart[idx]; if (!it) return;
    it.qty = Math.max(1, (it.qty||1) + d);
    API.cart.save(cart); render();
  }
  function removeItem(idx){
    const cart = API.cart.get();
    cart.splice(idx, 1);
    API.cart.save(cart); render();
  }

  function updateSummary(cart){
    const count = cart.reduce((s,it)=> s + (it.qty||1), 0);
    const subtotal = cart.reduce((s,it)=> s + (it.price||0) * (it.qty||1), 0);
    const discount = Number(localStorage.getItem('gw_coupon_off')||0);
    const total = Math.max(0, subtotal - discount);

    $('#sumCount').textContent = toFa(count);
    $('#sumSubtotal').textContent = formatPrice(subtotal);
    $('#sumDiscount').textContent = formatPrice(discount);
    $('#sumTotal').textContent = formatPrice(total);
  }

  function applyCoupon(){
    const code = ($('#couponInput').value||'').trim().toUpperCase();
    // Demo: GW10 => 10% ، GW200 => 200,000
    const cart = API.cart.get();
    const subtotal = cart.reduce((s,it)=> s + (it.price||0) * (it.qty||1), 0);
    let off = 0;
    if (code === 'GW10') off = Math.floor(subtotal * 0.10);
    else if (code === 'GW200') off = 200000;
    else return notify('کد معتبر نیست','error');
    localStorage.setItem('gw_coupon_off', String(off));
    notify('کد اعمال شد','success');
    updateSummary(cart);
  }

  function notify(msg,type='info'){ if(window.showNotification) showNotification(msg,type); else alert(msg); }
  function escapeHTML(s=''){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#039;' }[m])); }
  function toFa(n){ const map='۰۱۲۳۴۵۶۷۸۹'; return String(n).replace(/\d/g,d=>map[d]); }
  function formatPrice(n){ return toFa((n||0).toLocaleString()) + ' تومان'; }
  function variantText(v){ if(!v) return ''; const arr=[]; if(v.size) arr.push('سایز: '+v.size); if(v.color) arr.push('رنگ: '+v.color); if(v.course) arr.push('دوره'); return arr.join(' | '); }
})();