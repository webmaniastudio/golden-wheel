// ========== Golden Wheel | Shop Big, Clean & Animated ==========

// State
let baseProducts = [];
let products = [];
let filteredProducts = [];
let cart = [];
let wishlist = [];
let compareProducts = JSON.parse(localStorage.getItem('compare') || '[]');

let filters = {
  category: 'all',
  priceRange: [0, 10000000],
  size: [],
  color: [],
  sort: localStorage.getItem('shop_sort') || 'newest',
  search: '',
  special: 'all' // all | new | sale | featured | popular
};

let viewMode = localStorage.getItem('shop_view') || 'grid';
let currentPage = 1;
let productsPerPage = 12;

// Flash Sale
let flashEnd = Date.now() + 1000 * 60 * 60 * 6; // 6 ساعت از الان

// Init
document.addEventListener('DOMContentLoaded', () => {
  initWishlist();
  initCart();
  initDataset();
  initFilters();
  initViewMode();
  initPagination();
  initProductModal();
  initSorting();
  initSearch();
  initCompare();
  initFilterToggles();
  initMobileFilters();
  initSliders();
  initInfiniteSentinel();
  initTabs();
  initFAQ();
  initTailor();
  initDiscounts();
  initCouponCopy();

  // اولین رندر
  applyFilters();
  displayProducts();
  updateProductCount();
  updateSidebarCounts();

  // مخفی کردن اسپینر
  const spinner = document.getElementById('productsLoading');
  setTimeout(() => spinner && (spinner.style.display = 'none'), 300);
});

// Dataset (bigger and rich)
function initDataset() {
  baseProducts = [
    { id:1, name:'لباس مجلسی زنانه', category:'women', price:2500000, oldPrice:3000000, image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=70&auto=format&fit=crop', images:[
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?w=900&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=70&auto=format&fit=crop'
    ], description:'لباس مجلسی زنانه با طراحی خاص و دوخت عالی', details:'این لباس با بهترین پارچه‌های وارداتی دوخته شده و برای مجالس رسمی مناسب است.', sizes:['S','M','L','XL'], colors:['#000000','#ffffff','#ff0000','#0000ff'], inStock:true, rating:4.5, reviews:24, new:true, sale:true, featured:true, tags:['مجلسی','زنانه','شیک'], material:'پارچه ابریشمی', care:'شستشو با دست', origin:'ایران' },
    { id:2, name:'کت و شلوار مردانه', category:'men', price:4500000, oldPrice:null, image:'https://images.unsplash.com/photo-1511556670410-f76353ae45fb?w=900&q=70&auto=format&fit=crop', images:[
      'https://images.unsplash.com/photo-1511556670410-f76353ae45fb?w=900&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=70&auto=format&fit=crop'
    ], description:'کت و شلوار مردانه با دوخت تضمینی', details:'پارچه ممتاز + برش دقیق + دوخت حرفه‌ای', sizes:['S','M','L','XL','XXL'], colors:['#000000','#000080','#8B4513'], inStock:true, rating:4.8, reviews:31, new:false, sale:false, featured:true, tags:['کت','شلوار','مردانه','رسمی'], material:'پارچه پشمی', care:'خشکشویی', origin:'ترکیه' },
    { id:3, name:'لباس بچگانه', category:'kids', price:800000, oldPrice:1000000, image:'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=70&auto=format&fit=crop', images:[
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516476405536-d352a4a5755a?w=900&q=70&auto=format&fit=crop'
    ], description:'لباس بچگانه شاد و رنگارنگ', details:'نرم، راحت و مناسب پوست حساس کودک', sizes:['2T','3T','4T','5T'], colors:['#ff0000','#00ff00','#0000ff','#ffff00'], inStock:true, rating:4.2, reviews:15, new:true, sale:true, featured:false, tags:['بچگانه','شاد','رنگارنگ'], material:'پارچه نخی', care:'ماشین‌شویی', origin:'ایران' },
    { id:4, name:'روسری سنتی', category:'accessories', price:500000, oldPrice:null, image:'https://images.unsplash.com/photo-1541781286675-8c29bfa357e5?w=900&q=70&auto=format&fit=crop', images:[
      'https://images.unsplash.com/photo-1541781286675-8c29bfa357e5?w=900&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590766940554-153a1b04a9a6?w=900&q=70&auto=format&fit=crop'
    ], description:'روسری سنتی با طرح‌های اصیل ایرانی', details:'طرح اصیل + رنگ ثابت + لطیف', sizes:['90cm','110cm','130cm'], colors:['#ff0000','#0000ff','#008000','#800080'], inStock:true, rating:4.7, reviews:32, new:false, sale:false, featured:true, tags:['روسری','سنتی','ایرانی'], material:'پارچه ابریشمی', care:'شستشو با دست', origin:'ایران' },
    { id:5, name:'مانتو کتی', category:'women', price:1200000, oldPrice:1500000, image:'https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?w=900&q=70&auto=format&fit=crop', images:[
      'https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?w=900&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=70&auto=format&fit=crop'
    ], description:'مانتو کتی با طراحی مدرن', details:'استایل روزمره با برش تمیز', sizes:['S','M','L','XL'], colors:['#000000','#ffffff','#ff69b4','#800080'], inStock:true, rating:4.3, reviews:21, new:true, sale:true, featured:false, tags:['مانتو','کتی','زنانه'], material:'پارچه کرپ', care:'ماشین‌شویی', origin:'چین' },
    { id:6, name:'پیراهن مردانه', category:'men', price:900000, oldPrice:null, image:'https://images.unsplash.com/photo-1590766940554-153a1b04a9a6?w=900&q=70&auto=format&fit=crop', images:[
      'https://images.unsplash.com/photo-1590766940554-153a1b04a9a6?w=900&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596985064390-2960b4d8b9e7?w=900&q=70&auto=format&fit=crop'
    ], description:'پیراهن مردانه با طرح‌های متنوع', details:'تنفس‌پذیر و خوش‌فرم', sizes:['S','M','L','XL','XXL'], colors:['#ffffff','#0000ff','#008000','#ff0000'], inStock:true, rating:4.4, reviews:19, new:false, sale:false, featured:false, tags:['پیراهن','مردانه'], material:'پارچه نخی', care:'ماشین‌شویی', origin:'ایران' },
    { id:7, name:'لباس مجلسی کودک', category:'kids', price:1100000, oldPrice:1400000, image:'https://images.unsplash.com/photo-1516476405536-d352a4a5755a?w=900&q=70&auto=format&fit=crop', images:[
      'https://images.unsplash.com/photo-1516476405536-d352a4a5755a?w=900&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=70&auto=format&fit=crop'
    ], description:'لباس مجلسی کودک با طراحی شیک', details:'پرو خوش‌فرم + لطیف', sizes:['2T','3T','4T','5T','6T'], colors:['#ff69b4','#ffffff','#800080','#ff0000'], inStock:true, rating:4.6, reviews:12, new:true, sale:true, featured:false, tags:['بچگانه','مجلسی','شیک'], material:'پارچه ابریشمی', care:'شستشو با دست', origin:'ایران' },
    { id:8, name:'کلاه لبه‌دار', category:'accessories', price:300000, oldPrice:null, image:'https://images.unsplash.com/photo-1529921450784-5b8fe0e4f0c7?w=900&q=70&auto=format&fit=crop', images:[
      'https://images.unsplash.com/photo-1529921450784-5b8fe0e4f0c7?w=900&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=900&q=70&auto=format&fit=crop'
    ], description:'کلاه لبه‌دار با طراحی مدرن', details:'راحت و سبک', sizes:['S/M','L/XL'], colors:['#000000','#ffffff','#0000ff','#ff0000'], inStock:true, rating:4.1, reviews:8, new:false, sale:false, featured:false, tags:['کلاه','لبه‌دار','مردانه'], material:'پارچه پنبه‌ای', care:'شستشو با دست', origin:'چین' }
  ];

  // ساخت لیست بزرگ‌تر (افزایش تعداد محصولات)
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get('category');
  let id = 100;
  products = [...baseProducts];
  for (let k=0;k<56;k++){ // 56 تا واریانت اضافه
    const src = baseProducts[k % baseProducts.length];
    const priceVariation = ((k % 6) * 80000);
    const variant = {
      ...src,
      id: id++,
      name: src.name + ' ' + (k+1),
      price: src.price + priceVariation,
      oldPrice: (k % 3 === 0) ? (src.price + priceVariation + 250000) : src.oldPrice,
      new: (k % 4 === 0),
      sale: (k % 3 === 0) || !!src.oldPrice,
      featured: (k % 5 === 0),
      reviews: src.reviews + (k % 17),
      rating: Math.min(5, src.rating + ((k % 6 === 0) ? 0.2 : 0))
    };
    products.push(variant);
  }

  if (cat) filters.category = cat;
  updateCategoryFilter();
}

