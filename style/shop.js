// giohang.js – JS giỏ hàng CHUẨN, DUY NHẤT, SIÊU ỔN ĐỊNH cho toàn bộ website Flores
(() => {
  // === CẤU HÌNH CHUNG ===
  const CART_KEY = "flores_cart";         // Key chính (dùng cho mọi nơi)
  const FAV_KEY = "flores_favorites";     // Key yêu thích

  // === LẤY DỮ LIỆU ===
  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const getFavorites = () => JSON.parse(localStorage.getItem(FAV_KEY) || "[]");

  // === LƯU DỮ LIỆU ===
  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Backward compatible với code cũ (nếu còn dùng key "cart")
    try { localStorage.setItem("cart", JSON.stringify(cart)); } catch(e) {}
    try { localStorage.setItem("floresCart", JSON.stringify(cart)); } catch(e) {}
  };
  const saveFavorites = (fav) => localStorage.setItem(FAV_KEY, JSON.stringify(fav));

  // === CẬP NHẬT SỐ LƯỢNG TRÊN ICON GIỎ HÀNG ===
  window.updateCartCount = () => {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    document.querySelectorAll("#cart-count").forEach(el => {
      el.textContent = totalItems;
      el.style.display = totalItems > 0 ? "flex" : "none";
    });

    // Cập nhật số sản phẩm trong trang giỏ hàng (nếu có)
    const itemCountEl = document.getElementById("item-count");
    if (itemCountEl) itemCountEl.textContent = cart.length;
  };

  // === TOAST ĐẸP ===
  window.showToast = (message, type = "success") => {
    // Xóa toast cũ nếu có
    document.querySelectorAll(".flores-toast").forEach(t => t.remove());

    const toast = document.createElement("div");
    toast.className = `flores-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 9999;
      background: ${type === "error" ? "#ff4757" : "#fbbf24"};
      color: ${type === "error" ? "white" : "#0f172a"};
      padding: 1rem 2rem; border-radius: 50px; font-weight: bold;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      transform: translateX(120%); transition: all 0.5s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.transform = "translateX(0)", 100);
    setTimeout(() => {
      toast.style.transform = "translateX(120%)";
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  // === THÊM VÀO GIỎ HÀNG ===
  window.addToCart = (name, price, image = "", variant = "") => {
    if (!name || !price) return showToast("Lỗi sản phẩm!", "error");

    let cart = getCart();
    const existing = cart.find(item => item.name === name && item.variant === variant);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        name,
        price: Number(price),
        image: image || "",
        variant: variant || "",
        quantity: 1
      });
    }

    saveCart(cart);
    updateCartCount();
    showToast(`${name} đã thêm vào giỏ hàng!`);
  };

  // === YÊU THÍCH ===
  window.toggleFavorite = (name, image, buttonElement) => {
    let favorites = getFavorites();
    const index = favorites.findIndex(f => f.name === name);

    if (index > -1) {
      favorites.splice(index, 1);
      buttonElement.classList.remove("liked");
      showToast(`${name} đã bỏ yêu thích`);
    } else {
      favorites.push({ name, image });
      buttonElement.classList.add("liked");
      showToast(`${name} đã thêm vào yêu thích!`);
    }

    saveFavorites(favorites);
  };

  // === MỞ GIỎ HÀNG (khi bấm icon) ===
  window.toggleGioHang = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    // Nếu bạn có sidebar giỏ hàng thì gọi openCart()
    if (typeof openCart === "function") return openCart();
    // Ngược lại: chuyển sang trang giỏ hàng
    location.href = "giohang.html";
  };

  // === KHỞI ĐỘNG KHI LOAD TRANG ===
  document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    // Gắn sự kiện cho icon giỏ hàng (nếu chưa có)
    document.querySelectorAll(".cart, .cart-btn, [data-role='open-cart']").forEach(el => {
      el.style.cursor = "pointer";
      el.addEventListener("click", toggleGioHang);
    });

    // Khôi phục trạng thái yêu thích trên trang shop
    if (document.querySelector(".shop-item")) {
      const favorites = getFavorites();
      document.querySelectorAll(".shop-item").forEach(item => {
        const title = item.querySelector(".shop-title")?.textContent.trim();
        const btn = item.querySelector(".fav-btn");
        if (title && btn && favorites.some(f => f.name === title)) {
          btn.classList.add("liked");
        }
      });
    }
  });

  // === CẬP NHẬT KHI CÓ THAY ĐỔI TỪ TAB KHÁC ===
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY || e.key === "cart" || e.key === "floresCart") {
      updateCartCount();
    }
  });

  // Expose ra để dùng ở console nếu cần
  window.FloresCart = { getCart, updateCartCount, showToast };
})();