// Main JavaScript for Static Drop Media Website

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Form submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm();
        });
    }

    const vendorForm = document.getElementById('vendorForm');
    if (vendorForm) {
        vendorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleVendorForm();
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubscription();
        });
    }

    // Initialize animations
    initializeAnimations();
});

// Handle contact form submission
function handleContactForm() {
    const formData = new FormData(document.getElementById('contactForm'));
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    console.log('Contact form submitted:', data);
    
    // Show success message
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// Handle vendor form submission
function handleVendorForm() {
    const formData = new FormData(document.getElementById('vendorForm'));
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    console.log('Vendor application submitted:', data);
    
    // Show success message
    showNotification('Vendor application submitted successfully! We\'ll review and contact you soon.', 'success');
    
    // Reset form
    document.getElementById('vendorForm').reset();
}

// Handle newsletter subscription
function handleNewsletterSubscription() {
    const email = document.querySelector('.newsletter-form input[type="email"]').value;
    
    if (email) {
        // Simulate subscription
        console.log('Newsletter subscription:', email);
        
        // Show success message
        showNotification('Successfully subscribed to our newsletter!', 'success');
        
        // Reset form
        document.querySelector('.newsletter-form input[type="email"]').value = '';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Hide notification
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.event-card, .ticket-card, .sponsor-tier, .merch-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Sponsor contact function
function contactSponsor(tier) {
    const tierNames = {
        'gold': 'Gold Sponsor',
        'platinum': 'Platinum Sponsor',
        'diamond': 'Diamond Sponsor'
    };
    
    const subject = `Sponsorship Inquiry - ${tierNames[tier]}`;
    const message = `I'm interested in learning more about the ${tierNames[tier]} opportunity. Please contact me with additional details.`;
    
    // Pre-fill contact form
    if (document.getElementById('contactSubject')) {
        document.getElementById('contactSubject').value = 'sponsorship';
    }
    if (document.getElementById('contactMessage')) {
        document.getElementById('contactMessage').value = message;
    }
    
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification(`Redirecting to contact form for ${tierNames[tier]} inquiry.`, 'info');
}

// Utility function to generate random ticket codes
function generateTicketCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Export functions for use in other scripts
window.StaticDropMedia = {
    generateTicketCode,
    showNotification,
    contactSponsor
};