// Filters
function initFilters() {
  // Category radios
  document.querySelectorAll('input[name="category"]').forEach(r => {
    r.addEventListener('change', function(){
      filters.category = this.value;
      currentPage = 1;
      applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
    });
  });

  // Price range
  const MAX = 10000000;
  const minRange = document.getElementById('minPriceRange');
  const maxRange = document.getElementById('maxPriceRange');
  const minInput = document.getElementById('minPriceInput');
  const maxInput = document.getElementById('maxPriceInput');
  const track = document.getElementById('priceTrack');

  const updateTrack = () => {
    const minVal = parseInt(minRange.value, 10);
    const maxVal = parseInt(maxRange.value, 10);
    const minP = (minVal / MAX) * 100;
    const maxP = (maxVal / MAX) * 100;
    track.style.left = minP + '%';
    track.style.right = (100 - maxP) + '%';
  };

  const toFa = n => n.toLocaleString();
  const fa2en = s => (s||'').replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]).replace(/,/g,'');

  const updateFromRanges = () => {
    let minVal = parseInt(minRange.value, 10);
    let maxVal = parseInt(maxRange.value, 10);
    if (minVal > maxVal) { minVal = maxVal; minRange.value = String(minVal); }
    filters.priceRange = [minVal, maxVal];
    minInput.value = toPersianNumber(toFa(minVal));
    maxInput.value = toPersianNumber(toFa(maxVal));
    updateTrack();
    currentPage = 1;
    applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
  };

  const updateFromInputs = () => {
    const minVal = Math.max(0, Math.min(MAX, parseInt(fa2en(minInput.value), 10) || 0));
    const maxVal = Math.max(0, Math.min(MAX, parseInt(fa2en(maxInput.value), 10) || 0));
    if (minVal > maxVal) return;
    minRange.value = String(minVal); maxRange.value = String(maxVal);
    updateFromRanges();
  };

  if (minRange && maxRange && minInput && maxInput && track){
    minRange.addEventListener('input', updateFromRanges);
    maxRange.addEventListener('input', updateFromRanges);
    minInput.addEventListener('change', updateFromInputs);
    maxInput.addEventListener('change', updateFromInputs);
    updateFromRanges();
  }

  // Size
  document.querySelectorAll('.size-filters input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', function(){
      if (this.checked) { if (!filters.size.includes(this.value)) filters.size.push(this.value); }
      else { filters.size = filters.size.filter(s => s !== this.value); }
      currentPage = 1; applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
    });
  });

  // Color
  document.querySelectorAll('.color-filters input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', function(){
      if (this.checked) { if (!filters.color.includes(this.value)) filters.color.push(this.value); }
      else { filters.color = filters.color.filter(c => c !== this.value); }
      currentPage = 1; applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
    });
  });

  // Reset
  document.getElementById('resetFilters')?.addEventListener('click', () => {
    filters = { category:'all', priceRange:[0,MAX], size:[], color:[], sort:'newest', search:'', special:'all' };
    localStorage.setItem('shop_sort', 'newest');
    document.querySelectorAll('input[name="category"]').forEach(r => r.checked = r.value === 'all');
    document.querySelectorAll('.size-filters input[type="checkbox"], .color-filters input[type="checkbox"]').forEach(c => c.checked = false);
    if (minRange && maxRange){
      minRange.value = '0'; maxRange.value = String(MAX);
      minInput.value = toPersianNumber('0'); maxInput.value = toPersianNumber(MAX.toLocaleString());
      updateTrack();
    }
    document.getElementById('shopSearch')?.value = '';
    document.getElementById('shopSearchSub')?.value = '';
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.tab-btn[data-special="all"]')?.classList.add('active');
    currentPage = 1; applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
  });

  // Initial chips
  renderActiveChips();
}

