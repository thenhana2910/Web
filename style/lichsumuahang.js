// lichsumuahang.js – LỊCH SỬ MUA HÀNG HOÀN CHỈNH
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (!currentUser.email) {
    alert("Vui lòng đăng nhập!");
    location.href = "signup.html";
    return;
  }

  // Lấy danh sách đơn hàng của user
  let allOrders = JSON.parse(localStorage.getItem("flores_orders") || "[]");
  let userOrders = allOrders.filter(order => order.userEmail === currentUser.email);

  const ordersList = document.getElementById("orders-list");
  const emptyState = document.getElementById("empty-orders");

  if (userOrders.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  // Sắp xếp mới nhất trước
  userOrders.sort((a, b) => b.timestamp - a.timestamp);

  userOrders.forEach(order => {
    const date = new Date(order.timestamp).toLocaleString("vi-VN");

    const statusClass = {
      "processing": "status-processing",
      "delivered": "status-delivered",
      "cancelled": "status-cancelled"
    }[order.status] || "status-processing";

    const statusText = {
      "processing": "Đang xử lý",
      "delivered": "Đã giao",
      "cancelled": "Đã hủy"
    }[order.status] || "Đang xử lý";

    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <div class="order-header">
        <div>
          <div class="order-id">#${order.id}</div>
          <div class="order-date">${date}</div>
        </div>
        <div class="order-status ${statusClass}">${statusText}</div>
      </div>
      <div style="font-size:1.4rem;color:#e2e8f0;">
        ${order.items} sản phẩm
      </div>
      <div class="order-total">${order.total.toLocaleString("vi-VN")} ₫</div>
    `;
    ordersList.appendChild(card);
  });

  // Cập nhật giỏ hàng
  if (typeof updateCartCount === "function") updateCartCount();
});