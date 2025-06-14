// orders.js - Functionality for the orders page

// Global variables for pagination
let currentPage = 1;
const ordersPerPage = 5;
let totalOrders = 0;
let filteredOrders = [];

// Store user info in local storage for demo purposes (in a real app, this would be handled with proper authentication)
const currentUser = {
    phone: localStorage.getItem('userPhone') || ''
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
    // Fetch and display orders
    fetchOrders();
    
    // Add event listeners for search and filters
    document.getElementById('order-search').addEventListener('input', filterOrders);
    document.getElementById('status-filter').addEventListener('change', filterOrders);
    document.getElementById('date-filter').addEventListener('change', filterOrders);
    
    // Add event listeners for pagination
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayOrders(filteredOrders);
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredOrders.length / ordersPerPage)) {
            currentPage++;
            displayOrders(filteredOrders);
        }
    });
    
    // Event delegation for order card clicks
    document.getElementById('orders-container').addEventListener('click', function(e) {
        const orderCard = e.target.closest('.order-card');
        if (orderCard) {
            const orderId = orderCard.getAttribute('data-order-id');
            showOrderDetails(orderId);
        }
    });
    
    // Close modal when X is clicked
    document.querySelector('.close-modal-btn').addEventListener('click', function() {
        document.getElementById('order-detail-modal').style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('order-detail-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Ask for phone number if not available (for demo purposes)
    if (!currentUser.phone) {
        promptForPhoneNumber();
    }
});

// Function to prompt for phone number (for demo purposes)
function promptForPhoneNumber() {
    // Create a modal for phone input
    const phoneModal = document.createElement('div');
    phoneModal.className = 'modal';
    phoneModal.id = 'phone-modal';
    phoneModal.style.display = 'block';
    
    phoneModal.innerHTML = `
        <div class="modal-content">
            <h2>Find Your Orders</h2>
            <p>Please enter the phone number you used for your orders:</p>
            <form id="phone-form">
                <div class="form-group">
                    <input type="tel" id="user-phone" placeholder="Enter your phone number" required>
                </div>
                <button type="submit" class="primary-btn">Find Orders</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(phoneModal);
    
    // Add event listener for form submission
    document.getElementById('phone-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = document.getElementById('user-phone').value;
        if (phone) {
            localStorage.setItem('userPhone', phone);
            currentUser.phone = phone;
            document.body.removeChild(phoneModal);
            fetchOrders();
        }
    });
}

// Function to fetch orders from the server
async function fetchOrders() {
    try {
        showLoading();
        
        // Fetch all orders from the server
        const response = await fetch('http://localhost:5004/api/orders');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const orders = await response.json();
        
        // Filter orders for current user (in a real app, this would be handled by the server)
        const userOrders = currentUser.phone 
            ? orders.filter(order => order.customer.phone === currentUser.phone)
            : orders;
            
        // Sort orders by date (most recent first)
        userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        
        // Store filtered orders and display
        filteredOrders = userOrders;
        totalOrders = userOrders.length;
        
        hideLoading();
        displayOrders(userOrders);
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        hideLoading();
        showError('Failed to load orders. Please try again later.');
    }
}

// Function to display orders with pagination
function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    const noOrdersMessage = document.getElementById('no-orders-message');
    
    // Clear previous content
    ordersContainer.innerHTML = '';
    
    if (orders.length === 0) {
        // Show no orders message
        noOrdersMessage.style.display = 'block';
        ordersContainer.style.display = 'none';
        
        // Hide pagination
        document.querySelector('.pagination-controls').style.display = 'none';
        return;
    }
    
    // Hide no orders message and show container
    noOrdersMessage.style.display = 'none';
    ordersContainer.style.display = 'block';
    
    // Calculate pagination
    const totalPages = Math.ceil(orders.length / ordersPerPage);
    if (currentPage > totalPages) {
        currentPage = 1;
    }
    
    // Update pagination controls
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    document.querySelector('.pagination-controls').style.display = totalPages > 1 ? 'flex' : 'none';
    
    // Calculate slice for current page
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = Math.min(startIndex + ordersPerPage, orders.length);
    const currentOrders = orders.slice(startIndex, endIndex);
    
    // Create order cards
    currentOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.setAttribute('data-order-id', order._id);
        
        // Format date
        const orderDate = new Date(order.orderDate);
        const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Get order summary
        const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
        const firstItemName = order.items[0].name;
        const moreItemsText = order.items.length > 1 ? ` + ${order.items.length - 1} more item${order.items.length > 2 ? 's' : ''}` : '';
        
        // Get status class
        const statusClass = getStatusClass(order.status);
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-id-date">
                    <h3>Order #${order._id.substring(order._id.length - 8)}</h3>
                    <span class="order-date">${formattedDate}</span>
                </div>
                <span class="order-status ${statusClass}">${order.status}</span>
            </div>
            <div class="order-summary">
                <div class="order-items-summary">
                    <span class="item-count">${itemCount} item${itemCount !== 1 ? 's' : ''}</span>
                    <p class="item-names">${firstItemName}${moreItemsText}</p>
                </div>
                <div class="order-total">
                    <span class="total-label">Total:</span>
                    <span class="total-amount">₹${order.total.toFixed(2)}</span>
                </div>
            </div>
            <div class="order-actions">
                <button class="view-details-btn">View Details</button>
            </div>
        `;
        
        ordersContainer.appendChild(orderCard);
    });
}

