// js/main.js (clean)
// ========== متغیرها ==========
let isLoading = true;
let currentTheme = localStorage.getItem('theme') ||
  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
let scrollPosition = 0;

// ========== اجرای اولیه ==========
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initScrollEffects();
  initMobileMenu();
  initSearch();
  initParticles();
  initAnimations();
  initGalleryFilter();
  initReviewForm();
  initSwiper();
  initCountdown();
  initStats();
  initSmoothScroll();
  initFormValidation();
  initViewportFix(); // فیکس بهم‌ریختگی موبایل هنگام تایپ

  if (window.AOS) {
    AOS.init({ duration: 800, once: true, offset: 60 });
  }
});

// ========== Loader ==========
function initLoader() {
  const loader = document.getElementById('loader');
  const progressBar = document.querySelector('.loader-progress-bar');
  if (!loader) return;

  let done = false, progress = 0;
  const finish = () => {
    if (done) return;
    done = true;
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    isLoading = false;
    startEntryAnimations();
  };

  const interval = setInterval(() => {
    progress += 10 + Math.random() * 25;
    if (progress > 100) progress = 100;
    if (progressBar) progressBar.style.width = progress + '%';
    if (progress >= 100) { clearInterval(interval); setTimeout(finish, 300); }
  }, 200);

  window.addEventListener('load', () => setTimeout(finish, 300));
  setTimeout(() => { clearInterval(interval); finish(); }, 7000); // failsafe
}

// ========== Entry Animations ==========
function startEntryAnimations() {
  const logo = document.querySelector('.logo');
  if (logo) logo.style.animation = 'slideInRight 0.8s ease-out';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link, i) => link.style.animation = `fadeInDown 0.5s ease-out ${i * 0.1}s both`);
  const navActions = document.querySelector('.nav-actions');
  if (navActions) navActions.style.animation = 'slideInLeft 0.8s ease-out';
}

// ========== Theme ==========
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
  if (themeToggle) themeToggle.addEventListener('click', (e) => toggleTheme(e));
}
function toggleTheme(e) {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
  document.body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  if (e && e.clientX != null) createRippleEffect(e);
}
function updateThemeIcon() {
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  if (currentTheme === 'dark') { sunIcon?.classList.remove('active'); moonIcon?.classList.add('active'); }
  else { moonIcon?.classList.remove('active'); sunIcon?.classList.add('active'); }
}
function createRippleEffect(e) {
  const ripple = document.createElement('div');
  ripple.className = 'theme-ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top = e.clientY + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1000);
}

// ========== Scroll Effects ==========
function initScrollEffects() {
  const btn = document.getElementById('scrollTop');
  const header = document.querySelector('.main-header');
  const circle = document.querySelector('.progress-ring-circle');

  window.addEventListener('scroll', () => {
    scrollPosition = window.scrollY;

    if (btn) scrollPosition > 300 ? btn.classList.add('show') : btn.classList.remove('show');

    if (circle) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max ? (scrollPosition / max) : 0;
      const r = parseFloat(circle.getAttribute('r')) || 23;
      const C = 2 * Math.PI * r;
      circle.style.strokeDasharray = `${C} ${C}`;
      circle.style.strokeDashoffset = `${C - pct * C}`;
    }

    if (header) scrollPosition > 100 ? header.classList.add('scrolled') : header.classList.remove('scrolled');

    updateParallax();
  });

  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // استایل هدر اسکرول‌شده (اگر در CSS نبود)
  const fix = document.createElement('style');
  fix.textContent = `.main-header.scrolled{padding:10px 0;background:rgba(0,0,0,.98);box-shadow:0 5px 20px rgba(0,0,0,.3)}`;
  document.head.appendChild(fix);
}
function updateParallax() {
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax || '0.5');
    el.style.transform = `translateY(${scrollPosition * speed}px)`;
  });
}

