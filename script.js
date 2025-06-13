// Sample product data with categories and relative image paths
const products = [
    { id: 1, name: "Smartphone Pro", price: 599.99, image: "assets/mobile.jpg", category: "Electronics" },
    { id: 2, name: "UltraBook Laptop", price: 999.99, image: "assets/Laptop.jpg", category: "Electronics" },
    { id: 3, name: "Wireless Headphones", price: 149.99, image: "assets/Headset.jpg", category: "Accessories" },
    { id: 4, name: "Smartwatch Elite", price: 249.99, image: "assets/smartwatch.jpg", category: "Accessories" },
    { id: 5, name: "Tablet Air", price: 399.99, image: "assets/Tablet.jpg", category: "Electronics" },
     { id: 6, name: "jwellery", price: 140.99, image: "assets/jwellery.jpg", category: "Accessories" },
];


// Cart array to store selected items
let cart = [];

// Load products and initialize functionality
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const loader = document.getElementById('loader');
    const searchInput = document.getElementById('search-input');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Show loader
    loader.style.display = 'block';
    productGrid.style.display = 'none';

    // Simulate loading delay
    setTimeout(() => {
        loader.style.display = 'none';
        productGrid.style.display = 'grid';
        renderProducts(products);
    }, 1000);

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        filterProducts(searchTerm, activeCategory);
    });

    // Category filter functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const searchTerm = searchInput.value.toLowerCase();
            filterProducts(searchTerm, button.dataset.category);
        });
    });

    // Cart modal toggle
    document.getElementById('cart-toggle').addEventListener('click', () => {
        document.getElementById('cart-modal').classList.toggle('hidden');
    });

    // Close cart modal
    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-modal').classList.add('hidden');
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert('Checkout complete! (This is a demo - no actual transaction occurs)');
        cart = [];
        updateCart();
    });

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
});

// Render products
function renderProducts(productsToDisplay) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter products by search term and category
function filterProducts(searchTerm, category) {
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });
    renderProducts(filteredProducts);
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hidden');
    }, 2000);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update cart display and localStorage
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = totalItems;
    cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;

    localStorage.setItem('cart', JSON.stringify(cart));
}