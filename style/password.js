// === TÍNH NĂNG QUÊN MẬT KHẨU ===
function openForgotPasswordModal() {
  document.getElementById("forgotPasswordModal").style.display = "flex";
  document.getElementById("forgotEmail").focus();
}

function closeForgotPasswordModal() {
  document.getElementById("forgotPasswordModal").style.display = "none";
  document.getElementById("forgotEmail").value = "";
  document.getElementById("resetResult").style.display = "none";
}

// Tạo mật khẩu ngẫu nhiên an toàn
function generateStrongPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Xử lý reset mật khẩu
function resetPassword() {
  const email = document.getElementById("forgotEmail").value.trim();
  const resultDiv = document.getElementById("resetResult");

  if (!email) {
    resultDiv.textContent = "Vui lòng nhập email!";
    resultDiv.className = "error";
    resultDiv.style.display = "block";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    resultDiv.textContent = "Không tìm thấy email này trong hệ thống!";
    resultDiv.className = "error";
    resultDiv.style.display = "block";
    return;
  }

  // Tạo mật khẩu mới
  const newPassword = generateStrongPassword();
  users[userIndex].password = newPassword;
  localStorage.setItem("users", JSON.stringify(users));

  // Hiển thị mật khẩu mới
  resultDiv.innerHTML = `
  <div style="text-align:center;">
    <i class="fas fa-check-circle" style="color:#22c55e; font-size:2rem; margin-bottom:15px;"></i><br>
    <strong style="font-size:1.25rem; color:#fbbf24;">Khôi phục thành công!</strong><br><br>
    Mật khẩu mới của bạn:<br>
    <div class="new-pass">${newPassword}</div>
    <p style="color:#cbd5e1; margin:20px 0; line-height:1.6;">
      Hãy đăng nhập ngay và <strong style="color:#fbbf24;">đổi mật khẩu mới</strong> để bảo mật tài khoản nhé!
    </p>
    
    <!-- NÚT CAM MỚI -->
    <button onclick="closeForgotPasswordModal()" class="btn-orange-close">
      <i class="fas fa-check"></i> Tôi đã copy mật khẩu – Đóng
    </button>
  </div>
`;
  resultDiv.className = "";
  resultDiv.style.display = "block";
}