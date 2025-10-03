console.log('script.js загружен');

let cart = {};

const savedCart = localStorage.getItem("cart");
if (savedCart) {
  cart = JSON.parse(savedCart);
}

function addToCart(cartObj, product) {
  const id = product.id;
  if (cartObj[id]) {
    cartObj[id].qty++;
  } else {
    cartObj[id] = { title: product.title, price: product.price, qty: 1 };
  }
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
  updateButtonStates();
}

function updateButtonStates() {
  document.querySelectorAll(".add-btn").forEach(btn => {
    const id = btn.dataset.id;
    if (cart[id]) {
      btn.classList.add("in-cart");
      btn.textContent = "Уже в корзине";
    } else {
      btn.classList.remove("in-cart");
      btn.textContent = "Добавить в корзину";
    }
  });
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
        <span>${item.price} руб.</span>
        <span>&times;</span>
        <input type="number" min="1" max="10000" value="${item.qty}" data-id="${id}" class="qty-input">
      </div>
      <div class="cart-item-sum">Итого: ${item.price * item.qty} руб.</div>
      <button class="remove-btn" data-id="${id}">Удалить</button>
    `;
    cartItems.appendChild(li);
  }

  const totalElem = document.getElementById("cartTotal");
  if (totalElem) totalElem.textContent = total;
}

document.addEventListener('DOMContentLoaded', () => {
  try {
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
    if (productsContainer) {
      productsContainer.innerHTML = '';
      products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
          <article>
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">${product.price} €.</p>
            <button class="add-btn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">
              Добавить в корзину
            </button>
          </article>
        `;
        productsContainer.appendChild(li);
      });

      productsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("add-btn")) {
          const id = e.target.dataset.id;
          const title = e.target.dataset.title;
          const price = parseInt(e.target.dataset.price);

          if (cart[id]) {
            removeFromCart(cart, id);
          } else {
            addToCart(cart, { id, title, price });
          }

          saveCart();
          updateCartCount();
          updateButtonStates();
        }
      });
    }

    const cartModal = document.getElementById("cartModal");
    const cartItems = document.getElementById("cartItems");

    document.getElementById("cartBtn")?.addEventListener("click", () => { showCart(); cartModal?.classList.remove("hidden"); });
    document.getElementById("closeCart")?.addEventListener("click", () => cartModal?.classList.add("hidden"));

    cartItems?.addEventListener("click", e => {
      if (e.target.classList.contains("remove-btn")) {
        removeFromCart(cart, e.target.dataset.id);
        saveCart();
        showCart();
        updateCartCount();
      }
    });

    cartItems?.addEventListener("change", e => {
      if (e.target.classList.contains("qty-input")) {
        const id = e.target.dataset.id;
        let value = parseInt(e.target.value);
        updateQty(cart, id, value);
        e.target.value = cart[id].qty;
        saveCart();
        showCart();
        updateCartCount();
      }
    });

    const checkoutModal = document.getElementById("checkoutModal");
    document.getElementById("checkoutBtn")?.addEventListener("click", () => checkoutModal?.classList.remove("hidden"));
    document.getElementById("closeCheckout")?.addEventListener("click", () => checkoutModal?.classList.add("hidden"));

    document.getElementById("orderForm")?.addEventListener("submit", e => {
      e.preventDefault();

      let totalQty = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
      if (totalQty === 0) { alert("Корзина пуста, заказ невозможен!"); return; }

      alert("Заказ создан!");
      cart = {};
      saveCart();
      updateCartCount();
      checkoutModal?.classList.add("hidden");
      cartModal?.classList.add("hidden");
    });

    updateCartCount();
    updateButtonStates();

    window.addEventListener("scroll", () => {
      const header = document.querySelector("header");
      if (window.scrollY > 50) {
        header.classList.add("shrink");
      } else {
        header.classList.remove("shrink");
      }
    });

  } catch (err) {
    console.error('Ошибка в script.js:', err);
  }
});
