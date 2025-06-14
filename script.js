// Farmer and Buyer Buttons
document.getElementById('farmerBtn')?.addEventListener('click', function() {
    window.location.href = 'login.html';
});

document.getElementById('buyerBtn')?.addEventListener('click', function() {
    window.location.href = 'dash.html';
});

// Signup Form Validation
document.querySelector('.signup-container form')?.addEventListener('submit', function(event) {
    const password = document.getElementById('password').value;
    const retypePassword = document.getElementById('retype-password').value;

    if (password !== retypePassword) {
        alert('Passwords do not match!');
        event.preventDefault();
    }
});

// Chat with AI Button
document.querySelector('.chatbot-btn')?.addEventListener('click', () => {
    alert('Chat with AI functionality will be added soon!');
});

// Logout Button
document.querySelector('.logout-btn')?.addEventListener('click', () => {
   
    window.location.href = 'index.html';
});

// Weather Data Fetching
const weatherIcons = {
    "Clear": "sunny-outline",
    "Clouds": "cloud-outline",
    "Rain": "rainy-outline",
    "Thunderstorm": "thunderstorm-outline",
    "Snow": "snow-outline",
    "Mist": "cloudy-outline",
};

async function fetchWeather() {
    const apiKey = '58b7d9d18228197415fe2bfa899dedd7'; // Replace with your OpenWeatherMap API key
    const city = 'Kochi'; // Replace with the desired city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const weatherCondition = data.weather[0].main;
        const weatherIcon = document.querySelector('.weather-icon');
        if (weatherIcon) {
            weatherIcon.setAttribute('name', weatherIcons[weatherCondition] || 'partly-sunny-outline');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

fetchWeather();

// Activate Notification and User Profile Buttons
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.notification-icon')?.addEventListener('click', function () {
        alert('Notifications clicked!');
    });

    document.querySelector('.user-icon')?.addEventListener('click', function () {
       
    });
});

