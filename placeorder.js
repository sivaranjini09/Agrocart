// placeorder.js - Functions for handling the order placement process

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for the cart button to open the checkout flow
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCheckoutModal();
        });
    }
    
    // Add event listener for checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
    
    // Add event listeners for modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
});

// Function to open the checkout modal
function openCheckoutModal() {
    // Get cart items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Get the checkout modal element
    const checkoutModal = document.getElementById('checkout-modal');
    if (!checkoutModal) {
        createCheckoutModal();
    } else {
        updateCheckoutItems();
        checkoutModal.style.display = 'block';
    }
}

// Function to create the checkout modal if it doesn't exist
function createCheckoutModal() {
    // Create the modal element
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'modal';
    
    // Create the modal content
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Checkout</h2>
            
            <div class="checkout-items-container">
                <h3>Your Cart</h3>
                <div id="checkout-items"></div>
                <div class="checkout-total">
                    <p>Total: <span id="checkout-total-amount">₹0.00</span></p>
                </div>
            </div>
            
            <form id="checkout-form">
                <h3>Customer Information</h3>
                
                <div class="form-group">
                    <label for="customer-name">Full Name*</label>
                    <input type="text" id="customer-name" required>
                </div>
                
                <div class="form-group">
                    <label for="customer-address">Delivery Address*</label>
                    <textarea id="customer-address" rows="3" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="customer-phone">Phone Number*</label>
                    <input type="tel" id="customer-phone" required>
                </div>
                
                <div class="form-group">
                    <label for="customer-email">Email</label>
                    <input type="email" id="customer-email">
                </div>
                
                <div class="form-group">
                    <label for="payment-method">Payment Method*</label>
                    <select id="payment-method" required>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                        <option value="Online Payment">Online Payment</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>
                
                <div class="button-group">
                    <button type="submit" class="primary-btn">Place Order</button>
                    <button type="button" class="secondary-btn close-modal-btn">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    // Add the modal to the document
    document.body.appendChild(modal);
    
    // Update the checkout items
    updateCheckoutItems();
    
    // Show the modal
    modal.style.display = 'block';
    
    // Add event listeners
    modal.querySelector('#checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });
    
    modal.querySelector('.close-modal-btn').addEventListener('click', function() {
        closeAllModals();
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAllModals();
        }
    });
}

// Function to update checkout items
function updateCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const totalElement = document.getElementById('checkout-total-amount');
    
    if (!checkoutItemsContainer || !totalElement) return;
    
    // Clear existing items
    checkoutItemsContainer.innerHTML = '';
    
    let total = 0;
    
    // If cart is empty
    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalElement.textContent = '₹0.00';
        return;
    }
    
    // Create a table for the items
    const table = document.createElement('table');
    table.className = 'checkout-items-table';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Actions</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add items to table
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.productName}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-control">
                    <button type="button" class="quantity-btn" data-action="decrease" data-id="${item._id}">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="quantity-btn" data-action="increase" data-id="${item._id}">+</button>
                </div>
            </td>
            <td>₹${subtotal.toFixed(2)}</td>
            <td>
                <button type="button" class="remove-item-btn" data-id="${item._id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    checkoutItemsContainer.appendChild(table);
    
    // Update total
    totalElement.textContent = `₹${total.toFixed(2)}`;
    
    // Add event listeners for quantity buttons and remove buttons
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const itemId = this.getAttribute('data-id');
            updateCartItemQuantity(itemId, action);
        });
    });
    
    const removeButtons = document.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            removeCartItem(itemId);
        });
    });
}

// Function to update cart item quantity
function updateCartItemQuantity(itemId, action) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item._id === itemId);
    
    if (itemIndex === -1) return;
    
    if (action === 'increase') {
        cart[itemIndex].quantity += 1;
    } else if (action === 'decrease') {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            // If quantity becomes 0, remove the item
            cart.splice(itemIndex, 1);
        }
    }
    
    // Update the cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update the checkout items and cart count
    updateCheckoutItems();
    updateCartCount();
}