// Function to show order details in a modal
async function showOrderDetails(orderId) {
    try {
        // Show loading
        const modal = document.getElementById('order-detail-modal');
        const contentDiv = document.getElementById('order-detail-content');
        contentDiv.innerHTML = `
            <div class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>Loading order details...</p>
            </div>
        `;
        modal.style.display = 'block';
        
        // Fetch order details
        const response = await fetch(`http://localhost:5004/api/orders/${orderId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const order = await response.json();
        
        // Format date
        const orderDate = new Date(order.orderDate);
        const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
        
        // Get status class
        const statusClass = getStatusClass(order.status);
        
        // Create order details HTML
        contentDiv.innerHTML = `
            <div class="order-detail-header">
                <h2>Order Details</h2>
                <span class="order-id">Order ID: ${order._id}</span>
            </div>
            
            <div class="order-info-grid">
                <div class="order-info-item">
                    <h3>Order Date</h3>
                    <p>${formattedDate}</p>
                </div>
                <div class="order-info-item">
                    <h3>Status</h3>
                    <p class="status-badge ${statusClass}">${order.status}</p>
                </div>
                <div class="order-info-item">
                    <h3>Payment Method</h3>
                    <p>${order.paymentMethod}</p>
                </div>
                <div class="order-info-item">
                    <h3>Total Amount</h3>
                    <p class="total-price">₹${order.total.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Delivery Information</h3>
                <div class="customer-info">
                    <p><strong>Name:</strong> ${order.customer.name}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                    ${order.customer.email ? `<p><strong>Email:</strong> ${order.customer.email}</p>` : ''}
                    <p><strong>Address:</strong> ${order.customer.address}</p>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Order Items</h3>
                <table class="order-items-table">
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
                    <tfoot>
                        <tr>
                            <td colspan="3">Total</td>
                            <td>₹${order.total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            <div class="order-detail-actions">
                <button id="track-order-btn" class="primary-btn">Track Order</button>
                <button id="contact-support-btn" class="secondary-btn">Contact Support</button>
            </div>
        `;
        
        // Add event listeners for action buttons
        document.getElementById('track-order-btn').addEventListener('click', () => {
            showNotification('Order tracking is not available yet', 'info');
        });
        
        document.getElementById('contact-support-btn').addEventListener('click', () => {
            showNotification('Support contact feature coming soon', 'info');
        });
        
    } catch (error) {
        console.error('Error fetching order details:', error);
        document.getElementById('order-detail-content').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load order details. Please try again later.</p>
            </div>
        `;
    }
}

// Function to filter orders based on search and filter values
function filterOrders() {
    const searchTerm = document.getElementById('order-search').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    // Get all orders
    if (!filteredOrders || filteredOrders.length === 0) {
        return;
    }
    
    // Clone the original orders array
    const allOrders = Array.from(filteredOrders);
    
    // Filter by search term
    let filtered = allOrders.filter(order => {
        // Search by order ID
        if (order._id.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search by product name
        const productMatch = order.items.some(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
        
        return productMatch;
    });
    
    // Filter by status
    if (statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            
            switch(dateFilter) {
                case 'today':
                    return orderDate >= today;
                case 'week':
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() - now.getDay());
                    return orderDate >= weekStart;
                case 'month':
                    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                    return orderDate >= monthStart;
                case 'year':
                    const yearStart = new Date(now.getFullYear(), 0, 1);
                    return orderDate >= yearStart;
                default:
                    return true;
            }
        });
    }
    
    // Reset to first page when filter changes
    currentPage = 1;
    
    // Display filtered orders
    displayOrders(filtered);
}

// Helper functions
function getStatusClass(status) {
    switch(status) {
        case 'Pending':
            return 'status-pending';
        case 'Processing':
            return 'status-processing';
        case 'Shipped':
            return 'status-shipped';
        case 'Delivered':
            return 'status-delivered';
        case 'Cancelled':
            return 'status-cancelled';
        default:
            return 'status-pending';
    }
}

function showLoading() {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = `
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <p>Loading your orders...</p>
        </div>
    `;
}

function hideLoading() {
    // Loading indicator will be replaced when orders are displayed
}

function showError(message) {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
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