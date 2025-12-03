// auth.js – Phiên bản CUỐI CÙNG, ĐẸP NHƯ WEB XỊN

const ADMIN_EMAILS = ["thenhan29102006@gmail.com", "friendemail@gmail.com"]; // sửa email 2 bạn

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navActions = document.getElementById("navActions");
  if (!navActions) return;

  if (currentUser) {
    const isAdmin = currentUser.isAdmin || ADMIN_EMAILS.includes(currentUser.email);

    navActions.innerHTML = `
      <div class="account-wrapper">
        <button class="account-btn">
          Thông tin tài khoản <i class="fas fa-caret-down"></i>
        </button>
        <div class="account-dropdown">
          <a href="profile.html"><i class="fas fa-user"></i> Thông tin cá nhân</a>
          ${isAdmin ? '<a href="admin.html"><i class="fas fa-crown"></i> Bảng điều khiển</a>' : ''}
          <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>
        </div>
      </div>

      <div class="cart" onclick="toggleGioHang()">
        <i class="fa-solid fa-bag-shopping"></i>
        <span id="cart-count" class="cart-count">0</span>
      </div>
    `;
  } else {
    navActions.innerHTML = `
      <a href="signup.html"><button class="signup-btn">Đăng nhập</button></a>
      <div class="cart" onclick="toggleGioHang()">
        <i class="fa-solid fa-bag-shopping"></i>
        <span id="cart-count" class="cart-count">0</span>
      </div>
    `;
  }
});

function logout() {
  if (confirm("Đăng xuất tài khoản?")) {
    localStorage.removeItem("currentUser");
    location.href = "signup.html";
  }
}
window.logout = logout;


let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlides() {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    dots[i].classList.remove('active');
  });

  slideIndex++;
  if (slideIndex >= slides.length) slideIndex = 0;

  slides[slideIndex].classList.add('active');
  dots[slideIndex].classList.add('active');

  setTimeout(showSlides, 5000); // Đổi ảnh mỗi 5 giây
}

function currentSlide(n) {
  slideIndex = n - 1;
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    dots[i].classList.remove('active');
  });
  slides[slideIndex].classList.add('active');
  dots[slideIndex].classList.add('active');
}

// Khởi động slider
document.addEventListener('DOMContentLoaded', () => {
  showSlides();
});

// Nút prev/next
document.querySelector('.slider-next').addEventListener('click', () => {
  slideIndex++;
  if (slideIndex >= slides.length) slideIndex = 0;
  currentSlide(slideIndex + 1);
});

document.querySelector('.slider-prev').addEventListener('click', () => {
  slideIndex--;
  if (slideIndex < 0) slideIndex = slides.length - 1;
  currentSlide(slideIndex + 1);
});

// Hàm cập nhật số lượng giỏ hàng (đã có sẵn ở một số trang, nhưng làm chung)
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("floresCart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = totalItems;
    countEl.style.display = totalItems > 0 ? "flex" : "none";
  }
}

// Xử lý click icon giỏ hàng: chuyển đến checkout nếu có hàng
document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.getElementById("cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("floresCart")) || [];
      if (cart.length === 0) {
        alert("Giỏ hàng đang trống! Hãy thêm ít nhất một bó hoa nhé");
      } else {
        window.location.href = "checkout.html";
      }
    });
  }

  // Cập nhật số lượng giỏ hàng khi load trang
  updateCartCount();
});
