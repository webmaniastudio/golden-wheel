// ========== متغیرهای سراسری ==========
let currentUser = null;
let loginForm = null;
let registerForm = null;
let forgotForm = null;
let activeTab = 'login';

// ========== اجرای اولیه ==========
document.addEventListener('DOMContentLoaded', function() {
  initAuth();
  initTabs();
  initLoginForm();
  initRegisterForm();
  initForgotForm();
  initSocialLogin();
  initRememberMe();
  initPasswordStrength();
  initFormValidation();
  
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
function initAuth() {
  // بررسی وجود کاربر لاگین کرده
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    
    // اگر کاربر لاگین کرده باشد، به داشبورد هدایت شود
    if (window.location.pathname.includes('auth.html')) {
      window.location.href = 'dashboard.html';
    }
  }
  
  // دریافت فرم‌ها
  loginForm = document.getElementById('loginForm');
  registerForm = document.getElementById('registerForm');
  forgotForm = document.getElementById('forgotForm');
}

function initTabs() {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const forgotTab = document.getElementById('forgotTab');
  
  if (loginTab) {
    loginTab.addEventListener('click', function() {
      showTab('login');
    });
  }
  
  if (registerTab) {
    registerTab.addEventListener('click', function() {
      showTab('register');
    });
  }
  
  if (forgotTab) {
    forgotTab.addEventListener('click', function() {
      showTab('forgot');
    });
  }
}

function showTab(tabName) {
  activeTab = tabName;
  
  // مخفی کردن همه فرم‌ها
  document.querySelectorAll('.auth-form').forEach(form => {
    form.style.display = 'none';
  });
  
  // غیرفعال کردن همه تب‌ها
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // نمایش فرم فعال
  const activeForm = document.getElementById(tabName + 'Form');
  if (activeForm) {
    activeForm.style.display = 'block';
  }
  
  // فعال کردن تب مربوطه
  const activeTabElement = document.getElementById(tabName + 'Tab');
  if (activeTabElement) {
    activeTabElement.classList.add('active');
  }
  
  // به‌روزرسانی عنوان صفحه
  updatePageTitle(tabName);
}

function updatePageTitle(tabName) {
  const titles = {
    'login': 'ورود به حساب کاربری',
    'register': 'ثبت‌نام',
    'forgot': 'فراموشی رمز عبور'
  };
  
  document.title = `${titles[tabName]} | چرخ طلایی`;
}

function initLoginForm() {
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // اعتبارسنجی فرم
    if (!validateLoginForm(email, password)) {
      return;
    }
    
    // شبیه‌سازی ورود به سیستم
    const user = authenticateUser(email, password);
    
    if (user) {
      // ذخیره کاربر
      currentUser = user;
      
      // ذخیره در localStorage
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      // نمایش اعلان موفقیت
      showNotification('ورود با موفقیت انجام شد', 'success');
      
      // هدایت به داشبورد
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      showNotification('ایمیل یا رمز عبور اشتباه است', 'error');
    }
  });
}

function validateLoginForm(email, password) {
  if (!email) {
    showNotification('لطفاً ایمیل را وارد کنید', 'error');
    return false;
  }
  
  if (!isValidEmail(email)) {
    showNotification('ایمیل معتبر نیست', 'error');
    return false;
  }
  
  if (!password) {
    showNotification('لطفاً رمز عبور را وارد کنید', 'error');
    return false;
  }
  
  if (password.length < 6) {
    showNotification('رمز عبور باید حداقل ۶ کاراکتر باشد', 'error');
    return false;
  }
  
  return true;
}

function authenticateUser(email, password) {
  // شبیه‌سازی پایگاه داده کاربران
  const users = [
    {
      id: 1,
      name: 'کاربر تست',
      email: 'test@example.com',
      password: '123456', // در حالت واقعی باید هش شده باشد
      phone: '09123456789',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'user',
      registerDate: '2023-01-01'
    },
    {
      id: 2,
      name: 'ادمین تست',
      email: 'admin@example.com',
      password: 'admin123', // در حالت واقعی باید هش شده باشد
      phone: '09876543210',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'admin',
      registerDate: '2023-01-01'
    }
  ];
  
  // جستجوی کاربر
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // حذف رمز عبور قبل از بازگشت
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

function initRegisterForm() {
  if (!registerForm) return;
  
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // اعتبارسنجی فرم
    if (!validateRegisterForm(name, email, phone, password, confirmPassword, agreeTerms)) {
      return;
    }
    
    // شبیه‌سازی ثبت‌نام
    const user = registerUser(name, email, phone, password);
    
    if (user) {
      // ذخیره کاربر
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // نمایش اعلان موفقیت
      showNotification('ثبت‌نام با موفقیت انجام شد', 'success');
      
      // هدایت به داشبورد
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      showNotification('این ایمیل قبلاً ثبت شده است', 'error');
    }
  });
}