function updateCategoryFilter() {
  const radio = document.querySelector(`input[name="category"][value="${filters.category}"]`);
  if (radio) radio.checked = true;
}

function updateSidebarCounts() {
  // Category counts
  const catCounts = products.reduce((acc,p) => (acc[p.category]=(acc[p.category]||0)+1, acc), { all: products.length });
  document.querySelectorAll('.category-filters label').forEach(lbl => {
    const inp = lbl.querySelector('input');
    const span = lbl.querySelector('.category-count');
    if (inp && span) {
      const v = inp.value;
      const c = catCounts[v] || 0;
      span.textContent = toPersianNumber(c.toString());
    }
  });

  // Size counts
  const sizeCounts = {};
  products.forEach(p => p.sizes.forEach(s => sizeCounts[s] = (sizeCounts[s] || 0) + 1));
  document.querySelectorAll('.size-filters .size-filter').forEach(div => {
    const inp = div.querySelector('input');
    const countEl = div.querySelector('.size-count');
    if (inp && countEl) countEl.textContent = toPersianNumber((sizeCounts[inp.value] || 0).toString());
  });

  // Color counts
  const colorCounts = {};
  products.forEach(p => p.colors.forEach(c => colorCounts[c] = (colorCounts[c] || 0) + 1));
  document.querySelectorAll('.color-filters .color-filter').forEach(div => {
    const inp = div.querySelector('input');
    const countEl = div.querySelector('.color-count');
    if (inp && countEl) countEl.textContent = toPersianNumber((colorCounts[inp.value] || 0).toString());
  });
}

// Active chips
function renderActiveChips() {
  const wrap = document.getElementById('activeChips');
  if (!wrap) return;
  wrap.innerHTML = '';

  const addChip = (label, onRemove) => {
    const chip = document.createElement('span');
    chip.className = 'active-chip';
    chip.innerHTML = `${label} <button aria-label="حذف"><i class="fas fa-times"></i></button>`;
    chip.querySelector('button').addEventListener('click', onRemove);
    wrap.appendChild(chip);
  };

  if (filters.category !== 'all') {
    const map = {women:'زنانه', men:'مردانه', kids:'بچگانه', accessories:'اکسسوری'};
    addChip(`دسته: ${map[filters.category]||filters.category}`, () => {
      filters.category = 'all';
      updateCategoryFilter();
      currentPage=1; applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
    });
  }
  if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000000) {
    addChip(`قیمت: ${toPersianNumber(filters.priceRange[0].toLocaleString())} تا ${toPersianNumber(filters.priceRange[1].toLocaleString())}`, () => {
      const MAX = 10000000;
      filters.priceRange = [0,MAX];
      document.getElementById('minPriceRange').value = '0';
      document.getElementById('maxPriceRange').value = String(MAX);
      document.getElementById('minPriceInput').value = toPersianNumber('0');
      document.getElementById('maxPriceInput').value = toPersianNumber(MAX.toLocaleString());
      currentPage=1; applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
    });
  }
  if (filters.size.length) addChip(`سایز: ${filters.size.join('، ')}`, () => {
    filters.size = [];
    document.querySelectorAll('.size-filters input[type="checkbox"]').forEach(c => c.checked = false);
    currentPage=1; applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
  });
  if (filters.color.length) addChip(`رنگ: ${filters.color.length} انتخاب`, () => {
    filters.color = [];
    document.querySelectorAll('.color-filters input[type="checkbox"]').forEach(c => c.checked = false);
    currentPage=1; applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
  });
  if (filters.special !== 'all') {
    const map = { new:'جدید', sale:'تخفیف‌دار', featured:'ویژه', popular:'پرفروش' };
    addChip(`ویژه: ${map[filters.special]}`, () => {
      filters.special = 'all';
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.tab-btn[data-special="all"]')?.classList.add('active');
      currentPage=1; applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
    });
  }
}

// Tabs
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function(){
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filters.special = this.dataset.special;
      currentPage = 1; applyFilters(); displayProducts(); updateProductCount(); renderActiveChips();
    });
  });
}

// Apply filters + sort + search + special
function applyFilters() {
  filteredProducts = products.filter(p => {
    if (filters.category !== 'all' && p.category !== filters.category) return false;
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
    if (filters.size.length && !filters.size.some(s => p.sizes.includes(s))) return false;
    if (filters.color.length && !filters.color.some(c => p.colors.includes(c))) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const ok = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
      if (!ok) return false;
    }
    // special tabs
    if (filters.special === 'new' && !p.new) return false;
    if (filters.special === 'sale' && !p.sale) return false;
    if (filters.special === 'featured' && !p.featured) return false;
    if (filters.special === 'popular' && !(p.reviews >= 20)) return false;
    return true;
  });
  sortProducts();
}

