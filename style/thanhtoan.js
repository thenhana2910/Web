// thanhtoan.js – FIX 100% LOAD VÔ TẬN + LƯU ĐƠN HÀNG ĐÚNG
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (!currentUser.email) {
    alert("Vui lòng đăng nhập!");
    location.href = "signup.html";
    return;
  }

  // LẤY GIỎ HÀNG MỘT LẦN DUY NHẤT
  const cart = JSON.parse(localStorage.getItem("flores_cart") || "[]");
  if (cart.length === 0) {
    document.getElementById("total-amount").textContent = "0 ₫";
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const formatted = total.toLocaleString("vi-VN") + " ₫";

  // Cập nhật hiển thị
  document.getElementById("total-amount").textContent = formatted;
  document.getElementById("card-total").textContent = formatted;
  document.getElementById("wallet-total").textContent = formatted;

  const userBalance = FloresWallet.getBalance(currentUser.email);
  const balanceFormatted = userBalance.toLocaleString("vi-VN") + " ₫";
  document.getElementById("user-balance").textContent = balanceFormatted;
  document.getElementById("wallet-balance-display").textContent = balanceFormatted;

  // === HÀM XÓA GIỎ HÀNG ===
  function clearCartCompletely() {
    localStorage.removeItem("flores_cart");
    localStorage.removeItem("cart");
    localStorage.removeItem("floresCart");
    document.querySelectorAll("#cart-count").forEach(el => {
      el.textContent = "0";
      el.style.display = "none";
    });
    localStorage.setItem("cart_cleared", Date.now().toString());
  }

  // === HÀM LƯU ĐƠN HÀNG (DỮ LIỆU ĐÃ ĐƯỢC CLONE SẠCH) ===
  function saveOrder(paymentMethod) {
    const itemsCount = cart.reduce((s, i) => s + (i.quantity || 1), 0);

    const order = {
      id: "FL" + Date.now().toString().slice(-8),
      userEmail: currentUser.email,
      timestamp: Date.now(),
      total: total,
      items: itemsCount,
      status: "processing",
      paymentMethod: paymentMethod,
      itemsDetail: JSON.parse(JSON.stringify(cart)) // clone sâu, tránh lỗi
    };

    let allOrders = JSON.parse(localStorage.getItem("flores_orders") || "[]");
    allOrders.push(order);
    localStorage.setItem("flores_orders", JSON.stringify(allOrders));

    // Cập nhật tổng chi tiêu
    currentUser.totalSpend = (currentUser.totalSpend || 0) + total;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) {
      users[idx].totalSpend = currentUser.totalSpend;
      localStorage.setItem("users", JSON.stringify(users));
    }
  }

  // === MODAL XÁC NHẬN THANH TOÁN ===
  function showConfirmModal() {
    const remaining = userBalance - total;
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;z-index:99999;";

    overlay.innerHTML = `
      <div style="background:linear-gradient(145deg,#1a2332,#0f172a);border:3px solid #fbbf24;border-radius:28px;padding:3rem 4rem;text-align:center;max-width:90%;box-shadow:0 30px 80px rgba(251,191,36,0.5);">
        <i class="fas fa-wallet" style="font-size:5.5rem;color:#fbbf24;margin-bottom:1.5rem;"></i>
        <h2 style="font-family:'Playfair Display',serif;font-size:2.8rem;color:#fbbf24;margin:1rem 0;">Xác nhận thanh toán</h2>
        <p style="color:#e2e8f0;font-size:1.4rem;">Sử dụng <strong style="color:#fbbf24;">Ví Flores</strong></p>
        <div style="background:rgba(251,191,36,0.1);padding:1.5rem;border-radius:16px;margin:1.5rem 0;">
          <p style="color:#94a3b8;margin:0.8rem 0;">Thanh toán: <strong style="color:#fbbf24;font-size:1.6rem;">${formatted}</strong></p>
          <p style="color:#94a3b8;margin:0.8rem 0;">Số dư hiện tại: <strong style="color:#fbbf24;">${balanceFormatted}</strong></p>
          <p style="color:#e2e8f0;margin:1rem 0;">Còn lại: <strong style="color:${remaining >= 0 ? '#fbbf24' : '#ff4757'};font-size:1.8rem;">${remaining.toLocaleString("vi-VN")} ₫</strong></p>
        </div>
        <div style="display:flex;gap:1.5rem;justify-content:center;margin-top:2rem;">
          <button onclick="this.closest('div[style]').parentElement.remove()" style="padding:1rem 2.5rem;background:transparent;border:2px solid #94a3b8;color:#94a3b8;border-radius:50px;font-weight:bold;cursor:pointer;">Hủy</button>
          <button id="confirmPayBtn" style="padding:1rem 3rem;background:#fbbf24;color:#0f172a;border:none;border-radius:50px;font-weight:bold;cursor:pointer;">Xác nhận</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#confirmPayBtn").onclick = function () {
      overlay.remove();

      const payBtn = document.getElementById("pay-with-wallet");
      payBtn.disabled = true;
      payBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang xử lý...`;

      // THỰC HIỆN TOÀN BỘ: TRỪ TIỀN → LƯU ĐƠN → XÓA GIỎ
      FloresWallet.deductMoney(currentUser.email, total);
      saveOrder("Ví Flores");
      clearCartCompletely();

      // HIỆN POPUP THÀNH CÔNG SAU 1.5S
      setTimeout(showWalletSuccess, 1500);
    };
  }

  // === POPUP THÀNH CÔNG ===
  function showWalletSuccess() {
    const remaining = userBalance - total;
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;z-index:99999;";

    overlay.innerHTML = `
      <div style="background:linear-gradient(145deg,#1a2332,#0f172a);border:3px solid #fbbf24;border-radius:28px;padding:3.5rem 4rem;text-align:center;box-shadow:0 30px 80px rgba(251,191,36,0.5);">
        <i class="fas fa-check-circle" style="font-size:6rem;color:#fbbf24;margin-bottom:1.5rem;"></i>
        <h2 style="font-family:'Playfair Display',serif;font-size:3.2rem;color:#fbbf24;">Thanh toán thành công!</h2>
        <p style="color:#e2e8f0;font-size:1.5rem;">Đã thanh toán bằng <strong style="color:#fbbf24;">Ví Flores</strong></p>
        <p style="font-size:2.2rem;color:#fbbf24;font-weight:bold;margin:1.5rem 0;">${formatted}</p>
        <p style="color:#94a3b8;">Số dư còn lại: <strong style="color:#fbbf24;">${remaining.toLocaleString("vi-VN")} ₫</strong></p>
        <p style="color:#e2e8f0;margin:2rem 0;">Đơn hàng sẽ được giao trong <strong>2-3 ngày</strong></p>
        <button onclick="location.href='index.html'" style="padding:1.2rem 3.5rem;background:#fbbf24;color:#0f172a;border:none;border-radius:50px;font-size:1.3rem;font-weight:bold;cursor:pointer;">
          Về trang chủ
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => location.href = "index.html", 6000);
  }

  // === NÚT THANH TOÁN VÍ ===
  const payWalletBtn = document.getElementById("pay-with-wallet");
  if (userBalance < total) {
    payWalletBtn.disabled = true;
    payWalletBtn.innerHTML = `<i class="fas fa-times-circle"></i> Số dư không đủ`;
  } else {
    payWalletBtn.onclick = showConfirmModal;
  }

  // === THANH TOÁN THẺ ===
  document.getElementById("card-form").onsubmit = function (e) {
    e.preventDefault();
    const btn = this.querySelector(".pay-card-btn");
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang xử lý...`;

    saveOrder("Thẻ ngân hàng");
    clearCartCompletely();

    setTimeout(() => {
      document.querySelector("#success-amount strong").textContent = formatted;
      document.getElementById("success-overlay").style.display = "flex";
      setTimeout(() => location.href = "index.html", 4000);
    }, 2000);
  };

  // QR Code
  const orderId = "FL" + Date.now().toString().slice(-6);
  document.getElementById("noidung").textContent = orderId;
  document.getElementById("qr-image").src = 
    `https://img.vietqr.io/image/BIDV-0904708037-compact2.png?amount=${total}&addInfo=${orderId}`;

  if (typeof updateCartCount === "function") updateCartCount();
});

// Bắt sự kiện xóa giỏ hàng từ tab khác
window.addEventListener("storage", e => {
  if (e.key === "cart_cleared" && typeof updateCartCount === "function") {
    updateCartCount();
  }
});