// phuongthucthanhtoan.js
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (!currentUser.email) {
    alert("Vui lòng đăng nhập!");
    location.href = "signup.html";
    return;
  }

  // Cập nhật số dư
  function updateBalance() {
    const balance = FloresWallet.getBalance(currentUser.email);
    document.getElementById("userBalance").textContent = balance.toLocaleString("vi-VN") + " ₫";
    document.getElementById("bigBalance").textContent = balance.toLocaleString("vi-VN") + " ₫";
  }

  // Tạo mã chuyển khoản
  const transferCode = "FL" + Date.now().toString().slice(-6);
  document.getElementById("transferCode").textContent = transferCode;

  // Nạp tiền nhanh
  document.querySelectorAll(".topup-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const amount = parseInt(btn.dataset.amount);
      FloresWallet.addMoney(currentUser.email, amount);
      updateBalance();
      toast(`Nạp thành công +${amount.toLocaleString()}₫ !`);
    });
  });

  // Xác nhận đã chuyển khoản
  window.confirmTransfer = function () {
    toast("Cảm ơn! Đơn hàng sẽ được xử lý sau khi nhận được tiền chuyển khoản.");
  };

  // Toast
  window.toast = function (msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3500);
  };

  // Khởi động
  updateBalance();
});

    