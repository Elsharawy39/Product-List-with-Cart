/* ============================================================
   PRODUCT LIST WITH CART — SCRIPT
   1. Data
   2. State
   3. DOM References
   4. Render: Product Grid
   5. Render: Cart
   6. Render: Confirmation Modal
   7. Event Handlers
   8. Initialisation
   ============================================================ */

/* ============================================================
   1. DATA
   ============================================================ */
const PRODUCTS = [
  {
    image: {
      thumbnail: "../assets/images/image-waffle-thumbnail.jpg",
      mobile:    "../assets/images/image-waffle-mobile.jpg",
      tablet:    "../assets/images/image-waffle-tablet.jpg",
      desktop:   "../assets/images/image-waffle-desktop.jpg",
    },
    name:     "Waffle with Berries",
    category: "Waffle",
    price:    6.50,
  },
  {
    image: {
      thumbnail: "../assets/images/image-creme-brulee-thumbnail.jpg",
      mobile:    "../assets/images/image-creme-brulee-mobile.jpg",
      tablet:    "../assets/images/image-creme-brulee-tablet.jpg",
      desktop:   "../assets/images/image-creme-brulee-desktop.jpg",
    },
    name:     "Vanilla Bean Creme Brulee",
    category: "Creme Brulee",
    price:    7.00,
  },
  {
    image: {
      thumbnail: "../assets/images/image-macaron-thumbnail.jpg",
      mobile:    "../assets/images/image-macaron-mobile.jpg",
      tablet:    "../assets/images/image-macaron-tablet.jpg",
      desktop:   "../assets/images/image-macaron-desktop.jpg",
    },
    name:     "Macaron Mix of Five",
    category: "Macaron",
    price:    8.00,
  },
  {
    image: {
      thumbnail: "../assets/images/image-tiramisu-thumbnail.jpg",
      mobile:    "../assets/images/image-tiramisu-mobile.jpg",
      tablet:    "../assets/images/image-tiramisu-tablet.jpg",
      desktop:   "../assets/images/image-tiramisu-desktop.jpg",
    },
    name:     "Classic Tiramisu",
    category: "Tiramisu",
    price:    5.50,
  },
  {
    image: {
      thumbnail: "../assets/images/image-baklava-thumbnail.jpg",
      mobile:    "../assets/images/image-baklava-mobile.jpg",
      tablet:    "../assets/images/image-baklava-tablet.jpg",
      desktop:   "../assets/images/image-baklava-desktop.jpg",
    },
    name:     "Pistachio Baklava",
    category: "Baklava",
    price:    4.00,
  },
  {
    image: {
      thumbnail: "../assets/images/image-meringue-thumbnail.jpg",
      mobile:    "../assets/images/image-meringue-mobile.jpg",
      tablet:    "../assets/images/image-meringue-tablet.jpg",
      desktop:   "../assets/images/image-meringue-desktop.jpg",
    },
    name:     "Lemon Meringue Pie",
    category: "Pie",
    price:    5.00,
  },
  {
    image: {
      thumbnail: "../assets/images/image-cake-thumbnail.jpg",
      mobile:    "../assets/images/image-cake-mobile.jpg",
      tablet:    "../assets/images/image-cake-tablet.jpg",
      desktop:   "../assets/images/image-cake-desktop.jpg",
    },
    name:     "Red Velvet Cake",
    category: "Cake",
    price:    4.50,
  },
  {
    image: {
      thumbnail: "../assets/images/image-brownie-thumbnail.jpg",
      mobile:    "../assets/images/image-brownie-mobile.jpg",
      tablet:    "../assets/images/image-brownie-tablet.jpg",
      desktop:   "../assets/images/image-brownie-desktop.jpg",
    },
    name:     "Salted Caramel Brownie",
    category: "Brownie",
    price:    4.50,
  },
  {
    image: {
      thumbnail: "../assets/images/image-panna-cotta-thumbnail.jpg",
      mobile:    "../assets/images/image-panna-cotta-mobile.jpg",
      tablet:    "../assets/images/image-panna-cotta-tablet.jpg",
      desktop:   "../assets/images/image-panna-cotta-desktop.jpg",
    },
    name:     "Vanilla Panna Cotta",
    category: "Panna Cotta",
    price:    6.50,
  },
];

/* ============================================================
   2. STATE
   ============================================================ */
/** @type {Map<string, number>} */
const cart = new Map();

/* ============================================================
   3. DOM REFERENCES
   ============================================================ */