function sortProducts() {
  switch (filters.sort) {
    case 'newest': filteredProducts.sort((a,b) => (b.new === a.new) ? b.id - a.id : (b.new - a.new)); break;
    case 'price-asc': filteredProducts.sort((a,b) => a.price - b.price); break;
    case 'price-desc': filteredProducts.sort((a,b) => b.price - a.price); break;
    case 'rating': filteredProducts.sort((a,b) => b.rating - a.rating); break;
    case 'popular': filteredProducts.sort((a,b) => b.reviews - a.reviews); break;
  }
}

// Render products
function displayProducts() {
  const container = document.getElementById('productsContainer');
  const noProducts = document.getElementById('noProducts');
  if (!container) return;

  // Secondary counters
  const pcSub = document.getElementById('productCountSub');
  if (pcSub) pcSub.textContent = toPersianNumber(filteredProducts.length.toLocaleString());

  // Pagination slice
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const pageItems = filteredProducts.slice(startIndex, endIndex);

  // Clear
  container.innerHTML = '';
  if (!pageItems.length) {
    noProducts && (noProducts.style.display = 'block');
    updatePagination();
    return;
  }
  noProducts && (noProducts.style.display = 'none');

  if (viewMode === 'grid') container.className = 'products-grid';
  else container.className = 'products-list';

  if (viewMode === 'grid') {
    pageItems.forEach((p, i) => container.appendChild(createProductCard(p, i)));
  } else {
    pageItems.forEach((p, i) => container.appendChild(createProductListItem(p, i)));
  }

  updatePagination();
  try { if (window.AOS) AOS.refresh(); } catch(e){}
}