function validateRegisterForm(name, email, phone, password, confirmPassword, agreeTerms) {
  if (!name) {
    showNotification('لطفاً نام و نام خانوادگی را وارد کنید', 'error');
    return false;
  }
  
  if (name.length < 3) {
    showNotification('نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد', 'error');
    return false;
  }
  
  if (!email) {
    showNotification('لطفاً ایمیل را وارد کنید', 'error');
    return false;
  }
  
  if (!isValidEmail(email)) {
    showNotification('ایمیل معتبر نیست', 'error');
    return false;
  }
  
  if (!phone) {
    showNotification('لطفاً شماره تماس را وارد کنید', 'error');
    return false;
  }
  
  if (!isValidPhone(phone)) {
    showNotification('شماره تماس معتبر نیست', 'error');
    return false;
  }
  
  if (!password) {
    showNotification('لطفاً رمز عبور را وارد کنید', 'error');
    return false;
  }
  
  if (password.length < 6) {
    showNotification('رمز عبور باید حداقل ۶ کاراکتر باشد', 'error');
    return false;
  }
  
  if (!isValidPassword(password)) {
    showNotification('رمز عبور باید شامل حروف و اعداد باشد', 'error');
    return false;
  }
  
  if (password !== confirmPassword) {
    showNotification('رمز عبور و تکرار آن یکسان نیست', 'error');
    return false;
  }
  
  if (!agreeTerms) {
    showNotification('لطفاً قوانین و مقررات را بپذیرید', 'error');
    return false;
  }
  
  return true;
}

function registerUser(name, email, phone, password) {
  // شبیه‌سازی پایگاه داده کاربران
  const users = [
    {
      id: 1,
      name: 'کاربر تست',
      email: 'test@example.com',
      password: '123456',
      phone: '09123456789',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'user',
      registerDate: '2023-01-01'
    },
    {
      id: 2,
      name: 'ادمین تست',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '09876543210',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'admin',
      registerDate: '2023-01-01'
    }
  ];
  
  // بررسی وجود ایمیل
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return null;
  }
  
  // ایجاد کاربر جدید
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password, // در حالت واقعی باید هش شود
    phone,
    avatar: `https://i.pravatar.cc/150?img=${users.length + 1}`,
    role: 'user',
    registerDate: new Date().toISOString().split('T')[0]
  };
  
  // در حالت واقعی باید در دیتابیس ذخیره شود
  users.push(newUser);
  
  // حذف رمز عبور قبل از بازگشت
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

function initForgotForm() {
  if (!forgotForm) return;
  
  forgotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    // اعتبارسنجی فرم
    if (!validateForgotForm(email)) {
      return;
    }
    
    // شبیه‌سازی ارسال ایمیل بازیابی
    const success = sendResetEmail(email);
    
    if (success) {
      showNotification('ایمیل بازیابی رمز عبور ارسال شد', 'success');
      
      // بازگشت به تب ورود
      setTimeout(() => {
        showTab('login');
      }, 2000);
    } else {
      showNotification('ایمیل وارد شده معتبر نیست', 'error');
    }
  });
}

function validateForgotForm(email) {
  if (!email) {
    showNotification('لطفاً ایمیل را وارد کنید', 'error');
    return false;
  }
  
  if (!isValidEmail(email)) {
    showNotification('ایمیل معتبر نیست', 'error');
    return false;
  }
  
  return true;
}

function sendResetEmail(email) {
  // شبیه‌سازی پایگاه داده کاربران
  const users = [
    {
      id: 1,
      name: 'کاربر تست',
      email: 'test@example.com',
      password: '123456',
      phone: '09123456789',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'user',
      registerDate: '2023-01-01'
    },
    {
      id: 2,
      name: 'ادمین تست',
      email: 'admin@example.com',
      password: 'admin123',
      phone: '09876543210',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'admin',
      registerDate: '2023-01-01'
    }
  ];
  
  // بررسی وجود ایمیل
  const user = users.find(u => u.email === email);
  return !!user;
}

