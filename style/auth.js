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
          ${isAdmin ? '<a href="admin.html"><i class="fas fa-crown"></i> Admin Panel</a>' : ''}
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
      <a href="signup.html"><button class="signup-btn">Sign Up</button></a>
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