// ========== Mobile Menu ==========
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileMenuClose');
  const hasSubmenu = document.querySelectorAll('.has-submenu > a');

  if (toggle) toggle.addEventListener('click', openMobileMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);

  hasSubmenu.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const li = a.parentElement;
      document.querySelectorAll('.has-submenu.active').forEach(x => { if (x !== li) x.classList.remove('active'); });
      li.classList.toggle('active');
    });
  });

  initTouchGestures();
}
function openMobileMenu() {
  const drawer = document.getElementById('mobileMenu');
  const toggle = document.getElementById('mobileMenuToggle');
  drawer?.classList.add('active');
  toggle?.classList.add('active');
  document.body.style.overflow = 'hidden';
  createOverlay('mobile-menu-overlay', closeMobileMenu);
}
function closeMobileMenu() {
  const drawer = document.getElementById('mobileMenu');
  const toggle = document.getElementById('mobileMenuToggle');
  drawer?.classList.remove('active');
  toggle?.classList.remove('active');
  document.body.style.overflow = '';
  removeOverlay('mobile-menu-overlay');
}
function initTouchGestures() {
  let sx = 0, ex = 0;
  const threshold = 100;
  document.addEventListener('touchstart', e => sx = e.changedTouches[0].screenX);
  document.addEventListener('touchend', e => {
    ex = e.changedTouches[0].screenX;
    const diff = sx - ex;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && sx < 50) openMobileMenu(); // از لبه سمت راست به چپ
      else if (diff < 0) {
        const drawer = document.getElementById('mobileMenu');
        if (drawer?.classList.contains('active')) closeMobileMenu();
      }
    }
  });
}

// ========== Search ==========
function initSearch() {
  const btn = document.getElementById('searchBtn');
  const overlay = document.getElementById('searchOverlay');
  const close = document.getElementById('searchClose');
  const input = document.getElementById('searchInput');

  if (btn) btn.addEventListener('click', openSearch);
  if (close) close.addEventListener('click', closeSearch);
  if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });

  if (input) input.addEventListener('input', debounce(() => performSearch(input.value.trim()), 300));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearch(); closeMobileMenu(); } });
}
function openSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => input?.focus(), 250);
}
function closeSearch() {
  const overlay = document.getElementById('searchOverlay');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
}
function performSearch(q) { console.log('Searching for:', q); }

// ========== Particles ==========
function initParticles() {
  const box = document.getElementById('particles');
  if (!box) return;
  const isMobile = window.innerWidth <= 768;
  const count = isMobile ? 15 : 30;
  box.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = (Math.random() * 15) + 's';
    p.style.animationDuration = (15 + Math.random() * 10) + 's';
    if (isMobile) { p.style.width = '2px'; p.style.height = '2px'; }
    box.appendChild(p);
  }
}

// ========== Animations ==========
function initAnimations() {
  const options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        if (entry.target.classList.contains('fade-in')) entry.target.style.animation = 'fadeIn 0.6s ease forwards';
        if (entry.target.classList.contains('slide-up')) entry.target.style.animation = 'slideUp 0.6s ease forwards';
        if (entry.target.classList.contains('zoom-in')) entry.target.style.animation = 'zoomIn 0.5s ease forwards';
      }
    });
  }, options);
  document.querySelectorAll('.feature-card, .gallery-item, .course-card, .testimonial-card').forEach(el => io.observe(el));
}

// ========== Gallery Filter ==========
function initGalleryFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!btns.length || !items.length) return;
  function apply(filter) {
    items.forEach(it => {
      const show = filter === 'all' || it.getAttribute('data-category') === filter;
      it.style.display = show ? 'block' : 'none';
      if (show) it.style.animation = 'zoomIn 0.5s ease';
    });
  }
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    apply(b.getAttribute('data-filter') || 'all');
  }));
  const active = document.querySelector('.filter-btn.active');
  apply(active ? active.getAttribute('data-filter') || 'all' : 'all');
}

// ========== Reviews ==========
function initReviewForm() {
  const openBtn = document.getElementById('addReviewBtn');
  const wrap = document.getElementById('reviewForm');
  const cancelBtn = document.getElementById('cancelReview');
  const stars = document.querySelectorAll('.star-rating i');

  if (openBtn) openBtn.addEventListener('click', () => { wrap?.classList.add('active'); openBtn.style.display = 'none'; });
  if (cancelBtn) cancelBtn.addEventListener('click', () => { wrap?.classList.remove('active'); openBtn.style.display = 'inline-flex'; });

  stars.forEach((s, i) => {
    s.addEventListener('click', () => updateStarRating(i + 1));
    s.addEventListener('mouseenter', () => highlightStars(i + 1));
  });
  document.querySelector('.star-rating')?.addEventListener('mouseleave', () => {
    const cur = parseInt(document.querySelector('.star-rating')?.dataset.rating || '0', 10);
    updateStarRating(cur);
  });

  const form = wrap?.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      wrap.classList.remove('active');
      openBtn.style.display = 'inline-flex';
      form.reset();
      updateStarRating(0);
      showNotification('نظر شما ثبت شد. ممنونیم! 💛', 'success');
    });
  }
}
function updateStarRating(r) {
  const stars = document.querySelectorAll('.star-rating i');
  const wrap = document.querySelector('.star-rating');
  if (wrap) wrap.dataset.rating = r;
  stars.forEach((s, i) => { if (i < r) { s.classList.remove('far'); s.classList.add('fas'); } else { s.classList.remove('fas'); s.classList.add('far'); } });
}
function highlightStars(r) {
  const stars = document.querySelectorAll('.star-rating i');
  stars.forEach((s, i) => { if (i < r) { s.classList.remove('far'); s.classList.add('fas'); } else { s.classList.remove('fas'); s.classList.add('far'); } });
}

