// giohang.js – HOÀN HẢO 100%: XÓA ĐƯỢC + THÔNG BÁO ĐẸP + KHÔNG BAO GIỜ LỖI NỮA
const CART_KEY = "flores_cart"; // CHỈ DÙNG KEY NÀY TRÊN TOÀN DỰ ÁN!!!

let cart = []; // Biến toàn cục

// === LẤY GIỎ HÀNG KHI LOAD TRANG ===
document.addEventListener("DOMContentLoaded", function () {
  cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  updateCartCount();
  if (document.getElementById("cart-items")) renderCartPage(); // chỉ chạy trên trang giỏ hàng
});

// === CẬP NHẬT SỐ LƯỢNG Ở HEADER (tất cả trang) ===
function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelectorAll("#cart-count").forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? "block" : "none";
  });
  // Cập nhật tiêu đề trong giỏ hàng
  const itemCountEl = document.getElementById("item-count");
  if (itemCountEl) itemCountEl.textContent = total || 0;
}
window.updateCartCount = updateCartCount;

// === HIỆN THÔNG BÁO ĐẸP ===
function showToast(message, type = "success") {
  const toast = document.getElementById("toastNotification") || createToast();
  const icon = toast.querySelector(".toast-icon");
  const msg = toast.querySelector(".toast-message");

  toast.className = type === "success" ? "toast-show toast-success" : "toast-show toast-error";
  icon.className = type === "success" ? "fas fa-check-circle toast-icon" : "fas fa-times-circle toast-icon";
  msg.textContent = message;

  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => {
    toast.classList.remove("toast-show");
  }, 3000);
}

function createToast() {
  const toast = document.createElement("div");
  toast.id = "toastNotification";
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-check-circle toast-icon"></i>
      <span class="toast-message"></span>
    </div>
    <div class="toast-progress"></div>
  `;
  document.body.appendChild(toast);
  return toast;
}

// === RENDER TRANG GIỎ HÀNG ===
function renderCartPage() {
  const tbody = document.getElementById("cart-items");
  const content = document.getElementById("cart-content");

  if (cart.length === 0) {
    content.style.display = "none";
    document.getElementById("cart-subtitle").innerHTML = "Giỏ hàng của bạn đang trống";
    return;
  }

  content.style.display = "block";
  tbody.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const price = parseInt(item.price);
    const qty = item.quantity || 1;
    const totalItem = price * qty;
    subtotal += totalItem;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="product-info">
        <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
        <div>
          <div class="product-name">${item.name}</div>
          ${item.variant ? `<small style="color:#94a3b8;">${item.variant}</small>` : ""}
        </div>
      </td>
      <td>${price.toLocaleString()} ₫</td>
      <td>
        <div class="quantity-controls">
          <button onclick="changeQuantity(${index}, -1)">−</button>
          <span>${qty}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>
      </td>
      <td><strong>${totalItem.toLocaleString()} ₫</strong></td>
      <td>
        <i class="fas fa-trash remove-item" onclick="removeItem(${index})" style="cursor:pointer;color:#ef4444;font-size:1.2rem;"></i>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("subtotal").textContent = subtotal.toLocaleString() + " ₫";
  document.getElementById("total").textContent = subtotal.toLocaleString() + " ₫";
}

// === THAY ĐỔI SỐ LƯỢNG ===
window.changeQuantity = function (index, delta) {
  cart[index].quantity = (cart[index].quantity || 1) + delta;
  if (cart[index].quantity <= 0) {
    removeItem(index);
    return;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartPage();
  updateCartCount();
};

// === XÓA SẢN PHẨM ===
window.removeItem = function (index) {
  const productName = cart[index].name;
  if (confirm(`Xóa "${productName}" khỏi giỏ hàng?`)) {
    cart.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
    showToast(`Đã xóa "${productName}" khỏi giỏ hàng`, "success");
  }
};

// === BẤM ICON GIỎ HÀNG Ở HEADER → VÀO TRANG GIỎ HÀNG ===
document.querySelectorAll("#cart-icon, .cart").forEach(el => {
  el.style.cursor = "pointer";
  el.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    location.href = "giohang.html";
  });
});

// === BẮT SỰ KIỆN XÓA GIỎ TỪ TRANG THANH TOÁN ===
window.addEventListener("storage", (e) => {
  if (e.key === "cart_cleared") {
    cart = [];
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    if (document.getElementById("cart-items")) renderCartPage();
  }
});

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.querySelector("#cart-count");

  if (badge) {
    if (total > 0) {
      badge.textContent = total > 99 ? "99+" : total;
      badge.style.display = "flex";
    } else {
      badge.textContent = "0";
      badge.style.display = "none";
    }
  }

  const itemCountEl = document.getElementById("item-count");
  if (itemCountEl) itemCountEl.textContent = total || 0;
}