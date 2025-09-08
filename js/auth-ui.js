// js/auth-ui.js
(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const T_AUTH = 'gw_auth';
  const T_USER = 'gw_user';

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function init(){
    renderHeaderAuth();
    renderMobileAuth();
    injectUserMenuStyles();

    // رویدادهای سراسری
    window.addEventListener('auth:login', ()=> { renderHeaderAuth(); renderMobileAuth(); });
    window.addEventListener('auth:logout', ()=> { renderHeaderAuth(); renderMobileAuth(); });

    // کلیک خارج برای بستن منو
    document.addEventListener('click', (e)=>{
      const menu = $('.user-menu');
      if (menu && !menu.contains(e.target)) menu.classList.remove('open');
    });
  }

  function isLogged(){
    try{
      const a = JSON.parse(localStorage.getItem(T_AUTH)||'null');
      const u = JSON.parse(localStorage.getItem(T_USER)||'null');
      return !!(a && a.token && u && u.id);
    }catch{ return false; }
  }
  function getUser(){
    try{ return JSON.parse(localStorage.getItem(T_USER)||'null'); }catch{ return null; }
  }

  function renderHeaderAuth(){
    const actions = document.querySelector('.nav-actions');
    if (!actions) return;
    actions.innerHTML = ''; // پاکسازی

    if (!isLogged()){
      const a = document.createElement('a');
      a.href='auth.html'; a.className='auth-btn';
      a.innerHTML = `<i class="fas fa-user"></i><b class="auth-label" style="font-weight:600;">ورود / ثبت‌نام</b>`;
      actions.appendChild(a);
      return;
    }

    const u = getUser();
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    const initial = (u?.name||'کاربر').trim().charAt(0) || 'ک';

    menu.innerHTML = `
      <button class="user-btn" id="userBtn">
        <span class="u-initial">${initial}</span>
        <span class="u-name" style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u?.name||'کاربر'}</span>
        <i class="fas fa-chevron-down" style="font-size:12px"></i>
      </button>
      <div class="user-dropdown" id="userDropdown">
        <a href="dashboard.html"><i class="fas fa-gauge"></i> داشبورد</a>
        <a href="dashboard.html#orders"><i class="fas fa-receipt"></i> سفارش‌ها</a>
        <a href="dashboard.html#courses"><i class="fas fa-graduation-cap"></i> دوره‌های من</a>
        <button id="logoutBtn"><i class="fas fa-sign-out-alt"></i> خروج</button>
      </div>
    `;
    actions.appendChild(menu);

    $('#userBtn', menu)?.addEventListener('click', (e)=> {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    $('#logoutBtn', menu)?.addEventListener('click', doLogout);
  }

  function renderMobileAuth(){
    const list = document.querySelector('.mobile-nav');
    if (!list) return;

    // حذف آیتم‌های قدیمی "ورود/ثبت‌نام" و "داشبورد" تکراری
    $$('.mobile-nav li').forEach(li=>{
      const a = $('a', li);
      if (!a) return;
      const txt = a.textContent || '';
      if (txt.includes('ورود') || txt.includes('ثبت‌نام') || txt.includes('داشبورد')) li.remove();
    });

    const li = document.createElement('li');
    if (!isLogged()){
      li.innerHTML = `<a href="auth.html"><i class="fas fa-user-lock"></i> ورود / ثبت‌نام</a>`;
    } else {
      li.innerHTML = `<a href="dashboard.html"><i class="fas fa-user"></i> داشبورد</a>`;
      const lo = document.createElement('li');
      lo.innerHTML = `<a href="#" id="mLogout"><i class="fas fa-sign-out-alt"></i> خروج</a>`;
      list.appendChild(lo);
      $('#mLogout')?.addEventListener('click', (e)=>{ e.preventDefault(); doLogout(); });
    }
    list.appendChild(li);
  }

  function doLogout(){
    try{ localStorage.removeItem(T_AUTH); localStorage.removeItem(T_USER); }catch{}
    window.dispatchEvent(new CustomEvent('auth:logout'));
    if (window.showNotification) showNotification('با موفقیت خارج شدید','success');
    setTimeout(()=> location.href='index.html', 300);
  }

  function injectUserMenuStyles(){
    const css = document.createElement('style');
    css.textContent = `
      .user-menu{ position:relative; }
      .user-btn{ display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:20px; border:1px solid var(--gold); background:transparent; color:var(--gold); cursor:pointer; }
      .user-btn .u-initial{ width:24px;height:24px;border-radius:50%;background:var(--gold);color:var(--black);display:flex;align-items:center;justify-content:center;font-weight:800; }
      .user-dropdown{ position:absolute; top:110%; left:0; min-width:180px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:8px; display:none; z-index:10; }
      .user-menu.open .user-dropdown{ display:block; }
      .user-dropdown a, .user-dropdown button{ width:100%; text-align:right; padding:8px 10px; border:none; background:transparent; color:var(--text-primary); border-radius:8px; cursor:pointer; display:block; }
      .user-dropdown a:hover, .user-dropdown button:hover{ background:rgba(212,175,55,.1); color:var(--gold); }
    `;
    document.head.appendChild(css);
  }
})();