function createProductCard(product, index) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', (index % 4) * 80);

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async">
      <div class="product-actions">
        <button class="action-btn quick-view" data-id="${product.id}" title="نمایش سریع" aria-label="نمایش سریع"><i class="fas fa-eye"></i></button>
        <button class="action-btn add-to-wishlist ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}" title="علاقه‌مندی" aria-label="علاقه‌مندی"><i class="fas fa-heart"></i></button>
        <button class="action-btn add-to-compare ${compareProducts.includes(product.id) ? 'active' : ''}" data-id="${product.id}" title="مقایسه" aria-label="مقایسه"><i class="fas fa-exchange-alt"></i></button>
      </div>
      ${product.new ? '<span class="product-badge new">جدید</span>' : ''}
      ${product.sale ? `<span class="product-badge sale">${discount}%</span>` : ''}
      ${product.featured ? '<span class="product-badge featured">ویژه</span>' : ''}
    </div>
    <div class="product-info">
      <h3 class="product-name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <div class="product-rating">
        <div class="stars">${generateStars(product.rating)}</div>
        <span class="reviews-count">(${toPersianNumber(product.reviews)})</span>
      </div>
      <div class="product-price">
        ${product.oldPrice ? `<span class="old-price">${toPersianNumber(product.oldPrice.toLocaleString())} تومان</span>` : ''}
        <span class="current-price">${toPersianNumber(product.price.toLocaleString())} تومان</span>
      </div>
      <div class="product-colors">${product.colors.map(c => `<span class="color-option" style="background-color:${c}"></span>`).join('')}</div>
      <button class="add-to-cart-btn" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> افزودن به سبد خرید</button>
    </div>
  `;

  card.querySelector('.quick-view').addEventListener('click', () => showQuickView(product));
  card.querySelector('.add-to-wishlist').addEventListener('click', (e) => toggleWishlist(product.id, e.currentTarget));
  card.querySelector('.add-to-compare').addEventListener('click', (e) => addToCompare(product.id, e.currentTarget));
  card.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product.id));

  return card;
}

function createProductListItem(product, index) {
  const item = document.createElement('div');
  item.className = 'product-list-item';
  item.setAttribute('data-aos', 'fade-up');
  item.setAttribute('data-aos-delay', index * 60);

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  item.innerHTML = `
    <div class="product-list-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async">
      ${product.new ? '<span class="product-badge new">جدید</span>' : ''}
      ${product.sale ? `<span class="product-badge sale">${discount}%</span>` : ''}
    </div>
    <div class="product-list-content">
      <div class="product-list-header">
        <h3 class="product-name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="product-list-actions">
          <button class="action-btn quick-view" data-id="${product.id}" title="نمایش سریع"><i class="fas fa-eye"></i></button>
          <button class="action-btn add-to-wishlist ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}" title="علاقه‌مندی"><i class="fas fa-heart"></i></button>
          <button class="action-btn add-to-compare ${compareProducts.includes(product.id) ? 'active' : ''}" data-id="${product.id}" title="مقایسه"><i class="fas fa-exchange-alt"></i></button>
        </div>
      </div>
      <div class="product-list-info">
        <div class="product-rating"><div class="stars">${generateStars(product.rating)}</div><span class="reviews-count">(${toPersianNumber(product.reviews)})</span></div>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          <div class="product-sizes"><span>سایز:</span> ${product.sizes.map(s => `<span class="size-tag">${s}</span>`).join('')}</div>
          <div class="product-colors"><span>رنگ:</span> ${product.colors.map(c => `<span class="color-option" style="background-color:${c}"></span>`).join('')}</div>
        </div>
        <div class="product-list-footer">
          <div class="product-price">
            ${product.oldPrice ? `<span class="old-price">${toPersianNumber(product.oldPrice.toLocaleString())} تومان</span>` : ''}
            <span class="current-price">${toPersianNumber(product.price.toLocaleString())} تومان</span>
          </div>
          <button class="add-to-cart-btn" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> افزودن به سبد خرید</button>
        </div>
      </div>
    </div>
  `;

  item.querySelector('.quick-view').addEventListener('click', () => showQuickView(product));
  item.querySelector('.add-to-wishlist').addEventListener('click', (e) => toggleWishlist(product.id, e.currentTarget));
  item.querySelector('.add-to-compare').addEventListener('click', (e) => addToCompare(product.id, e.currentTarget));
  item.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product.id));

  return item;
}

function generateStars(rating) {
  let html = '';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i=0;i<full;i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-stroke"></i>';
  const empty = 5 - Math.ceil(rating);
  for (let i=0;i<empty;i++) html += '<i class="far fa-star"></i>';
  return html;
}

function updateProductCount() {
  const el = document.getElementById('productCount');
  if (el) el.textContent = toPersianNumber(filteredProducts.length.toLocaleString());
}

// View mode
function initViewMode() {
  const gridBtn = document.getElementById('gridView');
  const listBtn = document.getElementById('listView');

  const apply = () => {
    localStorage.setItem('shop_view', viewMode);
    [gridBtn, listBtn].forEach(btn => btn && btn.classList.remove('active'));
    gridBtn?.classList.toggle('active', viewMode === 'grid');
    listBtn?.classList.toggle('active', viewMode === 'list');
    gridBtn?.setAttribute('aria-pressed', String(viewMode === 'grid'));
    listBtn?.setAttribute('aria-pressed', String(viewMode === 'list'));
    displayProducts();
  };

  gridBtn?.addEventListener('click', () => { viewMode = 'grid'; apply(); });
  listBtn?.addEventListener('click', () => { viewMode = 'list'; apply(); });

  apply();
}

// Pagination
function initPagination() {
  document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; displayProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  });
  document.getElementById('nextPage')?.addEventListener('click', () => {
    const total = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < total) { currentPage++; displayProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  });
}

function updatePagination() {
  const total = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const prev = document.getElementById('prevPage');
  const next = document.getElementById('nextPage');
  const info = document.getElementById('pageInfo');
  prev && (prev.disabled = currentPage === 1);
  next && (next.disabled = currentPage === total || total === 0);
  info && (info.textContent = `${toPersianNumber(currentPage)} از ${toPersianNumber(total)}`);
}

// Sorting (top + sub)
function initSorting() {
  const sel1 = document.getElementById('sortProducts');
  const sel2 = document.getElementById('sortProductsSub');
  [sel1, sel2].forEach(sel => { if (sel) sel.value = filters.sort; });
  const onChange = function() {
    filters.sort = this.value;
    localStorage.setItem('shop_sort', filters.sort);
    currentPage = 1; applyFilters(); displayProducts();
    [sel1, sel2].forEach(sel => { if (sel && sel !== this) sel.value = filters.sort; });
  };
  sel1?.addEventListener('change', onChange);
  sel2?.addEventListener('change', onChange);
}

// Search (mirror)
function initSearch() {
  const i1 = document.getElementById('shopSearch');
  const i2 = document.getElementById('shopSearchSub');
  const handler = function() {
    filters.search = (this.value || '').toLowerCase().trim();
    currentPage = 1;
    applyFilters(); displayProducts(); updateProductCount();
    if (this === i1 && i2) i2.value = this.value;
    if (this === i2 && i1) i1.value = this.value;
  };
  i1?.addEventListener('input', debounce(handler, 300));
  i2?.addEventListener('input', debounce(handler, 300));
}

// Wishlist
function initWishlist() {
  try { const saved = localStorage.getItem('wishlist'); if (saved) wishlist = JSON.parse(saved); } catch(e){ wishlist = []; }
}
function toggleWishlist(productId, btn) {
  const idx = wishlist.indexOf(productId);
  if (idx === -1) { wishlist.push(productId); notify('محصول به علاقه‌مندی‌ها اضافه شد','success'); }
  else { wishlist.splice(idx,1); notify('محصول از علاقه‌مندی‌ها حذف شد','info'); }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  if (btn) btn.classList.toggle('active');
  document.querySelectorAll(`.add-to-wishlist[data-id="${productId}"]`).forEach(b => b.classList.toggle('active'));
}

// Cart
function initCart() {
  try { const saved = localStorage.getItem('cart'); if (saved) cart = JSON.parse(saved); } catch(e){ cart = []; }
  updateCartCount();
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    addToCart(id);
  });
}
function addToCart(productId, size, color, quantity = 1) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  const key = `${productId}_${size||''}_${color||''}`;
  let item = cart.find(i => i.key === key);
  if (item) item.quantity += quantity;
  else cart.push({ key, id: p.id, name: p.name, price: p.price, image: p.image, size: size||null, color: color||null, quantity });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  notify('محصول به سبد خرید اضافه شد','success');
  animateCartIcon();
}
function updateCartCount() {
  const el = document.querySelector('.cart-count');
  if (!el) return;
  const total = cart.reduce((s, i) => s + (i.quantity || 0), 0);
  el.textContent = toPersianNumber(total);
  el.style.display = total > 0 ? 'flex' : 'none';
}
function animateCartIcon() {
  const btn = document.querySelector('.cart-btn');
  if (!btn) return;
  btn.classList.add('animate-bounce');
  setTimeout(() => btn.classList.remove('animate-bounce'), 900);
}

// Compare
function initCompare() {
  updateCompareCount(compareProducts.length);
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-compare');
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    addToCompare(id, btn);
  });
}
function addToCompare(productId, btn) {
  if (compareProducts.length >= 3) return notify('حداکثر می‌توانید ۳ محصول را مقایسه کنید','error');
  if (compareProducts.includes(productId)) return notify('این محصول قبلاً به مقایسه اضافه شده','info');
  compareProducts.push(productId);
  localStorage.setItem('compare', JSON.stringify(compareProducts));
  btn && btn.classList.add('active');
  document.querySelectorAll(`.add-to-compare[data-id="${productId}"]`).forEach(b => b.classList.add('active'));
  updateCompareCount(compareProducts.length);
  notify('محصول به لیست مقایسه اضافه شد','success');
}
function updateCompareCount(count) {
  const el = document.querySelector('.compare-count');
  if (el) { el.textContent = toPersianNumber(count); el.style.display = count > 0 ? 'flex' : 'none'; }
}

// Quick View Modal
function initProductModal() {
  const modal = document.getElementById('productModal');
  const close = modal?.querySelector('.close-modal');
  close?.addEventListener('click', () => modal.classList.remove('active'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-backdrop')) modal.classList.remove('active');
  });
}
function showQuickView(product) {
  const modal = document.getElementById('productModal');
  if (!modal) return;
  const content = modal.querySelector('.modal-content');
  content.innerHTML = `
    <button type="button" class="close-modal" aria-label="بستن"><i class="fas fa-times"></i></button>
    <div class="product-modal-grid">
      <div class="product-modal-images">
        <div class="main-image"><img src="${product.image}" alt="${product.name}" id="modalMainImage"></div>
        <div class="thumbnail-images">
          ${product.images.map((img, i) => `<img src="${img}" alt="${product.name}" class="thumbnail ${i===0?'active':''}" data-index="${i}">`).join('')}
        </div>
      </div>
      <div class="product-modal-info">
        <h2 class="product-modal-name">${product.name}</h2>
        <div class="product-modal-rating"><div class="stars">${generateStars(product.rating)}</div><span class="reviews-count">(${toPersianNumber(product.reviews)} نظر)</span></div>
        <div class="product-modal-price">
          ${product.oldPrice ? `<span class="old-price">${toPersianNumber(product.oldPrice.toLocaleString())} تومان</span>` : ''}
          <span class="current-price">${toPersianNumber(product.price.toLocaleString())} تومان</span>
        </div>
        <p class="product-modal-description">${product.description}</p>
        <div class="product-modal-options">
          <div class="option-group"><h4>سایز</h4><div class="size-options">${product.sizes.map(s => `<button class="size-option" data-size="${s}">${s}</button>`).join('')}</div></div>
          <div class="option-group"><h4>رنگ</h4><div class="color-options">${product.colors.map(c => `<button class="color-option" data-color="${c}" style="background-color:${c}"></button>`).join('')}</div></div>
          <div class="option-group"><h4>تعداد</h4>
            <div class="quantity-selector"><button class="quantity-btn minus">-</button><input type="number" value="1" min="1" max="10" class="quantity-input"><button class="quantity-btn plus">+</button></div>
          </div>
        </div>
        <div class="product-modal-actions">
          <button class="add-to-cart-modal-btn" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> افزودن به سبد خرید</button>
          <button class="add-to-wishlist-modal-btn ${wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}"><i class="fas fa-heart"></i></button>
        </div>
        <div class="product-modal-details">
          <h4>جزئیات محصول</h4>
          <p>${product.details}</p>
          <div class="product-meta">
            <div class="meta-item"><span>جنس:</span><span>${product.material}</span></div>
            <div class="meta-item"><span>نحوه شستشو:</span><span>${product.care}</span></div>
            <div class="meta-item"><span>کشور سازنده:</span><span>${product.origin}</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
  const close = content.querySelector('.close-modal');
  close?.addEventListener('click', () => modal.classList.remove('active'));
  const mainImg = content.querySelector('#modalMainImage');
  content.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function(){
      const i = parseInt(this.dataset.index, 10);
      mainImg.src = product.images[i];
      content.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
  const sizeBtns = content.querySelectorAll('.size-option');
  sizeBtns.forEach(b => b.addEventListener('click', function(){ sizeBtns.forEach(x=>x.classList.remove('selected')); this.classList.add('selected'); }));
  const colorBtns = content.querySelectorAll('.color-option');
  colorBtns.forEach(b => b.addEventListener('click', function(){ colorBtns.forEach(x=>x.classList.remove('selected')); this.classList.add('selected'); }));
  const minus = content.querySelector('.minus'), plus = content.querySelector('.plus'), qty = content.querySelector('.quantity-input');
  minus?.addEventListener('click', () => { const v = Math.max(1, (parseInt(qty.value,10)||1)-1); qty.value = v; });
  plus?.addEventListener('click', () => { const v = Math.min(10,(parseInt(qty.value,10)||1)+1); qty.value = v; });
  const addBtn = content.querySelector('.add-to-cart-modal-btn');
  addBtn?.addEventListener('click', function(){
    const selSize = content.querySelector('.size-option.selected');
    const selColor = content.querySelector('.color-option.selected');
    if (!selSize) return notify('لطفاً سایز را انتخاب کنید','error');
    if (!selColor) return notify('لطفاً رنگ را انتخاب کنید','error');
    const q = Math.max(1, Math.min(10, parseInt(qty.value,10)||1));
    addToCart(product.id, selSize.dataset.size, selColor.dataset.color, q);
    modal.classList.remove('active');
  });
  const wlBtn = content.querySelector('.add-to-wishlist-modal-btn');
  wlBtn?.addEventListener('click', function(){ toggleWishlist(product.id, this); this.classList.toggle('active'); });

  modal.classList.add('active');
}

