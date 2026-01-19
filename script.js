// ============================================
// WILD FITNESS - MINIMAL JAVASCRIPT
// ============================================

// ============================================
// Mobile Navigation Toggle
// ============================================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navList = mainNav.querySelector('.nav-list');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', 
            navList.classList.contains('active'));
    });

    // Close menu when clicking on a link
    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && navList.classList.contains('active')) {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe schedule and contact sections
const animateElements = document.querySelectorAll(
    '.schedule-content, .pricing, .gallery-grid, .contact-wrapper'
);

animateElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// WhatsApp button tracking
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('WhatsApp link clicked');
    });
});

// Email button tracking
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
        console.log('Email link clicked');
    });
});

// Gallery lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.gallery-item img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalBtnText = submitBtn.textContent;
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviant...';
        
        // Hide previous status messages
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';
        
        try {
            const formData = new FormData(contactForm);
            
            // Send to Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                formStatus.className = 'form-status success';
                formStatus.textContent = '✓ Missatge enviat correctament! Et respondrem aviat.';
                formStatus.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Track conversion (if using analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form'
                    });
                }
                
                console.log('Contact form submitted successfully');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error
            formStatus.className = 'form-status error';
            formStatus.textContent = '✗ Error enviant el missatge. Prova-ho de nou o contacta per WhatsApp.';
            formStatus.style.display = 'block';
            
            console.error('Form submission error:', error);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
    
    // Real-time validation
    const emailInput = contactForm.querySelector('#email');
    const phoneInput = contactForm.querySelector('#phone');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !this.validity.valid) {
                this.style.borderColor = '#dc2626';
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Allow only numbers, spaces, +, and -
            this.value = this.value.replace(/[^0-9\s\+\-]/g, '');
        });
    }
}

// Console message
console.log('%c🏔️ Wild Fitness', 'font-size: 20px; font-weight: bold; color: #2d7d7d;');
console.log('%cEntrenament Funcional Trail - Fonteta', 'font-size: 12px; color: #7f8c8d;');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Wild Fitness website loaded successfully! 🏃‍♂️');
});

// Prevent form resubmission
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
