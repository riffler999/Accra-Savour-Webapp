/* ==========================================================================
   Accra Savour — Application Logic
   Vanilla JavaScript, localStorage persistence, Paystack Test Mode ready.
   ========================================================================== */

/* ---------- Config ---------- */
const CURRENCY = 'GHS';
const CURRENCY_SYMBOL = '₵';

// Paystack test public key — replace with your live key in production.
// Test cards: 4084 0840 8604 6795 (any future expiry, any CVV, PIN 3310)
const PAYSTACK_PUBLIC_KEY = 'pk_test_your_test_public_key_here';
const PAYSTACK_SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';

// Test card details for local/dev testing (any expiry, any CVV, PIN 3310)
const TEST_CARD_NUMBER = '4084 0840 8604 6795';
const TEST_CARD_PIN = '3310';

const STORAGE_KEY_CART = 'accrasavour_cart';
const STORAGE_KEY_ORDER = 'accrasavour_last_order';

/* ---------- Menu data (Ghana restaurant) ---------- */
const MENU_ITEMS = [
  {
    id: 1, name: 'Jollof Rice & Grilled Chicken', category: 'rice',
    price: 45.00, currency: 'GHS',
    description: 'Signature tomato jollof served with grilled chicken, shito and fried plantain.',
    image: 'https://placehold.co/600x450?text=Jollof+Rice+%26+Grilled+Chicken&bg=F7F4EF&fg=B85042',
    popular: true
  },
  {
    id: 2, name: 'Waakye with Fish & Shito', category: 'rice',
    price: 35.00, description: 'Beans and rice classic with boiled egg, spaghetti, fish and shito.',
    image: 'https://placehold.co/600x450?text=Waakye+with+Fish+%26+Shito&bg=F7F4EF&fg=B85042'
  },
  {
    id: 3, name: 'Banku & Grilled Tilapia', category: 'mains',
    price: 50.00, description: 'Fermented corn dough with grilled tilapia, pepper sauce and okro stew.',
    image: 'https://placehold.co/600x450?text=Banku+%26+Grilled+Tilapia&bg=F7F4EF&fg=B85042'
  },
  {
    id: 4, name: 'Red Red with Fried Plantain', category: 'mains',
    price: 30.00, description: 'Black-eyed pea stew in palm oil with sweet fried plantain and avocado.',
    image: 'https://placehold.co/600x450?text=Red+Red+with+Fried+Plantain&bg=F7F4EF&fg=B85042', vegetarian: true
  },
  {
    id: 5, name: 'Groundnut Soup with Fufu', category: 'mains',
    price: 40.00, description: 'Rich peanut soup served with fufu and your choice of chicken or goat.',
    image: 'https://placehold.co/600x450?text=Groundnut+Soup+with+Fufu&bg=F7F4EF&fg=B85042'
  },
  {
    id: 6, name: 'Light Soup with Goat Meat', category: 'mains',
    price: 55.00, description: 'Light tomato soup with tender goat meat, served with rice balls.',
    image: 'https://placehold.co/600x450?text=Light+Soup+with+Goat+Meat&bg=F7F4EF&fg=B85042'
  },
  {
    id: 7, name: 'Crispy Chicken Burger', category: 'burgers',
    price: 35.00, description: 'Buttermilk fried chicken, lettuce, tomato and special sauce in a brioche bun.',
    image: 'https://placehold.co/600x450?text=Crispy+Chicken+Burger&bg=F7F4EF&fg=B85042'
  },
  {
    id: 8, name: 'Classic Beef Burger', category: 'burgers',
    price: 40.00, description: 'Grilled beef patty, cheese, caramelized onions and house sauce.',
    image: 'https://placehold.co/600x450?text=Classic+Beef+Burger&bg=F7F4EF&fg=B85042', popular: true
  },
  {
    id: 9, name: 'Chinchinga (Suya Kebab)', category: 'sides',
    price: 25.00, description: 'Spicy grilled beef skewers with sliced onions and extra shito.',
    image: 'https://placehold.co/600x450?text=Chinchinga+%28Suya%29&bg=F7F4EF&fg=B85042'
  },
  {
    id: 10, name: 'Kelewele', category: 'sides',
    price: 20.00, description: 'Spiced fried ripe plantain cubes with roasted peanuts.',
    image: 'https://placehold.co/600x450?text=Kelewele&bg=F7F4EF&fg=B85042', vegetarian: true
  },
  {
    id: 11, name: 'Bofrot (Ghanaian Donut)', category: 'desserts',
    price: 15.00, description: 'Sweet fried dough balls dusted with sugar — served warm.',
    image: 'https://placehold.co/600x450?text=Bofrot&bg=F7F4EF&fg=B85042', vegetarian: true
  },
  {
    id: 12, name: 'Sobolo (Hibiscus Drink)', category: 'drinks',
    price: 12.00, description: 'Chilled hibiscus infusion with pineapple and ginger.',
    image: 'https://placehold.co/600x450?text=Sobolo&bg=F7F4EF&fg=B85042', vegetarian: true
  },
  {
    id: 13, name: 'Fan Ice / Fan Yogo', category: 'desserts',
    price: 10.00, description: 'Vanilla ice cream on a stick — the classic Ghanaian treat.',
    image: 'https://placehold.co/600x450?text=Fan+Ice+%2F+Fan+Yogo&bg=F7F4EF&fg=B85042', vegetarian: true
  },
  {
    id: 14, name: 'Bottled Water', category: 'drinks',
    price: 5.00, description: '500ml still water.',
    image: 'https://placehold.co/600x450?text=Bottled+Water&bg=F7F4EF&fg=B85042', vegetarian: true
  }
];

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'rice', label: 'Jollof & Rice' },
  { key: 'mains', label: 'Mains & Soups' },
  { key: 'burgers', label: 'Burgers' },
  { key: 'sides', label: 'Sides' },
  { key: 'drinks', label: 'Drinks' },
  { key: 'desserts', label: 'Desserts' }
];
/* ---------- Cart state ---------- */
let cart = JSON.parse(localStorage.getItem(STORAGE_KEY_CART)) || [];

