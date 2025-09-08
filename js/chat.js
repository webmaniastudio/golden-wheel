// js/chat.js - Golden Wheel Support Chat (enhanced)
(() => {
  if (window.__GW_CHAT_INITED) return;
  window.__GW_CHAT_INITED = true;

  const STORAGE_KEY = 'gw_chat_msgs_v1';
  const UNREAD_KEY = 'gw_chat_unread_v1';
  const EMOJIS = '😀 😍 😊 😉 🤩 🤗 🙌 👍🙏 🎉 🥳 💎 ✨ 💬 💐 💖 🔥 💡 📞 🛍️ 🧵 ✂️'.split(' ');

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  let els, msgs = [], unread = 0;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    els = {
      toggle: $('#chatToggle'),
      box: $('#chatBox'),
      close: $('#chatClose'),
      input: $('#chatInput'),
      send: $('#chatSend'),
      msgs: $('#chatMessages'),
      quick: $$('.quick-reply'),
      badge: $('.chat-badge', $('#chatToggle')),
      attach: $('.chat-attach'),
      emoji: $('.chat-emoji'),
      onboard: $('#chatOnboard'),
      nameI: $('#obName'),
      phoneI: $('#obPhone'),
      startBtn: $('#obStart'),
    };
    if (!els.box || !els.msgs) return;

    // a11y + UX
    els.msgs.setAttribute('aria-live', 'polite');
    els.input?.setAttribute('dir', 'auto');
    els.phoneI?.setAttribute('dir','ltr');

    // آن‌بورد: بررسی ذخیره‌شده
    try {
      const n = localStorage.getItem('support_name');
      const p = localStorage.getItem('support_phone');
      if (n && p) enableChat();
    } catch {}

    // رویدادهای آن‌بورد
    els.startBtn?.addEventListener('click', () => {
      const n = (els.nameI?.value || '').trim();
      const p = (els.phoneI?.value || '').trim();
      if (!n) { els.nameI?.focus(); return; }
      if (!isValidPhone(p)) { els.phoneI?.focus(); els.phoneI?.select?.(); return; }
      try {
        localStorage.setItem('support_name', n);
        localStorage.setItem('support_phone', faToEn(p));
      } catch {}
      enableChat();
    });

    // state
    msgs = loadMsgs();
    unread = parseInt(localStorage.getItem(UNREAD_KEY) || '0', 10);
    renderHistory();
    updateBadge();

    // events
    els.toggle?.addEventListener('click', () => {
      els.box.classList.toggle('active');
      if (els.box.classList.contains('active')) {
        unread = 0; saveUnread(); updateBadge();
        setTimeout(() => {
          if (els.input?.disabled && (els.nameI || els.phoneI)) (els.nameI || els.phoneI).focus();
          else els.input?.focus();
        }, 200);
        window.playSound?.('open');
      }
    });
    els.close?.addEventListener('click', () => els.box.classList.remove('active'));

    els.send?.addEventListener('click', sendFromInput);
    els.input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendFromInput(); } });

    els.quick.forEach(b => b.addEventListener('click', () => {
      if (!els.input || els.input.disabled) return nudgeOnboard();
      els.input.value = b.textContent.trim();
      sendFromInput();
    }));

    setupEmoji();
    setupAttach();

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') els.box.classList.remove('active'); });
  }

  function enableChat() {
    els.input?.removeAttribute('disabled');
    els.send?.removeAttribute('disabled');
    if (els.onboard) els.onboard.style.display = 'none';
  }

  function nudgeOnboard() {
    els.box.classList.add('shake');
    setTimeout(() => els.box.classList.remove('shake'), 400);
    (els.nameI || els.phoneI)?.focus();
  }

  // Messages
  function loadMsgs() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
  function saveMsgs() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-100))); } catch {} }
  function saveUnread() { try { localStorage.setItem(UNREAD_KEY, String(unread)); } catch {} }

  function renderHistory() {
    if (!msgs.length && !els.msgs.children.length) {
      addMessage({ sender: 'bot', type: 'text', text: 'سلام! 👋\nچطور می‌تونم کمکتون کنم؟', ts: Date.now() }, false);
    } else {
      msgs.forEach(m => renderMessage(m));
      scrollToBottom();
    }
  }

  function renderMessage(m) {
    const wrap = document.createElement('div');
    wrap.className = `chat-message ${m.sender} animate-message`;

    const img = document.createElement('img');
    img.alt = m.sender;
    img.src = m.sender === 'bot' ? 'assets/images/bot-avatar.png' : 'assets/images/user-avatar.png';
    img.addEventListener('error', () => {
      img.src = m.sender === 'bot' ? 'https://i.pravatar.cc/80?img=64' : 'https://i.pravatar.cc/80?img=12';
    });

    const content = document.createElement('div');
    content.className = 'message-content msg-tail';
    content.setAttribute('dir', 'auto');

    if (m.type === 'image' && m.src) {
      const fig = document.createElement('figure');
      fig.className = 'msg-media';
      const im = new Image();
      im.src = m.src;
      fig.appendChild(im);
      content.appendChild(fig);
    } else if (m.type === 'file' && m.name) {
      const f = document.createElement('div');
      f.className = 'msg-file';
      f.innerHTML = `<i class="fas fa-paperclip"></i><span>${escapeHTML(m.name)}</span>`;
      content.appendChild(f);
    } else {
      const p = document.createElement('p');
      renderTextWithLinks(p, m.text || '');
      content.appendChild(p);
    }

    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = formatTime(m.ts);
    content.appendChild(time);

    wrap.appendChild(img);
    wrap.appendChild(content);
    els.msgs.appendChild(wrap);
  }

  function addMessage(m, persist = true) {
    renderMessage(m);
    if (persist !== false) { msgs.push(m); saveMsgs(); }
    if (m.sender === 'bot' && !els.box.classList.contains('active')) {
      unread++; saveUnread(); updateBadge();
    }
    scrollToBottom();
  }
  function scrollToBottom() { els.msgs.scrollTop = els.msgs.scrollHeight; }

  // Typing
  function showTyping() {
    if ($('.typing-indicator', els.msgs)) return;
    const t = document.createElement('div');
    t.className = 'chat-message bot typing-indicator';
    t.innerHTML = `
      <img src="assets/images/bot-avatar.png" alt="bot" onerror="this.src='https://i.pravatar.cc/80?img=64'">
      <div class="message-content typing-bubble"><span></span><span></span><span></span></div>
    `;
    els.msgs.appendChild(t);
    scrollToBottom();
  }
  function hideTyping() { $('.typing-indicator', els.msgs)?.remove(); }

  function updateBadge() {
    if (!els.badge) return;
    els.badge.textContent = unread > 9 ? '9+' : String(unread);
    els.badge.style.display = unread > 0 ? 'flex' : 'none';
  }

  // Send
  function sendFromInput() {
    if (!els.input || els.input.disabled) return nudgeOnboard();
    const text = (els.input.value || '').trim();
    if (!text) return;

    addMessage({ sender: 'user', type: 'text', text, ts: Date.now() });
    els.input.value = '';

    showTyping();
    setTimeout(() => {
      hideTyping();
      const reply = getAutoResponse(text);
      addMessage({ sender: 'bot', type: 'text', text: reply, ts: Date.now() });
      window.playSound?.('message');
    }, 900 + Math.random() * 600);
  }

  // Attachments
  function setupAttach() {
    if (!els.attach) return;
    let picker = null;
    els.attach.addEventListener('click', () => {
      if (!picker) {
        picker = document.createElement('input');
        picker.type = 'file';
        picker.accept = 'image/*,.pdf,.doc,.docx,.txt';
        picker.style.display = 'none';
        document.body.appendChild(picker);
        picker.addEventListener('change', onPickFile);
      }
      picker.value = ''; picker.click();
    });
    function onPickFile(e) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const isImg = f.type.startsWith('image/');
      if (isImg) {
        const reader = new FileReader();
        reader.onload = () => { addMessage({ sender: 'user', type: 'image', src: reader.result, ts: Date.now() }); simulateReply(); };
        reader.readAsDataURL(f);
      } else {
        addMessage({ sender: 'user', type: 'file', name: f.name, ts: Date.now() });
        simulateReply();
      }
      function simulateReply() {
        showTyping();
        setTimeout(() => {
          hideTyping();
          addMessage({ sender: 'bot', type: 'text', text: 'فایل دریافت شد ✅\nکارشناس ما بررسی می‌کند.', ts: Date.now() });
        }, 1000);
      }
    }
  }

  // Emoji
  function setupEmoji() {
    if (!els.emoji || !els.input) return;
    let panel = null, isOpen = false;
    els.emoji.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!panel) panel = buildPanel();
      panel.classList.toggle('open');
      isOpen = panel.classList.contains('open');
      positionPanel(panel);
    });
    document.addEventListener('click', () => { if (panel && isOpen) panel.classList.remove('open'); isOpen = false; });
    window.addEventListener('resize', () => panel && positionPanel(panel));

    function buildPanel() {
      const p = document.createElement('div');
      p.className = 'emoji-panel';
      EMOJIS.forEach(em => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'emoji-btn'; b.textContent = em;
        b.addEventListener('click', (ev) => { ev.stopPropagation(); insertAtCursor(els.input, em + ' '); els.input.focus(); });
        p.appendChild(b);
      });
      els.box.appendChild(p);
      return p;
    }
    function positionPanel(p) {
      const inputRect = els.input.getBoundingClientRect();
      const boxRect = els.box.getBoundingClientRect();
      const top = inputRect.top - boxRect.top - 10;
      const left = inputRect.left - boxRect.left + inputRect.width - 220;
      p.style.top = `${top - 180}px`;
      p.style.left = `${Math.max(10, left)}px`;
    }
  }

  // Helpers
  function insertAtCursor(input, text) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    const pos = start + text.length;
    input.setSelectionRange(pos, pos);
  }
  function renderTextWithLinks(container, text) {
    container.textContent = '';
    const parts = tokenize(text);
    parts.forEach(part => {
      if (part.type === 'url') {
        const a = document.createElement('a');
        a.href = part.href; a.textContent = part.display;
        a.target = '_blank'; a.rel = 'noopener nofollow'; a.className = 'msg-link';
        container.appendChild(a);
      } else if (part.type === 'tel') {
        const a = document.createElement('a');
        a.href = `tel:${faToEn(part.display).replace(/\D/g,'')}`;
        a.textContent = part.display; a.className = 'msg-link'; a.setAttribute('dir','ltr');
        container.appendChild(a);
      } else {
        container.appendChild(document.createTextNode(part.text));
      }
    });
  }
  function tokenize(text) {
    const tokens = [];
    const urlRe = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
    const telRe = /(?:\+?[\d۰-۹٠-٩][\d\s\-()۰-۹٠-٩]{7,}\d)/g;
    let i = 0, m;
    const pushPlain = (end) => { if (end > i) tokens.push({ type: 'text', text: text.slice(i, end) }); i = end; };
    const matches = [];
    while ((m = urlRe.exec(text))) matches.push({ type: 'url', start: m.index, end: m.index + m[0].length, val: m[0] });
    while ((m = telRe.exec(text))) matches.push({ type: 'tel', start: m.index, end: m.index + m[0].length, val: m[0] });
    matches.sort((a, b) => a.start - b.start);
    for (const mm of matches) {
      if (mm.start < i) continue;
      pushPlain(mm.start);
      if (mm.type === 'url') {
        const href = mm.val.startsWith('http') ? mm.val : 'https://' + mm.val;
        tokens.push({ type: 'url', href, display: mm.val });
      } else tokens.push({ type: 'tel', display: mm.val });
      i = mm.end;
    }
    pushPlain(text.length);
    return tokens;
  }
  function getAutoResponse(message) {
    const t = (message || '').toLowerCase();
    const map = [
      { k: ['قیمت','قیمت‌ها','price'], v: 'برای قیمت‌ها به فروشگاه سر بزنید یا تماس: ۰۲۱-۱۲۳۴۵۶۷۸' },
      { k: ['آموزش','دوره','کلاس','academy'], v: 'دوره‌های آکادمی از مقدماتی تا حرفه‌ای موجوده. بخش آکادمی 👩‍🎓' },
      { k: ['زمان','دوخت','تحویل'], v: 'زمان دوخت معمولاً ۷ تا ۱۴ روز کاریه؛ بسته به نوع سفارش.' },
      { k: ['آدرس','کجا','لوکیشن'], v: 'تهران، خیابان ولیعصر، پلاک ۱۲۳. روی نقشه: https://maps.google.com' },
      { k: ['سفارش','خرید','order'], v: 'برای ثبت سفارش به فروشگاه برید یا با پشتیبانی تماس بگیرید.' },
      { k: ['شبکه','اینستاگرام','تلگرام','واتساپ','whatsapp','instagram','telegram'], v: 'شبکه‌ها: اینستاگرام/تلگرام/واتساپ — آیکون‌های فوتر رو بزنید.' },
    ];
    for (const row of map) if (row.k.some(k => t.includes(k))) return row.v;
    return 'ممنون از پیام شما. یکی از همکاران ما به زودی پاسخ می‌دهد. 🙏';
  }
  function formatTime(ts) { try { return new Date(ts || Date.now()).toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'});} catch { return ''; } }
  function escapeHTML(s = '') { return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
  function faToEn(s = '') { const fa='۰۱۲۳۴۵۶۷۸۹', ar='٠١٢٣٤٥٦٧٨٩'; return s.replace(/[۰-۹٠-٩]/g, ch => { const i=fa.indexOf(ch); if(i>-1) return String(i); const j=ar.indexOf(ch); return j>-1?String(j):ch; }); }

  // Styles (drop-in)
  const chatStyles = document.createElement('style');
  chatStyles.textContent = `
    .chat-box{ backdrop-filter: blur(12px) saturate(120%); background: color-mix(in oklab, var(--bg-secondary) 85%, transparent); border: 1px solid color-mix(in oklab, var(--gold) 40%, transparent); }
    .chat-header{ background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%); position: relative; overflow: hidden; }
    .chat-header::after{ content:""; position:absolute; inset:-30% -10% auto auto; height:200%; width:40%; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.3), transparent 60%); transform: rotate(25deg); pointer-events:none; }
    .chat-message{ margin-bottom:16px; }
    .chat-message .message-content{ border-radius:18px; padding:12px 14px; line-height:1.7; box-shadow:0 6px 18px rgba(0,0,0,.08); position:relative; }
    .chat-message.bot .message-content{ background: var(--bg-tertiary); border:1px solid var(--border-color); }
    .chat-message.user .message-content{ background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%); color: var(--black); }
    .msg-tail::after{ content:""; position:absolute; bottom:0; border:8px solid transparent; }
    .chat-message.bot .msg-tail::after{ left:-2px; border-right-color: var(--bg-tertiary); border-left:0; transform: translateY(-4px); }
    .chat-message.user .msg-tail::after{ right:-2px; border-left-color: var(--gold-dark); border-right:0; transform: translateY(-4px); }
    .message-time{ display:block; font-size:10px; opacity:.7; margin-top:6px; }
    .animate-message{ animation: msgIn .28s ease-out; } .chat-message.user .animate-message{ animation-name: msgInRight; }
    @keyframes msgIn{ from{opacity:0; transform:translateY(6px) scale(.98)} to{opacity:1; transform:none} }
    @keyframes msgInRight{ from{opacity:0; transform:translateX(10px) scale(.98)} to{opacity:1; transform:none} }
    .typing-bubble{ display:flex; gap:4px; align-items:center; padding:10px 14px; }
    .typing-bubble span{ width:8px;height:8px;border-radius:50%; background: var(--gold); animation: dot 1.2s infinite ease-in-out; }
    .typing-bubble span:nth-child(2){ animation-delay:.15s } .typing-bubble span:nth-child(3){ animation-delay:.3s }
    @keyframes dot{ 0%,100%{transform:translateY(0); opacity:.6} 50%{transform:translateY(-6px); opacity:1} }
    .msg-link{ color: inherit; text-decoration: underline; text-underline-offset: 3px; opacity:.9 }
    .chat-message.bot .msg-link{ color: var(--gold); }
    .msg-media img{ max-width:220px; border-radius:12px; display:block }
    .msg-file{ display:flex; align-items:center; gap:8px; } .msg-file i{ color: var(--gold); }
    .emoji-panel{ position:absolute; width:220px; max-height:200px; overflow:auto; background: var(--bg-primary); border:1px solid var(--border-color); border-radius:12px; padding:8px; display:none; z-index:5; box-shadow: var(--shadow-md); }
    .emoji-panel.open{ display:block; }
    .emoji-btn{ background:transparent; border:none; cursor:pointer; font-size:20px; padding:6px; border-radius:8px; }
    .emoji-btn:hover{ background: rgba(212,175,55,.12); }
    .shake{ animation: shake .25s linear 2 } @keyframes shake{ 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
  `;
  document.head.appendChild(chatStyles);

  // Phone validator (مشترک با main.js)
  function isValidPhone(phone) {
    const v = faToEn(phone || '').trim();
    const digits = v.replace(/\D/g, '');
    const allowed = /^[+]?[\d\s\-()]+$/;
    return allowed.test(v) && digits.length >= 10 && digits.length <= 15;
  }
})();