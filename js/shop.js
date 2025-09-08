// js/shop.js – Golden Wheel Shop (mobile-first, animated)
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // State
  const state = {
    search: '',
    category: 'all',
    sort: 'popular',
    price: [100000, 10000000],
    colors: new Set(),
    sizes: new Set(),
    rating: 0,
    brands: new Set(),
    page: 1,
    pageSize: 8
  };

  // Demo Data
  const PRODUCTS = [
    {id:1, title:'پیراهن مجلسی طرح بهار', category:'women', price:1850000, oldPrice:2500000, rating:5, brand:'Golden', colors:['#D4AF37','#000000','#FFFFFF'], sizes:['S','M','L'], badges:['sale','new'], salePercent: 26, images:['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=60&auto=format&fit=crop']},
    {id:2, title:'کت و شلوار کلاسیک', category:'men', price:2200000, rating:4, brand:'Classic', colors:['#000000','#1E90FF'], sizes:['M','L','XL'], badges:[], images:['https://images.unsplash.com/photo-1511556670410-f76353ae45fb?w=1200&q=60&auto=format&fit=crop']},
    {id:3, title:'ست شاد کودکانه', category:'kids', price:980000, rating:4, brand:'KidsJoy', colors:['#B22222','#2E8B57','#1E90FF'], sizes:['XS','S','M'], badges:['new'], images:['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=60&auto=format&fit=crop']},
    {id:4, title:'لباس سنتی دست‌دوز', category:'traditional', price:2650000, oldPrice:2950000, rating:5, brand:'Heritage', colors:['#D4AF37','#000000'], sizes:['S','M','L','XL'], badges:['sale'], salePercent: 10, images:['https://images.unsplash.com/photo-1541781286675-8c29bfa357e5?w=1200&q=60&auto=format&fit=crop']},
    {id:5, title:'شال ابریشمی ویژه', category:'accessories', price:450000, rating:4, brand:'Silky', colors:['#FFFFFF','#D4AF37'], sizes:['M'], badges:['new'], images:['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=60&auto=format&fit=crop']},
    {id:6, title:'مانتو تابستانی مینیمال', category:'women', price:1350000, rating:4, brand:'Minimal', colors:['#FFFFFF','#2E8B57'], sizes:['S','M','L'], badges:[], images:['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=60&auto=format&fit=crop']},
    {id:7, title:'کت رسمی سرمه‌ای', category:'men', price:1950000, oldPrice:2150000, rating:4, brand:'Classic', colors:['#000000','#1E90FF'], sizes:['M','L','XL'], badges:['sale'], salePercent: 9, images:['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=60&auto=format&fit=crop']},
    {id:8, title:'روسری نخی طرح‌دار', category:'accessories', price:320000, rating:3, brand:'Silky', colors:['#B22222','#FFFFFF'], sizes:['S','M'], badges:[], images:['https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1200&q=60&auto=format&fit=crop']},
    {id:9, title:'کتان سنتی دوخته‌شده با ظرافت', category:'traditional', price:2850000, rating:5, brand:'Heritage', colors:['#D4AF37','#000000'], sizes:['M','L','XL'], badges:['new'], images:['https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&q=60&auto=format&fit=crop']},
    {id:10, title:'تی‌شرت بچگانه طرح رعد', category:'kids', price:390000, rating:4, brand:'KidsJoy', colors:['#1E90FF','#B22222'], sizes:['XS','S','M'], badges:[], images:['https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=60&auto=format&fit=crop']},
    {id:11, title:'دامن پلیسه طلایی', category:'women', price:890000, oldPrice:1150000, rating:4, brand:'Golden', colors:['#D4AF37','#FFFFFF'], sizes:['S','M'], badges:['sale'], salePercent: 22, images:['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=60&auto=format&fit=crop']},
    {id:12, title:'کمربند چرمی دست‌دوز', category:'accessories', price:520000, rating:5, brand:'Heritage', colors:['#000000'], sizes:['M','L'], badges:['new'], images:['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=60&auto=format&fit=crop']},
  ];

  let DOM = {};
  let WISHLIST = loadLS('gw_wishlist', []);
  let CART = loadLS('gw_cart', []);

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else setup();

  function setup() {
    DOM = {
      grid: $('#productsGrid'),
      count: $('#resultsCount'),
      empty: $('#emptyState'),
      emptyReset: $('#emptyReset'),
      loadMore: $('#loadMore'),
      search: $('#shopSearch'),
      clearSearch: $('#clearSearch'),
      chips: $$('#categoryChips .chip'),
      sort: $('#sortSelect'),
      // drawer
      drawer: $('#filterDrawer'),
      drawerOverlay: $('#drawerOverlay'),
      openFilters: $('#openFilters'),
      closeFilters: $('#closeFilters'),
      applyFilters: $('#applyFilters'),
      resetFilters: $('#resetFilters'),
      priceMin: $('#priceMin'),
      priceMax: $('#priceMax'),
      priceMinLabel: $('#priceMinLabel'),
      priceMaxLabel: $('#priceMaxLabel'),
      rangeTrack: $('.range-track'),
      colorSwatches: $$('#colorSwatches .swatch'),
      sizeChips: $$('#sizeChips .size-chip'),
      ratingRows: $('#ratingRows'),
      brandList: $('#brandList'),
      resetAll: $('#resetAll'),
      // quick view
      qv: $('#quickView'),
      qvOverlay: $('#qvOverlay'),
      qvClose: $('#qvClose'),
      qvSlides: $('#qvSlides'),
      qvTitle: $('#qvTitle'),
      qvRating: $('#qvRating'),
      qvPrice: $('#qvPrice'),
      qvOldPrice: $('#qvOldPrice'),
      qvSaleBadge: $('#qvSaleBadge'),
      qvColors: $('#qvColors'),
      qvSizes: $('#qvSizes'),
      qtyMinus: $('#qtyMinus'),
      qtyPlus: $('#qtyPlus'),
      qtyInput: $('#qtyInput'),
      qvAdd: $('#qvAddToCart'),
      qvWish: $('#qvWishlist'),
      // mini cart pill
      miniCount: $('#miniCartCount'),
      miniTotal: $('#miniCartTotal'),
      miniPill: $('#miniCartPill')
    };

    // init from URL
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) state.category = cat;

    // bind events
    bindToolbar();
    bindDrawer();
    buildBrandList();
    syncRangeUI();
    render(true);

    // mini cart initial + click
    updateMiniCart();
    DOM.miniPill?.addEventListener('click', () => {
      try { location.href = 'cart.html'; } catch {}
    });

    // Empty reset
    DOM.emptyReset?.addEventListener('click', () => resetAll());
  }

  // Bind toolbar
  function bindToolbar() {
    // Chips
    DOM.chips.forEach(ch => {
      if (ch.dataset.cat === state.category) ch.classList.add('active');
      ch.addEventListener('click', () => {
        DOM.chips.forEach(c => c.classList.remove('active'));
        ch.classList.add('active');
        state.category = ch.dataset.cat;
        state.page = 1;
        render(true);
        updateURL();
      });
    });

    // Search
    DOM.search?.addEventListener('input', debounce(() => {
      state.search = (DOM.search.value || '').trim();
      state.page = 1;
      DOM.clearSearch.style.display = state.search ? 'block' : 'none';
      render(true);
    }, 250));
    DOM.clearSearch?.addEventListener('click', () => {
      DOM.search.value = '';
      state.search = '';
      DOM.clearSearch.style.display = 'none';
      state.page = 1;
      render(true);
    });

    // Sort
    DOM.sort?.addEventListener('change', () => {
      state.sort = DOM.sort.value;
      state.page = 1;
      render(true);
    });

    // Reset all
    DOM.resetAll?.addEventListener('click', () => resetAll());

    // Load more
    DOM.loadMore?.addEventListener('click', () => {
      state.page++;
      render(false);
    });

    // Filters drawer
    DOM.openFilters?.addEventListener('click', openDrawer);
    DOM.closeFilters?.addEventListener('click', closeDrawer);
    DOM.drawerOverlay?.addEventListener('click', closeDrawer);
    DOM.applyFilters?.addEventListener('click', () => { state.page = 1; closeDrawer(); render(true); });
    DOM.resetFilters?.addEventListener('click', () => resetFiltersUI());
  }

  // Drawer filters
  function bindDrawer() {
    // Price ranges
    const clampRanges = () => {
      let min = +DOM.priceMin.value;
      let max = +DOM.priceMax.value;
      if (min > max - 100000) min = max - 100000;
      if (max < min + 100000) max = min + 100000;
      DOM.priceMin.value = String(min);
      DOM.priceMax.value = String(max);
      state.price = [min, max];
      renderPriceLabels();
      syncRangeUI();
    };
    DOM.priceMin?.addEventListener('input', clampRanges);
    DOM.priceMax?.addEventListener('input', clampRanges);

    // Colors
    DOM.colorSwatches.forEach(sw => {
      sw.addEventListener('click', () => {
        const c = sw.dataset.color;
        if (state.colors.has(c)) { state.colors.delete(c); sw.classList.remove('active'); }
        else { state.colors.add(c); sw.classList.add('active'); }
      });
    });

    // Sizes
    DOM.sizeChips.forEach(ch => {
      ch.addEventListener('click', () => {
        const s = ch.dataset.size;
        if (state.sizes.has(s)) { state.sizes.delete(s); ch.classList.remove('active'); }
        else { state.sizes.add(s); ch.classList.add('active'); }
      });
    });

    // Rating
    DOM.ratingRows?.addEventListener('change', (e) => {
      if (e.target && e.target.name === 'rating') {
        state.rating = parseInt(e.target.value, 10) || 0;
      }
    });
  }

  function buildBrandList() {
    const brands = Array.from(new Set(PRODUCTS.map(p => p.brand))).sort();
    DOM.brandList.innerHTML = brands.map(b => `<button class="brand-item" data-brand="${escapeHTML(b)}">${escapeHTML(b)}</button>`).join('');
    $$('#brandList .brand-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const b = btn.dataset.brand;
        if (state.brands.has(b)) { state.brands.delete(b); btn.classList.remove('active'); }
        else { state.brands.add(b); btn.classList.add('active'); }
      });
    });
  }

  function renderPriceLabels() {
    DOM.priceMinLabel.textContent = formatPrice(state.price[0]);
    DOM.priceMaxLabel.textContent = formatPrice(state.price[1]);
  }
  function syncRangeUI() {
    const min = +DOM.priceMin.value, max = +DOM.priceMax.value;
    const total = +DOM.priceMax.max - +DOM.priceMin.min;
    const left = ((min - +DOM.priceMin.min) / total) * 100;
    const right = ((+DOM.priceMax.max - max) / total) * 100;
    DOM.rangeTrack.style.background = `linear-gradient(90deg, var(--border-color) ${left}%, var(--gold) ${left}%, var(--gold) ${100 - right}%, var(--border-color) ${100 - right}%)`;
    renderPriceLabels();
  }

  function openDrawer() { DOM.drawer?.classList.add('active'); disableScroll(); }
  function closeDrawer() { DOM.drawer?.classList.remove('active'); enableScroll(); }
  function disableScroll(){ document.body.style.overflow = 'hidden'; }
  function enableScroll(){ document.body.style.overflow = ''; }

  // Rendering
  function render(resetGrid) {
    const list = applyAllFilters(PRODUCTS.slice());
    const total = list.length;

    DOM.count.textContent = `${toFa(total)} نتیجه`;
    DOM.empty.hidden = total > 0;

    if (resetGrid) DOM.grid.innerHTML = '';

    const start = 0;
    const end = state.page * state.pageSize;
    const pageItems = list.slice(start, end);

    // Toggle Load more
    if (total > end) {
      DOM.loadMore.style.display = 'inline-flex';
    } else {
      DOM.loadMore.style.display = (total > 0 && total <= state.pageSize) ? 'none' : 'inline-flex';
      if (total <= end) DOM.loadMore.style.display = 'none';
    }

    if (pageItems.length === 0) {
      DOM.empty.hidden = false;
      return;
    }

    const frag = document.createDocumentFragment();
    pageItems.forEach(p => frag.appendChild(renderCard(p)));
    DOM.grid.appendChild(frag);

    if (window.AOS) setTimeout(() => AOS.refresh(), 50);
  }

  function applyAllFilters(items) {
    if (state.search) items = items.filter(p => normalize(p.title).includes(normalize(state.search)));
    if (state.category && state.category !== 'all') {
      if (state.category === 'sale') items = items.filter(p => p.badges?.includes('sale'));
      else if (state.category === 'new') items = items.filter(p => p.badges?.includes('new'));
      else items = items.filter(p => p.category === state.category);
    }
    items = items.filter(p => p.price >= state.price[0] && p.price <= state.price[1]);
    if (state.colors.size) items = items.filter(p => (p.colors||[]).some(c => state.colors.has(c)));
    if (state.sizes.size) items = items.filter(p => (p.sizes||[]).some(s => state.sizes.has(s)));
    if (state.rating > 0) items = items.filter(p => (p.rating||0) >= state.rating);
    if (state.brands.size) items = items.filter(p => state.brands.has(p.brand));

    items.sort((a,b) => {
      switch (state.sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'discount': return (b.salePercent||0) - (a.salePercent||0);
        case 'newest': return (b.badges?.includes('new')?1:0) - (a.badges?.includes('new')?1:0);
        default: return (b.rating||0) - (a.rating||0);
      }
    });

    return items;
  }

  function renderCard(p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', p.id);
    card.setAttribute('data-aos', 'zoom-in');

    const wishActive = WISHLIST.includes(p.id);
    const hasSale = p.oldPrice && p.oldPrice > p.price;
    const salePercent = p.salePercent || (hasSale ? Math.round((1 - p.price/p.oldPrice) * 100) : 0);

    card.innerHTML = `
      <div class="product-thumb">
        <img loading="lazy" decoding="async" src="${p.images[0]}" alt="${escapeHTML(p.title)}">
        <div class="badges">
          ${p.badges?.includes('new') ? `<span class="badge new">جدید</span>`:''}
          ${hasSale ? `<span class="badge sale">-${toFa(salePercent)}%</span>`:''}
        </div>
        <button class="wishlist-btn ${wishActive?'active':''}" title="علاقه‌مندی">
          <i class="${wishActive?'fas':'far'} fa-heart"></i>
        </button>
        <button class="quickview-btn"><i class="fas fa-eye"></i> مشاهده سریع</button>
      </div>

      <div class="product-info">
        <div class="product-title">${escapeHTML(p.title)}</div>
        <div class="product-meta">
          <div class="rating">${renderStars(p.rating||0)}</div>
          <div class="price">
            <span class="price-current">${formatPrice(p.price)}</span>
            ${hasSale ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>`:''}
          </div>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-add"><i class="fas fa-shopping-bag"></i> افزودن</button>
        <button class="btn-ghost" title="اشتراک‌گذاری"><i class="fas fa-share-alt"></i></button>
      </div>
    `;

    // Events
    $('.wishlist-btn', card)?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(p.id, e.currentTarget);
    });
    $('.quickview-btn', card)?.addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickView(p.id);
    });
    $('.btn-add', card)?.addEventListener('click', () => {
      addToCart(p, 1, null);
      const imgEl = $('.product-thumb img', card);
      flyToCart(imgEl, p.images[0]);
      if (window.showNotification) showNotification('به سبد اضافه شد 💛', 'success');
    });
    $('.btn-ghost', card)?.addEventListener('click', () => shareProduct(p));

    return card;
  }

  // Quick View
  let qvSwiper = null, currentQV = null, selectedColor = null, selectedSize = null;
  function openQuickView(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    currentQV = p;
    selectedColor = (p.colors||[])[0] || null;
    selectedSize = (p.sizes||[])[0] || null;

    DOM.qvTitle.textContent = p.title;
    DOM.qvRating.innerHTML = renderStars(p.rating||0);
    DOM.qvPrice.textContent = formatPrice(p.price);
    if (p.oldPrice && p.oldPrice > p.price) {
      DOM.qvOldPrice.textContent = formatPrice(p.oldPrice);
      const perc = p.salePercent || Math.round((1 - p.price/p.oldPrice)*100);
      DOM.qvSaleBadge.textContent = `-${toFa(perc)}%`;
      DOM.qvSaleBadge.hidden = false;
    } else {
      DOM.qvOldPrice.textContent = '';
      DOM.qvSaleBadge.hidden = true;
    }

    // Colors
    DOM.qvColors.innerHTML = (p.colors||[]).map(c => `<button class="swatch ${c===selectedColor?'active':''}" style="--c:${c}" data-color="${c}"></button>`).join('');
    $$('#qvColors .swatch').forEach(sw => sw.addEventListener('click', () => {
      selectedColor = sw.dataset.color;
      $$('#qvColors .swatch').forEach(x => x.classList.remove('active'));
      sw.classList.add('active');
    }));

    // Sizes
    DOM.qvSizes.innerHTML = (p.sizes||[]).map(s => `<button class="size-chip ${s===selectedSize?'active':''}" data-size="${s}">${s}</button>`).join('');
    $$('#qvSizes .size-chip').forEach(ch => ch.addEventListener('click', () => {
      selectedSize = ch.dataset.size;
      $$('#qvSizes .size-chip').forEach(x => x.classList.remove('active'));
      ch.classList.add('active');
    }));

    // Qty
    DOM.qtyInput.value = 1;
    DOM.qtyMinus.onclick = () => { const v = Math.max(1, (+DOM.qtyInput.value||1)-1); DOM.qtyInput.value = v; };
    DOM.qtyPlus.onclick = () => { const v = Math.max(1, (+DOM.qtyInput.value||1)+1); DOM.qtyInput.value = v; };

    // Slides
    DOM.qvSlides.innerHTML = (p.images||[]).map(src => `<div class="swiper-slide"><img src="${src}" alt="${escapeHTML(p.title)}" loading="lazy"></div>`).join('');
    if (qvSwiper) { qvSwiper.destroy(true, true); qvSwiper = null; }
    if (window.Swiper) {
      qvSwiper = new Swiper('.qv-swiper', {
        slidesPerView: 1,
        loop: true,
        pagination: { el: '.qv-swiper .swiper-pagination', clickable: true }
      });
    }

    // Actions
    DOM.qvAdd.onclick = () => {
      const qty = Math.max(1, +DOM.qtyInput.value||1);
      const variant = { color: selectedColor, size: selectedSize };
      addToCart(p, qty, variant);
      const g = document.querySelector('.qv-gallery');
      flyToCart(g?.getBoundingClientRect?.() ? g.getBoundingClientRect() : null, p.images[0]);
      if (window.showNotification) showNotification('به سبد اضافه شد 💛', 'success');
      closeQuickView();
    };
    DOM.qvWish.onclick = () => {
      toggleWishlist(p.id);
      if (window.showNotification) showNotification('در علاقه‌مندی‌ها ذخیره شد', 'success');
    };

    // Open
    DOM.qv.classList.add('active');
    document.body.style.overflow = 'hidden';
    DOM.qvOverlay.onclick = closeQuickView;
    DOM.qvClose.onclick = closeQuickView;
  }
  function closeQuickView() {
    DOM.qv.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Wishlist
  function toggleWishlist(id, btn=null) {
    const idx = WISHLIST.indexOf(id);
    if (idx>-1) WISHLIST.splice(idx,1);
    else WISHLIST.push(id);
    saveLS('gw_wishlist', WISHLIST);
    if (btn) {
      btn.classList.toggle('active');
      const i = btn.querySelector('i');
      i.classList.toggle('fas'); i.classList.toggle('far');
    }
  }

  // Cart
  function addToCart(p, qty=1, variant=null) {
    const item = { id: p.id, title: p.title, price: p.price, qty, variant, image: p.images[0] };
    const key = JSON.stringify({ id:p.id, variant });
    const found = CART.find(x => JSON.stringify({id:x.id, variant:x.variant}) === key);
    if (found) found.qty += qty;
    else CART.push(item);
    saveLS('gw_cart', CART);
    try {
      window.dispatchEvent(new CustomEvent('cart:add', { detail: { product: p, qty, variant } }));
      if (typeof window.cartAdd === 'function') window.cartAdd(p, qty, variant);
    } catch {}
    updateMiniCart();
  }

  function updateMiniCart() {
    const cnt = CART.reduce((s, it) => s + (it.qty||0), 0);
    const sum = CART.reduce((s, it) => s + (it.qty||0) * (it.price||0), 0);
    if (DOM.miniCount) DOM.miniCount.textContent = toFa(cnt);
    if (DOM.miniTotal) DOM.miniTotal.textContent = `${formatPrice(sum)}`;
    bumpMiniCart();
  }

  // Share
  async function shareProduct(p) {
    const url = location.origin + '/product.html?id=' + p.id;
    const text = `${p.title} - ${formatPrice(p.price)}`;
    if (navigator.share) {
      try { await navigator.share({ title: p.title, text, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); if (window.showNotification) showNotification('لینک کپی شد 📋','success'); } catch {}
    }
  }

  // Animations: fly to cart + bump
  function flyToCart(fromElOrRect, imgSrc){
    const pill = document.getElementById('miniCartPill');
    if (!pill) return;
    let rect;
    if (fromElOrRect && typeof fromElOrRect.getBoundingClientRect === 'function') {
      rect = fromElOrRect.getBoundingClientRect();
    } else if (fromElOrRect && fromElOrRect.top != null) {
      rect = fromElOrRect;
    } else {
      rect = { top: window.innerHeight/2, left: window.innerWidth/2, width:80, height:80 };
    }
    const target = pill.getBoundingClientRect();
    const img = document.createElement('img');
    img.className = 'fly-img';
    img.src = imgSrc || 'https://i.pravatar.cc/80?img=11';
    img.style.top = rect.top + 'px';
    img.style.left = rect.left + 'px';
    document.body.appendChild(img);

    const dx = target.left - rect.left + (target.width/2 - (rect.width||80)/2);
    const dy = target.top - rect.top + (target.height/2 - (rect.height||80)/2);
    requestAnimationFrame(() => {
      img.style.transform = `translate(${dx}px, ${dy}px) scale(.2)`;
      img.style.opacity = '0.2';
    });

    setTimeout(() => { img.remove(); bumpMiniCart(); }, 850);
  }
  function bumpMiniCart(){
    const pill = document.getElementById('miniCartPill');
    if (!pill) return;
    pill.classList.remove('bump');
    void pill.offsetWidth; // reflow
    pill.classList.add('bump');
  }

  // Helpers
  function updateURL() {
    const params = new URLSearchParams(location.search);
    if (state.category && state.category!=='all') params.set('category', state.category);
    else params.delete('category');
    history.replaceState(null,'', location.pathname + (params.toString()?`?${params.toString()}`:''));
  }
  function renderStars(n) {
    const full = Math.floor(n), half = (n - full) >= 0.5 ? 1 : 0;
    return `${'★'.repeat(full)}${half?'½':''}`.replace(/★/g, '<i class="fas fa-star"></i>').replace('½','<i class="fas fa-star-half-alt"></i>') +
      `${'<i class="far fa-star"></i>'.repeat(5 - full - half)}`;
  }
  function toFa(num){ const map='۰۱۲۳۴۵۶۷۸۹'; return String(num).replace(/\d/g,d=>map[d]); }
  function formatPrice(n){ return toFa((n||0).toLocaleString()) + ' تومان'; }
  function escapeHTML(s=''){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m])); }
  function normalize(s=''){ return s.toLowerCase().replace(/[\u200c\s]+/g,' ').trim(); }
  function loadLS(k, def){ try{ return JSON.parse(localStorage.getItem(k) || JSON.stringify(def)); }catch{ return def; } }
  function saveLS(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }

  // Reset
  function resetFiltersUI() {
    state.price = [+DOM.priceMin.min, +DOM.priceMax.max];
    DOM.priceMin.value = state.price[0]; DOM.priceMax.value = state.price[1]; syncRangeUI();

    state.colors.clear(); DOM.colorSwatches.forEach(s=>s.classList.remove('active'));
    state.sizes.clear(); DOM.sizeChips.forEach(s=>s.classList.remove('active'));
    state.rating = 0; $('input[name="rating"][value="0"]')?.click();
    state.brands.clear(); $$('#brandList .brand-item').forEach(b=>b.classList.remove('active'));
  }
  function resetAll() {
    DOM.search.value = ''; state.search = '';
    DOM.clearSearch.style.display = 'none';
    state.category = 'all';
    DOM.chips.forEach(c => c.classList.remove('active'));
    DOM.chips.find(c=>c.dataset.cat==='all')?.classList.add('active');
    state.sort = 'popular'; if (DOM.sort) DOM.sort.value = 'popular';
    resetFiltersUI();
    state.page = 1;
    render(true);
    updateURL();
  }

  // Utils
  function debounce(fn, wait) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }

})();
// js/shop.js – Golden Wheel Shop (mobile-first, animated)
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // State
  const state = {
    search: '',
    category: 'all',
    sort: 'popular',
    price: [100000, 10000000],
    colors: new Set(),
    sizes: new Set(),
    rating: 0,
    brands: new Set(),
    page: 1,
    pageSize: 8
  };

  // Demo Data
  const PRODUCTS = [
    {id:1, title:'پیراهن مجلسی طرح بهار', category:'women', price:1850000, oldPrice:2500000, rating:5, brand:'Golden', colors:['#D4AF37','#000000','#FFFFFF'], sizes:['S','M','L'], badges:['sale','new'], salePercent: 26, images:['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=60&auto=format&fit=crop']},
    {id:2, title:'کت و شلوار کلاسیک', category:'men', price:2200000, rating:4, brand:'Classic', colors:['#000000','#1E90FF'], sizes:['M','L','XL'], badges:[], images:['https://images.unsplash.com/photo-1511556670410-f76353ae45fb?w=1200&q=60&auto=format&fit=crop']},
    {id:3, title:'ست شاد کودکانه', category:'kids', price:980000, rating:4, brand:'KidsJoy', colors:['#B22222','#2E8B57','#1E90FF'], sizes:['XS','S','M'], badges:['new'], images:['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=60&auto=format&fit=crop']},
    {id:4, title:'لباس سنتی دست‌دوز', category:'traditional', price:2650000, oldPrice:2950000, rating:5, brand:'Heritage', colors:['#D4AF37','#000000'], sizes:['S','M','L','XL'], badges:['sale'], salePercent: 10, images:['https://images.unsplash.com/photo-1541781286675-8c29bfa357e5?w=1200&q=60&auto=format&fit=crop']},
    {id:5, title:'شال ابریشمی ویژه', category:'accessories', price:450000, rating:4, brand:'Silky', colors:['#FFFFFF','#D4AF37'], sizes:['M'], badges:['new'], images:['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=60&auto=format&fit=crop']},
    {id:6, title:'مانتو تابستانی مینیمال', category:'women', price:1350000, rating:4, brand:'Minimal', colors:['#FFFFFF','#2E8B57'], sizes:['S','M','L'], badges:[], images:['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=60&auto=format&fit=crop']},
    {id:7, title:'کت رسمی سرمه‌ای', category:'men', price:1950000, oldPrice:2150000, rating:4, brand:'Classic', colors:['#000000','#1E90FF'], sizes:['M','L','XL'], badges:['sale'], salePercent: 9, images:['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=60&auto=format&fit=crop']},
    {id:8, title:'روسری نخی طرح‌دار', category:'accessories', price:320000, rating:3, brand:'Silky', colors:['#B22222','#FFFFFF'], sizes:['S','M'], badges:[], images:['https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1200&q=60&auto=format&fit=crop']},
    {id:9, title:'کتان سنتی دوخته‌شده با ظرافت', category:'traditional', price:2850000, rating:5, brand:'Heritage', colors:['#D4AF37','#000000'], sizes:['M','L','XL'], badges:['new'], images:['https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&q=60&auto=format&fit=crop']},
    {id:10, title:'تی‌شرت بچگانه طرح رعد', category:'kids', price:390000, rating:4, brand:'KidsJoy', colors:['#1E90FF','#B22222'], sizes:['XS','S','M'], badges:[], images:['https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=60&auto=format&fit=crop']},
    {id:11, title:'دامن پلیسه طلایی', category:'women', price:890000, oldPrice:1150000, rating:4, brand:'Golden', colors:['#D4AF37','#FFFFFF'], sizes:['S','M'], badges:['sale'], salePercent: 22, images:['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=60&auto=format&fit=crop']},
    {id:12, title:'کمربند چرمی دست‌دوز', category:'accessories', price:520000, rating:5, brand:'Heritage', colors:['#000000'], sizes:['M','L'], badges:['new'], images:['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=60&auto=format&fit=crop']},
  ];

  let DOM = {};
  let WISHLIST = loadLS('gw_wishlist', []);
  let CART = loadLS('gw_cart', []);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();

  function setup() {
    DOM = {
      grid: $('#productsGrid'),
      count: $('#resultsCount'),
      empty: $('#emptyState'),
      emptyReset: $('#emptyReset'),
      loadMore: $('#loadMore'),
      search: $('#shopSearch'),
      clearSearch: $('#clearSearch'),
      chips: $$('#categoryChips .chip'),
      sort: $('#sortSelect'),
      drawer: $('#filterDrawer'),
      drawerOverlay: $('#drawerOverlay'),
      openFilters: $('#openFilters'),
      closeFilters: $('#closeFilters'),
      applyFilters: $('#applyFilters'),
      resetFilters: $('#resetFilters'),
      priceMin: $('#priceMin'),
      priceMax: $('#priceMax'),
      priceMinLabel: $('#priceMinLabel'),
      priceMaxLabel: $('#priceMaxLabel'),
      rangeTrack: $('.range-track'),
      colorSwatches: $$('#colorSwatches .swatch'),
      sizeChips: $$('#sizeChips .size-chip'),
      ratingRows: $('#ratingRows'),
      brandList: $('#brandList'),
      resetAll: $('#resetAll'),
      qv: $('#quickView'),
      qvOverlay: $('#qvOverlay'),
      qvClose: $('#qvClose'),
      qvSlides: $('#qvSlides'),
      qvTitle: $('#qvTitle'),
      qvRating: $('#qvRating'),
      qvPrice: $('#qvPrice'),
      qvOldPrice: $('#qvOldPrice'),
      qvSaleBadge: $('#qvSaleBadge'),
      qvColors: $('#qvColors'),
      qvSizes: $('#qvSizes'),
      qtyMinus: $('#qtyMinus'),
      qtyPlus: $('#qtyPlus'),
      qtyInput: $('#qtyInput'),
      qvAdd: $('#qvAddToCart'),
      qvWish: $('#qvWishlist'),
      miniCount: $('#miniCartCount'),
      miniTotal: $('#miniCartTotal'),
      miniPill: $('#miniCartPill')
    };

    // از URL
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) state.category = cat;

    bindToolbar();
    bindDrawer();
    buildBrandList();
    syncRangeUI();
    render(true);

    updateMiniCart();
    DOM.miniPill?.addEventListener('click', () => { try { location.href = 'cart.html'; } catch {} });

    DOM.emptyReset?.addEventListener('click', () => resetAll());
  }

  function bindToolbar() {
    DOM.chips.forEach(ch => {
      if (ch.dataset.cat === state.category) ch.classList.add('active');
      ch.addEventListener('click', () => {
        DOM.chips.forEach(c => c.classList.remove('active'));
        ch.classList.add('active');
        state.category = ch.dataset.cat;
        state.page = 1;
        render(true);
        updateURL();
      });
    });

    DOM.search?.addEventListener('input', debounce(() => {
      state.search = (DOM.search.value || '').trim();
      state.page = 1;
      DOM.clearSearch.style.display = state.search ? 'block' : 'none';
      render(true);
    }, 250));
    DOM.clearSearch?.addEventListener('click', () => {
      DOM.search.value = '';
      state.search = '';
      DOM.clearSearch.style.display = 'none';
      state.page = 1;
      render(true);
    });

    DOM.sort?.addEventListener('change', () => {
      state.sort = DOM.sort.value;
      state.page = 1;
      render(true);
    });

    DOM.resetAll?.addEventListener('click', () => resetAll());
    DOM.loadMore?.addEventListener('click', () => { state.page++; render(false); });

    DOM.openFilters?.addEventListener('click', openDrawer);
    DOM.closeFilters?.addEventListener('click', closeDrawer);
    DOM.drawerOverlay?.addEventListener('click', closeDrawer);
    DOM.applyFilters?.addEventListener('click', () => { state.page = 1; closeDrawer(); render(true); });
    DOM.resetFilters?.addEventListener('click', () => resetFiltersUI());
  }

  function openDrawer(){ DOM.drawer?.classList.add('active'); disableScroll(); }
  function closeDrawer(){ DOM.drawer?.classList.remove('active'); enableScroll(); }
  function disableScroll(){ document.body.style.overflow='hidden'; }
  function enableScroll(){ document.body.style.overflow=''; }

  function bindDrawer() {
    const clampRanges = () => {
      let min = +DOM.priceMin.value, max = +DOM.priceMax.value;
      if (min > max - 100000) min = max - 100000;
      if (max < min + 100000) max = min + 100000;
      DOM.priceMin.value = String(min); DOM.priceMax.value = String(max);
      state.price = [min, max]; renderPriceLabels(); syncRangeUI();
    };
    DOM.priceMin?.addEventListener('input', clampRanges);
    DOM.priceMax?.addEventListener('input', clampRanges);

    DOM.colorSwatches.forEach(sw => {
      sw.addEventListener('click', () => {
        const c = sw.dataset.color;
        if (state.colors.has(c)) { state.colors.delete(c); sw.classList.remove('active'); }
        else { state.colors.add(c); sw.classList.add('active'); }
      });
    });

    DOM.sizeChips.forEach(ch => {
      ch.addEventListener('click', () => {
        const s = ch.dataset.size;
        if (state.sizes.has(s)) { state.sizes.delete(s); ch.classList.remove('active'); }
        else { state.sizes.add(s); ch.classList.add('active'); }
      });
    });

    DOM.ratingRows?.addEventListener('change', (e) => {
      if (e.target && e.target.name === 'rating') state.rating = parseInt(e.target.value, 10) || 0;
    });
  }

  function buildBrandList() {
    const brands = Array.from(new Set(PRODUCTS.map(p => p.brand))).sort();
    DOM.brandList.innerHTML = brands.map(b => `<button class="brand-item" data-brand="${escapeHTML(b)}">${escapeHTML(b)}</button>`).join('');
    $$('#brandList .brand-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const b = btn.dataset.brand;
        if (state.brands.has(b)) { state.brands.delete(b); btn.classList.remove('active'); }
        else { state.brands.add(b); btn.classList.add('active'); }
      });
    });
  }

  function renderPriceLabels(){ DOM.priceMinLabel.textContent = formatPrice(state.price[0]); DOM.priceMaxLabel.textContent = formatPrice(state.price[1]); }
  function syncRangeUI(){
    const min = +DOM.priceMin.value, max = +DOM.priceMax.value;
    const total = +DOM.priceMax.max - +DOM.priceMin.min;
    const left = ((min - +DOM.priceMin.min) / total) * 100;
    const right = ((+DOM.priceMax.max - max) / total) * 100;
    DOM.rangeTrack.style.background = `linear-gradient(90deg, var(--border-color) ${left}%, var(--gold) ${left}%, var(--gold) ${100 - right}%, var(--border-color) ${100 - right}%)`;
    renderPriceLabels();
  }

  function render(resetGrid) {
    const list = applyAllFilters(PRODUCTS.slice());
    const total = list.length;
    DOM.count.textContent = `${toFa(total)} نتیجه`;
    DOM.empty.hidden = total > 0;

    if (resetGrid) DOM.grid.innerHTML = '';
    const end = state.page * state.pageSize;
    const pageItems = list.slice(0, end);

    if (total > end) DOM.loadMore.style.display = 'inline-flex';
    else DOM.loadMore.style.display = total > state.pageSize ? 'inline-flex' : 'none';

    if (pageItems.length === 0) { DOM.empty.hidden = false; return; }

    const frag = document.createDocumentFragment();
    pageItems.forEach(p => frag.appendChild(renderCard(p)));
    DOM.grid.appendChild(frag);
    if (window.AOS) setTimeout(() => AOS.refresh(), 50);
  }

  function applyAllFilters(items) {
    if (state.search) items = items.filter(p => normalize(p.title).includes(normalize(state.search)));
    if (state.category && state.category !== 'all') {
      if (state.category === 'sale') items = items.filter(p => p.badges?.includes('sale'));
      else if (state.category === 'new') items = items.filter(p => p.badges?.includes('new'));
      else items = items.filter(p => p.category === state.category);
    }
    items = items.filter(p => p.price >= state.price[0] && p.price <= state.price[1]);
    if (state.colors.size) items = items.filter(p => (p.colors||[]).some(c => state.colors.has(c)));
    if (state.sizes.size) items = items.filter(p => (p.sizes||[]).some(s => state.sizes.has(s)));
    if (state.rating > 0) items = items.filter(p => (p.rating||0) >= state.rating);
    if (state.brands.size) items = items.filter(p => state.brands.has(p.brand));
    items.sort((a,b) => {
      switch (state.sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'discount': return (b.salePercent||0) - (a.salePercent||0);
        case 'newest': return (b.badges?.includes('new')?1:0) - (a.badges?.includes('new')?1:0);
        default: return (b.rating||0) - (a.rating||0);
      }
    });
    return items;
  }

  function renderCard(p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', p.id);
    card.setAttribute('data-aos', 'zoom-in');

    const wishActive = WISHLIST.includes(p.id);
    const hasSale = p.oldPrice && p.oldPrice > p.price;
    const salePercent = p.salePercent || (hasSale ? Math.round((1 - p.price/p.oldPrice) * 100) : 0);

    card.innerHTML = `
      <div class="product-thumb">
        <img loading="lazy" decoding="async" src="${p.images[0]}" alt="${escapeHTML(p.title)}">
        <div class="badges">
          ${p.badges?.includes('new') ? `<span class="badge new">جدید</span>`:''}
          ${hasSale ? `<span class="badge sale">-${toFa(salePercent)}%</span>`:''}
        </div>
        <button class="wishlist-btn ${wishActive?'active':''}" title="علاقه‌مندی">
          <i class="${wishActive?'fas':'far'} fa-heart"></i>
        </button>
        <button class="quickview-btn"><i class="fas fa-eye"></i> مشاهده سریع</button>
      </div>

      <div class="product-info">
        <div class="product-title">${escapeHTML(p.title)}</div>
        <div class="product-meta">
          <div class="rating">${renderStars(p.rating||0)}</div>
          <div class="price">
            <span class="price-current">${formatPrice(p.price)}</span>
            ${hasSale ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>`:''}
          </div>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-add"><i class="fas fa-shopping-bag"></i> افزودن</button>
        <button class="btn-ghost" title="اشتراک‌گذاری"><i class="fas fa-share-alt"></i></button>
      </div>
    `;

    $('.wishlist-btn', card)?.addEventListener('click', (e) => {
      e.stopPropagation(); toggleWishlist(p.id, e.currentTarget);
    });
    $('.quickview-btn', card)?.addEventListener('click', (e) => {
      e.stopPropagation(); openQuickView(p.id);
    });
    $('.btn-add', card)?.addEventListener('click', () => {
      addToCart(p, 1, null);
      const imgEl = $('.product-thumb img', card);
      flyToCart(imgEl, p.images[0]);
      if (window.showNotification) showNotification('به سبد اضافه شد 💛', 'success');
    });
    $('.btn-ghost', card)?.addEventListener('click', () => shareProduct(p));

    return card;
  }

  // Quick View
  let qvSwiper = null, selectedColor = null, selectedSize = null;
  function openQuickView(id) {
    const p = PRODUCTS.find(x => x.id === id); if (!p) return;
    selectedColor = (p.colors||[])[0] || null;
    selectedSize = (p.sizes||[])[0] || null;

    DOM.qvTitle.textContent = p.title;
    DOM.qvRating.innerHTML = renderStars(p.rating||0);
    DOM.qvPrice.textContent = formatPrice(p.price);
    if (p.oldPrice && p.oldPrice > p.price) {
      DOM.qvOldPrice.textContent = formatPrice(p.oldPrice);
      const perc = p.salePercent || Math.round((1 - p.price/p.oldPrice)*100);
      DOM.qvSaleBadge.textContent = `-${toFa(perc)}%`; DOM.qvSaleBadge.hidden = false;
    } else { DOM.qvOldPrice.textContent = ''; DOM.qvSaleBadge.hidden = true; }

    DOM.qvColors.innerHTML = (p.colors||[]).map(c => `<button class="swatch ${c===selectedColor?'active':''}" style="--c:${c}" data-color="${c}"></button>`).join('');
    $$('#qvColors .swatch').forEach(sw => sw.addEventListener('click', () => {
      selectedColor = sw.dataset.color;
      $$('#qvColors .swatch').forEach(x => x.classList.remove('active')); sw.classList.add('active');
    }));

    DOM.qvSizes.innerHTML = (p.sizes||[]).map(s => `<button class="size-chip ${s===selectedSize?'active':''}" data-size="${s}">${s}</button>`).join('');
    $$('#qvSizes .size-chip').forEach(ch => ch.addEventListener('click', () => {
      selectedSize = ch.dataset.size;
      $$('#qvSizes .size-chip').forEach(x => x.classList.remove('active')); ch.classList.add('active');
    }));

    DOM.qtyInput.value = 1;
    DOM.qtyMinus.onclick = () => { const v = Math.max(1, (+DOM.qtyInput.value||1)-1); DOM.qtyInput.value = v; };
    DOM.qtyPlus.onclick = () => { const v = Math.max(1, (+DOM.qtyInput.value||1)+1); DOM.qtyInput.value = v; };

    DOM.qvSlides.innerHTML = (p.images||[]).map(src => `<div class="swiper-slide"><img src="${src}" alt="${escapeHTML(p.title)}" loading="lazy"></div>`).join('');
    if (qvSwiper) { qvSwiper.destroy(true, true); qvSwiper = null; }
    if (window.Swiper) {
      qvSwiper = new Swiper('.qv-swiper', { slidesPerView: 1, loop: true, pagination: { el: '.qv-swiper .swiper-pagination', clickable: true } });
    }

    DOM.qvAdd.onclick = () => {
      const qty = Math.max(1, +DOM.qtyInput.value||1);
      const variant = { color: selectedColor, size: selectedSize };
      addToCart(p, qty, variant);
      const g = document.querySelector('.qv-gallery');
      flyToCart(g?.getBoundingClientRect?.() ? g.getBoundingClientRect() : null, p.images[0]);
      if (window.showNotification) showNotification('به سبد اضافه شد 💛', 'success');
      closeQuickView();
    };
    DOM.qvWish.onclick = () => { toggleWishlist(p.id); if (window.showNotification) showNotification('در علاقه‌مندی ذخیره شد','success'); };

    DOM.qv.classList.add('active'); document.body.style.overflow='hidden';
    DOM.qvOverlay.onclick = closeQuickView; DOM.qvClose.onclick = closeQuickView;
  }
  function closeQuickView(){ DOM.qv.classList.remove('active'); document.body.style.overflow=''; }

  // Wishlist
  function toggleWishlist(id, btn=null) {
    const idx = WISHLIST.indexOf(id);
    if (idx>-1) WISHLIST.splice(idx,1); else WISHLIST.push(id);
    saveLS('gw_wishlist', WISHLIST);
    if (btn) { btn.classList.toggle('active'); const i=btn.querySelector('i'); i.classList.toggle('fas'); i.classList.toggle('far'); }
  }

  // Cart
  function addToCart(p, qty=1, variant=null) {
    const item = { id: p.id, title: p.title, price: p.price, qty, variant, image: p.images[0] };
    const key = JSON.stringify({ id:p.id, variant });
    const found = CART.find(x => JSON.stringify({id:x.id, variant:x.variant}) === key);
    if (found) found.qty += qty; else CART.push(item);
    saveLS('gw_cart', CART);
    try { window.dispatchEvent(new CustomEvent('cart:add', { detail: { product: p, qty, variant } })); } catch {}
    updateMiniCart();
  }
  function updateMiniCart() {
    const cnt = CART.reduce((s, it) => s + (it.qty||0), 0);
    const sum = CART.reduce((s, it) => s + (it.qty||0) * (it.price||0), 0);
    if (DOM.miniCount) DOM.miniCount.textContent = toFa(cnt);
    if (DOM.miniTotal) DOM.miniTotal.textContent = `${formatPrice(sum)}`;
    bumpMiniCart();
  }

  // Share
  async function shareProduct(p) {
    const url = location.origin + '/product.html?id=' + p.id;
    const text = `${p.title} - ${formatPrice(p.price)}`;
    if (navigator.share) { try { await navigator.share({ title: p.title, text, url }); } catch {} }
    else { try { await navigator.clipboard.writeText(url); if (window.showNotification) showNotification('لینک کپی شد 📋','success'); } catch {} }
  }

  // ====== انیمیشن پرواز Bezier (Arc + Scale + Rotate) ======
  function flyToCart(fromElOrRect, imgSrc){
    const pill = document.getElementById('miniCartPill'); if (!pill) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rect;
    if (fromElOrRect && typeof fromElOrRect.getBoundingClientRect === 'function') rect = fromElOrRect.getBoundingClientRect();
    else if (fromElOrRect && fromElOrRect.top != null) rect = fromElOrRect;
    else rect = { top: window.innerHeight/2, left: window.innerWidth/2, width:90, height:90 };

    const target = pill.getBoundingClientRect();
    // نقاط Bezier
    const P0 = { x: rect.left + (rect.width||90)/2, y: rect.top + (rect.height||90)/2 };
    const P1 = { x: target.left + target.width/2, y: target.top + target.height/2 };
    const ctrlY = Math.min(P0.y, P1.y) - 140; // قوس به بالا
    const Pctrl = { x: (P0.x + P1.x)/2, y: ctrlY };

    // المنت پرواز
    const wrap = document.createElement('div'); wrap.className='fly-wrap';
    const img = document.createElement('img'); img.className='fly-img'; img.src = imgSrc || 'https://i.pravatar.cc/90?img=11';
    wrap.appendChild(img); document.body.appendChild(wrap);

    // بدون انیمیشن (احترام به reduced-motion)
    if (reduced) { wrap.remove(); bumpMiniCart(); return; }

    const D = 850; // ms
    const t0 = performance.now();
    (function step(now){
      let t = Math.min((now - t0) / D, 1); // 0..1
      // easeOutCubic
      const ease = 1 - Math.pow(1 - t, 3);
      // نقطه Bezier درجه 2
      const x = (1-ease)*(1-ease)*P0.x + 2*(1-ease)*ease*Pctrl.x + ease*ease*P1.x;
      const y = (1-ease)*(1-ease)*P0.y + 2*(1-ease)*ease*Pctrl.y + ease*ease*P1.y;

      const scale = 1 - 0.75*ease;
      const rot = -25 * ease;
      wrap.style.transform = `translate(${x-45}px, ${y-45}px)`; // 45 نصف 90
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
  function updateURL() {
    const params = new URLSearchParams(location.search);
    if (state.category && state.category!=='all') params.set('category', state.category);
    else params.delete('category');
    history.replaceState(null,'', location.pathname + (params.toString()?`?${params.toString()}`:''));
  }
  function renderStars(n) {
    const full = Math.floor(n), half = (n - full) >= 0.5 ? 1 : 0;
    return `${'★'.repeat(full)}${half?'½':''}`.replace(/★/g, '<i class="fas fa-star"></i>').replace('½','<i class="fas fa-star-half-alt"></i>') +
      `${'<i class="far fa-star"></i>'.repeat(5 - full - half)}`;
  }
  function toFa(num){ const map='۰۱۲۳۴۵۶۷۸۹'; return String(num).replace(/\d/g,d=>map[d]); }
  function formatPrice(n){ return toFa((n||0).toLocaleString()) + ' تومان'; }
  function escapeHTML(s=''){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m])); }
  function normalize(s=''){ return s.toLowerCase().replace(/[\u200c\s]+/g,' ').trim(); }
  function loadLS(k, def){ try{ return JSON.parse(localStorage.getItem(k) || JSON.stringify(def)); }catch{ return def; } }
  function saveLS(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
  function debounce(fn, wait){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }

  function resetFiltersUI() {
    state.price = [+DOM.priceMin.min, +DOM.priceMax.max];
    DOM.priceMin.value = state.price[0]; DOM.priceMax.value = state.price[1]; syncRangeUI();
    state.colors.clear(); DOM.colorSwatches.forEach(s=>s.classList.remove('active'));
    state.sizes.clear(); DOM.sizeChips.forEach(s=>s.classList.remove('active'));
    state.rating = 0; $('input[name="rating"][value="0"]')?.click();
    state.brands.clear(); $$('#brandList .brand-item').forEach(b=>b.classList.remove('active'));
  }
  function resetAll() {
    DOM.search.value = ''; state.search = ''; DOM.clearSearch.style.display='none';
    state.category = 'all'; DOM.chips.forEach(c=>c.classList.remove('active')); DOM.chips.find(c=>c.dataset.cat==='all')?.classList.add('active');
    state.sort = 'popular'; if (DOM.sort) DOM.sort.value = 'popular';
    resetFiltersUI(); state.page = 1; render(true); updateURL();
  }

})();