// Collapsible filters
function initFilterToggles() {
  document.querySelectorAll('.filter-header').forEach(h => {
    h.addEventListener('click', function(){ this.closest('.filter-section')?.classList.toggle('collapsed'); });
  });
}

// Mobile filters + bottom toolbar
function initMobileFilters() {
  const btn = document.getElementById('filterToggleBtn');
  const sidebar = document.getElementById('filtersSidebar');
  const overlay = document.getElementById('filtersOverlay');
  const open = () => { sidebar?.classList.add('active'); overlay?.classList.add('active'); document.documentElement.style.overflow = 'hidden'; };
  const close = () => { sidebar?.classList.remove('active'); overlay?.classList.remove('active'); document.documentElement.style.overflow = ''; };
  btn?.addEventListener('click', open);
  overlay?.addEventListener('click', close);

  const mbFilter = document.getElementById('mbFilter');
  const mbSort = document.getElementById('mbSort');
  const mbView = document.getElementById('mbView');
  mbFilter?.addEventListener('click', open);
  mbSort?.addEventListener('click', () => document.getElementById('sortProducts')?.focus());
  mbView?.addEventListener('click', () => {
    viewMode = viewMode === 'grid' ? 'list' : 'grid';
    localStorage.setItem('shop_view', viewMode);
    initViewMode();
  });
}