// ========== Swiper ==========
function initSwiper() {
  if (!window.Swiper) return;
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1, spaceBetween: 30, loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
  });
}

// ========== Countdown ==========
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const cta = document.querySelector('.cta-section');
  const ds = cta?.getAttribute('data-deadline');
  const end = ds ? new Date(ds) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const pad2 = (n) => n.toString().padStart(2, '0');
  function update() {
    const now = new Date();
    let diff = Math.max(0, end - now);
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
    const m = Math.floor(diff / 60000);    diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    daysEl.textContent    = toPersianNumber(pad2(d));
    hoursEl.textContent   = toPersianNumber(pad2(h));
    minutesEl.textContent = toPersianNumber(pad2(m));
    secondsEl.textContent = toPersianNumber(pad2(s));
  }
  update(); setInterval(update, 1000);
}

// ========== Stats Counter ==========
function initStats() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.dataset.target || '0', 10);
        animateCounter(entry.target, target);
        entry.target.classList.add('counted');
        o.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => obs.observe(s));
}
function animateCounter(el, target) {
  const dur = 1800, start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const val = Math.floor(target * p);
    el.textContent = toPersianNumber(val.toLocaleString());
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ========== Smooth Scroll ==========
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.offsetTop - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileMenu();
    });
  });
}

// ========== Form Validation ==========
function initFormValidation() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) { showNotification('فرم با موفقیت ارسال شد!', 'success'); form.reset(); }
    });
  });
}
function validateForm(form) {
  const required = form.querySelectorAll('[required]');
  let ok = true;
  required.forEach(field => {
    const val = (field.value || '').trim();
    if (!val) { showFieldError(field, 'این فیلد الزامی است'); ok = false; }
    else { clearFieldError(field); }
    if (field.type === 'email' && val && !isValidEmail(val)) { showFieldError(field, 'ایمیل معتبر نیست'); ok = false; }
    if (field.type === 'tel' && val && !isValidPhone(val)) { showFieldError(field, 'شماره تلفن معتبر نیست'); ok = false; }
  });
  return ok;
}
function showFieldError(field, msg) {
  field.classList.add('error');
  let el = field.nextElementSibling;
  if (!el || !el.classList || !el.classList.contains('field-error')) {
    el = document.createElement('span'); el.className = 'field-error';
    field.parentNode.insertBefore(el, field.nextSibling);
  }
  el.textContent = msg;
}
function clearFieldError(field) {
  field.classList.remove('error');
  const el = field.nextElementSibling;
  if (el?.classList?.contains('field-error')) el.remove();
}

