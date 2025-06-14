// buyerproduct.js - Functions for loading products for the buyer interface

document.addEventListener('DOMContentLoaded', function() {
    // Load all products when the page loads
    loadProducts();
    
    // Add event listener for the "View Products" button
    const viewProductsBtn = document.querySelector('.view-btn');
    if (viewProductsBtn) {
        viewProductsBtn.addEventListener('click', function() {
            // Scroll to products section
            const productsSection = document.querySelector('.products-section');
            productsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Initialize cart count
    updateCartCount();
    
    // Add event listener for search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // You can implement search functionality here in the future
            alert('Search functionality will be implemented soon!');
        });
    }
});

// Function to load all products from the server
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5004/api/products');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-container').innerHTML = 
            `<p class="error-message">Failed to load products. Please try again later.</p>`;
    }
}

// Function to display products in the grid
function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    
    // Clear any existing content
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products available at the moment.</p>';
        return;
    }
    
    // Loop through products and create product cards
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Format price to 2 decimal places
        const formattedPrice = product.price.toFixed(2);
        
        // Check if the product is organic to add a badge
        const organicBadge = product.isOrganic ? '<span class="organic-badge">Organic</span>' : '';
        
        // Use a default image if no image URL is provided
        const imageUrl = product.imageUrl || 'default-product.jpg';
        
        // Create the product card HTML
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.productName}">
                ${organicBadge}
            </div>
            <div class="product-info">
                <h3>${product.productName}</h3>
                <p class="product-description">${product.description || 'No description available'}</p>
                <p class="product-category">${product.category || 'Uncategorized'}</p>
                <div class="product-details">
                    <p class="product-price">₹${formattedPrice}</p>
                    <p class="product-stock">${product.quantity} in stock</p>
                </div>
                <button class="add-to-cart-btn" data-id="${product._id}">Add to Cart</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
        
        // Add event listener to the "Add to Cart" button
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', function() {
            addToCart(product);
        });
    });
}

// Function to add a product to the cart
function addToCart(product) {
    // Get the current cart from localStorage or initialize an empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingProductIndex !== -1) {
        // If the product is already in the cart, increase the quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // If the product is not in the cart, add it with quantity 1
        const cartItem = {
            _id: product._id,
            productName: product.productName,
            price: product.price,
            quantity: 1,
            imageUrl: product.imageUrl
        };
        cart.push(cartItem);
    }
    
    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update the cart count
    updateCartCount();
    
    // Show a notification
    showNotification(`${product.productName} added to cart!`);
}

// Function to update the cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Function to show a notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
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

// Add event listeners for the buyer information modal
document.addEventListener('DOMContentLoaded', function() {
    // For now, just capture the click on "Add to Cart" buttons
    // The full checkout flow will be implemented later as requested
    
    // Add event listener for the cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Cart functionality will be implemented in the future.');
        });
    }
});