// js/api.js
(() => {
  'use strict';
  const API_BASE = window.ENV?.API_BASE || ''; // مثلا 'https://api.yourdomain.com'
  const USE_LOCAL = !API_BASE; // اگر API_BASE ست نشد، از حالت local استفاده کن

  async function post(url, data){
    const res = await fetch(API_BASE + url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error('API error');
    return res.json();
  }

  function saveLS(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
  function loadLS(k, def){ try{ return JSON.parse(localStorage.getItem(k) || JSON.stringify(def)); }catch{ return def; } }

  window.API = {
    auth: {
      // Google Sign-in: backend باید idToken را verify کند و user برگرداند
      async googleLogin(idToken){
        if (!USE_LOCAL) return post('/auth/google', { idToken });
        // local mock: decode quick (صرفا دمو)
        const payload = JSON.parse(atob(idToken.split('.')[1] || 'e30=') || '{}');
        const user = {
          id: 'u_' + Date.now(),
          name: payload.name || 'کاربر گوگل',
          email: payload.email || 'user@gmail.com',
          phone: '',
          avatar: payload.picture || ''
        };
        return { token: 'local-google-'+Date.now(), user };
      },
      // OTP: backend باید sms بفرستد
      async otpSend(phone){
        if (!USE_LOCAL) return post('/auth/otp/send', { phone });
        // local mock
        const code = '123456';
        saveLS('otp:'+phone, { code, ts: Date.now() });
        return { ok: true };
      },
      async otpVerify(phone, code){
        if (!USE_LOCAL) return post('/auth/otp/verify', { phone, code });
        const rec = loadLS('otp:'+phone, null);
        if (!rec || rec.code !== code) throw new Error('کد تایید نادرست است');
        const user = {
          id: 'u_'+phone,
          name: 'کاربر '+phone.slice(-4),
          email: '',
          phone,
          avatar: ''
        };
        return { token: 'local-otp-'+Date.now(), user };
      },
      async emailLogin(email, password){
        if (!USE_LOCAL) return post('/auth/login', { email, password });
        // local mock: ساده
        let users = loadLS('gw_users', []);
        const u = users.find(x => x.email === email && x.password === password);
        if(!u) throw new Error('ایمیل یا رمز نادرست است');
        return { token: 'local-email-'+Date.now(), user: u };
      },
      async emailRegister({name, phone, email, password}){
        if (!USE_LOCAL) return post('/auth/register', { name, phone, email, password });
        let users = loadLS('gw_users', []);
        if(users.find(x => x.email === email)) throw new Error('این ایمیل قبلاً ثبت شده');
        const user = { id:'u_'+Date.now(), name, phone, email, password, avatar:'' };
        users.push(user); saveLS('gw_users', users);
        return { token: 'local-email-'+Date.now(), user };
      }
    },
    cart: {
      get(){ return loadLS('gw_cart', []); },
      save(cart){ saveLS('gw_cart', cart); },
      clear(){ localStorage.removeItem('gw_cart'); }
    },
    order: {
      async create(orderPayload){
        if (!USE_LOCAL) return post('/orders', orderPayload);
        // local mock: ذخیره سفارش
        const ORDERS = loadLS('gw_orders', []);
        const order = { id: 'ORD-'+Date.now(), ts: Date.now(), status: 'پرداخت شده', ...orderPayload };
        ORDERS.unshift(order);
        saveLS('gw_orders', ORDERS);
        return { ok: true, order };
      }
    },
    contact: {
      async send(message){
        if (!USE_LOCAL) return post('/contact', message);
        console.log('Contact (local):', message);
        return { ok: true };
      }
    },
    custom: {
      async submit(data){
        if (!USE_LOCAL) return post('/custom-order', data);
        const REQS = loadLS('gw_custom_requests', []);
        const req = { id:'CR-'+Date.now(), ts:Date.now(), ...data };
        REQS.unshift(req); saveLS('gw_custom_requests', REQS);
        return { ok: true, req };
      }
    }
  };
})();