function saveCart() {
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  updateCartBadge();
  if (typeof renderCartSidebarTotal === 'function') renderCartSidebarTotal();
}

function addToCart(itemId, qty = 1) {
  const item = MENU_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  const existing = cart.find(i => i.id === itemId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty });
  }
  saveCart();
  showToast(`${item.name} added to cart`, 'success');
}

function removeFromCart(itemId) {
  cart = cart.filter(i => i.id !== itemId);
  saveCart();
  renderCart();
}

function changeQuantity(itemId, delta) {
  const item = cart.find(i => i.id === itemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(itemId);
  else {
    saveCart();
    renderCart();
  }
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartCount();
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

function formatPrice(price) {
  return `${CURRENCY_SYMBOL} ${price.toFixed(2)}`;
}

/* ---------- Generic render helpers ---------- */
function renderMenuCard(item) {
  return `
    <article class="menu-card" data-id="${item.id}">
      <div class="menu-card-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        ${item.popular ? '<span class="menu-card-badge">Popular</span>' : ''}
      </div>
      <div class="menu-card-content">
        <div class="menu-card-meta">
          <h3>${item.name}</h3>
          <span class="menu-card-price">${formatPrice(item.price)}</span>
        </div>
        <p>${item.description}</p>
        <div class="menu-card-actions">
          <button class="btn btn--primary btn--full add-to-cart" data-id="${item.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function initAddToCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      btn.classList.add('loading-state');
      const original = btn.innerHTML;
      btn.innerHTML = '<span class="loader active"><span></span></span> Adding…';
      setTimeout(() => {
        addToCart(id);
        btn.classList.remove('loading-state');
        btn.innerHTML = original;
      }, 400);
    });
  });
}
/* ---------- Menu page: render + filters ---------- */
function renderMenu(filterKey = 'all') {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  const filtered = filterKey === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.category === filterKey);
  grid.innerHTML = filtered.map(renderMenuCard).join('');
  initAddToCartButtons();
}

function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tabs button');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderMenu(tab.dataset.category);
    });
  });
}

function renderFilterTabs() {
  const container = document.getElementById('filter-tabs');
  if (!container) return;
  container.innerHTML = CATEGORIES.map(c => `
    <button class="${c.key === 'all' ? 'active' : ''}" data-category="${c.key}">${c.label}</button>
  `).join('');
  initFilterTabs();
}

/* ---------- Homepage featured ---------- */
function renderHomepage() {
  const container = document.getElementById('featured-grid');
  if (!container) return;
  const featured = MENU_ITEMS.filter(i => i.popular).slice(0, 4);
  container.innerHTML = featured.map((item, i) => `
    <article class="featured-card">
      <div class="featured-card-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="accents">
          <span class="tag">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
          <span class="tag">${formatPrice(item.price)}</span>
        </div>
      </div>
      <div class="featured-card-content">
        <span class="featured-card-kicker">${item.popular ? 'Popular' : 'New'}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="featured-card-price">${formatPrice(item.price)}</div>
        <button class="btn btn--primary btn--full add-to-cart featured-add" data-id="${item.id}" style="margin-top:auto">Add to Cart</button>
      </div>
    </article>
  `).join('');
  container.querySelectorAll('.featured-add').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}
/* ---------- Cart page ---------- */
function renderCartItem(item) {
  return `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-media">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>${formatPrice(item.price)} each</p>
      </div>
      <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
      <div class="cart-item-controls">
        <button class="btn--ghost qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="btn--ghost qty-btn" data-id="${item.id}" data-delta="1" aria-label="Increase quantity">+</button>
      </div>
      <button class="remove-item" data-id="${item.id}" aria-label="Remove item">Remove</button>
    </div>
  `;
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Nothing here yet — explore the menu and add some dishes.</p>
        <a href="menu.html" class="btn btn--primary">View Menu</a>
      </div>`;
    renderCartSidebarTotal();
    return;
  }
  container.innerHTML = cart.map(renderCartItem).join('');
  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => changeQuantity(Number(btn.dataset.id), Number(btn.dataset.delta)));
  });
  container.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
  });
  renderCartSidebarTotal();
}

