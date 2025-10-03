let cart = {};

const savedCart = localStorage.getItem("cart");
if (savedCart) cart = JSON.parse(savedCart);

function addToCart(cartObj, product) {
  const id = product.id;
  if (cartObj[id]) return;
  cartObj[id] = { title: product.title, price: product.price, qty: 1 };
}

function updateQty(cartObj, id, qty) {
  if (!cartObj[id]) return;
  if (qty < 1) qty = 1;
  if (qty > 10000) qty = 10000;
  cartObj[id].qty = qty;
}

function removeFromCart(cartObj, id) {
  delete cartObj[id];
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  const cartCountElem = document.getElementById("cartCount");
  if (cartCountElem) cartCountElem.textContent = count;
}

function showCart() {
  const cartItems = document.getElementById("cartItems");
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;

  for (let id in cart) {
    const item = cart[id];
    total += item.price * item.qty;

    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.innerHTML = `
      <div class="cart-item-info">
        <span>${item.title}</span>
        <span>${item.price} €</span>
        <div class="qty-controls">
          <button class="qty-btn" data-id="${id}" data-action="decrease">-</button>
          <input type="number" min="1" max="10000" value="${item.qty}" data-id="${id}" class="qty-input">
          <button class="qty-btn" data-id="${id}" data-action="increase">+</button>
        </div>
      </div>
      <div class="cart-item-sum">Итого: ${item.price * item.qty} €</div>
      <button class="remove-btn" data-id="${id}">Удалить</button>
    `;
    cartItems.appendChild(li);
  }

  const totalElem = document.getElementById("cartTotal");
  if (totalElem) totalElem.textContent = total;

  updateAddButtons();
}

function showNotification(message) {
  let notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => notif.classList.add("show"), 50);
  setTimeout(() => { notif.classList.remove("show"); setTimeout(() => notif.remove(), 400); }, 3000);
}

function updateAddButtons() {
  document.querySelectorAll(".add-btn").forEach(btn => {
    const id = parseInt(btn.dataset.id);
    if (cart[id]) {
      btn.classList.add("in-cart");
      btn.textContent = "Уже в корзине";
    } else {
      btn.classList.remove("in-cart");
      btn.textContent = "Добавить в корзину";
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, title: "LABUBU | WINGS OF FANTASY", price: 399, image: "images/Labubu_WINGS_OF_FANTASY.jpg" },
    { id: 2, title: "LABUBU | FALL INTO WILD", price: 359, image: "images/Labubu_FALL_INTO-WILD.jpg" },
    { id: 3, title: "LABUBU | KING", price: 549, image: "images/Labubu_KING.jpg" },
    { id: 4, title: "LABUBU | FLIP WITH ME", price: 349, image: "images/Labubu_FLIP_WITH_ME.jpg" },
    { id: 5, title: "LABUBU | FWM GLASSES", price: 379, image: "images/Mini_labubu_FWM.jpg" },
    { id: 6, title: "LABUBU | ANGEL IN CLOUD", price: 649, image: "images/Labubu_ANGEL_IN_CLOUD.jpg" },
    { id: 7, title: "LABUBU | ROCK", price: 549, image: "images/Labubu_ROCK.jpg" },
    { id: 8, title: "MINI LABUBU | WOF", price: 59, image: "images/Mini_Labubub_WINGS_OF_FORTUNE.jpg" },
    { id: 9, title: "MINI LABUBU | FIW", price: 59, image: "images/Mini_Labubu_FALL_INTO-WILD.jpg" },
    { id: 10, title: "MINI LABUBU | COLA", price: 79, image: "images/Labubu_COLA.jpg" }
  ];

  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <article>
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="price">${product.price} €</p>
        <button class="add-btn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">
          Добавить в корзину
        </button>
      </article>
    `;
    productsContainer.appendChild(li);
  });

  const cartModal = document.getElementById("cartModal");
  const checkoutModal = document.getElementById("checkoutModal");
  const cartItems = document.getElementById("cartItems");

  productsContainer.addEventListener("click", e => {
    if (e.target.classList.contains("
