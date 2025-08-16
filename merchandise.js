// Merchandise functionality for Static Drop Media Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize shopping cart
    initializeShoppingCart();
    
    // Initialize merchandise interactions
    initializeMerchandise();
});

// Shopping cart state
let cart = [];
let cartTotal = 0;

// Initialize shopping cart
function initializeShoppingCart() {
    // Load cart from localStorage if available
    loadCartFromStorage();
    
    // Update cart display
    updateCartDisplay();
}

// Initialize merchandise interactions
function initializeMerchandise() {
    // Add event listeners to size selectors
    const sizeSelectors = document.querySelectorAll('.merch-size');
    sizeSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const merchItem = this.closest('.merch-item');
            const addToCartBtn = merchItem.querySelector('.btn');
            
            if (this.value) {
                addToCartBtn.disabled = false;
                addToCartBtn.textContent = 'Add to Cart';
            } else {
                addToCartBtn.disabled = true;
                addToCartBtn.textContent = 'Select Size';
            }
        });
    });
}

// Add item to cart
function addToCart(itemId, price) {
    const merchItem = event.target.closest('.merch-item');
    const sizeSelector = merchItem.querySelector('.merch-size');
    const size = sizeSelector ? sizeSelector.value : null;
    
    // Check if size is selected for items that require it
    if (itemId === 'tshirt' && !size) {
        showNotification('Please select a size before adding to cart.', 'error');
        return;
    }
    
    // Get item details
    const itemDetails = getItemDetails(itemId);
    if (!itemDetails) return;
    
    // Create cart item
    const cartItem = {
        id: itemId,
        name: itemDetails.name,
        price: price,
        size: size,
        quantity: 1
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === itemId && item.size === size
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item
        cart.push(cartItem);
    }
    
    // Update cart
    updateCart();
    
    // Show success message
    showNotification(`${itemDetails.name} added to cart!`, 'success');
    
    // Reset size selector if it exists
    if (sizeSelector) {
        sizeSelector.value = '';
        const addToCartBtn = merchItem.querySelector('.btn');
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = 'Select Size';
    }
}

// Get item details
function getItemDetails(itemId) {
    const items = {
        'tshirt': { name: 'Static Drop Media T-Shirt' },
        'mug': { name: 'Static Drop Media Mug' },
        'cap': { name: 'Static Drop Media Cap' },
        'poster': { name: 'Event Poster Collection' }
    };
    
    return items[itemId] || null;
}

// Update cart
function updateCart() {
    // Calculate total
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart display
    updateCartDisplay();
    
    // Save cart to localStorage
    saveCartToStorage();
}

// Update cart display
function updateCartDisplay() {
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = cartTotal.toFixed(2);
    }
    
    // Update cart count badge if it exists
    updateCartCountBadge();
}

// Update cart count badge
function updateCartCountBadge() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Create or update cart count badge
    let cartBadge = document.querySelector('.cart-count-badge');
    if (!cartBadge) {
        cartBadge = document.createElement('div');
        cartBadge.className = 'cart-count-badge';
        cartBadge.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #dc3545;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
        `;
        
        // Add to navigation if it exists
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            const merchLink = navMenu.querySelector('a[href="#merch"]');
            if (merchLink) {
                merchLink.style.position = 'relative';
                merchLink.appendChild(cartBadge);
            }
        }
    }
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}

// Remove item from cart
function removeFromCart(index) {
    const item = cart[index];
    if (confirm(`Are you sure you want to remove ${item.name} from your cart?`)) {
        cart.splice(index, 1);
        updateCart();
        showNotification(`${item.name} removed from cart`, 'info');
    }
}

// Update item quantity
function updateItemQuantity(index, newQuantity) {
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
        updateCart();
    } else {
        removeFromCart(index);
    }
}

// Show cart details
function showCartDetails() {
    if (cart.length === 0) {
        showNotification('Your cart is empty.', 'info');
        return;
    }
    
    // Create cart details modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '600px';
    
    let cartHTML = `
        <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
        <h2>Shopping Cart</h2>
        <div class="cart-items">
    `;
    
    cart.forEach((item, index) => {
        cartHTML += `
            <div class="cart-item" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #e1e5e9;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                transition: all 0.2s ease;
            " onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'" 
               onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>P${item.price.toFixed(2)}</p>
                    ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                </div>
                <div class="cart-item-controls" style="display: flex; align-items: center; gap: 1rem;">
                    <div class="quantity-controls" style="display: flex; align-items: center; gap: 0.5rem;">
                        <button onclick="updateItemQuantity(${index}, ${item.quantity - 1})" style="
                            background: #dc2626;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            width: 32px;
                            height: 32px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 1.1rem;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
                        " onmouseover="this.style.background='#991b1b'; this.style.transform='scale(1.1)'" 
                           onmouseout="this.style.background='#dc2626'; this.style.transform='scale(1)'">-</button>
                        <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button onclick="updateItemQuantity(${index}, ${item.quantity + 1})" style="
                            background: #dc2626;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            width: 32px;
                            height: 32px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 1.1rem;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 4px rgba(220,38, 38, 0.3);
                        " onmouseover="this.style.background='#991b1b'; this.style.transform='scale(1.1)'" 
                           onmouseout="this.style.background='#dc2626'; this.style.transform='scale(1)'">+</button>
                    </div>
                    <button onclick="removeFromCart(${index})" style="
                        background: #dc2626;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        padding: 0.5rem 1rem;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
                    " onmouseover="this.style.background='#991b1b'; this.style.transform='translateY(-1px)'" 
                       onmouseout="this.style.background='#dc2626'; this.style.transform='translateY(0)'">
                        <i class="fas fa-trash" style="margin-right: 0.5rem;"></i>Remove
                    </button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
        </div>
        <div class="cart-summary" style="
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 2px solid #e1e5e9;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Total:</h3>
                <h3>P${cartTotal.toFixed(2)}</h3>
            </div>
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <button onclick="clearCart()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    flex: 1;
                " onmouseover="this.style.background='#5a6268'" 
                   onmouseout="this.style.background='#6c757d'">
                    <i class="fas fa-trash-alt" style="margin-right: 0.5rem;"></i>Clear Cart
                </button>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button onclick="this.closest('.modal').remove()" class="btn btn-outline" style="flex: 1;">
                    Continue Shopping
                </button>
                <button onclick="checkout()" class="btn btn-primary" style="flex: 1;">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = cartHTML;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Checkout process
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty.', 'error');
        return;
    }
    
    // Show checkout modal
    showCheckoutModal();
}

