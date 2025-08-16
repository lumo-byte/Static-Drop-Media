// Tickets functionality for Static Drop Media Website

document.addEventListener('DOMContentLoaded', function() {
    // Ticket modal functionality
    const ticketModal = document.getElementById('ticketModal');
    const successModal = document.getElementById('successModal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Close modal when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            ticketModal.style.display = 'none';
            successModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === ticketModal) {
            ticketModal.style.display = 'none';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Ticket form functionality
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTicketBooking();
        });
    }
    
    // Ticket quantity and type change handlers
    const ticketQuantity = document.getElementById('ticketQuantity');
    const ticketType = document.getElementById('ticketType');
    
    if (ticketQuantity) {
        ticketQuantity.addEventListener('change', updateModalTotal);
    }
    
    if (ticketType) {
        ticketType.addEventListener('change', updateModalTotal);
    }
});

// Open ticket modal with pre-selected package
function openTicketModal(packageType) {
    const ticketModal = document.getElementById('ticketModal');
    const ticketType = document.getElementById('ticketType');
    const modalTotal = document.getElementById('modalTotal');
    
    if (ticketModal && ticketType && modalTotal) {
        // Set the ticket type based on package
        const packageMap = {
            'general': 'general',
            'vip': 'vip',
            'premium': 'premium'
        };
        
        if (packageMap[packageType]) {
            ticketType.value = packageMap[packageType];
        }
        
        // Update total
        updateModalTotal();
        
        // Show modal
        ticketModal.style.display = 'block';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = ticketModal.querySelector('input, select');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

// Update modal total based on ticket type and quantity
function updateModalTotal() {
    const ticketType = document.getElementById('ticketType');
    const ticketQuantity = document.getElementById('ticketQuantity');
    const modalTotal = document.getElementById('modalTotal');
    
    if (ticketType && ticketQuantity && modalTotal) {
        const typeValue = ticketType.value;
        const quantity = parseInt(ticketQuantity.value) || 1;
        
        let pricePerTicket = 75; // Default to general admission
        
        if (typeValue === 'vip') {
            pricePerTicket = 150;
        } else if (typeValue === 'premium') {
            pricePerTicket = 250;
        }
        
        const total = pricePerTicket * quantity;
        modalTotal.textContent = total.toFixed(2);
    }
}

// Handle ticket booking submission
function handleTicketBooking() {
    const formData = new FormData(document.getElementById('ticketForm'));
    const data = Object.fromEntries(formData);
    
    // Validate form data
    if (!validateTicketForm(data)) {
        return;
    }
    
    // Simulate ticket booking process
    console.log('Ticket booking submitted:', data);
    
    // Generate unique ticket code
    const ticketCode = window.StaticDropMedia ? 
        window.StaticDropMedia.generateTicketCode() : 
        generateTicketCode();
    
    // Show success modal with ticket code
    showSuccessModal(ticketCode);
    
    // Close ticket modal
    const ticketModal = document.getElementById('ticketModal');
    if (ticketModal) {
        ticketModal.style.display = 'none';
    }
    
    // Reset form
    document.getElementById('ticketForm').reset();
    
    // Simulate sending confirmation email
    simulateEmailConfirmation(data, ticketCode);
}

// Validate ticket form data
function validateTicketForm(data) {
    const requiredFields = ['ticketType', 'ticketQuantity', 'ticketEvent', 'ticketName', 'ticketEmail', 'ticketPhone'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field.replace('ticket', '').toLowerCase()} field.`, 'error');
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.ticketEmail)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate phone format
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.ticketPhone.replace(/[\s\-\(\)]/g, ''))) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }
    
    // Validate quantity
    const quantity = parseInt(data.ticketQuantity);
    if (quantity < 1 || quantity > 10) {
        showNotification('Please select between 1 and 10 tickets.', 'error');
        return false;
    }
    
    return true;
}

// Show success modal with ticket code
function showSuccessModal(ticketCode) {
    const successModal = document.getElementById('successModal');
    const ticketCodeSpan = document.getElementById('ticketCode');
    
    if (successModal && ticketCodeSpan) {
        ticketCodeSpan.textContent = ticketCode;
        successModal.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (successModal.style.display === 'block') {
                successModal.style.display = 'none';
            }
        }, 10000);
    }
}

// Close success modal
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.style.display = 'none';
    }
}

// Simulate sending confirmation email
function simulateEmailConfirmation(data, ticketCode) {
    const emailContent = {
        to: data.ticketEmail,
        subject: 'Ticket Confirmation - Static Drop Media Event',
        body: `
            Dear ${data.ticketName},
            
            Thank you for booking your tickets for our upcoming event!
            
            Booking Details:
            - Event: ${data.ticketEvent}
            - Ticket Type: ${data.ticketType}
            - Quantity: ${data.ticketQuantity}
            - Ticket Code: ${ticketCode}
            
            Your digital tickets will be available for download 24 hours before the event.
            
            If you have any questions, please contact us at info@staticdropmedia.com
            
            Best regards,
            The Static Drop Media Team
        `
    };
    
    console.log('Email confirmation would be sent:', emailContent);
    
    // Show notification
    if (window.StaticDropMedia && window.StaticDropMedia.showNotification) {
        window.StaticDropMedia.showNotification('Confirmation email sent to ' + data.ticketEmail, 'success');
    }
}

// Generate ticket code (fallback function)
function generateTicketCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Calculate ticket price based on type
function getTicketPrice(ticketType) {
    const prices = {
        'general': 75,
        'vip': 150,
        'premium': 250
    };
    
    return prices[ticketType] || 75;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export functions for use in other scripts
window.TicketSystem = {
    openTicketModal,
    updateModalTotal,
    handleTicketBooking,
    validateTicketForm,
    showSuccessModal,
    closeSuccessModal,
    getTicketPrice,
    formatCurrency
};
