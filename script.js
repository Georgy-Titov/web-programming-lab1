document.addEventListener("DOMContentLoaded", () => {
  let cart = {};
  const savedCart = localStorage.getItem("cart");
  if (savedCart) cart = JSON.parse(savedCart);

  const products = [
    { id: 1, title: "LABUBU | WINGS OF FANTASY", price: 399, image: "images/Labubu_WINGS_OF_FANTASY.jpg" },
    { id: 2, title: "LABUBU | FALL INTO WILD", price: 359, image: "images/Labubu_FALL_INTO-WILD.jpg" },
    { id: 3, title: "LABUBU | KING", price: 549, image: "images/Labubu_KING.jpg" },
    { id: 4, title: "LABUBU | FLIP WITH ME", price: 349, image: "images/Labubu_FLIP_WITH_ME.jpg" }
  ];

  const productsContainer = document.getElementById('products');
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

  const cartModal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cartItems");
  const toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);

  function showCart() {
    cartItems.innerHTML = '';
    let total = 0;
    for (let id in cart) {
      const item = cart[id];
      total += item.price * item.qty;
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <div class="cart-item-info">
          <span>${item.title}</span>
          <span>${item.price} €.</span>
          <span>&times;</span>
          <input type="number" min="1" max="10000" value="${item.qty}" data-id="${id}" class="qty-input">
        </div>
        <div class="cart-item-sum">Итого: ${item.price * item.qty} €.</div>
        <button class="remove-btn" data-id="${id}">Удалить</button>
      `;
      cartItems.appendChild(li);
    }
    document.getElementById("cartTotal").textContent = total;
    document.getElementById("cartCount").textContent = Object.values(cart).reduce((a,b) => a+b.qty, 0);
  }

  function addToCart(id, title, price) {
    if (!cart[id]) cart[id] = { title, price, qty: 1 };
    else cart[id].qty++;
  }

  function removeFromCart(id) {
    delete cart[id];
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  productsContainer.addEventListener("click", e => {
    if (e.target.classList.contains("add-btn")) {
      const id = parseInt(e.target.dataset.id);
      const title = e.target.dataset.title;
      const price = parseInt(e.target.dataset.price);

      if (!cart[id]) {
        addToCart(id, title, price);
        e.target.classList.add("in-cart");
        e.target.textContent = "Уже в корзине";
        showCart();
        cartModal.classList.remove("hidden");
      } else {
        removeFromCart(id);
        e.target.classList.remove("in-cart");
        e.target.textContent = "Добавить в корзину";
      }

      saveCart();
    }
  });

  document.getElementById("cartBtn").addEventListener("click", () => {
    showCart();
    cartModal.classList.remove("hidden");
  });

  document.getElementById("closeCart").addEventListener("click", () => cartModal.classList.add("hidden"));

  cartItems.addEventListener("click", e => {
    if (e.target.classList.contains("remove-btn")) {
      const id = e.target.dataset.id;
      removeFromCart(id);
      saveCart();
      showCart();

      // Меняем состояние кнопки обратно
      const btn = document.querySelector(`.add-btn[data-id='${id}']`);
      if (btn) {
        btn.classList.remove("in-cart");
        btn.textContent = "Добавить в корзину";
      }
    }
  });

  cartItems.addEventListener("change", e => {
    if (e.target.classList.contains("qty-input")) {
      const id = e.target.dataset.id;
      let val = parseInt(e.target.value);
      if (val < 1) val = 1;
      cart[id].qty = val;
      saveCart();
      showCart();
    }
  });

  const checkoutModal = document.getElementById("checkoutModal");
  document.getElementById("checkoutBtn").addEventListener("click", () => checkoutModal.classList.remove("hidden"));
  document.getElementById("closeCheckout").addEventListener("click", () => checkoutModal.classList.add("hidden"));

  document.getElementById("orderForm").addEventListener("submit", e => {
    e.preventDefault();
    if (Object.keys(cart).length === 0) {
      toast.textContent = "Корзина пуста!";
      toast.style.display = "block";
      setTimeout(() => toast.style.display = "none", 2000);
      return;
    }

    toast.textContent = "Заказ успешно создан!";
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 3000);

    cart = {};
    saveCart();
    showCart();
    checkoutModal.classList.add("hidden");
    cartModal.classList.add("hidden");

    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.classList.remove("in-cart");
      btn.textContent = "Добавить в корзину";
    });

    e.target.reset();
  });

  // Header shrink on scroll
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) header.classList.add("shrink");
    else header.classList.remove("shrink");
  });

  showCart();
});
