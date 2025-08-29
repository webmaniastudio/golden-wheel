// ========== متغیرهای سراسری ==========
let isLoading = true;
let currentTheme = localStorage.getItem('theme') || 'dark';
let scrollPosition = 0;
let chatMessages = [];

// ========== اجرای اولیه ==========
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initTheme();
    initScrollEffects();
    initMobileMenu();
    initSearch();
    initChat();
    initParticles();
    initAnimations();
    initGalleryFilter();
    initReviewForm();
    initSwiper();
    initCountdown();
    initStats();
    initSmoothScroll();
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

// ========== لودر صفحه ==========
function initLoader() {
    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('.loader-progress-bar');
    
    // شبیه‌سازی بارگذاری
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                isLoading = false;
                
                // شروع انیمیشن‌های ورودی
                startEntryAnimations();
            }, 500);
        }
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }, 200);
}

// ========== انیمیشن‌های ورودی ==========
function startEntryAnimations() {
    // انیمیشن لوگو
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.animation = 'slideInRight 0.8s ease-out';
    }
    
    // انیمیشن منو
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.style.animation = `fadeInDown 0.5s ease-out ${index * 0.1}s both`;
    });
    
    // انیمیشن دکمه‌ها
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.style.animation = 'slideInLeft 0.8s ease-out';
    }
}

// ========== مدیریت تم ==========
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // اعمال تم ذخیره شده
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // انیمیشن تغییر تم
    document.body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // افکت موج
    createRippleEffect(event);
}

function updateThemeIcon() {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (currentTheme === 'dark') {
        sunIcon?.classList.remove('active');
        moonIcon?.classList.add('active');
    } else {
        moonIcon?.classList.remove('active');
        sunIcon?.classList.add('active');
    }
}

function createRippleEffect(e) {
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
}

// ========== افکت‌های اسکرول ==========
function initScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    const header = document.querySelector('.main-header');
    const progressCircle = document.querySelector('.progress-ring-circle');
    
    window.addEventListener('scroll', () => {
        scrollPosition = window.scrollY;
        
        // نمایش/مخفی کردن دکمه برگشت به بالا
        if (scrollTopBtn) {
            if (scrollPosition > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
        
        // پیشرفت اسکرول
        if (progressCircle) {
            const scrollPercentage = (scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            const dashOffset = 144.51 - (144.51 * scrollPercentage) / 100;
            progressCircle.style.strokeDashoffset = dashOffset;
        }
        
        // هدر چسبنده با افکت
        if (header) {
            if (scrollPosition > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // پارالاکس افکت
        updateParallax();
    });
    
    // دکمه برگشت به بالا
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function updateParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const offset = scrollPosition * speed;
        element.style.transform = `translateY(${offset}px)`;
    });
}

// ========== منوی موبایل ==========
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const hasSubmenu = document.querySelectorAll('.has-submenu > a');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', openMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // زیرمنوها
    hasSubmenu.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            
            // بستن سایر زیرمنوها
            document.querySelectorAll('.has-submenu.active').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                }
            });
            
            parent.classList.toggle('active');
        });
    });
    
    // Swipe gestures برای موبایل
    initTouchGestures();
}

function openMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    
    mobileMenu?.classList.add('active');
    mobileToggle?.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // ایجاد overlay
    createOverlay('mobile-menu-overlay', closeMobileMenu);
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    
    mobileMenu?.classList.remove('active');
    mobileToggle?.classList.remove('active');
    document.body.style.overflow = '';
    
    removeOverlay('mobile-menu-overlay');
}

function initTouchGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    const threshold = 100;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        
        // Swipe left - open menu
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && touchStartX < 50) {
                openMobileMenu();
            }
            // Swipe right - close menu
            else if (diff < 0) {
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu?.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        }
    }
}

