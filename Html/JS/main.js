/**
 * High Ville Restaurant - Main JavaScript
 * Handles all interactions, animations, and form validations
 */

// ============================================
// DOM Content Loaded
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initScrollAnimations();
    initHeaderScroll();
    initMenuFilter();
    initOrderButtons();
    initContactForm();
    initSmoothScroll();
    initDetailsAnimation();
});

// ============================================
// Mobile Menu Toggle
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (!fadeElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// ============================================
// Header Scroll Effect
// ============================================
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// Menu Category Filter
// ============================================
function initMenuFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (!categoryBtns.length || !menuItems.length) return;
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease both';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide sections
            document.querySelectorAll('.menu-section').forEach(section => {
                if (category === 'all' || section.id === category) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// Order Buttons
// ============================================
function initOrderButtons() {
    const orderBtns = document.querySelectorAll('.btn-order');
    
    if (!orderBtns.length) return;
    
    orderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const dishName = this.getAttribute('data-dish');
            const price = this.getAttribute('data-price');
            
            // Add animation to button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.02)';
            }, 100);
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Show success toast
            showToast(`Added "${dishName}" ($${price}) to your order!`, 'success');
            
            // Optional: Store in localStorage for cart functionality
            addToCart(dishName, price);
        });
    });
}

// Cart functionality
function addToCart(dish, price) {
    let cart = JSON.parse(localStorage.getItem('restaurantCart') || '[]');
    cart.push({ dish, price: parseFloat(price), quantity: 1 });
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
}

// ============================================
// Contact Form Validation & Submission
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Validate first name
        if (!firstName || firstName.length < 2) {
            showError('firstName', 'Please enter a valid first name (at least 2 characters)');
            isValid = false;
        }
        
        // Validate last name
        if (!lastName || lastName.length < 2) {
            showError('lastName', 'Please enter a valid last name (at least 2 characters)');
            isValid = false;
        }
        
        // Validate phone (Kenyan format)
        const phoneRegex = /^(\+254|0)?[79]\d{8}$/;
        if (!phone || !phoneRegex.test(phone.replace(/\s/g, ''))) {
            showError('phone', 'Please enter a valid phone number (e.g., 0711 739 233)');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate message
        if (!message || message.length < 10) {
            showError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success message
                showToast('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
                
                // Reset form
                form.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error state on input
            this.classList.remove('error');
            const errorSpan = document.getElementById(this.id + 'Error');
            if (errorSpan) errorSpan.textContent = '';
        });
    });
    
    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            clearErrors();
            showToast('Form has been cleared.', 'info');
        });
    }
}

// Validate individual field
function validateField(field) {
    const id = field.id;
    const value = field.value.trim();
    
    switch(id) {
        case 'firstName':
            if (!value || value.length < 2) {
                showError('firstName', 'Please enter a valid first name');
            }
            break;
        case 'lastName':
            if (!value || value.length < 2) {
                showError('lastName', 'Please enter a valid last name');
            }
            break;
        case 'phone':
            const phoneRegex = /^(\+254|0)?[79]\d{8}$/;
            if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                showError('phone', 'Please enter a valid phone number');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showError('email', 'Please enter a valid email');
            }
            break;
        case 'message':
            if (!value || value.length < 10) {
                showError('message', 'Message must be at least 10 characters');
            }
            break;
    }
}

// Show error message
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
        field.style.borderColor = '#e74c3c';
    }
    
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.color = '#e74c3c';
        errorSpan.style.fontSize = '0.85rem';
        errorSpan.style.marginTop = '0.25rem';
    }
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
        el.style.borderColor = '';
    });
    
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '✓';
            break;
        case 'error':
            icon = '✕';
            break;
        case 'info':
            icon = 'ℹ';
            break;
    }
    
    toast.innerHTML = `
        <span style="font-size: 1.2rem; font-weight: bold;">${icon}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Details/Summary Animation
// ============================================
function initDetailsAnimation() {
    const details = document.querySelectorAll('details');
    
    details.forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                // Close other open details in the same container
                const container = this.closest('.details-container');
                if (container) {
                    container.querySelectorAll('details').forEach(d => {
                        if (d !== this && d.open) {
                            d.open = false;
                        }
                    });
                }
            }
        });
    });
}

// ============================================
// Parallax Effect for Hero Sections
// ============================================
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// ============================================
// Loading Animation
// ============================================
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add entrance animation to main elements
    const mainElements = document.querySelectorAll('header, .hero, .menu-hero, .about-hero, .contact-hero');
    mainElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ============================================
// Keyboard Navigation Support
// ============================================
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle && navLinks && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }
});

// ============================================
// Prevent Form Resubmission on Refresh
// ============================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ============================================
// Console Welcome Message
// ============================================
console.log('%c🍽️ Welcome to High Ville Restaurant! 🍽️', 'color: #e67e22; font-size: 20px; font-weight: bold;');
console.log('%cExperience dining like never before.', 'color: #2c3e50; font-size: 14px;');