// Infinite scroll with sentinel
function initInfiniteSentinel() {
  const sentinel = document.getElementById('infiniteSentinel');
  if (!('IntersectionObserver' in window) || !sentinel) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const total = Math.ceil(filteredProducts.length / productsPerPage);
      if (currentPage < total) {
        currentPage++;
        appendNextPage();
      }
    });
  }, { rootMargin: '200px' });
  observer.observe(sentinel);
}
function appendNextPage() {
  const container = document.getElementById('productsContainer');
  if (!container) return;
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const items = filteredProducts.slice(startIndex, endIndex);
  if (viewMode === 'grid') items.forEach((p, i) => container.appendChild(createProductCard(p, i)));
  else items.forEach((p, i) => container.appendChild(createProductListItem(p, i)));
  updatePagination();
  try { if (window.AOS) AOS.refresh(); } catch(e){}
}

// Sliders
function initSliders() {
  try {
    if (typeof Swiper === 'undefined') return;
    new Swiper('.featured-swiper', {
      slidesPerView: 1.2,
      spaceBetween: 18,
      loop: true,
      centeredSlides: true,
      autoplay: { delay: 3500, disableOnInteraction: false },
      pagination: { el: '.featured-collections .swiper-pagination', clickable: true },
      breakpoints: { 768: { slidesPerView: 2.2 }, 1200: { slidesPerView: 3 } }
    });
    new Swiper('.brands-swiper', {
      slidesPerView: 2.2,
      spaceBetween: 16,
      loop: true,
      autoplay: { delay: 2500, disableOnInteraction: false },
      breakpoints: { 576: { slidesPerView: 3.5 }, 768: { slidesPerView: 4.5 }, 1200: { slidesPerView: 6 } }
    });
  } catch(e){}
}

// DISCOUNTS: Flash Sale + Coupon copy
function initDiscounts() {
  buildFlashSlides();
  initFlashSwiper();
  startFlashTimer();
}