const productsGrid     = document.getElementById("products-grid");
const cartCountEl      = document.getElementById("cart-count");
const cartEmptyEl      = document.getElementById("cart-empty");
const cartFilledEl     = document.getElementById("cart-filled");
const cartItemsEl      = document.getElementById("cart-items");
const cartTotalEl      = document.getElementById("cart-total");
const btnConfirmOrder  = document.getElementById("btn-confirm-order");
const modalOverlay     = document.getElementById("modal-overlay");
const modalItemsEl     = document.getElementById("modal-items");
const modalTotalEl     = document.getElementById("modal-total");
const btnStartNewOrder = document.getElementById("btn-start-new-order");

/* ============================================================
   4. RENDER: PRODUCT GRID
   ============================================================ */
function buildResponsivePicture(imageSet, altText) {
  return `
    <picture>
      <source media="(min-width: 1200px)" srcset="${imageSet.desktop}" />
      <source media="(min-width: 768px)"  srcset="${imageSet.tablet}" />
      <img
        class="product-card__image"
        src="${imageSet.mobile}"
        alt="${altText}"
        loading="lazy"
      />
    </picture>
  `;
}

function renderAddToCartBtn() {
  return `
    <button class="btn-add-to-cart" type="button" aria-label="Add to cart">
      <img src="../assets/images/icon-add-to-cart.svg" alt="" aria-hidden="true" />
      Add to Cart
    </button>
  `;
}

function renderQuantityControls(quantity) {
  return `
    <div class="quantity-controls" role="group" aria-label="Quantity">
      <button class="btn-quantity btn-decrement" type="button" aria-label="Decrease quantity">
        <img src="../assets/images/icon-decrement-quantity.svg" alt="" aria-hidden="true" />
      </button>
      <span class="quantity-controls__count" aria-live="polite">${quantity}</span>
      <button class="btn-quantity btn-increment" type="button" aria-label="Increase quantity">
        <img src="../assets/images/icon-increment-quantity.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  `;
}

function createProductCard(product, index) {
  const quantity = cart.get(product.name) ?? 0;
  const inCart   = quantity > 0;

  const article = document.createElement("article");
  article.classList.add("product-card");
  article.setAttribute("role", "listitem");
  article.dataset.productIndex = index;
  if (inCart) article.classList.add("product-card--in-cart");

  article.innerHTML = `
    <div class="product-card__image-wrapper">
      ${buildResponsivePicture(product.image, product.name)}
      <div class="product-card__btn-wrapper">
        ${inCart ? renderQuantityControls(quantity) : renderAddToCartBtn()}
      </div>
    </div>
    <div class="product-card__info">
      <p class="product-card__category">${product.category}</p>
      <h3 class="product-card__name">${product.name}</h3>
      <p class="product-card__price">$${product.price.toFixed(2)}</p>
    </div>
  `;

  return article;
}

function renderProductGrid() {
  productsGrid.innerHTML = "";
  PRODUCTS.forEach((product, index) => {
    productsGrid.appendChild(createProductCard(product, index));
  });
}

function updateProductCard(productIndex) {
  const card = productsGrid.querySelector(`[data-product-index="${productIndex}"]`);
  if (!card) return;

  const product  = PRODUCTS[productIndex];
  const quantity = cart.get(product.name) ?? 0;
  const inCart   = quantity > 0;
  const wrapper  = card.querySelector(".product-card__btn-wrapper");

  card.classList.toggle("product-card--in-cart", inCart);
  wrapper.innerHTML = inCart ? renderQuantityControls(quantity) : renderAddToCartBtn();
}

/* ============================================================
   5. RENDER: CART
   ============================================================ */
function getCartItemCount() {
  let total = 0;
  cart.forEach((qty) => (total += qty));
  return total;
}

function getCartTotal() {
  let total = 0;
  cart.forEach((qty, name) => {
    const product = PRODUCTS.find((p) => p.name === name);
    if (product) total += product.price * qty;
  });
  return total;
}

function formatPrice(amount) {
  return "$" + amount.toFixed(2);
}

function createCartItem(name, quantity) {
  const product  = PRODUCTS.find((p) => p.name === name);
  const subtotal = product.price * quantity;

  const li = document.createElement("li");
  li.classList.add("cart-item");
  li.dataset.cartItemName = name;

  li.innerHTML = `
    <div class="cart-item__details">
      <p class="cart-item__name">${name}</p>
      <div class="cart-item__pricing">
        <span class="cart-item__quantity">${quantity}x</span>
        <span class="cart-item__unit-price">@ ${formatPrice(product.price)}</span>
        <span class="cart-item__subtotal">${formatPrice(subtotal)}</span>
      </div>
    </div>
    <button class="btn-remove-item" type="button" aria-label="Remove ${name} from cart">
      <img src="../assets/images/icon-remove-item.svg" alt="" aria-hidden="true" />
    </button>
  `;

  return li;
}

