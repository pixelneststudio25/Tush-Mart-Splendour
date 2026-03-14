// script.js

// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// ---------- MOBILE MENU TOGGLE ----------
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');
mobileMenu.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// ---------- HERO SLIDER ----------
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsContainer = document.getElementById('slider-dots');
let currentSlide = 0;
const totalSlides = slides.length;

function showSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
    // update slider transform
    document.querySelector('.slider').style.transform = `translateX(-${index * 100}%)`;
}

prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
        const slideIndex = parseInt(e.target.dataset.slide);
        showSlide(slideIndex);
    }
});

// Auto-slide every 7 seconds
setInterval(() => showSlide(currentSlide + 1), 7000);

// ---------- CART FUNCTIONALITY ----------
let cart = [];
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const cartCountSpan = document.getElementById('cart-count');

// Open cart modal
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    renderCart();
});

// Close cart modal
closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target == cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target == newsletterModal) {
        newsletterModal.style.display = 'none';
    }
});

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        const image = card.dataset.image;

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        updateCartCount();
        renderCart(); // update modal if open
    });
});

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
}

function renderCart() {
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
            <span class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></span>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    // Quantity buttons
    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const item = cart.find(i => i.id === id);
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(i => i.id !== id);
            }
            updateCartCount();
            renderCart();
        });
    });

    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const item = cart.find(i => i.id === id);
            item.quantity++;
            updateCartCount();
            renderCart();
        });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            cart = cart.filter(i => i.id !== id);
            updateCartCount();
            renderCart();
        });
    });

    cartTotalSpan.textContent = total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        alert('Thank you for your order! This is a demo.');
        cart = [];
        updateCartCount();
        renderCart();
        cartModal.style.display = 'none';
    }
});

// ---------- NEWSLETTER MODAL ----------
const newsletterBtn = document.getElementById('newsletter-btn');
const newsletterModal = document.getElementById('newsletter-modal');
const closeNewsletter = document.getElementById('close-newsletter');
const modalSubscribe = document.getElementById('modal-subscribe');

newsletterBtn.addEventListener('click', () => {
    newsletterModal.style.display = 'flex';
});

closeNewsletter.addEventListener('click', () => {
    newsletterModal.style.display = 'none';
});

modalSubscribe.addEventListener('click', () => {
    const email = document.getElementById('modal-email').value;
    if (email) {
        alert(`Subscribed with ${email}! (Demo)`);
        newsletterModal.style.display = 'none';
        document.getElementById('modal-email').value = '';
    } else {
        alert('Please enter a valid email.');
    }
});

// ---------- SEARCH FILTER ----------
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

function filterProducts() {
    const term = searchInput.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const desc = card.querySelector('.product-description').textContent.toLowerCase();
        if (name.includes(term) || desc.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

searchBtn.addEventListener('click', filterProducts);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filterProducts();
});

// ---------- SMOOTH SCROLL FOR NAV LINKS ----------
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
        navbar.classList.remove('active'); // close mobile menu
    });
});

// ---------- CONTACT FORM (demo) ----------
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! (Demo)');
    e.target.reset();
});

// ---------- NAVBAR SCROLL EFFECT ----------
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Flash message function
function showFlashMessage(message) {
    const flash = document.getElementById('flash-message');
    flash.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    flash.classList.add('show');
    setTimeout(() => {
        flash.classList.remove('show');
    }, 2000);
}

// Then modify the add-to-cart event listener:
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        const image = card.dataset.image;

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ id, name, price, image, quantity: 1 });
        }
        updateCartCount();
        renderCart(); // update modal if open
        showFlashMessage(`${name} added to cart!`);  // 👈 flash message
    });
});