// Function to remove cart item
function removeCartItem(itemId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item._id !== itemId);
    
    // Update the cart in localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Update the checkout items and cart count
    updateCheckoutItems();
    updateCartCount();
    
    // If cart becomes empty, close the modal
    if (updatedCart.length === 0) {
        closeAllModals();
        showNotification('Your cart is empty!', 'info');
    }
}

// Function to process the order
async function processOrder() {
    // Get cart items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Get customer information
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;
    const phone = document.getElementById('customer-phone').value;
    const email = document.getElementById('customer-email').value;
    const paymentMethod = document.getElementById('payment-method').value;
    
    // Calculate totals
    let total = 0;
    const orderItems = cart.map(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        return {
            productId: item._id,
            name: item.productName,
            price: item.price,
            quantity: item.quantity,
            subtotal: subtotal
        };
    });
    
    // Create order object based on server.js Order schema
    const order = {
        customer: {
            name: name,
            address: address,
            phone: phone,
            email: email
        },
        items: orderItems,
        total: total,
        paymentMethod: paymentMethod,
        status: 'Pending',
        orderDate: new Date()
    };
    
    try {
        // Show loading indicator
        showLoadingIndicator();
        
        // Send the order to the server
        const response = await fetch('http://localhost:5004/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const orderResponse = await response.json();
        
        // Hide loading indicator
        hideLoadingIndicator();
        
        // Clear the cart
        localStorage.removeItem('cart');
        
        // Update cart count
        updateCartCount();
        
        // Close modals
        closeAllModals();
        
        // Show success message with the order ID
        showOrderConfirmation(orderResponse);
        
    } catch (error) {
        console.error('Error placing order:', error);
        
        // Hide loading indicator
        hideLoadingIndicator();
        
        // Show error notification
        showNotification('Failed to place order. Please try again.', 'error');
    }
}

// Function to show order confirmation
function showOrderConfirmation(order) {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.id = 'confirmation-modal';
    modal.className = 'modal';
    
    // Format date
    const orderDate = new Date(order.orderDate);
    const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
    
    // Create the modal content
    modal.innerHTML = `
        <div class="modal-content confirmation-content">
            <h2>Order Placed Successfully!</h2>
            
            <div class="order-confirmation">
                <p class="order-id">Order ID: <strong>${order._id}</strong></p>
                <p>Date: ${formattedDate}</p>
                <p>Total Amount: <strong>₹${order.total.toFixed(2)}</strong></p>
                <p>Payment Method: ${order.paymentMethod}</p>
                <p>Status: <span class="order-status">${order.status}</span></p>
                
                <div class="order-customer">
                    <h3>Delivery Information</h3>
                    <p>${order.customer.name}</p>
                    <p>${order.customer.address}</p>
                    <p>${order.customer.phone}</p>
                    ${order.customer.email ? `<p>${order.customer.email}</p>` : ''}
                </div>
                
                <h3>Order Summary</h3>
                <table class="order-summary-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>₹${item.price.toFixed(2)}</td>
                                <td>${item.quantity}</td>
                                <td>₹${item.subtotal.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="confirmation-message">
                    <p>Thank you for shopping with AGROCART!</p>
                    <p>You'll receive updates about your order status via phone.</p>
                </div>
                
                <button type="button" class="primary-btn close-modal-btn">Continue Shopping</button>
            </div>
        </div>
    `;
    
    // Add the modal to the document
    document.body.appendChild(modal);
    
    // Show the modal
    modal.style.display = 'block';
    
    // Add event listener for close button
    modal.querySelector('.close-modal-btn').addEventListener('click', function() {
        closeAllModals();
        
        // Reload the products
        if (typeof loadProducts === 'function') {
            loadProducts();
        }
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAllModals();
        }
    });
}

// Function to close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Function to show loading indicator
function showLoadingIndicator() {
    // Create loading element if it doesn't exist
    if (!document.getElementById('loading-indicator')) {
        const loading = document.createElement('div');
        loading.id = 'loading-indicator';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Processing your order...</p>
        `;
        document.body.appendChild(loading);
    }
    
    // Show the loading indicator
    document.getElementById('loading-indicator').style.display = 'flex';
}

// Function to hide loading indicator
function hideLoadingIndicator() {
    const loadingElement = document.getElementById('loading-indicator');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Function to show a notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Function to update cart count (reused from buyerproduct.js)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}