function renderCart() {
  const itemCount = getCartItemCount();
  cartCountEl.textContent = itemCount;

  const isEmpty = itemCount === 0;
  cartEmptyEl.hidden  = !isEmpty;
  cartFilledEl.hidden =  isEmpty;

  if (isEmpty) return;

  cartItemsEl.innerHTML = "";
  cart.forEach((qty, name) => {
    cartItemsEl.appendChild(createCartItem(name, qty));
  });

  cartTotalEl.textContent = formatPrice(getCartTotal());
}

/* ============================================================
   6. RENDER: CONFIRMATION MODAL
   ============================================================ */
function openConfirmationModal() {
  modalItemsEl.innerHTML = "";

  cart.forEach((qty, name) => {
    const product  = PRODUCTS.find((p) => p.name === name);
    const subtotal = product.price * qty;

    const li = document.createElement("li");
    li.classList.add("modal-item");
    li.innerHTML = `
      <img class="modal-item__thumbnail" src="${product.image.thumbnail}" alt="${name}" />
      <div class="modal-item__details">
        <p class="modal-item__name">${name}</p>
        <div class="modal-item__pricing">
          <span class="modal-item__quantity">${qty}x</span>
          <span class="modal-item__unit-price">@ ${formatPrice(product.price)}</span>
        </div>
      </div>
      <span class="modal-item__subtotal">${formatPrice(subtotal)}</span>
    `;
    modalItemsEl.appendChild(li);
  });

  modalTotalEl.textContent = formatPrice(getCartTotal());
  modalOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  btnStartNewOrder.focus();
}

function closeModalAndReset() {
  modalOverlay.hidden = true;
  document.body.style.overflow = "";
  cart.clear();
  renderProductGrid();
  renderCart();
}

/* ============================================================
   7. EVENT HANDLERS
   ============================================================ */
function handleProductGridClick(event) {
  const target = event.target;

  const addBtn = target.closest(".btn-add-to-cart");
  if (addBtn) {
    const card         = addBtn.closest(".product-card");
    const productIndex = parseInt(card.dataset.productIndex, 10);
    cart.set(PRODUCTS[productIndex].name, 1);
    updateProductCard(productIndex);
    renderCart();
    return;
  }

  const incrementBtn = target.closest(".btn-increment");
  if (incrementBtn) {
    const card         = incrementBtn.closest(".product-card");
    const productIndex = parseInt(card.dataset.productIndex, 10);
    const name         = PRODUCTS[productIndex].name;
    cart.set(name, (cart.get(name) ?? 0) + 1);
    updateProductCard(productIndex);
    renderCart();
    return;
  }

  const decrementBtn = target.closest(".btn-decrement");
  if (decrementBtn) {
    const card         = decrementBtn.closest(".product-card");
    const productIndex = parseInt(card.dataset.productIndex, 10);
    const name         = PRODUCTS[productIndex].name;
    const current      = cart.get(name) ?? 0;

    if (current <= 1) {
      cart.delete(name);
    } else {
      cart.set(name, current - 1);
    }

    updateProductCard(productIndex);
    renderCart();
    return;
  }
}

function handleCartItemsClick(event) {
  const removeBtn = event.target.closest(".btn-remove-item");
  if (!removeBtn) return;

  const cartItem = removeBtn.closest(".cart-item");
  const name     = cartItem.dataset.cartItemName;
  cart.delete(name);

  const productIndex = PRODUCTS.findIndex((p) => p.name === name);
  if (productIndex !== -1) updateProductCard(productIndex);

  renderCart();
}

function handleOverlayClick(event) {
  if (event.target === modalOverlay) closeModalAndReset();
}

function handleKeyDown(event) {
  if (event.key === "Escape" && !modalOverlay.hidden) closeModalAndReset();
}

/* ============================================================
   8. INITIALISATION
   ============================================================ */
function init() {
  renderProductGrid();
  renderCart();

  productsGrid.addEventListener("click", handleProductGridClick);
  cartItemsEl.addEventListener("click", handleCartItemsClick);
  btnConfirmOrder.addEventListener("click", openConfirmationModal);
  btnStartNewOrder.addEventListener("click", closeModalAndReset);
  modalOverlay.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleKeyDown);
}

init();