// ========== Mobile Keyboard Fix ==========
function initViewportFix() {
  // 1) iOS: جلوگیری از زوم هنگام فوکوس (فونت 16px در موبایل)
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width:768px){
      input,textarea,select{ font-size:16px !important; }
      .chat-box{ height: min(450px, 75dvh); }
      .chat-widget{ bottom: calc(20px + var(--kb, 0px)); }
    }
    @supports (height: 100dvh){
      .hero-section{ min-height:100dvh; }
    }
    .hero-section{ min-height: calc(var(--vh, 1vh) * 100); }
    body.kb-open .particles, body.kb-open .scroll-indicator{ display:none !important; }
  `;
  document.head.appendChild(style);

  // 2) VisualViewport برای محاسبه ارتفاع کیبورد
  const vv = window.visualViewport;
  if (!vv) return;
  const setVars = () => {
    const kb = Math.max(0, (window.innerHeight - vv.height - vv.offsetTop));
    document.documentElement.style.setProperty('--kb', kb + 'px');
    document.documentElement.style.setProperty('--vh', (vv.height * 0.01) + 'px');
    document.body.classList.toggle('kb-open', kb > 80);
  };
  setVars();
  vv.addEventListener('resize', setVars);
  vv.addEventListener('scroll', setVars);
}

// ========== Helpers ==========
function debounce(fn, wait) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }
function toPersianNumber(str) { const map = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']; return String(str).replace(/[0-9]/g, d => map[d]); }
function faToEn(s = '') { const fa='۰۱۲۳۴۵۶۷۸۹', ar='٠١٢٣٤٥٦٧٨٩'; return s.replace(/[۰-۹٠-٩]/g, ch => { const i=fa.indexOf(ch); if(i>-1) return String(i); const j=ar.indexOf(ch); return j>-1?String(j):ch; }); }
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function isValidPhone(phone) {
  const v = faToEn(phone || '').trim();
  const digits = v.replace(/\D/g, '');
  const allowed = /^[+]?[\d\s\-()]+$/;
  return allowed.test(v) && digits.length >= 10 && digits.length <= 15;
}
function createOverlay(className, clickHandler) {
  const overlay = document.createElement('div');
  overlay.className = className + ' overlay';
  document.body.appendChild(overlay);
  if (clickHandler) overlay.addEventListener('click', clickHandler);
  requestAnimationFrame(() => overlay.classList.add('active'));
}
function removeOverlay(className) {
  const overlay = document.querySelector('.' + className);
  if (overlay) { overlay.classList.remove('active'); setTimeout(() => overlay.remove(), 300); }
}
function showNotification(message, type = 'info') {
  const n = document.createElement('div');
  n.className = `notification notification-${type}`;
  n.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i><span>${message}</span>`;
  document.body.appendChild(n);
  setTimeout(() => n.classList.add('show'), 50);
  setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3000);
}
function playSound(type) { const audio = new Audio(`assets/sounds/${type}.mp3`); audio.play().catch(() => {}); }

// ========== Resize ==========
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 768) closeMobileMenu();
    const box = document.getElementById('particles');
    if (box) { box.innerHTML = ''; initParticles(); }
  }, 250);
});

// ========== Online/Offline ==========
window.addEventListener('online', () => showNotification('اتصال اینترنت برقرار شد', 'success'));
window.addEventListener('offline', () => showNotification('اتصال اینترنت قطع شد', 'error'));

// ========== Lazy images (data-src) ==========
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) img.src = src;
        img.classList.remove('lazy');
        obs.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => io.observe(img));
}

// ========== Service Worker ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

console.log('🌟 Golden Wheel – main.js ready');
els.startBtn?.addEventListener('click', () => {
  const first = (els.firstI?.value || '').trim();
  const last  = (els.lastI?.value  || '').trim();
  let   name  = (els.nameI?.value  || '').trim(); // اگر فقط یک فیلد اسم داشته باشی
  const p     = (els.phoneI?.value || '').trim();

  if (!name) name = [first, last].filter(Boolean).join(' ');
  if (!name) { (els.nameI || els.firstI)?.focus(); return; }

  if (!isValidPhone(p)) { els.phoneI?.focus(); els.phoneI?.select?.(); return; }

  try {
    localStorage.setItem('support_name', name);
    if (first) localStorage.setItem('support_first', first);
    if (last)  localStorage.setItem('support_last',  last);
    localStorage.setItem('support_phone', faToEn(p));
  } catch {}

  enableChat(true); // با خوش‌آمدگویی
});
function enableChat(greet = false) {
  els.input?.removeAttribute('disabled');
  els.send?.removeAttribute('disabled');
  if (els.onboard) els.onboard.style.display = 'none';

  if (greet) {
    const name = localStorage.getItem('support_name') || '';
    addMessage({
      sender: 'bot',
      type: 'text',
      text: `${name ? name + ' عزیز، ' : ''}خوش آمدید! 👋
چطور می‌تونم کمکتون کنم؟`,
      ts: Date.now()
    });
  }
}
function isValidPhone(phone) {
  const v = faToEn(phone || '').trim().replace(/[\s\-()]/g, '');
  // 09XXXXXXXXX یا +989XXXXXXXXX یا 989XXXXXXXXX
  return /^(?:\+?98|0)?9\d{9}$/.test(v);
}