function initSocialLogin() {
  // ورود با گوگل
  const googleLoginBtn = document.getElementById('googleLogin');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', function() {
      showNotification('ورود با گوگل به زودی فعال می‌شود', 'info');
    });
  }
  
  // ورود با تلگرام
  const telegramLoginBtn = document.getElementById('telegramLogin');
  if (telegramLoginBtn) {
    telegramLoginBtn.addEventListener('click', function() {
      showNotification('ورود با تلگرام به زودی فعال می‌شود', 'info');
    });
  }
}

function initRememberMe() {
  const rememberMe = document.getElementById('rememberMe');
  
  if (rememberMe) {
    rememberMe.addEventListener('change', function() {
      if (this.checked) {
        // ذخیره ایمیل برای دفعات بعدی
        const email = document.getElementById('loginEmail').value;
        if (email) {
          localStorage.setItem('rememberedEmail', email);
        }
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    });
  }
  
  // بازیابی ایمیل ذخیره شده
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    const emailInput = document.getElementById('loginEmail');
    if (emailInput) {
      emailInput.value = rememberedEmail;
      rememberMe.checked = true;
    }
  }
}

function initPasswordStrength() {
  const passwordInput = document.getElementById('registerPassword');
  const strengthMeter = document.getElementById('passwordStrength');
  
  if (passwordInput && strengthMeter) {
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      const strength = calculatePasswordStrength(password);
      updatePasswordStrength(strength);
    });
  }
}

function calculatePasswordStrength(password) {
  let strength = 0;
  
  // طول رمز عبور
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  
  // شامل حروف کوچک و بزرگ
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  
  // شامل اعداد
  if (/[0-9]/.test(password)) strength++;
  
  // شامل کاراکترهای خاص
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return strength;
}

function updatePasswordStrength(strength) {
  const strengthMeter = document.getElementById('passwordStrength');
  const strengthText = document.getElementById('strengthText');
  
  if (!strengthMeter || !strengthText) return;
  
  // حذف کلاس‌های قبلی
  strengthMeter.className = 'strength-meter';
  
  // به‌روزرسانی بر اساس قدرت رمز عبور
  switch (strength) {
    case 0:
    case 1:
      strengthMeter.classList.add('weak');
      strengthText.textContent = 'ضعیف';
      strengthText.style.color = '#ff4444';
      break;
    case 2:
    case 3:
      strengthMeter.classList.add('medium');
      strengthText.textContent = 'متوسط';
      strengthText.style.color = '#ffbb33';
      break;
    case 4:
    case 5:
      strengthMeter.classList.add('strong');
      strengthText.textContent = 'قوی';
      strengthText.style.color = '#00C851';
      break;
  }
}

function initFormValidation() {
  // اعتبارسنجی لحظه‌ای ایمیل
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !isValidEmail(this.value)) {
        this.classList.add('error');
        showFieldError(this, 'ایمیل معتبر نیست');
      } else {
        this.classList.remove('error');
        clearFieldError(this);
      }
    });
  });
  
  // اعتبارسنجی لحظه‌ای شماره تماس
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !isValidPhone(this.value)) {
        this.classList.add('error');
        showFieldError(this, 'شماره تماس معتبر نیست');
      } else {
        this.classList.remove('error');
        clearFieldError(this);
      }
    });
  });
  
  // اعتبارسنجی لحظه‌ای رمز عبور
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && this.value.length < 6) {
        this.classList.add('error');
        showFieldError(this, 'رمز عبور باید حداقل ۶ کاراکتر باشد');
      } else {
        this.classList.remove('error');
        clearFieldError(this);
      }
    });
  });
}

function showFieldError(field, message) {
  // حذف پیام خطای قبلی
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  
  // ایجاد پیام خطای جدید
  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.textContent = message;
  
  field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
  const errorElement = field.parentNode.querySelector('.field-error');
  if (errorElement) {
    errorElement.remove();
  }
}

// ========== توابع کمکی ==========
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s\-\+KATEX_INLINE_OPENKATEX_INLINE_CLOSE]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function isValidPassword(password) {
  // شامل حروف و اعداد
  return /[A-Za-z]/.test(password) && /[0-9]/.test(password);
}

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

// ========== توابع خروج ==========
function logout() {
  // حذف کاربر از localStorage و sessionStorage
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentUser');
  
  // حذف اطلاعات به خاطر سپرده شده
  localStorage.removeItem('rememberedEmail');
  
  // هدایت به صفحه اصلی
  window.location.href = 'index.html';
}

console.log('🔐 احراز هویت آماده است!');