// سیستم چت پشتیبانی
document.addEventListener('DOMContentLoaded', function() {
    initChat();
});

function initChat() {
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    
    // باز و بسته کردن چت
    if (chatToggle) {
        chatToggle.addEventListener('click', function() {
            chatBox.classList.toggle('active');
            if (chatBox.classList.contains('active')) {
                setTimeout(() => {
                    chatInput.focus();
                }, 300);
            }
        });
    }
    
    if (chatClose) {
        chatClose.addEventListener('click', function() {
            chatBox.classList.remove('active');
        });
    }
    
    // ارسال پیام
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // اضافه کردن پیام کاربر
        addMessage(message, 'user');
        
        // پاک کردن input
        chatInput.value = '';
        
        // نمایش در حال تایپ
        showTyping();
        
        // پاسخ خودکار (شبیه‌سازی)
        setTimeout(() => {
            hideTyping();
            const response = getAutoResponse(message);
            addMessage(response, 'bot');
        }, 1500);
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const avatar = sender === 'bot' ? 'bot-avatar.png' : 'user-avatar.png';
        
        messageDiv.innerHTML = `
            <img src="assets/images/${avatar}" alt="${sender}">
            <div class="message-content">${text}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTyping() {
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
    
    function hideTyping() {
        const typing = document.querySelector('.typing-indicator');
        if (typing) {
            typing.remove();
        }
    }
    
    function getAutoResponse(message) {
        const responses = {
            'سلام': 'سلام! چطور می‌تونم کمکتون کنم؟',
            'قیمت': 'برای اطلاع از قیمت‌ها می‌تونید به بخش فروشگاه مراجعه کنید یا با شماره ۰۲۱-۱۲۳۴۵۶۷۸ تماس بگیرید.',
            'آموزش': 'ما دوره‌های متنوعی از مقدماتی تا حرفه‌ای داریم. برای اطلاعات بیشتر به بخش آکادمی مراجعه کنید.',
            'سفارش': 'برای ثبت سفارش می‌تونید از بخش فروشگاه اقدام کنید یا با پشتیبانی تماس بگیرید.',
            'تماس': 'شماره تماس: ۰۲۱-۱۲۳۴۵۶۷۸ | ایمیل: info@goldenwheel.ir',
            'آدرس': 'آدرس: تهران، خیابان ولیعصر، پلاک ۱۲۳',
            'default': 'متشکرم از پیام شما. یکی از همکاران ما به زودی پاسخ خواهد داد. برای پاسخ سریع‌تر می‌تونید با شماره ۰۲۱-۱۲۳۴۵۶۷۸ تماس بگیرید.'
        };
        
        // جستجوی کلمات کلیدی در پیام
        for (let key in responses) {
            if (message.includes(key)) {
                return responses[key];
            }
        }
        
        return responses.default;
    }
}

// استایل‌های چت
const chatStyles = document.createElement('style');
chatStyles.textContent = `
    .typing-indicator .message-content {
        display: flex;
        align-items: center;
        padding: 15px;
    }
    
    .typing-indicator span {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--gold);
        margin: 0 2px;
        animation: typing 1.4s infinite;
    }
    
    .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
        }
        30% {
            transform: translateY(-10px);
        }
    }
`;

document.head.appendChild(chatStyles);