// ========== جستجو ==========
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', openSearch);
    }
    
    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }
    
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });
    }
    
    // جستجوی لحظه‌ای
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
    
    // بستن با ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeSearch();
            closeMobileMenu();
        }
    });
}

function openSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    
    searchOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        searchInput?.focus();
    }, 300);
}

function closeSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    
    searchOverlay?.classList.remove('active');
    document.body.style.overflow = '';
}

function performSearch(query) {
    console.log('Searching for:', query);
    // اینجا می‌توانید منطق جستجو را پیاده‌سازی کنید
}

// ========== چت پشتیبانی ==========
function initChat() {
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const quickReplies = document.querySelectorAll('.quick-reply');
    
    if (chatToggle) {
        chatToggle.addEventListener('click', toggleChat);
    }
    
    if (chatClose) {
        chatClose.addEventListener('click', closeChat);
    }
    
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // پاسخ‌های سریع
    quickReplies.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.textContent;
            chatInput.value = message;
            sendMessage();
        });
    });
}

function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    chatBox?.classList.toggle('active');
    
    if (chatBox?.classList.contains('active')) {
        playSound('open');
        setTimeout(() => {
            document.getElementById('chatInput')?.focus();
        }, 300);
    }
}

function closeChat() {
    const chatBox = document.getElementById('chatBox');
    chatBox?.classList.remove('active');
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput?.value.trim();
    
    if (!message) return;
    
    // اضافه کردن پیام کاربر
    addChatMessage(message, 'user');
    
    // پاک کردن input
    chatInput.value = '';
    
    // نمایش typing
    showTypingIndicator();
    
    // پاسخ خودکار
    setTimeout(() => {
        hideTypingIndicator();
        const response = getAutoResponse(message);
        addChatMessage(response, 'bot');
        playSound('message');
    }, 1500);
}

function addChatMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender} animate-message`;
    
    const time = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <img src="assets/images/${sender}-avatar.png" alt="${sender}">
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.innerHTML = `
        <img src="assets/images/bot-avatar.png" alt="bot">
        <div class="message-content">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typing = document.querySelector('.typing-indicator');
    typing?.remove();
}

function getAutoResponse(message) {
    const responses = {
        'سلام': 'سلام! چطور می‌تونم کمکتون کنم؟',
        'قیمت': 'برای اطلاع از قیمت‌ها می‌تونید به بخش فروشگاه مراجعه کنید یا با شماره ۰۲۱-۱۲۳۴۵۶۷۸ تماس بگیرید.',
        'آموزش': 'ما دوره‌های متنوعی از مقدماتی تا حرفه‌ای داریم. برای اطلاعات بیشتر به بخش آکادمی مراجعه کنید.',
        'زمان': 'زمان دوخت معمولاً بین ۷ تا ۱۴ روز کاری است، بسته به نوع سفارش.',
        'آدرس': 'آدرس ما: تهران، خیابان ولیعصر، پلاک ۱۲۳',
        'default': 'متشکرم از پیام شما. یکی از همکاران ما به زودی پاسخ خواهد داد.'
    };
    
    const lowercaseMessage = message.toLowerCase();
    
    for (let key in responses) {
        if (lowercaseMessage.includes(key)) {
            return responses[key];
        }
    }
    
    return responses.default;
}

// ========== ذرات متحرک ==========
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    if (window.innerWidth <= 768) {
        particle.style.width = '2px';
        particle.style.height = '2px';
    }
    
    container.appendChild(particle);
}

