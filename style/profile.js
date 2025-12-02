// ==================== MODAL CHỈNH SỬA + ĐỔI MẬT KHẨU GỘP CHUNG ====================
function openEditModal() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  document.getElementById("editFirstName").value = user.firstName || "";
  document.getElementById("editLastName").value  = user.lastName  || "";
  document.getElementById("editPhone").value     = user.phone     || "";
  document.getElementById("editAddress").value   = user.address   || "";
  
  // Xóa mật khẩu cũ khi mở modal
  document.getElementById("oldPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";
  document.getElementById("editMessage").textContent = "";

  document.getElementById("editProfileModal").classList.add("active");
}

function closeEditModal() {
  document.getElementById("editProfileModal").classList.remove("active");
}

// Lưu tất cả (thông tin + mật khẩu nếu có)
document.getElementById("editProfileForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const firstName = document.getElementById("editFirstName").value.trim();
  const lastName  = document.getElementById("editLastName").value.trim();
  const phone     = document.getElementById("editPhone").value.trim();
  const address   = document.getElementById("editAddress").value.trim();

  const oldPass = document.getElementById("oldPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;

  const msg = document.getElementById("editMessage");
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // === 1. Luôn cập nhật thông tin cơ bản ===
  currentUser.firstName = firstName;
  currentUser.lastName  = lastName;
  currentUser.phone     = phone;
  currentUser.address   = address;

  // === 2. Nếu người dùng nhập mật khẩu → kiểm tra và đổi ===
  if (oldPass || newPass || confirmPass) {
    // Bắt buộc nhập đủ 3 ô
    if (!oldPass || !newPass || !confirmPass) {
      msg.textContent = "Vui lòng nhập đầy đủ 3 ô mật khẩu nếu muốn đổi!";
      msg.className = "error";
      return;
    }
    if (oldPass !== currentUser.password) {
      msg.textContent = "Mật khẩu hiện tại không đúng!";
      msg.className = "error";
      return;
    }
    if (newPass.length < 6) {
      msg.textContent = "Mật khẩu mới phải có ít nhất 6 ký tự!";
      msg.className = "error";
      return;
    }
    if (newPass !== confirmPass) {
      msg.textContent = "Xác nhận mật khẩu không khớp!";
      msg.className = "error";
      return;
    }
    // Đổi mật khẩu thành công
    currentUser.password = newPass;
    msg.textContent = "Đã cập nhật thông tin và đổi mật khẩu thành công! Đang đăng xuất để bảo mật...";
    msg.className = "success";

    setTimeout(() => {
      localStorage.removeItem("currentUser");
      location.href = "signup.html";
    }, 2000);
  } else {
    msg.textContent = "Cập nhật thông tin thành công!";
    msg.className = "success";
  }

  // Cập nhật vào danh sách users
  const idx = users.findIndex(u => u.email === currentUser.email);
  if (idx !== -1) users[idx] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Cập nhật giao diện
  document.getElementById("fullName").textContent = `${firstName} ${lastName}`;
  document.getElementById("phone").textContent = phone || "Chưa cập nhật";
  document.getElementById("address").textContent = address || "Chưa cập nhật";

  if (!oldPass) setTimeout(closeEditModal, 1500); // chỉ đóng modal nếu không đổi mật khẩu
});