function renderCartSidebarTotal() {
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
  const emptyState = document.getElementById('cart-empty-state');
  const hasItems = cart.length > 0;
  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());
  if (countEl) countEl.textContent = getCartCount();
  const finalTotalEl = document.getElementById('cart-total-final');
  if (finalTotalEl) finalTotalEl.textContent = formatPrice(getCartTotal());
  const drawerTotal = document.getElementById('drawer-total');
  if (drawerTotal) drawerTotal.textContent = formatPrice(getCartTotal());
  if (emptyState) emptyState.style.display = hasItems ? 'none' : 'block';
  const sidebarItems = document.getElementById('cart-sidebar-items');
  if (sidebarItems) {
    sidebarItems.innerHTML = hasItems ? cart.map(i => `
      <div style="display:flex;justify-content:space-between;gap:1rem;margin-bottom:0.75rem;font-size:0.9rem">
        <span>${i.name} × ${i.qty}</span>
        <span>${formatPrice(i.price * i.qty)}</span>
      </div>
    `).join('') : '<p style="font-size:0.9rem;color:var(--muted)">No items yet.</p>';
  }
}

const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (getCartCount() === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    window.location.href = 'checkout.html';
  });
}
/* ---------- Checkout ---------- */
function initCheckout() {
  const form = document.getElementById('checkout-form');
  const orderType = document.getElementById('order-type');
  const deliveryFields = document.getElementById('delivery-fields');
  const paymentMethod = document.getElementById('payment-method');
  const paystackNotice = document.getElementById('paystack-notice');
  const placeOrderBtn = document.getElementById('place-order-btn');
  const btnText = placeOrderBtn.querySelector('.btn-text');
  const btnLoader = placeOrderBtn.querySelector('.btn-loader');

  // Show test-mode notice if using placeholder key
  const IS_TEST_KEY = PAYSTACK_PUBLIC_KEY.includes('your_test_public_key');
  paystackNotice.style.display = IS_TEST_KEY ? 'flex' : 'none';

  orderType.addEventListener('change', () => {
    const show = orderType.value === 'delivery';
    deliveryFields.classList.toggle('open', show);
    deliveryFields.querySelectorAll('input, textarea, select').forEach(el => {
      el.required = show;
    });
    if (!show) deliveryFields.querySelectorAll('input, textarea').forEach(el => el.value = '');
  });

  paymentMethod.addEventListener('change', () => {
    const isDigital = paymentMethod.value === 'card';
    paystackNotice.style.display = isDigital ? 'flex' : 'none';
  });

  renderCheckoutSummary();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (getCartCount() === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    let valid = true;
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    requiredInputs.forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        input.classList.add('error');
        const msg = group.querySelector('.error-msg');
        if (msg) msg.classList.add('visible');
        valid = false;
      } else {
        input.classList.remove('error');
        const msg = group.querySelector('.error-msg');
        if (msg) msg.classList.remove('visible');
      }
    });
    if (!valid) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const formData = new FormData(form);
    const order = {
      id: generateOrderNumber(),
      date: new Date().toISOString(),
      status: 'pending',
      items: [...cart],
      total: getCartTotal(),
      customer: {
        name: formData.get('customer-name'),
        phone: formData.get('customer-phone'),
        email: formData.get('customer-email')
      },
      orderType: formData.get('order-type'),
      delivery: formData.get('order-type') === 'delivery' ? {
        location: formData.get('delivery-location'),
        landmark: formData.get('delivery-landmark') || '',
        notes: formData.get('delivery-notes') || ''
      } : null,
      paymentMethod: formData.get('payment-method'),
      paymentStatus: 'pending'
    };

    const method = order.paymentMethod;
    if (method === 'card') {
      if (IS_TEST_KEY) {
        showToast('Test mode: use card ' + TEST_CARD_NUMBER + ' | any expiry | CVV any | PIN ' + TEST_CARD_PIN, 'informational');
        order.paymentStatus = 'cod';
        saveLastOrder(order);
        clearCart();
        window.location.href = `confirmation.html?order=${order.id}`;
      } else {
        await payWithPaystack(order);
      }
    } else {
      order.paymentStatus = 'cod';
      saveLastOrder(order);
      clearCart();
      window.location.href = `confirmation.html?order=${order.id}`;
    }
  });
}
async function payWithPaystack(order) {
  const placeOrderBtn = document.getElementById('place-order-btn');
  const btnText = placeOrderBtn.querySelector('.btn-text');
  const btnLoader = placeOrderBtn.querySelector('.btn-loader');
  setLoading(placeOrderBtn, btnText, btnLoader, true);

  return new Promise((resolve) => {
    const scriptExists = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
    if (!scriptExists) {
      const s = document.createElement('script');
      s.src = PAYSTACK_SCRIPT_URL;
      s.onload = () => openPaystack(order, placeOrderBtn, btnText, btnLoader, resolve);
      s.onerror = () => {
        showToast('Payment library failed to load', 'error');
        setLoading(placeOrderBtn, btnText, btnLoader, false);
        resolve();
      };
      document.head.appendChild(s);
    } else {
      openPaystack(order, placeOrderBtn, btnText, btnLoader, resolve);
    }
  });
}