// ========== انیمیشن‌ها ==========
function initAnimations() {
    // Intersection Observer برای انیمیشن‌های اسکرول
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // انیمیشن‌های مختلف بر اساس کلاس
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.style.animation = 'fadeIn 0.6s ease forwards';
                }
                if (entry.target.classList.contains('slide-up')) {
                    entry.target.style.animation = 'slideUp 0.6s ease forwards';
                }
                if (entry.target.classList.contains('zoom-in')) {
                    entry.target.style.animation = 'zoomIn 0.5s ease forwards';
                }
            }
        });
    }, observerOptions);
    
    // اضافه کردن المان‌ها به observer
    document.querySelectorAll('.feature-card, .gallery-item, .course-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// ========== فیلتر گالری ==========
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // تغییر کلاس active
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // فیلتر آیتم‌ها
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'zoomIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ========== فرم نظرات ==========
function initReviewForm() {
    const addReviewBtn = document.getElementById('addReviewBtn');
    const reviewForm = document.getElementById('reviewForm');
    const cancelReview = document.getElementById('cancelReview');
    const stars = document.querySelectorAll('.star-rating i');
    
    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', () => {
            reviewForm?.classList.add('active');
            addReviewBtn.style.display = 'none';
        });
    }
    
    if (cancelReview) {
        cancelReview.addEventListener('click', () => {
            reviewForm?.classList.remove('active');
            document.getElementById('addReviewBtn').style.display = 'inline-flex';
        });
    }
    
    // رتبه‌دهی ستاره‌ای
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            updateStarRating(rating);
        });
        
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });
    });
    
    document.querySelector('.star-rating')?.addEventListener('mouseleave', () => {
        const currentRating = document.querySelector('.star-rating').dataset.rating || 0;
        updateStarRating(currentRating);
    });
}

function updateStarRating(rating) {
    const stars = document.querySelectorAll('.star-rating i');
    const starRating = document.querySelector('.star-rating');
    
    if (starRating) {
        starRating.dataset.rating = rating;
    }
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating i');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// ========== Swiper ==========
function initSwiper() {
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }
}

// ========== شمارش معکوس ==========
function initCountdown() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 روز از الان
    
    function updateCountdown() {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = toPersianNumber(days.toString().padStart(2, '0'));
        document.getElementById('hours').textContent = toPersianNumber(hours.toString().padStart(2, '0'));
        document.getElementById('minutes').textContent = toPersianNumber(minutes.toString().padStart(2, '0'));
        document.getElementById('seconds').textContent = toPersianNumber(seconds.toString().padStart(2, '0'));
    }
    
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

// ========== شمارنده آمار ==========
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const counter = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(counter);
        }
        element.textContent = toPersianNumber(Math.floor(current).toLocaleString());
    }, 16);
}

// ========== اسکرول نرم ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offset = 80; // ارتفاع هدر
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // بستن منوی موبایل در صورت باز بودن
                closeMobileMenu();
            }
        });
    });
}

// ========== اعتبارسنجی فرم ==========
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // ارسال فرم
                showNotification('فرم با موفقیت ارسال شد!', 'success');
                this.reset();
            }
        });
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'این فیلد الزامی است');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // اعتبارسنجی ایمیل
        if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, 'ایمیل معتبر نیست');
            isValid = false;
        }
        
        // اعتبارسنجی تلفن
        if (field.type === 'tel' && !isValidPhone(field.value)) {
            showFieldError(field, 'شماره تلفن معتبر نیست');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.nextElementSibling;
    if (!errorElement?.classList.contains('field-error')) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.nextElementSibling;
    if (errorElement?.classList.contains('field-error')) {
        errorElement.remove();
    }
}

// ========== توابع کمکی ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function toPersianNumber(str) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/[0-9]/g, x => persianNumbers[x]);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\-\+KATEX_INLINE_OPENKATEX_INLINE_CLOSE]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function createOverlay(className, clickHandler) {
    const overlay = document.createElement('div');
    overlay.className = className + ' overlay';
    document.body.appendChild(overlay);
    
    if (clickHandler) {
        overlay.addEventListener('click', clickHandler);
    }
    
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
}

