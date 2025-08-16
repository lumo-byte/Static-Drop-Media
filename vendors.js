// Vendors functionality for Static Drop Media Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize vendor form functionality
    initializeVendorForm();
    
    // Initialize vendor package selection
    initializeVendorPackages();
    
    // Initialize image upload preview
    initializeImageUpload();
});

// Initialize vendor form functionality
function initializeVendorForm() {
    const vendorForm = document.getElementById('vendorForm');
    if (!vendorForm) return;
    
    // Form validation on input
    const inputs = vendorForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateVendorField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Form submission
    vendorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleVendorSubmission();
    });
}

// Initialize vendor package selection
function initializeVendorPackages() {
    const vendorPackages = document.querySelectorAll('.vendor-package');
    
    vendorPackages.forEach(package => {
        package.addEventListener('click', function() {
            // Remove active class from all packages
            vendorPackages.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked package
            this.classList.add('active');
            
            // Update form with selected package
            updateVendorFormWithPackage(this);
        });
    });
}

// Initialize image upload functionality
function initializeImageUpload() {
    const imageInput = document.getElementById('vendorImages');
    if (!imageInput) return;
    
    imageInput.addEventListener('change', function(e) {
        handleImageUpload(e.target.files);
    });
}

// Handle vendor form submission
function handleVendorSubmission() {
    const formData = new FormData(document.getElementById('vendorForm'));
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateVendorForm(data)) {
        return;
    }
    
    // Show loading state
    showVendorFormLoading(true);
    
    // Simulate form submission delay
    setTimeout(() => {
        // Process vendor application
        processVendorApplication(data);
        
        // Hide loading state
        showVendorFormLoading(false);
        
        // Show success message
        showVendorSuccessMessage();
        
        // Reset form
        document.getElementById('vendorForm').reset();
        
        // Clear image previews
        clearImagePreviews();
        
        // Reset package selection
        resetVendorPackageSelection();
        
    }, 2000);
}

// Validate vendor form
function validateVendorForm(data) {
    let isValid = true;
    const requiredFields = ['vendorName', 'vendorEmail', 'vendorPhone', 'vendorCategory', 'vendorDescription'];
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email format
    if (data.vendorEmail && !isValidEmail(data.vendorEmail)) {
        showFieldError('vendorEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone format
    if (data.vendorPhone && !isValidPhone(data.vendorPhone)) {
        showFieldError('vendorPhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate description length
    if (data.vendorDescription && data.vendorDescription.length < 50) {
        showFieldError('vendorDescription', 'Description must be at least 50 characters long');
        isValid = false;
    }
    
    return isValid;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone format
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        font-weight: 500;
    `;
    
    // Insert error message after field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    
    // Remove error message
    const errorMessage = field.parentNode.querySelector('.field-error');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Validate individual vendor field
function validateVendorField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    
    switch (fieldName) {
        case 'vendorName':
            if (value.length < 2) {
                showFieldError(fieldName, 'Business name must be at least 2 characters long');
            }
            break;
            
        case 'vendorEmail':
            if (value && !isValidEmail(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
            }
            break;
            
        case 'vendorPhone':
            if (value && !isValidPhone(value)) {
                showFieldError(fieldName, 'Please enter a valid phone number');
            }
            break;
            
        case 'vendorDescription':
            if (value && value.length < 50) {
                showFieldError(fieldName, 'Description must be at least 50 characters long');
            }
            break;
    }
}

// Update vendor form with selected package
function updateVendorFormWithPackage(packageElement) {
    const packageName = packageElement.querySelector('h4').textContent;
    const packagePrice = packageElement.querySelector('.price').textContent;
    
    // You can add hidden fields or update form data here
    console.log(`Selected package: ${packageName} - ${packagePrice}`);
    
    // Show notification
    if (window.StaticDropMedia && window.StaticDropMedia.showNotification) {
        window.StaticDropMedia.showNotification(`Selected: ${packageName}`, 'info');
    }
}

// Handle image upload
function handleImageUpload(files) {
    if (!files || files.length === 0) return;
    
    // Clear existing previews
    clearImagePreviews();
    
    // Create preview container if it doesn't exist
    let previewContainer = document.querySelector('.image-preview-container');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'image-preview-container';
        previewContainer.style.cssText = `
            margin-top: 1rem;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 1rem;
        `;
        
        const imageInput = document.getElementById('vendorImages');
        imageInput.parentNode.appendChild(previewContainer);
    }
    
    // Process each file
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const preview = document.createElement('div');
                preview.className = 'image-preview';
                preview.style.cssText = `
                    position: relative;
                    width: 100px;
                    height: 100px;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 2px solid #e1e5e9;
                `;
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                `;
                
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '×';
                removeBtn.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 1;
                `;
                
                removeBtn.addEventListener('click', function() {
                    preview.remove();
                    updateImageInput();
                });
                
                preview.appendChild(img);
                preview.appendChild(removeBtn);
                previewContainer.appendChild(preview);
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// Clear image previews
function clearImagePreviews() {
    const previewContainer = document.querySelector('.image-preview-container');
    if (previewContainer) {
        previewContainer.remove();
    }
}

// Update image input after preview removal
function updateImageInput() {
    const previews = document.querySelectorAll('.image-preview');
    const imageInput = document.getElementById('vendorImages');
    
    if (previews.length === 0) {
        imageInput.value = '';
    }
}

// Show vendor form loading state
function showVendorFormLoading(show) {
    const submitBtn = document.querySelector('#vendorForm button[type="submit"]');
    if (!submitBtn) return;
    
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Application';
    }
}

// Show vendor success message
function showVendorSuccessMessage() {
    if (window.StaticDropMedia && window.StaticDropMedia.showNotification) {
        window.StaticDropMedia.showNotification(
            'Vendor application submitted successfully! We\'ll review your application and contact you within 3-5 business days.',
            'success'
        );
    }
}

// Process vendor application
function processVendorApplication(data) {
    // Simulate processing
    console.log('Processing vendor application:', data);
    
    // In a real application, this would:
    // 1. Send data to backend server
    // 2. Store in database
    // 3. Send confirmation emails
    // 4. Notify admin team
    
    // Simulate admin notification
    const adminNotification = {
        type: 'vendor_application',
        business: data.vendorName,
        category: data.vendorCategory,
        email: data.vendorEmail,
        timestamp: new Date().toISOString()
    };
    
    console.log('Admin notification:', adminNotification);
}

// Reset vendor package selection
function resetVendorPackageSelection() {
    const vendorPackages = document.querySelectorAll('.vendor-package');
    vendorPackages.forEach(package => {
        package.classList.remove('active');
    });
}

// Calculate vendor booth pricing
function calculateVendorPricing(boothSize, duration) {
    const basePrices = {
        'standard': 500,
        'premium': 800
    };
    
    const durationMultiplier = {
        'single': 1,
        'weekend': 1.5,
        'full': 2
    };
    
    const basePrice = basePrices[boothSize] || 500;
    const multiplier = durationMultiplier[duration] || 1;
    
    return basePrice * multiplier;
}

// Export functions for use in other scripts
window.VendorSystem = {
    handleVendorSubmission,
    validateVendorForm,
    handleImageUpload,
    calculateVendorPricing,
    showVendorSuccessMessage
};