// ==================== HÀM LƯU THAY ĐỔ (gọi trực tiếp từ nút) ====================
function saveProfileChanges() {
  const firstName = document.getElementById("editFirstName").value.trim();
  const lastName  = document.getElementById("editLastName").value.trim();
  const phone     = document.getElementById("editPhone").value.trim();
  const address   = document.getElementById("editAddress").value.trim();

  const oldPass = document.getElementById("oldPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;

  const msg = document.getElementById("editMessage");
  msg.textContent = "";
  msg.className = "";

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // === 1. Kiểm tra bắt buộc ===
  if (!firstName || !lastName || !phone) {
    msg.textContent = "Vui lòng nhập đầy đủ họ tên và số điện thoại!";
    msg.className = "error";
    return;
  }

  // === 2. Cập nhật thông tin cơ bản ===
  currentUser.firstName = firstName;
  currentUser.lastName  = lastName;
  currentUser.phone     = phone;
  currentUser.address   = address || "Chưa cập nhật";

  // === 3. Xử lý đổi mật khẩu (nếu có nhập) ===
  if (oldPass || newPass || confirmPass) {
    if (!oldPass || !newPass || !confirmPass) {
      msg.textContent = "Nhập đủ 3 ô nếu muốn đổi mật khẩu!";
      msg.className = "error";
      return;
    }
    if (oldPass !== currentUser.password) {
      msg.textContent = "Mật khẩu hiện tại sai!";
      msg.className = "error";
      return;
    }
    if (newPass.length < 6) {
      msg.textContent = "Mật khẩu mới phải ≥ 6 ký tự!";
      msg.className = "error";
      return;
    }
    if (newPass !== confirmPass) {
      msg.textContent = "Mật khẩu xác nhận không khớp!";
      msg.className = "error";
      return;
    }

    currentUser.password = newPass;
    msg.textContent = "Đổi mật khẩu thành công! Đang đăng xuất để bảo mật...";
    msg.className = "success";

    // Cập nhật localStorage
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) users[idx] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    setTimeout(() => {
      localStorage.removeItem("currentUser");
      location.href = "signup.html";
    }, 2000);
    return;
  }

  // === 4. Nếu chỉ sửa thông tin (không đổi pass) ===
  const idx = users.findIndex(u => u.email === currentUser.email);
  if (idx !== -1) users[idx] = currentUser;

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Cập nhật giao diện
  document.getElementById("fullName").textContent = `${firstName} ${lastName}`;
  document.getElementById("phone").textContent = phone;
  document.getElementById("address").textContent = address || "Chưa cập nhật";

  msg.textContent = "Cập nhật thông tin thành công!";
  msg.className = "success";

  setTimeout(closeEditModal, 1200);
}function saveProfileChanges() {
  const firstName = document.getElementById("editFirstName").value.trim();
  const lastName  = document.getElementById("editLastName").value.trim();
  const phone     = document.getElementById("editPhone").value.trim();
  const address   = document.getElementById("editAddress").value.trim();

  const oldPass = document.getElementById("oldPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confirmPass = document.getElementById("confirmPassword").value;

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // === Kiểm tra bắt buộc ===
  if (!firstName || !lastName || !phone) {
    showToast("Vui lòng nhập đầy đủ họ tên và số điện thoại!", "error");
    return;
  }

  // === Cập nhật thông tin ===
  currentUser.firstName = firstName;
  currentUser.lastName  = lastName;
  currentUser.phone     = phone;
  currentUser.address   = address || "Chưa cập nhật";

  // === Đổi mật khẩu ===
  if (oldPass || newPass || confirmPass) {
    if (!oldPass || !newPass || !confirmPass) {
      showToast("Nhập đủ 3 ô nếu muốn đổi mật khẩu!", "error");
      return;
    }
    if (oldPass !== currentUser.password) {
      showToast("Mật khẩu hiện tại không đúng!", "error");
      return;
    }
    if (newPass.length < 6) {
      showToast("Mật khẩu mới phải ≥ 6 ký tự!", "error");
      return;
    }
    if (newPass !== confirmPass) {
      showToast("Xác nhận mật khẩu không khớp!", "error");
      return;
    }

    currentUser.password = newPass;
    updateUserData(currentUser, users);
    showToast("Đổi mật khẩu thành công! Đang đăng xuất...", "success");

    setTimeout(() => {
      localStorage.removeItem("currentUser");
      location.href = "signup.html";
    }, 2500);
    closeEditModal();
    return;
  }

  // === Chỉ cập nhật thông tin ===
  updateUserData(currentUser, users);
  updateProfileDisplay(firstName, lastName, phone, address);
  showToast("Cập nhật thông tin thành công!", "success");
  setTimeout(closeEditModal, 1200);
}

// Hàm hỗ trợ cập nhật localStorage
function updateUserData(currentUser, users) {
  const idx = users.findIndex(u => u.email === currentUser.email);
  if (idx !== -1) users[idx] = currentUser;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

// Cập nhật giao diện
function updateProfileDisplay(firstName, lastName, phone, address) {
  document.getElementById("fullName").textContent = `${firstName} ${lastName}`;
  document.getElementById("phone").textContent = phone;
  document.getElementById("address").textContent = address || "Chưa cập nhật";
}

// === HÀM HIỆN TOAST ĐẸP ===
function showToast(message, type = "success") {
  const toast = document.getElementById("toastNotification");
  const icon = toast.querySelector(".toast-icon");
  const msg = toast.querySelector(".toast-message");
  const progress = toast.querySelector(".toast-progress");

  // Xóa class cũ
  toast.classList.remove("show", "toast-success", "toast-error");
  clearTimeout(toast.timeout);

  // Thiết lập nội dung
  msg.textContent = message;

  if (type === "success") {
    toast.classList.remove("toast-error");
    toast.classList.add("toast-success");
    icon.innerHTML = "✓";
  } else {
    toast.classList.remove("toast-success");
    toast.classList.add("toast-error");
    icon.innerHTML = "✕";
  }

  // Hiện toast
  toast.classList.add("show");

  // Tự ẩn sau 4 giây
  toast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}


    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) { alert("Vui lòng đăng nhập!"); location.href = "signup.html"; }

    const f = n => new Intl.NumberFormat('vi-VN').format(n || 0) + 'đ';

    // Load thông tin
    document.getElementById("fullName").textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Chưa cập nhật";
    document.getElementById("email").textContent = user.email;
    document.getElementById("phone").textContent = user.phone || "Chưa cập nhật";
    document.getElementById("address").textContent = user.address || "Chưa cập nhật";
    document.getElementById("role").textContent = user.isAdmin ? "Quản trị viên" : "Khách hàng";
    document.getElementById("joined").textContent = new Date(user.registeredAt || Date.now()).toLocaleDateString('vi-VN');

    // Số dư + hạng thành viên
    const balance = user.balance || 0;
    const totalSpend = user.totalSpend || 0;
    document.getElementById("userBalance").textContent = f(balance);

    let rank = "Silver", next = 3000000, nextName = "Gold";
    if (totalSpend >= 15000000) { rank = "Diamond"; next = 0; nextName = "cao nhất"; }
    else if (totalSpend >= 7000000) { rank = "Platinum"; next = 15000000; nextName = "Diamond"; }
    else if (totalSpend >= 3000000) { rank = "Gold"; next = 7000000; nextName = "Platinum"; }

    document.getElementById("currentRank").textContent = rank;
    document.getElementById("rankDesc").textContent = { Silver: "Giảm 5% đơn từ 1 triệu", Gold: "Giảm 20% + miễn phí ship", Platinum: "Giảm 30% + quà sinh nhật", Diamond: "Giảm 40% + quà VIP" }[rank];
    document.getElementById("rankProgress").style.width = next === 0 ? "100%" : (totalSpend / next * 100) + "%";
    document.getElementById("progressText").innerHTML = next === 0 ? "Đã đạt hạng cao nhất!" : `${f(totalSpend)} / ${f(next)} để lên <strong>${nextName}</strong>`;

    const colors = { Silver: "#94a3b8", Gold: "#fbbf24", Platinum: "#e879f9", Diamond: "#5eead4" };
    document.querySelector(".crown i").style.color = colors[rank];

    // Modal
    function openEditModal() {
      document.getElementById("editFirstName").value = user.firstName || "";
      document.getElementById("editLastName").value = user.lastName || "";
      document.getElementById("editPhone").value = user.phone || "";
      document.getElementById("editAddress").value = user.address || "";
      ["oldPassword", "newPassword", "confirmPassword"].forEach(id => document.getElementById(id).value = "");
      document.getElementById("editProfileModal").classList.add("show");
    }
    function closeEditModal() { document.getElementById("editProfileModal").classList.remove("show"); }

    function saveProfileChanges() {
      const fn = document.getElementById("editFirstName").value.trim();
      const ln = document.getElementById("editLastName").value.trim();
      const ph = document.getElementById("editPhone").value.trim();
      const ad = document.getElementById("editAddress").value.trim();
      const op = document.getElementById("oldPassword").value;
      const np = document.getElementById("newPassword").value;
      const cp = document.getElementById("confirmPassword").value;

      if (!fn || !ln || !ph) return toast("Vui lòng nhập đầy đủ họ tên và số điện thoại!", "error");

      user.firstName = fn; user.lastName = ln; user.phone = ph; user.address = ad || "Chưa cập nhật";

      if (op || np || cp) {
        if (!op || !np || !cp) return toast("Nhập đủ 3 ô nếu muốn đổi mật khẩu!", "error");
        if (op !== user.password) return toast("Mật khẩu hiện tại sai!", "error");
        if (np.length < 6) return toast("Mật khẩu mới phải ≥ 6 ký tự!", "error");
        if (np !== cp) return toast("Xác nhận mật khẩu không khớp!", "error");
        user.password = np;
        toast("Đổi mật khẩu thành công! Đang đăng xuất...", "success");
        setTimeout(() => { localStorage.removeItem("currentUser"); location.href = "signup.html"; }, 2000);
        return;
      }

      let users = JSON.parse(localStorage.getItem("users") || "[]");
      const i = users.findIndex(u => u.email === user.email);
      if (i !== -1) users[i] = user;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(user));

      document.getElementById("fullName").textContent = `${fn} ${ln}`;
      document.getElementById("phone").textContent = ph;
      document.getElementById("address").textContent = ad || "Chưa cập nhật";

      toast("Cập nhật thành công!", "success");
      closeEditModal();
    }

    function toast(msg, type = "success") {
      const t = document.getElementById("toast");
      t.textContent = msg;
      t.className = type;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), 3500);
    }

    document.querySelector('.logout').onclick = () => {
      localStorage.removeItem('currentUser');
      location.href = 'signup.html';
    };