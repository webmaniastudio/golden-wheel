// ========== متغیرهای سراسری ==========
let cart = [];
let couponCode = '';
let discount = 0;
let shipping = 50000; // هزینه ارسال ثابت

// ========== اجرای اولیه ==========
document.addEventListener('DOMContentLoaded', function() {
  initCart();
  initCoupon();
  initCheckout();
  initQuantityControls();
  initRemoveItem();
  initContinueShopping();
  
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
      disable: 'mobile'
    });
  }
});

// ========== توابع اصلی ==========
function initCart() {
  // دریافت سبد خرید از localStorage
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  
  // نمایش سبد خرید
  displayCart();
  
  // به‌روزرسانی خلاصه سفارش
  updateOrderSummary();
}

function displayCart() {
  const cartContainer = document.getElementById('cartContainer');
  const emptyCart = document.getElementById('emptyCart');
  const cartContent = document.getElementById('cartContent');
  
  if (!cartContainer) return;
  
  // پاک کردن محتوا
  cartContainer.innerHTML = '';
  
  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }
  
  if (emptyCart) emptyCart.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';
  
  // نمایش محصولات سبد خرید
  cart.forEach((item, index) => {
    const cartItem = createCartItem(item, index);
    cartContainer.appendChild(cartItem);
  });
  
  // راه‌اندازی انیمیشن‌ها
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}

function createCartItem(item, index) {
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item animate-fadeInUp';
  cartItem.setAttribute('data-aos', 'fade-up');
  cartItem.setAttribute('data-aos-delay', index * 100);
  
  cartItem.innerHTML = `
    <div class="cart-item-image">
      <img src="${item.image}" alt="${item.name}">
    </div>
    <div class="cart-item-info">
      <h3 class="cart-item-name">${item.name}</h3>
      <div class="cart-item-details">
        ${item.size ? `<span class="cart-item-size">سایز: ${item.size}</span>` : ''}
        ${item.color ? `<span class="cart-item-color">رنگ: ${item.color}</span>` : ''}
      </div>
      <div class="cart-item-price">
        <span class="current-price">${toPersianNumber(item.price.toLocaleString())} تومان</span>
      </div>
    </div>
    <div class="cart-item-actions">
      <div class="quantity-control">
        <button class="quantity-btn minus" data-index="${index}">-</button>
        <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input" data-index="${index}">
        <button class="quantity-btn plus" data-index="${index}">+</button>
      </div>
      <div class="cart-item-total">
        ${toPersianNumber((item.price * item.quantity).toLocaleString())} تومان
      </div>
      <button class="remove-item" data-index="${index}">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  
  return cartItem;
}

function updateOrderSummary() {
  const subtotalElement = document.getElementById('subtotal');
  const discountElement = document.getElementById('discount');
  const shippingElement = document.getElementById('shipping');
  const totalElement = document.getElementById('total');
  
  // محاسبه subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // محاسبه تخفیف
  const discountAmount = subtotal * (discount / 100);
  
  // محاسره مجموع
  const total = subtotal - discountAmount + shipping;
  
  // به‌روزرسانی عناصر
  if (subtotalElement) subtotalElement.textContent = toPersianNumber(subtotal.toLocaleString()) + ' تومان';
  if (discountElement) discountElement.textContent = toPersianNumber(discountAmount.toLocaleString()) + ' تومان';
  if (shippingElement) shippingElement.textContent = toPersianNumber(shipping.toLocaleString()) + ' تومان';
  if (totalElement) totalElement.textContent = toPersianNumber(total.toLocaleString()) + ' تومان';
}

function initCoupon() {
  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCoupon');
  
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', function() {
      const code = couponInput ? couponInput.value.trim() : '';
      
      if (!code) {
        showNotification('لطفاً کد تخفیف را وارد کنید', 'error');
        return;
      }
      
      // شبیه‌سازی اعتبارسنجی کد تخفیف
      if (validateCoupon(code)) {
        couponCode = code;
        discount = getCouponDiscount(code);
        showNotification('کد تخفیف با موفقیت اعمال شد', 'success');
        updateOrderSummary();
      } else {
        showNotification('کد تخفیف معتبر نیست', 'error');
      }
    });
  }
}

function validateCoupon(code) {
  // کدهای تخفیف معتبر
  const validCoupons = ['GOLDEN10', 'WELCOME20', 'SPECIAL15'];
  return validCoupons.includes(code.toUpperCase());
}

function getCouponDiscount(code) {
  // درصدهای تخفیف برای هر کد
  const discounts = {
    'GOLDEN10': 10,
    'WELCOME20': 20,
    'SPECIAL15': 15
  };
  
  return discounts[code.toUpperCase()] || 0;
}

function initCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) {
        showNotification('سبد خرید شما خالی است', 'error');
        return;
      }
      
      // ذخیره سبد خرید در localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // رفتن به صفحه پرداخت
      window.location.href = 'checkout.html';
    });
  }
}

function initQuantityControls() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('minus') || e.target.classList.contains('plus')) {
      const index = parseInt(e.target.dataset.index);
      const input = document.querySelector(`.quantity-input[data-index="${index}"]`);
      
      if (e.target.classList.contains('minus')) {
        // کاهش تعداد
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        }
      } else {
        // افزایش تعداد
        if (cart[index].quantity < 10) {
          cart[index].quantity++;
        }
      }
      
      // به‌روزرسانی input
      input.value = cart[index].quantity;
      
      // به‌روزرسانی مجموع
      const totalElement = e.target.closest('.cart-item').querySelector('.cart-item-total');
      if (totalElement) {
        totalElement.textContent = toPersianNumber((cart[index].price * cart[index].quantity).toLocaleString()) + ' تومان';
      }
      
      // ذخیره در localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // به‌روزرسانی خلاصه سفارش
      updateOrderSummary();
    }
  });
  
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('quantity-input')) {
      const index = parseInt(e.target.dataset.index);
      const value = parseInt(e.target.value);
      
      // اعتبارسنجی مقدار
      if (value >= 1 && value <= 10) {
        cart[index].quantity = value;
        
        // به‌روزرسانی مجموع
        const totalElement = e.target.closest('.cart-item').querySelector('.cart-item-total');
        if (totalElement) {
          totalElement.textContent = toPersianNumber((cart[index].price * cart[index].quantity).toLocaleString()) + ' تومان';
        }
        
        // ذخیره در localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // به‌روزرسانی خلاصه سفارش
        updateOrderSummary();
      } else {
        // بازگرداندن مقدار قبلی
        e.target.value = cart[index].quantity;
      }
    }
  });
}

function initRemoveItem() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-item')) {
      const index = parseInt(e.target.closest('.remove-item').dataset.index);
      
      // حذف آیتم از سبد خرید
      cart.splice(index, 1);
      
      // ذخیره در localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // نمایش مجدد سبد خرید
      displayCart();
      
      // به‌روزرسانی خلاصه سفارش
      updateOrderSummary();
      
      // به‌روزرسانی تعداد سبد خرید در هدر
      updateCartCount();
      
      // نمایش اعلان
      showNotification('محصول از سبد خرید حذف شد', 'info');
    }
  });
}

function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
      cartCount.style.display = 'flex';
    } else {
      cartCount.style.display = 'none';
    }
  }
}

function initContinueShopping() {
  const continueBtn = document.getElementById('continueShopping');
  
  if (continueBtn) {
    continueBtn.addEventListener('click', function() {
      window.location.href = 'shop.html';
    });
  }
}

// ========== توابع کمکی ==========
function toPersianNumber(str) {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/[0-9]/g, x => persianNumbers[x]);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

console.log('🛒 سبد خرید آماده است!');