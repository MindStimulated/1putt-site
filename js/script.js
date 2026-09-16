/* ==========================================================================
   1PUTT — site interactivity
   Cart state persists to localStorage so it survives a page reload/back nav.
   Checkout is intentionally a hand-off point — see README.md for wiring
   this to a real payment processor (Stripe Payment Links, Shopify Buy
   Button, or Snipcart all drop in with minimal changes to checkoutBtn's
   click handler at the bottom of this file).
   ========================================================================== */

const CART_KEY = "1putt_cart";

function loadCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  }catch(e){
    return {};
  }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

let cart = loadCart();

function money(n){
  return "$" + n.toFixed(2);
}

function addToCart(id, name, price){
  if(!cart[id]){
    cart[id] = { name, price, qty: 0 };
  }
  cart[id].qty += 1;
  saveCart(cart);
  renderCart();
  openCart();
}

function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty <= 0){
    delete cart[id];
  }
  saveCart(cart);
  renderCart();
}

function removeItem(id){
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function cartTotals(){
  const items = Object.entries(cart);
  const count = items.reduce((sum, [, item]) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, [, item]) => sum + item.qty * item.price, 0);
  return { count, subtotal };
}

function renderCart(){
  const container = document.getElementById("cartItems");
  const emptyMsg = document.getElementById("cartEmpty");
  const entries = Object.entries(cart);

  container.innerHTML = "";

  if(entries.length === 0){
    container.appendChild(emptyMsg);
    emptyMsg.hidden = false;
  }else{
    emptyMsg.hidden = true;
    entries.forEach(([id, item]) => {
      const line = document.createElement("div");
      line.className = "cart-line";
      line.innerHTML = `
        <div>
          <div class="cart-line-name">${item.name}</div>
          <div class="cart-qty">
            <button data-qty-minus aria-label="Decrease quantity">−</button>
            <span class="cart-qty-num">${item.qty}</span>
            <button data-qty-plus aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-remove" data-remove>Remove</button>
        </div>
        <div class="cart-line-price">${money(item.price * item.qty)}</div>
      `;
      line.querySelector("[data-qty-minus]").addEventListener("click", () => changeQty(id, -1));
      line.querySelector("[data-qty-plus]").addEventListener("click", () => changeQty(id, 1));
      line.querySelector("[data-remove]").addEventListener("click", () => removeItem(id));
      container.appendChild(line);
    });
  }

  const { count, subtotal } = cartTotals();
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartSubtotal").textContent = money(subtotal);

  const remaining = Math.max(0, 50 - subtotal);
  const shippingNote = document.getElementById("shippingNote");
  shippingNote.textContent = remaining > 0
    ? `Add ${money(remaining)} more for free shipping`
    : "Your order ships free.";
}

/* ---------- Add-to-cart buttons on pricing cards ---------- */
document.querySelectorAll("[data-add-to-cart]").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest("[data-product]");
    addToCart(card.dataset.id, card.dataset.name, parseFloat(card.dataset.price));
  });
});

/* ---------- Cart drawer open/close ---------- */
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart(){
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart(){
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", e => {
  if(e.key === "Escape") closeCart();
});

/* ---------- Checkout hand-off point ---------- */
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const { count, subtotal } = cartTotals();
  if(count === 0){
    alert("Your cart is empty — add a 1Putt first.");
    return;
  }
  // TODO: replace this with a real checkout call, e.g.:
  //   window.location.href = "https://buy.stripe.com/your-payment-link";
  // or initialize Shopify Buy Button / Snipcart here.
  // See README.md for the three recommended integration paths.
  alert(
    `Order summary — ${count} item(s), subtotal ${money(subtotal)}.\n\n` +
    `This demo cart is ready to connect to a real payment processor. ` +
    `See README.md for setup instructions.`
  );
});

/* ---------- Accordions ---------- */
document.querySelectorAll("[data-accordion]").forEach(accordion => {
  accordion.querySelectorAll(".accordion-item").forEach(item => {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      accordion.querySelectorAll(".accordion-item.open").forEach(openItem => {
        openItem.classList.remove("open");
        openItem.querySelector(".accordion-panel").style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
});

/* ---------- Email capture (front-end only — wire to your ESP) ---------- */
document.getElementById("emailForm").addEventListener("submit", e => {
  e.preventDefault();
  // TODO: POST this to Klaviyo, Mailchimp, or your ESP's signup endpoint.
  document.getElementById("emailNote").hidden = false;
  e.target.reset();
});

/* ---------- Initial render ---------- */
renderCart();