function removeOverlay(className) {
    const overlay = document.querySelector('.' + className);
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
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

function playSound(type) {
    // می‌توانید صداهای مختلف را اینجا پخش کنید
    const audio = new Audio(`assets/sounds/${type}.mp3`);
    audio.play().catch(e => console.log('Sound play failed:', e));
}

// ========== مدیریت رزایز پنجره ==========
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // بروزرسانی المان‌های وابسته به اندازه
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
        
        // بروزرسانی ذرات
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
            initParticles();
        }
    }, 250);
});

// ========== مدیریت حالت آفلاین/آنلاین ==========
window.addEventListener('online', () => {
    showNotification('اتصال اینترنت برقرار شد', 'success');
});

window.addEventListener('offline', () => {
    showNotification('اتصال اینترنت قطع شد', 'error');
});

// ========== Performance Optimization ==========
// Lazy Loading Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== انیمیشن‌های CSS اضافی ==========
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInLeft {
        from {
            transform: translateX(-100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeInDown {
        from {
            transform: translateY(-30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .notification {
        position: fixed;
        top: 100px;
        right: -400px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: right 0.3s ease;
        z-index: 10000;
        border-right: 4px solid var(--gold);
    }
    
    .notification.show {
        right: 20px;
    }
    
    .notification-success {
        border-right-color: #00c851;
    }
    
    .notification-error {
        border-right-color: #ff4444;
    }
    
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1001;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .overlay.active {
        opacity: 1;
    }
    
    .field-error {
        display: block;
        color: #ff4444;
        font-size: 12px;
        margin-top: 5px;
    }
    
    input.error,
    textarea.error {
        border-color: #ff4444 !important;
    }
    
    .theme-ripple {
        position: fixed;
        border-radius: 50%;
        background: var(--gold);
        transform: translate(-50%, -50%);
        pointer-events: none;
        animation: ripple 1s ease-out;
    }
    
    @keyframes ripple {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 2000px;
            height: 2000px;
            opacity: 0;
        }
    }
    
    .header.scrolled {
        padding: 10px 0;
        background: rgba(0, 0, 0, 0.98);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    }
`;

document.head.appendChild(additionalStyles);

// ========== Service Worker برای PWA ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            registration => console.log('ServiceWorker registered'),
            err => console.log('ServiceWorker registration failed')
        );
    });
}

console.log('🌟 چرخ طلایی - سایت آماده است!');
function initLoader() {
  const loader = document.getElementById('loader');
  const progressBar = document.querySelector('.loader-progress-bar');
  if (!loader) return;

  let done = false;
  let progress = 0;

  const finish = () => {
    if (done) return;
    done = true;
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    isLoading = false;
    startEntryAnimations?.();
  };

  // شبیه‌سازی پیشرفت
  const interval = setInterval(() => {
    progress += 10 + Math.random() * 25;
    if (progress > 100) progress = 100;
    if (progressBar) progressBar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(finish, 300);
    }
  }, 200);

  // وقتی window load شد هم فینیش کن (اگر زودتر رسید)
  window.addEventListener('load', () => setTimeout(finish, 300));

  // فِیل‌سِیف نهایی (اگر هیچ‌کدوم اجرا نشد)
  setTimeout(() => {
    clearInterval(interval);
    finish();
  }, 6000);
}
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
}
function toggleTheme(e) {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
  document.body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  if (e) createRippleEffect(e);
}
if (typeof AOS !== 'undefined') {
  AOS.init({ duration: 1000, once: true, offset: 50 });
}
function isValidPhone(phone) {
  return /^[\d\s\-\+KATEX_INLINE_OPENKATEX_INLINE_CLOSE]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
if (searchInput) {
  searchInput.addEventListener('input', debounce(() => {
    performSearch(searchInput.value.trim());
  }, 300));
}
const fixHeaderStyle = document.createElement('style');
fixHeaderStyle.textContent = `.main-header.scrolled{padding:10px 0;background:rgba(0,0,0,.98);box-shadow:0 5px 20px rgba(0,0,0,.3)}`;
document.head.appendChild(fixHeaderStyle);