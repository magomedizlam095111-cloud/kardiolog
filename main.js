// ========================================
// Form Validation and Submission
// ========================================

class AppointmentForm {
    constructor() {
        this.form = document.getElementById('appointmentForm');
        this.nameInput = document.getElementById('name');
        this.phoneInput = document.getElementById('phone');
        this.messageInput = document.getElementById('message');
        this.messageCounter = document.getElementById('message-counter');
        this.submitBtn = this.form.querySelector('.btn-submit');
        
        this.successNotification = document.getElementById('successNotification');
        this.errorNotification = document.getElementById('errorNotification');
        
        this.init();
    }
    
    init() {
        // Phone input formatting
        this.phoneInput.addEventListener('input', (e) => this.formatPhone(e));
        
        // Message character counter
        this.messageInput.addEventListener('input', () => this.updateCharCounter());
        
        // Real-time validation
        this.nameInput.addEventListener('blur', () => this.validateField(this.nameInput));
        this.phoneInput.addEventListener('blur', () => this.validateField(this.phoneInput));
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Close notifications
        document.querySelectorAll('.notification-close').forEach(btn => {
            btn.addEventListener('click', () => this.hideNotifications());
        });
    }
    
    formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length === 0) {
            e.target.value = '';
            return;
        }
        
        // Start with +7
        if (value[0] === '8') {
            value = '7' + value.slice(1);
        }
        if (value[0] !== '7') {
            value = '7' + value;
        }
        
        let formatted = '+7';
        
        if (value.length > 1) {
            formatted += ' (' + value.substring(1, 4);
        }
        if (value.length >= 4) {
            formatted += ') ' + value.substring(4, 7);
        }
        if (value.length >= 7) {
            formatted += '-' + value.substring(7, 9);
        }
        if (value.length >= 9) {
            formatted += '-' + value.substring(9, 11);
        }
        
        e.target.value = formatted;
    }
    
    updateCharCounter() {
        const length = this.messageInput.value.length;
        this.messageCounter.textContent = `${length} / 500`;
        
        if (length > 450) {
            this.messageCounter.style.color = 'var(--error-color)';
        } else if (length > 400) {
            this.messageCounter.style.color = '#ff9800';
        } else {
            this.messageCounter.style.color = 'var(--text-light)';
        }
    }
    
    validateField(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        let isValid = true;
        let errorMessage = '';
        
        // Remove previous states
        field.classList.remove('error', 'success');
        
        if (field.id === 'name') {
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Пожалуйста, введите ваше имя';
            } else if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Имя должно содержать минимум 2 символа';
            } else if (!/^[А-Яа-яЁёA-Za-z\s-]+$/.test(field.value)) {
                isValid = false;
                errorMessage = 'Имя может содержать только буквы';
            }
        }
        
        if (field.id === 'phone') {
            const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Пожалуйста, введите номер телефона';
            } else if (!phoneRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Введите номер в формате +7 (XXX) XXX-XX-XX';
            }
        }
        
        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        } else {
            field.classList.add('success');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
        
        return isValid;
    }
    
    validateForm() {
        const isNameValid = this.validateField(this.nameInput);
        const isPhoneValid = this.validateField(this.phoneInput);
        
        return isNameValid && isPhoneValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Hide previous notifications
        this.hideNotifications();
        
        // Validate form
        if (!this.validateForm()) {
            this.showNotification('error');
            // Scroll to first error
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Show loading state
        this.setLoading(true);
        
        // Simulate API call
        await this.simulateSubmission();
        
        // Show success
        this.setLoading(false);
        this.showSuccessNotification();
        this.form.reset();
        this.updateCharCounter();
        
        // Clear validation states
        [this.nameInput, this.phoneInput, this.messageInput].forEach(field => {
            field.classList.remove('success', 'error');
        });
    }
    
    simulateSubmission() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }
    
    setLoading(isLoading) {
        this.submitBtn.disabled = isLoading;
        if (isLoading) {
            this.submitBtn.classList.add('loading');
        } else {
            this.submitBtn.classList.remove('loading');
        }
    }
    
    showNotification(type) {
        if (type === 'success') {
            this.successNotification.hidden = false;
        } else {
            this.errorNotification.hidden = false;
        }
    }
    
    hideNotifications() {
        this.successNotification.hidden = true;
        this.errorNotification.hidden = true;
    }
    
    showSuccessNotification() {
        const name = this.escapeHtml(this.nameInput.value);
        const phone = this.escapeHtml(this.phoneInput.value);
        const message = this.messageInput.value.trim();
        
        document.getElementById('successName').textContent = name;
        document.getElementById('successPhone').textContent = phone;
        
        const messageElement = document.getElementById('successMessage');
        if (message) {
            messageElement.textContent = `Ваш вопрос: "${message}"`;
            messageElement.style.display = 'block';
        } else {
            messageElement.style.display = 'none';
        }
        
        this.showNotification('success');
        
        // Scroll to notification
        setTimeout(() => {
            this.successNotification.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ========================================
// Smooth Scroll for Navigation Links
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Header Scroll Effect
// ========================================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// Intersection Observer for Animations
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add animation class
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// Initialize Everything
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form
    new AppointmentForm();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize scroll animations
    initScrollAnimations();
});