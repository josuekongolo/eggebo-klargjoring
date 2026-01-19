/**
 * EGGEBØ KLARGJØRING - Main JavaScript
 * Professional Property Preparation Services Stavanger
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initClickToCall();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const body = document.body;

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

/**
 * Sticky Header with Shadow on Scroll
 */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Skip if it's just "#"
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Contact Form Handler
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const statusDiv = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Henvendelse';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors();

        // Validate form
        if (!validateForm(form)) {
            return;
        }

        // Get form data
        const formData = {
            name: form.querySelector('#name')?.value.trim(),
            email: form.querySelector('#email')?.value.trim(),
            phone: form.querySelector('#phone')?.value.trim(),
            customerType: form.querySelector('#customerType')?.value,
            jobType: form.querySelector('#jobType')?.value,
            address: form.querySelector('#address')?.value.trim(),
            description: form.querySelector('#description')?.value.trim(),
            timing: form.querySelector('#timing')?.value
        };

        // Update button state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sender...';
        }

        try {
            // Simulate API call (replace with actual Resend API integration)
            await sendFormData(formData);

            // Show success message
            showFormStatus('success', 'Takk for din henvendelse! Jeg kontakter deg så snart som mulig, vanligvis samme dag.');
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showFormStatus('error', 'Beklager, noe gikk galt. Vennligst prøv igjen eller ring meg direkte.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Validate single field
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    removeFieldError(field);

    // Check if required and empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Dette feltet er påkrevd';
        isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Vennligst oppgi en gyldig e-postadresse';
            isValid = false;
        }
    }

    // Phone validation (Norwegian format)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^(\+47)?[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}$/;
        const cleanPhone = value.replace(/[\s-]/g, '');
        if (cleanPhone.length < 8) {
            errorMessage = 'Vennligst oppgi et gyldig telefonnummer';
            isValid = false;
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
}

/**
 * Remove field error
 */
function removeFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Clear all form errors
 */
function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    const statusDiv = document.getElementById('form-status');
    if (statusDiv) {
        statusDiv.className = 'form-status';
        statusDiv.style.display = 'none';
    }
}

/**
 * Show form status message
 */
function showFormStatus(type, message) {
    const statusDiv = document.getElementById('form-status');
    if (!statusDiv) return;

    statusDiv.className = `form-status ${type}`;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';

    // Scroll to status
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Send form data (placeholder - integrate with Resend API)
 */
async function sendFormData(formData) {
    // This is a placeholder. In production, replace with actual Resend API call:
    /*
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return response.json();
    */

    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });
}

/**
 * Scroll Animations (Intersection Observer)
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .benefit, .value-card, .partner-card');

    if (!animatedElements.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

/**
 * Click-to-Call Enhancement for Mobile
 */
function initClickToCall() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track phone clicks (for analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Click',
                    'value': 1
                });
            }
        });
    });
}

/**
 * Utility: Format Norwegian Phone Number
 */
function formatNorwegianPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
        return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    if (cleaned.length === 10 && cleaned.startsWith('47')) {
        return '+47 ' + cleaned.slice(2).replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    return phone;
}

/**
 * Utility: Debounce Function
 */
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

/**
 * Active Navigation Link Highlight
 */
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (href === currentPath ||
            (currentPath.endsWith('/') && href === 'index.html') ||
            currentPath.endsWith(href)) {
            link.classList.add('active');
        }
    });
}

// Run active nav highlight
setActiveNavLink();