function openPaystack(order, placeOrderBtn, btnText, btnLoader, resolve) {
  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: order.customer.email,
    amount: Math.round(order.total * 100),
    ref: order.id,
    metadata: {
      custom_fields: [
        { display_name: 'Order Number', variable_name: 'order_number', value: order.id },
        { display_name: 'Customer Name', variable_name: 'customer_name', value: order.customer.name },
        { display_name: 'Phone', variable_name: 'phone', value: order.customer.phone },
        { display_name: 'Order Type', variable_name: 'order_type', value: order.orderType },
        { display_name: 'Total', variable_name: 'total', value: order.total }
      ]
    },
    callback: function (response) {
      handlePaymentResult(order, response.reference, 'paid', placeOrderBtn, btnText, btnLoader);
      resolve();
    },
    onClose: function () {
      showToast('Payment was cancelled', 'error');
      setLoading(placeOrderBtn, btnText, btnLoader, false);
      resolve();
    }
  });
  handler.openIframe();
}

function handlePaymentResult(order, reference, status, btn, btnText, btnLoader) {
  order.paymentReference = reference;
  order.paymentStatus = status;
  saveLastOrder(order);
  clearCart();
  setLoading(btn, btnText, btnLoader, false);
  showToast('Payment successful! Placing your order…', 'success');
  setTimeout(() => {
    window.location.href = `confirmation.html?order=${order.id}`;
  }, 800);
}

