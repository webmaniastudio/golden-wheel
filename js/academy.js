// js/academy.js – Golden Wheel Academy (mobile-first, animated)
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // State
  const state = {
    search: '',
    category: 'all',
    sort: 'popular',
    page: 1,
    pageSize: 6
  };

  // Demo Courses
  const COURSES = [
    {id:101, title:'دوره جامع طراحی لباس', category:'basic', level:'مقدماتی تا پیشرفته', duration:48, students:250, rating:5, price:1850000, oldPrice:2500000, badges:['popular','new'], images:['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=60&auto=format&fit=crop'], syllabus:['مبانی طراحی','تناسب اندام','رنگ‌شناسی','اسکچ سریع']},
    {id:102, title:'الگوسازی و دوخت پیشرفته', category:'advanced', level:'پیشرفته', duration:60, students:180, rating:5, price:2200000, badges:['popular'], images:['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=60&auto=format&fit=crop'], syllabus:['الگوی بالاتنه','آستین و یقه','اتصال و فینیشینگ']},
    {id:103, title:'الگوسازی دیجیتال (آنلاین)', category:'online', level:'آنلاین', duration:30, students:320, rating:4, price:980000, badges:['new'], images:['https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1200&q=60&auto=format&fit=crop'], syllabus:['نرم‌افزارها','وُرک‌فلو دیجیتال','خروجی استاندارد']},
    {id:104, title:'دوخت حرفه‌ای کت و دامن', category:'professional', level:'حرفه‌ای', duration:72, students:120, rating:5, price:2650000, oldPrice:2950000, badges:['popular'], images:['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=60&auto=format&fit=crop'], syllabus:['کت الگنت','دامن حرفه‌ای','فن دوخت']},
    {id:105, title:'طراحی مد دیجیتال', category:'advanced', level:'پیشرفته', duration:36, students:140, rating:4, price:1450000, images:['https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=60&auto=format&fit=crop'], syllabus:['برداشت دیجیتال','رندرینگ','پورتفولیو']},
    {id:106, title:'دوخت مانتو مینیمال', category:'basic', level:'مقدماتی', duration:24, students:210, rating:4, price:990000, images:['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=60&auto=format&fit=crop'], syllabus:['الگوی ساده','برش و دوخت','اتمام‌کاری']},
    {id:107, title:'دوخت کت مردانه', category:'professional', level:'حرفه‌ای', duration:80, students:90, rating:5, price:2850000, images:['https://images.unsplash.com/photo-1511556670410-f76353ae45fb?w=1200&q=60&auto=format&fit=crop'], syllabus:['الگوی کت','لبه‌دوزی','ایستایی و فیت']},
    {id:108, title:'اکسسوری و تزئینات', category:'basic', level:'مقدماتی', duration:20, students:160, rating:4, price:520000, badges:['new'], images:['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=60&auto=format&fit=crop'], syllabus:['تزئینات دستی','نکات اتصال','جزئیات لوکس']},
  ];

  let DOM = {};
  let CART = loadLS('gw_cart', []);

  // Init
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();

  function setup() {
    DOM = {
      grid: $('#coursesGrid'),
      results: $('#acResults'),
      empty: $('#acEmpty'),
      emptyReset: $('#acEmptyReset'),
      loadMore: $('#acLoadMore'),
      search: $('#academySearch'),
      clearSearch: $('#clearAcademySearch'),
      chips: $$('#academyChips .chip'),
      sort: $('#academySort'),
      // course view
      cv: $('#courseView'),
      cvOverlay: $('#cvOverlay'),
      cvClose: $('#cvClose'),
      cvSlides: $('#cvSlides'),
      cvTitle: $('#cvTitle'),
      cvRating: $('#cvRating'),
      cvDuration: $('#cvDuration'),
      cvLevel: $('#cvLevel'),
      cvStudents: $('#cvStudents'),
      cvPrice: $('#cvPrice'),
      cvOldPrice: $('#cvOldPrice'),
      cvSaleBadge: $('#cvSaleBadge'),
      cvSyllabus: $('#cvSyllabus'),
      cvEnroll: $('#cvEnroll'),
      cvWishlist: $('#cvWishlist'),
      miniCount: $('#miniCartCount'),
      miniTotal: $('#miniCartTotal'),
      miniPill: $('#miniCartPill'),
    };

    // init from URL
    const params = new URLSearchParams(location.search);
    const t = params.get('type');
    if (t) state.category = t;

    bindToolbar();
    render(true);

    // empty reset
    DOM.emptyReset?.addEventListener('click', () => resetAll());
  }

  function bindToolbar() {
    // chips
    DOM.chips.forEach(ch => {
      if (ch.dataset.cat === state.category) ch.classList.add('active');
      ch.addEventListener('click', () => {
        DOM.chips.forEach(c => c.classList.remove('active'));
        ch.classList.add('active');
        state.category = ch.dataset.cat;
        state.page = 1;
        render(true);
      });
    });

    // search
    DOM.search?.addEventListener('input', debounce(() => {
      state.search = (DOM.search.value || '').trim();
      DOM.clearSearch.style.display = state.search ? 'block' : 'none';
      state.page = 1;
      render(true);
    }, 250));
    DOM.clearSearch?.addEventListener('click', () => {
      DOM.search.value = '';
      state.search = '';
      DOM.clearSearch.style.display = 'none';
      state.page = 1;
      render(true);
    });

    // sort
    DOM.sort?.addEventListener('change', () => {
      state.sort = DOM.sort.value;
      state.page = 1;
      render(true);
    });

    // load more
    DOM.loadMore?.addEventListener('click', () => {
      state.page++;
      render(false);
    });
  }

  function render(resetGrid) {
    const list = applyAll(COURSES.slice());
    const total = list.length;
    DOM.results.textContent = `${toFa(total)} نتیجه`;
    DOM.empty.hidden = total > 0;

    if (resetGrid) DOM.grid.innerHTML = '';

    const end = state.page * state.pageSize;
    const pageItems = list.slice(0, end);

    if (total > end) DOM.loadMore.style.display = 'inline-flex';
    else DOM.loadMore.style.display = total > state.pageSize ? 'inline-flex' : 'none';

    if (pageItems.length === 0) {
      DOM.empty.hidden = false; return;
    }

    const frag = document.createDocumentFragment();
    pageItems.forEach(c => frag.appendChild(renderCard(c)));
    DOM.grid.appendChild(frag);
    if (window.AOS) setTimeout(() => AOS.refresh(), 50);
  }

  function applyAll(items) {
    if (state.search) items = items.filter(c => normalize(c.title).includes(normalize(state.search)));
    if (state.category && state.category !== 'all') items = items.filter(c => c.category === state.category);
    items.sort((a,b) => {
      switch(state.sort) {
        case 'newest': return (b.badges?.includes('new')?1:0) - (a.badges?.includes('new')?1:0);
        case 'duration-asc': return (a.duration||0) - (b.duration||0);
        case 'duration-desc': return (b.duration||0) - (a.duration||0);
        case 'price-asc': return (a.price||0) - (b.price||0);
        case 'price-desc': return (b.price||0) - (a.price||0);
        default: return (b.rating||0) - (a.rating||0);
      }
    });
    return items;
  }

  function renderCard(c) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.setAttribute('data-id', c.id);
    card.setAttribute('data-aos', 'zoom-in');

    const isNew = c.badges?.includes('new');
    const isPop = c.badges?.includes('popular');

    card.innerHTML = `
      <div class="course-thumb">
        <img src="${c.images[0]}" alt="${escapeHTML(c.title)}" loading="lazy" decoding="async">
        <div class="course-badges">
          ${isNew ? `<span class="badge new">جدید</span>` : ''}
          ${isPop ? `<span class="badge popular">پرطرفدار</span>` : ''}
        </div>
      </div>
      <div class="course-info">
        <div class="course-title">${escapeHTML(c.title)}</div>
        <div class="course-meta">
          <span><i class="far fa-clock"></i> ${toFa(c.duration)} ساعت</span>
          <span><i class="fas fa-signal"></i> ${c.level}</span>
          <span><i class="far fa-user"></i> ${toFa(c.students)}</span>
        </div>
        <div class="course-meta">
          <span class="rating">${renderStars(c.rating||0)}</span>
          <span class="price">
            <b style="color:var(--gold)">${formatPrice(c.price)}</b>
            ${c.oldPrice ? `<s class="price-old">${formatPrice(c.oldPrice)}</s>` : ''}
          </span>
        </div>
      </div>
      <div class="course-actions">
        <button class="btn-enroll"><i class="fas fa-graduation-cap"></i> ثبت‌نام</button>
        <button class="btn-view"><i class="fas fa-eye"></i></button>
      </div>
    `;

    $('.btn-enroll', card)?.addEventListener('click', () => {
      addToCart(c, 1, { course: true });
      const img = $('.course-thumb img', card);
      flyToCart(img, c.images[0]);
      window.showNotification?.('به سبد اضافه شد 💛','success');
    });

    $('.btn-view', card)?.addEventListener('click', () => openCourseView(c.id));

    return card;
  }

  // Course View (Bottom Sheet)
  let cvSwiper = null, currentCourse = null;
  function openCourseView(id) {
    const c = COURSES.find(x => x.id === id); if (!c) return;
    currentCourse = c;

    DOM.cvTitle.textContent = c.title;
    DOM.cvRating.innerHTML = renderStars(c.rating||0);
    DOM.cvDuration.innerHTML = `<i class="far fa-clock"></i> ${toFa(c.duration)} ساعت`;
    DOM.cvLevel.innerHTML = `<i class="fas fa-signal"></i> ${c.level}`;
    DOM.cvStudents.innerHTML = `<i class="far fa-user"></i> ${toFa(c.students)} دانشجو`;

    DOM.cvPrice.textContent = formatPrice(c.price);
    if (c.oldPrice && c.oldPrice > c.price) {
      DOM.cvOldPrice.textContent = formatPrice(c.oldPrice);
      const perc = Math.round((1 - c.price/c.oldPrice)*100);
      DOM.cvSaleBadge.textContent = `-${toFa(perc)}%`;
      DOM.cvSaleBadge.hidden = false;
    } else {
      DOM.cvOldPrice.textContent = '';
      DOM.cvSaleBadge.hidden = true;
    }

    // Syllabus
    DOM.cvSyllabus.innerHTML = (c.syllabus||[]).map(it => `<li>${escapeHTML(it)}</li>`).join('');

    // Slides
    DOM.cvSlides.innerHTML = (c.images||[]).map(src => `<div class="swiper-slide"><img src="${src}" alt="${escapeHTML(c.title)}" loading="lazy"></div>`).join('');
    if (cvSwiper) { cvSwiper.destroy(true, true); cvSwiper = null; }
    if (window.Swiper) {
      cvSwiper = new Swiper('.cv-swiper', { slidesPerView: 1, loop: true, pagination: { el: '.cv-swiper .swiper-pagination', clickable: true } });
    }

    DOM.cv.classList.add('active');
    document.body.style.overflow = 'hidden';
    DOM.cvOverlay.onclick = closeCourseView;
    DOM.cvClose.onclick = closeCourseView;

    DOM.cvEnroll.onclick = () => {
      addToCart(c, 1, { course:true });
      const g = document.querySelector('.cv-gallery');
      const rect = g?.getBoundingClientRect?.();
      flyToCart(rect || null, c.images[0]);
      window.showNotification?.('به سبد اضافه شد 💛','success');
      closeCourseView();
    };
    DOM.cvWishlist.onclick = () => {
      window.showNotification?.('در علاقه‌مندی‌ها ذخیره شد','success');
    };
  }
  function closeCourseView() {
    DOM.cv.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Instructors Swiper
  if (document.readyState === 'complete') initInstructors();
  else window.addEventListener('load', initInstructors);
  function initInstructors(){
    if (window.Swiper) {
      new Swiper('.instructors-swiper', {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 3500, disableOnInteraction: false },
        pagination: { el: '.instructors-swiper .swiper-pagination', clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }
      });
    }
  }

  // Cart (shared localStorage)
  function addToCart(course, qty=1, variant=null){
    const item = { id: course.id, title: course.title, price: course.price, qty, variant, image: course.images[0] };
    const key = JSON.stringify({ id: course.id, variant });
    const found = CART.find(x => JSON.stringify({id:x.id, variant:x.variant}) === key);
    if (found) found.qty += qty; else CART.push(item);
    saveLS('gw_cart', CART);
    try{ window.dispatchEvent(new CustomEvent('cart:add',{ detail:{ product: course, qty, variant } })); }catch{}
    updateMiniCart();
  }
  function updateMiniCart(){
    const cnt = CART.reduce((s, it) => s + (it.qty||0), 0);
    const sum = CART.reduce((s, it) => s + (it.qty||0) * (it.price||0), 0);
    if (DOM.miniCount) DOM.miniCount.textContent = toFa(cnt);
    if (DOM.miniTotal) DOM.miniTotal.textContent = `${formatPrice(sum)}`;
    bumpMiniCart();
  }

  // Fly to cart (Bezier) + bump
  function flyToCart(fromElOrRect, imgSrc){
    const pill = document.getElementById('miniCartPill'); if (!pill) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rect;
    if (fromElOrRect && typeof fromElOrRect.getBoundingClientRect === 'function') rect = fromElOrRect.getBoundingClientRect();
    else if (fromElOrRect && fromElOrRect.top != null) rect = fromElOrRect;
    else rect = { top: window.innerHeight/2, left: window.innerWidth/2, width:90, height:90 };

    const target = pill.getBoundingClientRect();
    const P0 = { x: rect.left + (rect.width||90)/2, y: rect.top + (rect.height||90)/2 };
    const P1 = { x: target.left + target.width/2, y: target.top + target.height/2 };
    const Pctrl = { x: (P0.x + P1.x)/2, y: Math.min(P0.y, P1.y) - 140 };

    const wrap = document.createElement('div'); wrap.className='fly-wrap';
    const img = document.createElement('img'); img.className='fly-img'; img.src = imgSrc || 'https://i.pravatar.cc/90?img=11';
    wrap.appendChild(img); document.body.appendChild(wrap);

    if (reduced) { wrap.remove(); bumpMiniCart(); return; }

    const D = 850; const t0 = performance.now();
    (function step(now){
      let t = Math.min((now - t0)/D, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const x = (1-ease)*(1-ease)*P0.x + 2*(1-ease)*ease*Pctrl.x + ease*ease*P1.x;
      const y = (1-ease)*(1-ease)*P0.y + 2*(1-ease)*ease*Pctrl.y + ease*ease*P1.y;
      const scale = 1 - 0.75*ease;
      const rot = -25 * ease;
      wrap.style.transform = `translate(${x-45}px, ${y-45}px)`;
      img.style.transform = `scale(${scale}) rotate(${rot}deg)`;
      img.style.opacity = String(1 - 0.8*ease);
      if (t < 1) requestAnimationFrame(step);
      else { wrap.remove(); bumpMiniCart(); }
    })(t0);
  }
  function bumpMiniCart(){
    const pill = document.getElementById('miniCartPill'); if (!pill) return;
    pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
  }

  // Helpers
  function renderStars(n) {
    const full = Math.floor(n), half = (n - full) >= 0.5 ? 1 : 0;
    return `${'★'.repeat(full)}${half?'½':''}`.replace(/★/g, '<i class="fas fa-star"></i>').replace('½','<i class="fas fa-star-half-alt"></i>') +
      `${'<i class="far fa-star"></i>'.repeat(5 - full - half)}`;
  }
  function toFa(num){ const map='۰۱۲۳۴۵۶۷۸۹'; return String(num).replace(/\d/g,d=>map[d]); }
  function formatPrice(n){ return toFa((n||0).toLocaleString()) + ' تومان'; }
  function normalize(s=''){ return s.toLowerCase().replace(/[\u200c\s]+/g,' ').trim(); }
  function loadLS(k, def){ try{ return JSON.parse(localStorage.getItem(k) || JSON.stringify(def)); }catch{ return def; } }
  function saveLS(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
  function debounce(fn, wait){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }

  function resetAll(){
    DOM.search.value=''; state.search=''; DOM.clearSearch.style.display='none';
    state.category='all'; DOM.chips.forEach(c=>c.classList.remove('active')); DOM.chips.find(c=>c.dataset.cat==='all')?.classList.add('active');
    state.sort='popular'; if (DOM.sort) DOM.sort.value='popular';
    state.page=1; render(true);
  }
})();