function buildFlashSlides() {
  const wrap = document.getElementById('flashSaleSlides');
  if (!wrap) return;
  wrap.innerHTML = '';
  const saleItems = products.filter(p => p.sale || (p.oldPrice && p.oldPrice > p.price)).slice(0, 10);
  saleItems.forEach(p => {
    const discount = p.oldPrice ? Math.max(5, Math.round((1 - p.price / p.oldPrice) * 100)) : 10;
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="flash-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async">
        <div class="flash-info">
          <div class="flash-title">${p.name}</div>
          <div class="flash-price">
            ${p.oldPrice ? `<span class="old">${toPersianNumber(p.oldPrice.toLocaleString())} تومان</span>` : ''}
            <span class="new">${toPersianNumber(p.price.toLocaleString())} تومان</span>
          </div>
          <div class="flash-meta">
            <span><i class="fas fa-star"></i> ${p.rating.toFixed(1)}</span>
            <span><i class="fas fa-user"></i> ${toPersianNumber(p.reviews)}</span>
            <span><i class="fas fa-percent"></i> ${toPersianNumber(discount)}</span>
          </div>
          <div class="flash-timer" data-end="${flashEnd}">
            <div class="timer-box" data-d>00</div>
            <div class="timer-box" data-h>00</div>
            <div class="timer-box" data-m>00</div>
            <div class="timer-box" data-s>00</div>
          </div>
          <div class="flash-actions">
            <a class="btn btn-secondary" href="product.html?id=${p.id}"><i class="fas fa-eye"></i> مشاهده</a>
            <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}"><i class="fas fa-cart-plus"></i> افزودن</button>
          </div>
        </div>
      </div>
    `;
    wrap.appendChild(slide);
  });
}

function initFlashSwiper() {
  try {
    if (typeof Swiper === 'undefined') return;
    new Swiper('.flash-swiper', {
      slidesPerView: 1.05,
      spaceBetween: 12,
      loop: false,
      pagination: { el: '.discounts-section .swiper-pagination', clickable: true },
      breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
    });
  } catch(e){}
}

function startFlashTimer() {
  const tick = () => {
    const timers = document.querySelectorAll('.flash-timer');
    if (!timers.length) return;
    const now = Date.now();
    const end = flashEnd;
    let diff = Math.max(0, end - now);
    const d = Math.floor(diff / (1000*60*60*24));
    diff %= (1000*60*60*24);
    const h = Math.floor(diff / (1000*60*60));
    diff %= (1000*60*60);
    const m = Math.floor(diff / (1000*60));
    diff %= (1000*60);
    const s = Math.floor(diff / 1000);
    timers.forEach(t => {
      const dEl = t.querySelector('[data-d]'); const hEl = t.querySelector('[data-h]');
      const mEl = t.querySelector('[data-m]'); const sEl = t.querySelector('[data-s]');
      if (dEl) dEl.textContent = toPersianNumber(String(d).padStart(2,'0'));
      if (hEl) hEl.textContent = toPersianNumber(String(h).padStart(2,'0'));
      if (mEl) mEl.textContent = toPersianNumber(String(m).padStart(2,'0'));
      if (sEl) sEl.textContent = toPersianNumber(String(s).padStart(2,'0'));
    });
  };
  tick();
  setInterval(tick, 1000);
}

function initCouponCopy() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copy-coupon');
    if (!btn) return;
    const code = btn.dataset.code;
    try {
      await navigator.clipboard.writeText(code);
      notify('کد تخفیف کپی شد: ' + code, 'success');
    } catch (err) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); notify('کد تخفیف کپی شد: ' + code, 'success'); }
      catch(e){ notify('کپی نشد. دستی وارد کنید: ' + code, 'error'); }
      ta.remove();
    }
  });
}

// FAQ
function initFAQ() {
  document.querySelectorAll('.faq-item .faq-q').forEach(btn => {
    btn.addEventListener('click', function(){
      const item = this.closest('.faq-item');
      item.classList.toggle('active');
    });
  });
}

// Tailor form
function initTailor() {
  const form = document.getElementById('tailorForm');
  const budget = document.getElementById('budgetRange');
  const budgetValue = document.getElementById('budgetValue');
  const files = document.getElementById('tailorFiles');
  const previews = document.getElementById('filePreviews');
  const success = document.getElementById('tailorSuccess');
  const tsId = document.getElementById('tsId');
  const tsClose = document.getElementById('tsClose');

  const toFa = n => toPersianNumber(n.toLocaleString()) + ' تومان';

  budget?.addEventListener('input', () => {
    const v = parseInt(budget.value, 10) || 0;
    budgetValue.textContent = toFa(v);
  });

  files?.addEventListener('change', () => {
    previews.innerHTML = '';
    const list = Array.from(files.files || []).slice(0,6);
    list.forEach(f => {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.src = url; img.alt = 'طرح';
      previews.appendChild(img);
    });
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateTailorForm(form)) return;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    payload.styles = Array.from(form.querySelectorAll('.style-tags input:checked')).map(i => i.value);
    payload.budget = budget?.value || '';
    payload.date = payload.date || '';
    payload.time = payload.time || '';
    payload.id = 'GW' + Math.floor(Math.random()*1e6).toString().padStart(6,'0');
    try {
      const all = JSON.parse(localStorage.getItem('tailor_requests') || '[]');
      all.push(payload);
      localStorage.setItem('tailor_requests', JSON.stringify(all));
    } catch(e){}
    tsId.textContent = payload.id;
    success.classList.add('active');
    tsClose?.addEventListener('click', () => success.classList.remove('active'), { once:true });
    success.addEventListener('click', (ev) => { if (ev.target.classList.contains('ts-backdrop')) success.classList.remove('active'); });
    form.reset(); previews.innerHTML = ''; budgetValue.textContent = toFa(3000000);
  });
}

function validateTailorForm(form) {
  let ok = true;
  const name = form.querySelector('input[name="name"]');
  const phone = form.querySelector('input[name="phone"]');
  const type = form.querySelector('select[name="type"]');
  const date = form.querySelector('input[name="date"]');
  const time = form.querySelector('input[name="time"]');
  const agree = document.getElementById('agree');

  const isValidPhone = (v) => {
    const s = (v || '').trim();
    const digits = (s.match(/[0-9\u06F0-\u06F9]/g) || []).length;
    return /^[\d\u06F0-\u06F9\s\-+()]+$/.test(s) && digits >= 10;
  };

  const err = (el, msg) => {
    ok = false;
    el.classList.add('error');
    if (!el.nextElementSibling || !el.nextElementSibling.classList?.contains('field-error')) {
      const sp = document.createElement('small');
      sp.className = 'field-error';
      sp.style.color = '#ff4444';
      sp.textContent = msg;
      el.parentNode.appendChild(sp);
    } else {
      el.nextElementSibling.textContent = msg;
    }
  };
  const clear = (el) => {
    el.classList.remove('error');
    if (el.nextElementSibling?.classList?.contains('field-error')) el.nextElementSibling.remove();
  };

  [name, phone, type, date, time].forEach(el => clear(el));

  if (!name.value.trim()) err(name, 'نام الزامی است');
  if (!isValidPhone(phone.value)) err(phone, 'شماره معتبر نیست');
  if (!type.value) err(type, 'نوع سفارش را انتخاب کنید');
  if (!date.value) err(date, 'تاریخ را انتخاب کنید');
  if (!time.value) err(time, 'ساعت را انتخاب کنید');
  if (!agree.checked) { ok = false; notify('لطفاً با قوانین موافقت کنید', 'error'); }

  return ok;
}

// Helpers
function debounce(fn, wait=300) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }
function toPersianNumber(str) { const p = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']; return str.toString().replace(/[0-9]/g, d => p[d]); }

// Notifications (fallback if main.js not loaded)
function notify(message, type='info') {
  if (typeof window.showNotification === 'function') return window.showNotification(message, type);
  const icon = type==='success' ? 'check-circle' : type==='error' ? 'exclamation-circle' : 'info-circle';
  const n = document.createElement('div');
  n.style.cssText = 'position:fixed;top:90px;right:-400px;background:var(--bg-secondary);color:var(--text-primary);padding:12px 18px;border-radius:10px;border-right:4px solid var(--gold);box-shadow:0 5px 20px rgba(0,0,0,.25);display:flex;gap:8px;align-items:center;z-index:10000;transition:right .3s';
  n.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
  document.body.appendChild(n);
  setTimeout(()=> n.style.right='20px', 50);
  setTimeout(()=> { n.style.right='-400px'; setTimeout(()=> n.remove(), 350); }, 2500);
}