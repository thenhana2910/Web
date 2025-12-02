// giohang.js - Hoạt động mượt mà 100%
document.addEventListener("DOMContentLoaded", function () {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const countEl = document.getElementById("cart-count");
  const itemCountEl = document.getElementById("item-count");

  // Cập nhật số lượng ở navbar và tiêu đề
  if (countEl) countEl.textContent = cart.length;
  if (itemCountEl) itemCountEl.textContent = cart.length;

  // Hiển thị giỏ hàng
  if (cart.length === 0) {
    document.getElementById("empty-cart").style.display = "block";
  } else {
    document.getElementById("cart-content").style.display = "block";
    renderCartItems(cart);
    updateTotals(cart);
  }
});

function renderCartItems(cart) {
  const tbody = document.getElementById("cart-items");
  tbody.innerHTML = "";

  cart.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="product-info">
        <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}">
        <div>
          <div class="product-name">${item.name}</div>
          <small style="color:#94a3b8;">${item.variant || ''}</small>
        </div>
      </td>
      <td>${parseInt(item.price).toLocaleString()} ₫</td>
      <td>
        <div class="quantity-controls">
          <button onclick="changeQuantity(${index}, -1)">−</button>
          <span>${item.quantity || 1}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>
      </td>
      <td><strong>${(parseInt(item.price) * (item.quantity || 1)).toLocaleString()} ₫</strong></td>
      <td><i class="fas fa-trash remove-item" onclick="removeItem(${index})"></i></td>
    `;
    tbody.appendChild(row);
  });
}

function updateTotals(cart) {
  let subtotal = cart.reduce((sum, item) => sum + parseInt(item.price) * (item.quantity || 1), 0);
  document.getElementById("subtotal").textContent = subtotal.toLocaleString() + " ₫";
  document.getElementById("total").textContent = subtotal.toLocaleString() + " ₫";
}

function changeQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart[index].quantity = (cart[index].quantity || 1) + change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload(); // Reload để cập nhật
}

function removeItem(index) {
  if (confirm("Xóa sản phẩm khỏi giỏ hàng?")) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
  }
}
// Lấy giỏ hàng từ localStorage
let cart = JSON.parse(localStorage.getItem("floresCart") || "[]");

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? "flex" : "none";
  });
}

// Render giỏ hàng trong sidebar
function renderCart() {
  const container = document.getElementById("floresCartItems");
  container.innerHTML = "";
  let subtotal = 0;
  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "flores-cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="meta">
        <div class="name">${item.name}</div>
        <div class="meta-sub">${item.quantity} × ${item.price.toLocaleString()} ₫</div>
      </div>
      <div class="controls">
        <div class="qty-controls">
          <button onclick="changeQty(${index},-1)">−</button>
          <span class="qty">${item.quantity}</span>
          <button onclick="changeQty(${index},1)">+</button>
        </div>
        <button onclick="removeItem(${index})">🗑</button>
      </div>
    `;
    container.appendChild(row);
    subtotal += item.price * item.quantity;
  });
  document.getElementById("cartSubtotal").textContent = subtotal.toLocaleString() + " ₫";
  document.getElementById("cartTotal").textContent = subtotal.toLocaleString() + " ₫";
}

function changeQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  localStorage.setItem("floresCart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("floresCart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// Mở/đóng sidebar
function toggleCart() {
  document.getElementById("floresCartPanel").classList.toggle("open");
  document.getElementById("floresCartOverlay").classList.toggle("show");
}

document.getElementById("closeCart").addEventListener("click", toggleCart);
document.getElementById("floresCartOverlay").addEventListener("click", toggleCart);

// Mở giỏ hàng khi click icon trên navbar
document.querySelectorAll(".cart").forEach(el => {
  el.addEventListener("click", toggleCart);
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
});