function setLoading(btn, textEl, loaderEl, loading) {
  if (loading) {
    btn.disabled = true;
    textEl.style.display = 'none';
    loaderEl.style.display = 'block';
  } else {
    btn.disabled = false;
    textEl.style.display = 'inline';
    loaderEl.style.display = 'none';
  }
}

function renderCheckoutSummary() {
  const list = document.getElementById('checkout-items');
  const totalEl = document.getElementById('checkout-total');
  if (!list) return;
  if (cart.length === 0) {
    list.innerHTML = '<p style="font-size:0.9rem;color:var(--muted);">Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }
  list.innerHTML = cart.map(i => `
    <div class="order-item-row">
      <span class="name">${i.name} × ${i.qty}</span>
      <span class="price">${formatPrice(i.price * i.qty)}</span>
    </div>
  `).join('');
  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());
}

/* ---------- Order helpers ---------- */
function generateOrderNumber() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `AS${month}${day}${random}`;
}

function saveLastOrder(order) {
  localStorage.setItem(STORAGE_KEY_ORDER, JSON.stringify(order));
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
/* ---------- Confirmation page ---------- */
function renderConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order');
  const order = orderId ? JSON.parse(localStorage.getItem(STORAGE_KEY_ORDER) || 'null') : null;

  if (!order || order.id !== orderId) {
    document.body.innerHTML = `
      <section class="confirmation-hero"><div class="container">
        <h1>Order Not Found</h1>
        <p>We could not locate that order. Please return to the homepage.</p>
        <a href="index.html" class="btn btn--primary">Go Home</a>
      </div></section>`;
    return;
  }

  const paid = order.paymentStatus === 'paid';
  document.getElementById('confirm-order-number').textContent = order.id;
  document.getElementById('confirm-payment-badge').className = `payment-badge ${paid ? 'paid' : 'cod'}`;
  document.getElementById('confirm-payment-badge').textContent = paid ? 'Verified · Paid via Paystack' : 'Cash on Delivery';
  document.getElementById('confirm-total').textContent = formatPrice(order.total);
  document.getElementById('confirm-items-total').textContent = formatPrice(order.total);

  const date = new Date(order.date).toLocaleString('en-GH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  document.getElementById('confirm-date').textContent = date;
  document.getElementById('confirm-customer').textContent = order.customer.name;
  document.getElementById('confirm-phone').textContent = order.customer.phone;
  document.getElementById('confirm-email').textContent = order.customer.email;

  const orderTypeLabel = order.orderType === 'delivery' ? 'Delivery' : 'Pickup';
  document.getElementById('confirm-order-type').textContent = orderTypeLabel;
  document.getElementById('confirm-order-number-sidebar').textContent = order.id;
  document.getElementById('confirm-payment-sidebar').textContent = paid ? 'Card / Mobile Money (Paystack)' : 'Cash on Delivery';

  const deliveryBlock = document.getElementById('confirm-delivery-info');
  if (order.orderType === 'delivery') {
    deliveryBlock.style.display = 'block';
    document.getElementById('confirm-location').textContent = order.delivery.location;
    document.getElementById('confirm-landmark').textContent = order.delivery.landmark || '—';
    document.getElementById('confirm-notes').textContent = order.delivery.notes || '—';
  } else {
    deliveryBlock.style.display = 'none';
  }

  const itemsList = document.getElementById('confirm-items');
  itemsList.innerHTML = order.items.map(i => `
    <div class="confirm-item">
      <div class="confirm-item-info">
        <h4>${i.name}</h4>
        <p>${formatPrice(i.price)} × ${i.qty}</p>
      </div>
      <span class="line-total">${formatPrice(i.price * i.qty)}</span>
    </div>
  `).join('');
}

const continueBtn = document.getElementById('continue-shopping');
if (continueBtn) {
  continueBtn.addEventListener('click', () => {
    window.location.href = 'menu.html';
  });
}
/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn = document.getElementById('drawer-close');
  if (!btn) return;
  const open = () => { btn.classList.add('open'); drawer.classList.add('open'); overlay.classList.add('visible'); };
  const close = () => { btn.classList.remove('open'); drawer.classList.remove('open'); overlay.classList.remove('visible'); };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.querySelectorAll('.mobile-drawer a').forEach(link => {
    link.addEventListener('click', close);
  });
}

