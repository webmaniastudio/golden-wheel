// js/auth.js (phone-first OTP single-button + timer/resend + email + Google)
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const LS_AUTH='gw_auth', LS_USER='gw_user';

  let loginOtpStep='send', registerOtpStep='send';
  let tempPhoneAuth=null;
  let lpTimerId=null, rpTimerId=null, lpLeft=0, rpLeft=0;

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function init(){
    // اگر قبلاً لاگین شده
    try{ const a=JSON.parse(localStorage.getItem(LS_AUTH)||'null'); const u=JSON.parse(localStorage.getItem(LS_USER)||'null'); if(a&&a.token&&u&&u.id){ location.href='dashboard.html'; return; } }catch{}

    $$('.auth-tab').forEach(t=>t.addEventListener('click',()=>switchTab(t.dataset.tab)));
    switchTab('login');

    // سوییچ روش‌ها
    $('#toLoginEmail')?.addEventListener('click',()=>switchMethod('login','email'));
    $('#toLoginPhone')?.addEventListener('click',()=>switchMethod('login','phone'));
    $('#toRegEmail')?.addEventListener('click',()=>switchMethod('register','email'));
    $('#toRegPhone')?.addEventListener('click',()=>switchMethod('register','phone'));

    // ورود موبایل (یک دکمه)
    $('#loginPhoneForm')?.addEventListener('submit', onLoginPhoneAction);
    $('#lpResend')?.addEventListener('click', ()=> resendOtp('login'));

    // ایمیل ورود
    $('#loginEmailForm')?.addEventListener('submit', loginEmail);

    // ثبت‌نام موبایل
    $('#regPhoneForm')?.addEventListener('submit', onRegisterPhoneAction);
    $('#rpResend')?.addEventListener('click', ()=> resendOtp('register'));
    $('#regProfileForm')?.addEventListener('submit', regProfileFinish);

    // ثبت‌نام ایمیل
    $('#regEmailForm')?.addEventListener('submit', registerEmail);

    // گوگل
    window.handleGoogleCredential = googleCallback;
  }

  function switchTab(name){
    $$('.auth-tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===name));
    $$('.auth-pane').forEach(p=>p.classList.toggle('active', p.id==='pane-'+name));
    if(name==='login'){ resetLoginPhoneUI(); show('#loginPhoneBlock'); hide('#loginEmailBlock'); }
    if(name==='register'){ resetRegisterPhoneUI(); show('#regPhoneBlock'); hide('#regEmailBlock'); }
  }

  function switchMethod(tab, method){
    if(tab==='login'){
      if(method==='email'){ stopTimer('login'); hide('#loginPhoneBlock'); show('#loginEmailBlock'); }
      else { resetLoginPhoneUI(); show('#loginPhoneBlock'); hide('#loginEmailBlock'); }
    }else{
      if(method==='email'){ stopTimer('register'); hide('#regPhoneBlock'); show('#regEmailBlock'); }
      else { resetRegisterPhoneUI(); show('#regPhoneBlock'); hide('#regEmailBlock'); }
    }
  }

  // ورود موبایل
  async function onLoginPhoneAction(e){
    e.preventDefault();
    const phone = $('#lpPhone').value.trim();
    if(!validPhone(phone)) return notify('شماره موبایل معتبر نیست','error');

    if(loginOtpStep==='send'){
      try{
        loading('#lpActionBtn', true);
        await API.auth.otpSend(phone);
        show('#lpCodeWrap');
        $('#lpActionText').textContent='تایید و ورود';
        $('#lpActionBtn i').className='fas fa-check';
        loginOtpStep='verify';
        startTimer('login');
        notify('کد ارسال شد (دمو: 123456)','success');
      }catch(err){ notify(err.message||'خطا در ارسال کد','error'); }
      finally{ loading('#lpActionBtn', false); }
    }else{
      const code = $('#lpCode').value.trim();
      if(!code) return notify('کد تایید را وارد کنید','error');
      try{
        loading('#lpActionBtn', true);
        const res = await API.auth.otpVerify(phone, code);
        persistAuth(res); notify('خوش آمدید!','success');
        setTimeout(()=>location.href='dashboard.html',300);
      }catch(err){ notify(err.message||'کد نادرست','error'); }
      finally{ loading('#lpActionBtn', false); }
    }
  }

  // ثبت‌نام موبایل
  async function onRegisterPhoneAction(e){
    e.preventDefault();
    const phone = $('#rpPhone').value.trim();
    if(!validPhone(phone)) return notify('شماره موبایل معتبر نیست','error');

    if(registerOtpStep==='send'){
      try{
        loading('#rpActionBtn', true);
        await API.auth.otpSend(phone);
        show('#rpCodeWrap');
        $('#rpActionText').textContent='تایید کد';
        $('#rpActionBtn i').className='fas fa-check';
        registerOtpStep='verify';
        startTimer('register');
        notify('کد ارسال شد (دمو: 123456)','success');
      }catch(err){ notify(err.message||'خطا در ارسال کد','error'); }
      finally{ loading('#rpActionBtn', false); }
    }else{
      const code = $('#rpCode').value.trim();
      if(!code) return notify('کد تایید را وارد کنید','error');
      try{
        loading('#rpActionBtn', true);
        const res = await API.auth.otpVerify(phone, code);
        tempPhoneAuth = res;
        hide('#regPhoneForm'); show('#regProfileForm');
        stopTimer('register');
        notify('تایید شد؛ نام (و در صورت تمایل ایمیل) را وارد کنید','success');
      }catch(err){ notify(err.message||'کد نادرست','error'); }
      finally{ loading('#rpActionBtn', false); }
    }
  }

  function regProfileFinish(e){
    e.preventDefault();
    if(!tempPhoneAuth?.user) return notify('ابتدا شماره را تایید کنید','error');
    const name = $('#rpName').value.trim();
    const email= ($('#rpEmail').value||'').trim().toLowerCase();
    if(!name) return notify('نام الزامی است','error');
    tempPhoneAuth.user.name=name;
    tempPhoneAuth.user.email=email||tempPhoneAuth.user.email||'';
    persistAuth(tempPhoneAuth);
    tempPhoneAuth=null;
    notify('حساب شما ساخته شد','success');
    setTimeout(()=>location.href='dashboard.html',400);
  }

  // ورود ایمیل
  async function loginEmail(e){
    e.preventDefault();
    const email=$('#leEmail').value.trim().toLowerCase();
    const pass =$('#lePass').value.trim();
    if(!email||!pass) return notify('ایمیل و رمز را وارد کنید','error');
    try{
      loading('#loginEmailForm button[type="submit"]', true);
      const res=await API.auth.emailLogin(email,pass);
      persistAuth(res); notify('ورود موفق','success');
      setTimeout(()=>location.href='dashboard.html',300);
    }catch(err){ notify(err.message||'ورود ناموفق','error'); }
    finally{ loading('#loginEmailForm button[type="submit"]', false); }
  }

  // ثبت‌نام ایمیل
  async function registerEmail(e){
    e.preventDefault();
    const name=$('#reName').value.trim();
    const phone=$('#rePhone').value.trim();
    const email=$('#reEmail').value.trim().toLowerCase();
    const p1=$('#rePass1').value.trim(), p2=$('#rePass2').value.trim();
    if(!name||!phone||!email||!p1||!p2) return notify('همه فیلدها را تکمیل کنید','error');
    if(!validPhone(phone)) return notify('شماره موبایل معتبر نیست','error');
    if(p1.length<6) return notify('رمز حداقل ۶ کاراکتر','error');
    if(p1!==p2) return notify('تطابق رمز صحیح نیست','error');
    try{
      loading('#regEmailForm button[type="submit"]', true);
      const res=await API.auth.emailRegister({name,phone,email,password:p1});
      persistAuth(res); notify('ثبت‌نام موفق','success');
      setTimeout(()=>location.href='dashboard.html',400);
    }catch(err){ notify(err.message||'خطا در ثبت‌نام','error'); }
    finally{ loading('#regEmailForm button[type="submit"]', false); }
  }

  // Google
  async function googleCallback(response){
    try{
      const res=await API.auth.googleLogin(response.credential);
      persistAuth(res); notify('ورود با گوگل موفق بود','success');
      setTimeout(()=>location.href='dashboard.html',300);
    }catch{ notify('ورود با گوگل ناموفق','error'); }
  }

  // Timer
  function startTimer(which){
    const secs=60;
    if(which==='login'){
      lpLeft=secs; show('#lpTimer'); hide('#lpResend'); updateTimerText('login');
      lpTimerId && clearInterval(lpTimerId);
      lpTimerId=setInterval(()=>tick('login'),1000);
    }else{
      rpLeft=secs; show('#rpTimer'); hide('#rpResend'); updateTimerText('register');
      rpTimerId && clearInterval(rpTimerId);
      rpTimerId=setInterval(()=>tick('register'),1000);
    }
  }
  function stopTimer(which){
    if(which==='login'){ lpTimerId && clearInterval(lpTimerId); lpTimerId=null; hide('#lpTimer'); show('#lpResend'); }
    else { rpTimerId && clearInterval(rpTimerId); rpTimerId=null; hide('#rpTimer'); show('#rpResend'); }
  }
  function tick(which){
    if(which==='login'){
      lpLeft--; updateTimerText('login');
      if(lpLeft<=0){ clearInterval(lpTimerId); lpTimerId=null; hide('#lpTimer'); show('#lpResend'); }
    }else{
      rpLeft--; updateTimerText('register');
      if(rpLeft<=0){ clearInterval(rpTimerId); rpTimerId=null; hide('#rpTimer'); show('#rpResend'); }
    }
  }
  function updateTimerText(which){
    if(which==='login'){ const el=$('#lpTimer b'); el && (el.textContent=String(lpLeft)); }
    else { const el=$('#rpTimer b'); el && (el.textContent=String(rpLeft)); }
  }
  async function resendOtp(which){
    try{
      if(which==='login'){
        const phone=$('#lpPhone').value.trim(); if(!validPhone(phone)) return;
        await API.auth.otpSend(phone); startTimer('login'); notify('کد مجدداً ارسال شد','success');
      }else{
        const phone=$('#rpPhone').value.trim(); if(!validPhone(phone)) return;
        await API.auth.otpSend(phone); startTimer('register'); notify('کد مجدداً ارسال شد','success');
      }
    }catch{ notify('خطا در ارسال مجدد','error'); }
  }

  // Helpers
  function persistAuth(res){
    try{
      localStorage.setItem(LS_AUTH, JSON.stringify({ token: res.token, userId: res.user?.id, ts: Date.now() }));
      localStorage.setItem(LS_USER, JSON.stringify(res.user || {}));
      window.dispatchEvent(new CustomEvent('auth:login', { detail:{ user:res.user }}));
    }catch{}
  }
  function show(s){ const el=$(s); if(el){ el.hidden=false; } }
  function hide(s){ const el=$(s); if(el){ el.hidden=true; } }
  function loading(s,on){ const b=$(s); if(b){ b.disabled=on; b.style.opacity= on?.6:1; } }
  function notify(m,t='info'){ window.showNotification? showNotification(m,t): alert(m); }
  function validPhone(p){ const v=(p||'').replace(/[^\d]/g,''); return /^0?\d{10,11}$/.test(v); }
})();