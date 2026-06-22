// Main Application JavaScript
// iTSEC.AZ & ProSecurity

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadFeaturedProducts();
    setupEventListeners();
});

function initializeApp() {
    // Initialize sample products if not exists
    const existingProducts = localStorage.getItem('products');
    if (!existingProducts) {
        const sampleProducts = [
            {
                id: "1",
                name: "Hikvision DS-2DE4225IW-DE 2MP PTZ Camera",
                brand: "Hikvision",
                category: "cameras",
                price: 899,
                retailPrice: 899,
                wholesalePrice: 699,
                image: "https://via.placeholder.com/300x200?text=Hikvision+PTZ",
                description: "Professional 2MP PTZ camera with 25x optical zoom and PoE support",
                stock: 15
            },
            {
                id: "2",
                name: "Avitel IP Camera 5MP Full HD",
                brand: "Avitel",
                category: "cameras",
                price: 599,
                retailPrice: 599,
                wholesalePrice: 450,
                image: "https://via.placeholder.com/300x200?text=Avitel+Camera",
                description: "5MP high-definition IP camera with 4x digital zoom",
                stock: 20
            },
            {
                id: "3",
                name: "Dahua IPC-HDBW2431E-S 4MP Camera",
                brand: "Dahua",
                category: "cameras",
                price: 549,
                retailPrice: 549,
                wholesalePrice: 420,
                image: "https://via.placeholder.com/300x200?text=Dahua+Camera",
                description: "4MP compact network camera with infrared",
                stock: 25
            },
            {
                id: "4",
                name: "TP-Link Cat6 Ethernet Cable 305m",
                brand: "TP-Link",
                category: "cables",
                price: 399,
                retailPrice: 399,
                wholesalePrice: 280,
                image: "https://via.placeholder.com/300x200?text=TP-Link+Cable",
                description: "High-speed Cat6 cable for network installations",
                stock: 50
            },
            {
                id: "5",
                name: "Uniview IPC322SR-DVS28 2MP Camera",
                brand: "Uniview",
                category: "cameras",
                price: 449,
                retailPrice: 449,
                wholesalePrice: 340,
                image: "https://via.placeholder.com/300x200?text=Uniview+Camera",
                description: "2MP turret network camera with night vision",
                stock: 18
            },
            {
                id: "6",
                name: "Ubiquiti UniFi Dream Machine",
                brand: "Ubiquiti",
                category: "smart",
                price: 379,
                retailPrice: 379,
                wholesalePrice: 290,
                image: "https://via.placeholder.com/300x200?text=Ubiquiti+UDM",
                description: "All-in-one UniFi network management system",
                stock: 12
            }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (isLoggedIn && userRole === 'wholesaler') {
        document.querySelectorAll('.product-price-wholesale').forEach(el => {
            el.style.display = 'block';
        });
    }
}

function loadFeaturedProducts() {
    const productsContainer = document.getElementById('featuredProducts');
    if (!productsContainer) return;

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const featured = products.slice(0, 3);

    const html = featured.map(product => `
        <div class="col-md-6 col-lg-4">
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h5 class="product-name">${product.name}</h5>
                    <p class="text-muted small">${product.brand}</p>
                    <div class="product-price">$${product.retailPrice.toFixed(2)}</div>
                    <p class="product-price-wholesale text-success">Wholesale: $${product.wholesalePrice.toFixed(2)}</p>
                    <p class="text-muted small flex-grow-1">${product.description}</p>
                    <button class="btn btn-danger w-100" onclick="addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    productsContainer.innerHTML = html;
}

function setupEventListeners() {
    // Language toggle
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.addEventListener('click', toggleLanguage);
    }

    // Sort products
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }

    // Search products
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', handleSearch);
    }

    // Filter products
    document.querySelectorAll('.brand-filter, .category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);

    if (!product) {
        alert('Product not found');
        return;
    }

    const userRole = localStorage.getItem('userRole') || 'customer';
    const price = userRole === 'wholesaler' ? product.wholesalePrice : product.retailPrice;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: price,
            quantity: 1,
            image: product.image
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
}

function handleSort(event) {
    const sortValue = event.target.value;
    const productsContainer = document.getElementById('productsGrid');
    if (!productsContainer) return;

    let products = Array.from(productsContainer.querySelectorAll('[data-product]'));

    products.sort((a, b) => {
        const aValue = a.dataset.product;
        const bValue = b.dataset.product;

        switch(sortValue) {
            case 'name-asc':
                return aValue.localeCompare(bValue);
            case 'price-asc':
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            case 'price-desc':
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            default:
                return 0;
        }
    });

    productsContainer.innerHTML = '';
    products.forEach(product => productsContainer.appendChild(product));
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    applyFilters();
}

function applyFilters() {
    const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(cb => cb.value);
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);

        return matchesSearch && matchesBrand && matchesCategory;
    });

    displayProducts(filtered);
}

function displayProducts(products) {
    const container = document.getElementById('productsGrid');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center text-muted py-5">No products found</p></div>';
        return;
    }

    const userRole = localStorage.getItem('userRole') || 'customer';
    const html = products.map(product => {
        const price = userRole === 'wholesaler' ? product.wholesalePrice : product.retailPrice;
        return `
            <div class="col-md-6 col-lg-4">
                <div class="product-card" data-product="${product.name}" data-price="${price}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h5 class="product-name">${product.name}</h5>
                        <p class="text-muted small">${product.brand}</p>
                        <div class="product-price">$${price.toFixed(2)}</div>
                        <p class="text-muted small mb-2">${product.stock > 0 ? product.stock + ' in stock' : 'Out of stock'}</p>
                        <div class="d-flex gap-2">
                            <a href="product-detail.html?id=${product.id}" class="btn btn-sm btn-outline-danger flex-grow-1">
                                <i class="fas fa-eye"></i> View
                            </a>
                            <button class="btn btn-sm btn-danger" onclick="addToCart('${product.id}')" ${product.stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.brand-filter, .category-filter').forEach(checkbox => {
        checkbox.checked = false;
    });
    applyFilters();
}

function toggleLanguage() {
    const currentLang = localStorage.getItem('language') || 'en';
    const newLang = currentLang === 'en' ? 'az' : 'en';
    localStorage.setItem('language', newLang);
    alert('Language changed to ' + (newLang === 'en' ? 'English' : 'Azərbaycanca'));
    // In production, reload page with translations
}

function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    if (chatBox) {
        chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) return;

    const chatMessages = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = 'mb-2';
    messageEl.innerHTML = `<div class="bg-light p-2 rounded small"><strong>You:</strong> ${message}</div>`;
    chatMessages.appendChild(messageEl);

    // Simulate bot response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'mb-2';
        botMessage.innerHTML = `<div class="bg-danger text-white p-2 rounded small"><strong>Support:</strong> Thank you for your message. Our team will respond shortly!</div>`;
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Export for use in other files
window.app = {
    addToCart,
    toggleChat,
    sendMessage,
    clearFilters,
    toggleLanguage
};