// Cart Unit tests
const {
  addToCart,
  updateQty,
  removeFromCart,
  getCartTotal,
  getCartCount,
  validateName,
  validatePhone,
  validateAddress
} = require("../script.js");

// 1. Тест addToCart
test("addToCart добавляет товар и увеличивает qty при повторном добавлении", () => {
  let testCart = {};
  const product = { id: 1, title: "Test", price: 100 };

  addToCart(testCart, product);
  expect(testCart[1].qty).toBe(1);

  addToCart(testCart, product);
  expect(testCart[1].qty).toBe(2);
});

// 2. Тест updateQty
test("updateQty ограничивает qty от 1 до 10000", () => {
  let testCart = { 1: { title: "Test", price: 100, qty: 5 } };

  updateQty(testCart, 1, 0);
  expect(testCart[1].qty).toBe(1);

  updateQty(testCart, 1, 20000);
  expect(testCart[1].qty).toBe(10000);

  updateQty(testCart, 1, 500);
  expect(testCart[1].qty).toBe(500);
});

// 3. Тест removeFromCart
test("removeFromCart удаляет товар из корзины", () => {
  let testCart = { 1: { title: "Test", price: 100, qty: 2 } };

  removeFromCart(testCart, 1);
  expect(testCart[1]).toBeUndefined();
});

// 4. Тест getCartTotal и getCartCount
test("getCartTotal и getCartCount возвращают корректные значения", () => {
  let testCart = {
    1: { title: "A", price: 100, qty: 2 },
    2: { title: "B", price: 50, qty: 3 }
  };

  expect(getCartTotal(testCart)).toBe(100 * 2 + 50 * 3);
  expect(getCartCount(testCart)).toBe(2 + 3);
});

// 5. Тесты валидации
test("validateName проверяет имя", () => {
  expect(validateName("Иван")).toBe(true);
  expect(validateName("A")).toBe(false);
  expect(validateName("123")).toBe(false);
});

test("validatePhone проверяет телефон", () => {
  expect(validatePhone("+79161234567")).toBe(true);
  expect(validatePhone("12345")).toBe(false);
});

test("validateAddress проверяет адрес", () => {
  expect(validateAddress("ул. Пушкина, д. 10")).toBe(true);
  expect(validateAddress("123")).toBe(false);
});