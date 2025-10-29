(() => {
  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  }

  function cartKeyForUser(user) {
    return `cart:${user?.email || "guest"}`;
  }

  function readCart(k = KEY) {
    try {
      return JSON.parse(localStorage.getItem(k) || "[]");
    } catch {
      return [];
    }
  }

  function writeCart(cart, k = KEY) {
    localStorage.setItem(k, JSON.stringify(cart));
  }

  function formatVND(n) {
    return (n || 0).toLocaleString("vi-VN") + " đ";
  }

  function parsePriceText(s) {
    return parseInt(String(s || "").replace(/[^\d]/g, "")) || 0;
  }

  function calcTotal(cart) {
    return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  function calcTotalQty(cart) {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  const user = getCurrentUser();
  const KEY = cartKeyForUser(user);

  if (user) {
    const guestCart = readCart("cart:guest");
    const hasGuestItems = guestCart.length > 0;
    const userHasCart = Boolean(localStorage.getItem(KEY));
    if (hasGuestItems && !userHasCart) {
      writeCart(guestCart);
      localStorage.removeItem("cart:guest");
    }
  }

  const cartBtn = document.createElement("button");
  cartBtn.className = "cart-btn";
  cartBtn.textContent = "🛒 0";
  document.body.appendChild(cartBtn);

  const panel = document.createElement("div");
  panel.className = "cart-panel";
  panel.innerHTML = `
    <div class="row head">
      <b>Giỏ hàng</b>
      <span class="close">✕</span>
    </div>
    <div class="list"></div>
    <div class="row">
      <span>Tổng:</span>
      <b class="sum">0 đ</b>
    </div>
    <button class="checkout">Thanh toán khi nhận hàng</button>
    <div class="pay" style="display:none;margin-top:8px">
      <input class="inp name" placeholder="Họ tên *">
      <input class="inp phone" placeholder="SĐT *">
      <textarea class="inp addr" rows="2" placeholder="Địa chỉ *"></textarea>
      <button class="place">Giao</button>
    </div>
  `;
  document.body.appendChild(panel);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "../css/cart.css";
  document.head.appendChild(link);

  const $ = (sel, root = document) => root.querySelector(sel);
  const listEl = $(".list", panel);
  const sumEl = $(".sum", panel);
  const closeEl = $(".close", panel);
  const checkoutEl = $(".checkout", panel);
  const payBox = $(".pay", panel);
  const nameI = $(".name", panel);
  const phoneI = $(".phone", panel);
  const addrI = $(".addr", panel);
  const placeEl = $(".place", panel);

  function syncCartButton() {
    const cart = readCart();
    cartBtn.textContent = `🛒 ${calcTotalQty(cart)}`;
  }

  function renderItemRow(item) {
    return `
      <div class="item" data-id="${item.id}">
        <div style="flex:1">
          <div class="name">${item.name}</div>
          <div class="price">${formatVND(item.price)}</div>
        </div>
        <div class="qty">
          <button class="dec">-</button>
          <span>${item.qty}</span>
          <button class="inc">+</button>
          <button class="rmv">xóa</button>
        </div>
      </div>
    `;
  }

  function renderCart() {
    const cart = readCart();
    listEl.innerHTML = cart.length
      ? cart.map(renderItemRow).join("")
      : `<div style="padding:10px;color:#666;text-align:center">Giỏ hàng trống</div>`;
    sumEl.textContent = formatVND(calcTotal(cart));
    syncCartButton();
  }

  function addFromProductCard(cardEl) {
    const name = cardEl.querySelector(".title")?.textContent.trim() || "Món ăn";
    const price = parsePriceText(cardEl.querySelector(".price")?.textContent);
    const id = name.toLowerCase();
    const cart = readCart();
    const idx = cart.findIndex((it) => it.id === id);
    if (idx >= 0) {
      cart[idx].qty++;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    writeCart(cart);
    renderCart();
  }

  function handleListClick(e) {
    const row = e.target.closest(".item");
    if (!row) return;
    const id = row.dataset.id;
    const cart = readCart();
    const idx = cart.findIndex((it) => it.id === id);
    if (idx < 0) return;
    const t = e.target;
    if (t.classList.contains("inc")) {
      cart[idx].qty++;
    } else if (t.classList.contains("dec")) {
      cart[idx].qty = Math.max(1, cart[idx].qty - 1);
    } else if (t.classList.contains("rmv")) {
      cart.splice(idx, 1);
    } else {
      return;
    }
    writeCart(cart);
    renderCart();
  }

  function handleDocumentClick(e) {
    const btnOrder = e.target.closest(".btn-order");
    if (!btnOrder) return;
    const card = btnOrder.closest(".product-card");
    if (card) addFromProductCard(card);
  }

  function handleCheckoutClick() {
    const cart = readCart();
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống");
      return;
    }
    if (!user) {
      alert("Vui lòng đăng nhập để thanh toán");
      location.href = "login.html";
      return;
    }
    payBox.style.display = "block";
    nameI.value = user.name || "";
    phoneI.value = user.phone || "";
  }

  function handlePlaceOrder() {
    const name = nameI.value.trim();
    const phone = phoneI.value.trim();
    const addr = addrI.value.trim();
    if (!name || !phone || !addr) {
      alert("Nhập đủ họ tên, SĐT, địa chỉ");
      return;
    }
    const safeAddr = addr.replace(/</g, "&lt;");
    listEl.innerHTML = `
      <div style="padding:12px;text-align:center">
        Đang giao hàng đến: <b>${safeAddr}</b>...
      </div>
    `;
    sumEl.textContent = formatVND(0);
    writeCart([]);
    syncCartButton();
    setTimeout(() => {
      alert("Đặt hàng thành công!");
      panel.style.display = "none";
      payBox.style.display = "none";
      nameI.value = phoneI.value = addrI.value = "";
      renderCart();
    }, 1200);
  }

  cartBtn.onclick = () => {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  };

  closeEl.onclick = () => {
    panel.style.display = "none";
  };

  listEl.addEventListener("click", handleListClick);
  document.addEventListener("click", handleDocumentClick);
  checkoutEl.onclick = handleCheckoutClick;
  placeEl.onclick = handlePlaceOrder;

  renderCart();
})();
