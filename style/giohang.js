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