/* ---------- Reservation modal ---------- */
function initReservationModal() {
  const openers = document.querySelectorAll('[data-open-modal]');
  const closer = document.getElementById('modal-close');
  const overlay = document.getElementById('reservation-modal');
  const form = document.getElementById('reservation-form');
  const success = document.getElementById('reservation-success');
  if (!openers.length || !overlay) return;

  const openModal = () => { overlay.classList.add('open'); };
  const closeModal = () => { overlay.classList.remove('open'); success.classList.remove('open'); form.reset(); };

  openers.forEach(op => op.addEventListener('click', openModal));
  closer.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input[required], select[required]').forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        input.classList.add('error');
        const msg = group.querySelector('.error-msg');
        if (msg) msg.classList.add('visible');
        valid = false;
      } else {
        input.classList.remove('error');
        const msg = group.querySelector('.error-msg');
        if (msg) msg.classList.remove('visible');
      }
    });
    if (!valid) {
      showToast('Please complete all required fields', 'error');
      return;
    }
    const reservation = {
      name: form['res-name'].value,
      phone: form['res-phone'].value,
      email: form['res-email'].value,
      date: form['res-date'].value,
      time: form['res-time'].value,
      guests: form['res-guests'].value
    };
    localStorage.setItem('accrasavour_reservation', JSON.stringify(reservation));
    form.style.display = 'none';
    success.classList.add('open');
    showToast('Reservation confirmed', 'success');
  });
}

/* ---------- App init ---------- */
function initApp() {
  updateCartBadge();
  renderCartSidebarTotal();
  initMobileMenu();
  initReservationModal();

  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (path === 'index.html' || path === '') {
    renderHomepage();
  } else if (path === 'menu.html') {
    renderFilterTabs();
    renderMenu('all');
  } else if (path === 'cart.html') {
    renderCart();
  } else if (path === 'checkout.html') {
    initCheckout();
  } else if (path === 'confirmation.html') {
    renderConfirmation();
  }
}

document.addEventListener('DOMContentLoaded', initApp);