// Show checkout modal
function showCheckoutModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '500px';
    
    modalContent.innerHTML = `
        <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
        <h2>Checkout</h2>
        <form id="checkoutForm">
            <div class="form-group">
                <label for="checkoutName">Full Name</label>
                <input type="text" id="checkoutName" name="checkoutName" required>
            </div>
            <div class="form-group">
                <label for="checkoutEmail">Email</label>
                <input type="email" id="checkoutEmail" name="checkoutEmail" required>
            </div>
            <div class="form-group">
                <label for="checkoutPhone">Phone</label>
                <input type="tel" id="checkoutPhone" name="checkoutPhone" required>
            </div>
            <div class="form-group">
                <label for="checkoutAddress">Shipping Address</label>
                <textarea id="checkoutAddress" name="checkoutAddress" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label for="checkoutCity">City</label>
                <input type="text" id="checkoutCity" name="checkoutCity" required>
            </div>
            <div class="form-group">
                <label for="checkoutZip">ZIP Code</label>
                <input type="text" id="checkoutZip" name="checkoutZip" required>
            </div>
            <div class="order-summary" style="
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
            ">
                <h4>Order Summary</h4>
                <p>Total Items: ${cart.reduce((total, item) => total + item.quantity, 0)}</p>
                <p><strong>Total: $${cartTotal.toFixed(2)}</strong></p>
            </div>
            <button type="submit" class="btn btn-primary btn-full">Complete Order</button>
        </form>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processCheckout();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Process checkout
function processCheckout() {
    const formData = new FormData(document.getElementById('checkoutForm'));
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateCheckoutForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate order processing
    setTimeout(() => {
        // Process order
        processOrder(data);
        
        // Close checkout modal
        document.querySelector('.modal').remove();
        
        // Clear cart
        clearCart();
        
        // Show success message
        showNotification('Order placed successfully! You will receive a confirmation email shortly.', 'success');
        
    }, 2000);
}

// Validate checkout form
function validateCheckoutForm(data) {
    const requiredFields = ['checkoutName', 'checkoutEmail', 'checkoutPhone', 'checkoutAddress', 'checkoutCity', 'checkoutZip'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field.replace('checkout', '').toLowerCase()} field.`, 'error');
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.checkoutEmail)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

// Process order
function processOrder(data) {
    const order = {
        customer: data,
        items: cart,
        total: cartTotal,
        orderNumber: generateOrderNumber(),
        timestamp: new Date().toISOString()
    };
    
    console.log('Order processed:', order);
    
    // In a real application, this would:
    // 1. Send order to backend server
    // 2. Process payment
    // 3. Send confirmation emails
    // 4. Update inventory
    // 5. Generate shipping labels
}

// Generate order number
function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `SDM-${timestamp}-${random}`;
}

// Clear cart
function clearCart() {
    cart = [];
    cartTotal = 0;
    updateCart();
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('staticDropMediaCart', JSON.stringify({
        cart: cart,
        cartTotal: cartTotal
    }));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('staticDropMediaCart');
    if (savedCart) {
        try {
            const parsed = JSON.parse(savedCart);
            cart = parsed.cart || [];
            cartTotal = parsed.cartTotal || 0;
        } catch (e) {
            console.error('Error loading cart from storage:', e);
            cart = [];
            cartTotal = 0;
        }
    }
}

// Show notification (fallback)
function showNotification(message, type = 'info') {
    if (window.StaticDropMedia && window.StaticDropMedia.showNotification) {
        window.StaticDropMedia.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Export functions for use in other scripts
window.MerchandiseSystem = {
    addToCart,
    removeFromCart,
    updateItemQuantity,
    showCartDetails,
    checkout,
    clearCart,
    getCartTotal: () => cartTotal,
    getCartItems: () => cart
};