const userProfileBtn = document.querySelector('.user-icon');
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', function () {
            // Redirect to the farmer profile page
            window.location.href = 'profile.html';
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        // DOM Elements
        const productsContainer = document.getElementById('products-container');
        const addProductBtn = document.getElementById('add-product-btn');
        const productModal = document.getElementById('product-modal');
        const confirmModal = document.getElementById('confirm-modal');
        const modalTitle = document.getElementById('modal-title');
        const productForm = document.getElementById('product-form');
        const productIdInput = document.getElementById('product-id');
        const productNameInput = document.getElementById('product-name');
        const productDescriptionInput = document.getElementById('product-description');
        const productCategoryInput = document.getElementById('product-category');
        const productQuantityInput = document.getElementById('product-quantity');
        const productPriceInput = document.getElementById('product-price');
        const productExpiryInput = document.getElementById('product-expiry');
        const organicCheckInput = document.getElementById('organic-check');
        const productImageInput = document.getElementById('product-image');
        const imagePreview = document.getElementById('image-preview');
        const cancelBtn = document.getElementById('cancel-btn');
        const closeBtn = document.querySelector('.close');
        const cancelDeleteBtn = document.getElementById('cancel-delete');
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        const productSearch = document.getElementById('product-search');
        const categoryFilter = document.getElementById('category-filter');
        const statusFilter = document.getElementById('status-filter');
        
        // Variables
        let currentProducts = [];
        let productToDelete = null;
        
        // Fetch products when page loads
        fetchProducts();
        
        // Initialize event listeners
        initEventListeners();
        
        function initEventListeners() {
            // Open modal to add new product
            addProductBtn.addEventListener('click', () => {
                openProductModal();
            });
            
            // Close modal
            closeBtn.addEventListener('click', closeProductModal);
            cancelBtn.addEventListener('click', closeProductModal);
            
            // Handle image upload
            productImageInput.addEventListener('change', handleImagePreview);
            
            // Submit form
            productForm.addEventListener('submit', handleProductSubmit);
            
            // Cancel delete
            cancelDeleteBtn.addEventListener('click', () => {
                confirmModal.style.display = 'none';
                productToDelete = null;
            });
            
            // Confirm delete
            confirmDeleteBtn.addEventListener('click', () => {
                if (productToDelete) {
                    deleteProduct(productToDelete);
                }
                confirmModal.style.display = 'none';
            });
            
            // Search and filter
            productSearch.addEventListener('input', applyFilters);
            categoryFilter.addEventListener('change', applyFilters);
            statusFilter.addEventListener('change', applyFilters);
            
            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === productModal) {
                    closeProductModal();
                }
                if (e.target === confirmModal) {
                    confirmModal.style.display = 'none';
                    productToDelete = null;
                }
            });
        }
        
        function fetchProducts() {
            // Show loading state
            productsContainer.innerHTML = '<div class="loading">Loading products...</div>';
            
            // Fetch products from API
            fetch('api/products.php')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch products');
                    }
                    return response.json();
                })
                .then(data => {
                    currentProducts = data;
                    renderProducts(data);
                })
                .catch(error => {
                    productsContainer.innerHTML = `<div class="error">${error.message}</div>`;
                    console.error('Error fetching products:', error);
                    
                    // For development - show sample data
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        const sampleProducts = getSampleProducts();
                        currentProducts = sampleProducts;
                        renderProducts(sampleProducts);
                    }
                });
        }
        
        function renderProducts(products) {
            if (products.length === 0) {
                productsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-seedling empty-icon"></i>
                        <h3>No products found</h3>
                        <p>Start adding your farm products to showcase to buyers.</p>
                        <button class="primary-btn" onclick="document.getElementById('add-product-btn').click()">
                            <i class="fas fa-plus"></i> Add Your First Product
                        </button>
                    </div>
                `;
                return;
            }
            
            productsContainer.innerHTML = '';
            
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                
                let statusClass = '';
                if (product.quantity <= 0) {
                    statusClass = 'sold-out';
                } else if (new Date(product.expiry) < new Date()) {
                    statusClass = 'expired';
                } else {
                    statusClass = 'active';
                }
                
                card.innerHTML = `
                    <div class="product-image-container">
                        <img src="${product.image || 'images/product-placeholder.jpg'}" alt="${product.name}" class="product-image">
                        ${product.organic ? '<span class="organic-badge">Organic</span>' : ''}
                    </div>
                    <div class="product-details">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-category">${getCategoryLabel(product.category)}</p>
                        <p class="product-price">₹${product.price.toFixed(2)} per kg</p>
                        <p class="product-quantity ${statusClass}">
                            ${product.quantity > 0 ? `Available: ${product.quantity} kg` : 'Sold Out'}
                        </p>
                        <p class="product-expiry">
                            ${new Date(product.expiry) < new Date() 
                                ? '<span class="expired-text">Expired</span>' 
                                : `Expires: ${formatDate(product.expiry)}`}
                        </p>
                        <div class="product-actions">
                            <button class="secondary-btn" onclick="editProduct(${product.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="danger-btn" onclick="confirmDelete(${product.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
                
                productsContainer.appendChild(card);
            });
            
            // Add global functions for edit and delete
            window.editProduct = function(productId) {
                const product = currentProducts.find(p => p.id === productId);
                if (product) {
                    openProductModal(product);
                }
            };
            
            window.confirmDelete = function(productId) {
                productToDelete = productId;
                const product = currentProducts.find(p => p.id === productId);
                
                if (product) {
                    document.getElementById('confirm-message').textContent = 
                        `Are you sure you want to delete "${product.name}"?`;
                    confirmModal.style.display = 'block';
                }
            };
        }
        
        function openProductModal(product = null) {
            // Reset form
            productForm.reset();
            imagePreview.src = 'images/product-placeholder.jpg';
            productIdInput.value = '';
            
            // Set modal title
            modalTitle.textContent = product ? 'Edit Product' : 'Add New Product';
            
            // If editing, fill form with product data
            if (product) {
                productIdInput.value = product.id;
                productNameInput.value = product.name;
                productDescriptionInput.value = product.description || '';
                productCategoryInput.value = product.category;
                productQuantityInput.value = product.quantity;
                productPriceInput.value = product.price;
                productExpiryInput.value = formatDateForInput(product.expiry);
                organicCheckInput.checked = product.organic;
                
                if (product.image) {
                    imagePreview.src = product.image;
                }
            } else {
                // Default values for new product
                const today = new Date();
                const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
                productExpiryInput.value = formatDateForInput(nextMonth);
            }
            
            // Show modal
            productModal.style.display = 'block';
        }
        
        function closeProductModal() {
            productModal.style.display = 'none';
        }
        
        function handleImagePreview(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imagePreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
        
        function handleProductSubmit(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateProductForm()) {
                return;
            }
            
            const productId = productIdInput.value;
            const isNewProduct = !productId;
            
            // Prepare form data
            const formData = new FormData();
            formData.append('name', productNameInput.value);
            formData.append('description', productDescriptionInput.value);
            formData.append('category', productCategoryInput.value);
            formData.append('quantity', productQuantityInput.value);
            formData.append('price', productPriceInput.value);
            formData.append('expiry', productExpiryInput.value);
            formData.append('organic', organicCheckInput.checked ? '1' : '0');
            
            if (productImageInput.files.length > 0) {
                formData.append('image', productImageInput.files[0]);
            }
            
            if (!isNewProduct) {
                formData.append('id', productId);
            }
            
            // Send data to server
            const url = isNewProduct ? 'api/add_product.php' : 'api/update_product.php';
            
            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(isNewProduct ? 'Failed to add product' : 'Failed to update product');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Show success message
                    showNotification(
                        isNewProduct ? 'Product added successfully!' : 'Product updated successfully!', 
                        'success'
                    );
                    
                    // Refresh product list
                    fetchProducts();
                    
                    // Close modal
                    closeProductModal();
                } else {
                    throw new Error(data.message || 'Operation failed');
                }
            })
            .catch(error => {
                showNotification(error.message, 'error');
                console.error('Error:', error);
                
                // For development - simulate success
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    simulateProductOperation(isNewProduct);
                }
            });
        }
        
        function simulateProductOperation(isNewProduct) {
            // This is only for local development when API is not available
            const newProduct = {
                id: productIdInput.value || Math.floor(Math.random() * 1000) + 100,
                name: productNameInput.value,
                description: productDescriptionInput.value,
                category: productCategoryInput.value,
                quantity: parseFloat(productQuantityInput.value),
                price: parseFloat(productPriceInput.value),
                expiry: productExpiryInput.value,
                organic: organicCheckInput.checked,
                image: imagePreview.src
            };
            
            if (isNewProduct) {
                currentProducts.push(newProduct);
            } else {
                const index = currentProducts.findIndex(p => p.id == newProduct.id);
                if (index !== -1) {
                    currentProducts[index] = newProduct;
                }
            }
            
            renderProducts(currentProducts);
            showNotification(
                isNewProduct ? 'Product added successfully! (Demo)' : 'Product updated successfully! (Demo)', 
                'success'
            );
            closeProductModal();
        }
        
        function deleteProduct(productId) {
            fetch(`api/delete_product.php?id=${productId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showNotification('Product deleted successfully!', 'success');
                    fetchProducts();
                } else {
                    throw new Error(data.message || 'Failed to delete product');
                }
            })
            .catch(error => {
                showNotification(error.message, 'error');
                console.error('Error:', error);
                
                // For development - simulate delete
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    currentProducts = currentProducts.filter(p => p.id != productId);
                    renderProducts(currentProducts);
                    showNotification('Product deleted successfully! (Demo)', 'success');
                }
            });
        }
        
        function validateProductForm() {
            // Check required fields
            if (!productNameInput.value.trim()) {
                showNotification('Product name is required', 'error');
                productNameInput.focus();
                return false;
            }
            
            if (!productCategoryInput.value) {
                showNotification('Please select a category', 'error');
                productCategoryInput.focus();
                return false;
            }
            
            // Validate quantity and price
            const quantity = parseFloat(productQuantityInput.value);
            if (isNaN(quantity) || quantity < 0) {
                showNotification('Please enter a valid quantity', 'error');
                productQuantityInput.focus();
                return false;
            }
            
            const price = parseFloat(productPriceInput.value);
            if (isNaN(price) || price <= 0) {
                showNotification('Please enter a valid price', 'error');
                productPriceInput.focus();
                return false;
            }
            
            // Validate expiry date
            const expiry = new Date(productExpiryInput.value);
            if (isNaN(expiry.getTime())) {
                showNotification('Please enter a valid expiry date', 'error');
                productExpiryInput.focus();
                return false;
            }
            
            return true;
        }
        
        function applyFilters() {
            const searchTerm = productSearch.value.toLowerCase();
            const categoryValue = categoryFilter.value;
            const statusValue = statusFilter.value;
            
            let filteredProducts = currentProducts;
            
            // Apply search
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) || 
                    (product.description && product.description.toLowerCase().includes(searchTerm))
                );
            }
            
            // Apply category filter
            if (categoryValue) {
                filteredProducts = filteredProducts.filter(product => 
                    product.category === categoryValue
                );
            }
            
            // Apply status filter
            if (statusValue) {
                const today = new Date();
                
                switch (statusValue) {
                    case 'active':
                        filteredProducts = filteredProducts.filter(product => 
                            product.quantity > 0 && new Date(product.expiry) > today
                        );
                        break;
                    case 'sold-out':
                        filteredProducts = filteredProducts.filter(product => 
                            product.quantity <= 0
                        );
                        break;
                    case 'expired':
                        filteredProducts = filteredProducts.filter(product => 
                            new Date(product.expiry) < today
                        );
                        break;
                }
            }
            
            renderProducts(filteredProducts);
        }
        
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close">×</button>
            `;
            
            document.body.appendChild(notification);
            
            // Add close event
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.remove();
            });
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
        }
        
        function getCategoryLabel(categoryValue) {
            const categories = {
                'vegetables': 'Vegetables',
                'fruits': 'Fruits',
                'grains': 'Grains & Cereals',
                'dairy': 'Dairy Products',
                'meat': 'Meat & Poultry',
                'herbs': 'Herbs & Spices',
                'other': 'Other'
            };
            
            return categories[categoryValue] || categoryValue;
        }
        
        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }
        
        function formatDateForInput(dateString) {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        }
        
        function getSampleProducts() {
            return [
                {
                    id: 1,
                    name: 'Fresh Tomatoes',
                    description: 'Locally grown vine-ripened tomatoes',
                    category: 'vegetables',
                    quantity: 50,
                    price: 40,
                    expiry: '2025-04-15',
                    organic: true,
                    image: 'images/sample/tomatoes.jpg'
                },
                {
                    id: 2,
                    name: 'Alphonso Mangoes',
                    description: 'Premium quality Alphonso mangoes from Ratnagiri',
                    category: 'fruits',
                    quantity: 100,
                    price: 350,
                    expiry: '2025-04-05',
                    organic: false,
                    image: 'images/sample/mangoes.jpg'
                },
                {
                    id: 3,
                    name: 'Organic Rice',
                    description: 'Pesticide-free basmati rice',
                    category: 'grains',
                    quantity: 200,
                    price: 90,
                    expiry: '2025-08-20',
                    organic: true,
                    image: 'images/sample/rice.jpg'
                },
                {
                    id: 4,
                    name: 'Farm Fresh Milk',
                    description: 'Fresh cow milk delivered daily',
                    category: 'dairy',
                    quantity: 0,
                    price: 60,
                    expiry: '2025-03-22',
                    organic: false,
                    image: 'images/sample/milk.jpg'
                },
                {
                    id: 5,
                    name: 'Green Chillies',
                    description: 'Spicy green chillies',
                    category: 'herbs',
                    quantity: 20,
                    price: 30,
                    expiry: '2025-03-15',
                    organic: true,
                    image: 'images/sample/chillies.jpg'
                }
            ];
        }
    });

    // Logout functionality
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    
    window.location.href = 'index.html'; // Redirect to the home page
  });