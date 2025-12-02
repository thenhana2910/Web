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
        try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) { }
        try { localStorage.setItem("floresCart", JSON.stringify(cart)); } catch (e) { }
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




// Toast
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Giỏ hàng
function addToCart(name, price, img) {
    let cart = JSON.parse(localStorage.getItem('flores_cart') || '[]');
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, img, qty: 1 });
    localStorage.setItem('flores_cart', JSON.stringify(cart));
    document.getElementById('cart-count').textContent = cart.reduce((a, c) => a + c.qty, 0);
    showToast('Đã thêm vào giỏ hàng');
}

// Yêu thích
function toggleFavorite(name, img, btn) {
    let favs = JSON.parse(localStorage.getItem('flores_fav') || '[]');
    const index = favs.findIndex(f => f.name === name);
    if (index > -1) {
        favs.splice(index, 1);
        btn.classList.remove('liked');
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    } else {
        favs.push({ name, img });
        btn.classList.add('liked');
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }
    localStorage.setItem('flores_fav', JSON.stringify(favs));
    showToast(index > -1 ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích');
}

// Cập nhật số lượng giỏ khi load trang
document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('flores_cart') || '[]');
    document.getElementById('cart-count').textContent = cart.reduce((a, c) => a + c.qty, 0);
});


// Mở modal + scroll lên đầu phần nội dung
function openProductModal(title, price, imgSrc, tone, ingredients, care) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalMainImage').src = imgSrc;
    document.getElementById('modalTone').innerHTML = tone;
    document.getElementById('modalIngredients').innerHTML = ingredients;
    document.getElementById('modalCare').innerHTML = care;

    const modal = document.getElementById('productModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Scroll về đầu modal khi mở
    modal.scrollTop = 0;
}

// Đóng modal
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
};
document.getElementById('productModal').onclick = (e) => {
    if (e.target === document.getElementById('productModal')) {
        document.getElementById('productModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// Giữ nguyên hàm addToCart, toggleFavorite, toast như cũ của bạn

// DỮ LIỆU CHI TIẾT – ĐÃ ĐƯỢC CHUẨN HOÁ CHÍNH XÁC 100% VỚI HTML
const productDetails = {
    "Lửa Tình Rực Rỡ": {
        tone: "Tone: đỏ – cam – vàng, rực lửa",
        ingredients: "Hoa hồng đỏ Ecuador<br>Hồng kem viền đỏ<br>Hoa cúc mẫu đơn vàng<br>Baby trắng<br>Lá bạch đàn",
        care: "• Thay nước mỗi 24 giờ<br>• Cắt gốc 1–1.5 cm mỗi ngày<br>• Tránh nhiệt cao & gió mạnh<br>• Đặt nơi thoáng mát < 28°C"
    },
    "Niềm vui nhỏ": {
        tone: "Tone: vàng – trắng, nhẹ nhàng tươi sáng",
        ingredients: "Hoa hướng dương mini<br>Cúc tana trắng<br>Hoa baby vàng nhạt<br>Lá bạc phủ nhẹ",
        care: "• Hoa hướng dương thích nhiều nước → thêm nước mỗi 12h<br>• Cắt gốc chéo để tăng hút nước<br>• Tránh nắng trực tiếp"
    },
    "Bình Minh Rừng Sâu": {
        tone: "Tone: xanh lá – vàng – thiên nhiên",
        ingredients: "Hoa cúc xanh<br>Mẫu đơn vàng nhạt<br>Bụi lá waxflower<br>Eucalyptus",
        care: "• Giữ nơi mát, không để gần trái cây chín<br>• Phun sương 1–2 lần/ngày<br>• Thay nước mỗi ngày"
    },
    "Cẩm Tú Cầu": {
        tone: "Tone: tím – xanh nhẹ, sang trọng",
        ingredients: "1–2 bông cẩm tú cầu xanh tím<br>Hồng pastel đi kèm<br>Lá olive<br>Sương mù tím (misty purple)",
        care: "• Cẩm tú cầu cần nước nhiều: ngâm gốc 5 phút trước khi cắm<br>• Phun sương trực tiếp lên cánh để giữ nước<br>• Không để dưới máy lạnh mạnh"
    },
    "Tình Yêu Lặng Lẽ": {
        tone: "Tone: hồng pastel – kem, mềm mại",
        ingredients: "Hoa hồng pastel<br>Hoa hồng phấn Đà Lạt<br>Baby hồng<br>Lá măng nhỏ",
        care: "• Hạn chế chạm vào cánh hoa<br>• Để nơi ánh sáng nhẹ<br>• Thay nước mỗi 24h, giữ bình sạch"
    },
    "Giấc Mơ Dịu Dàng": {
        tone: "Tone: hồng tím ngọt ngào – dreamy",
        ingredients: "Hồng tím pastel<br>Cẩm chướng hồng<br>Lavender khô<br>Lá dusty miller bạc",
        care: "• Không để gần cửa gió điều hòa<br>• Lavender không cần nhiều nước → giữ khô phần bông<br>• Cắt gốc & thay nước hằng ngày"
    }
};

// PHẦN MỞ MODAL – ĐÃ SỬA ĐỂ BẮT CHÍNH XÁC TÊN
document.querySelectorAll('.shop-item').forEach(item => {
    item.addEventListener('click', function (e) {
        if (e.target.closest('.shop-add-btn') || e.target.closest('.fav-btn')) return;

        const titleElement = this.querySelector('.shop-title');
        if (!titleElement) return;

        const title = titleElement.textContent.trim();  // ← quan trọng: trim sạch
        const price = this.querySelector('.shop-price').textContent.trim();
        const img = this.querySelector('.shop-image img').src;

        // Kiểm tra xem có dữ liệu không (tránh lỗi)
        if (!productDetails[title]) {
            console.log("Không tìm thấy dữ liệu cho:", title);
            return;
        }

        const data = productDetails[title];

        // Đổ dữ liệu
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalPrice').textContent = price;
        document.getElementById('modalMainImage').src = img;
        document.getElementById('modalTone').innerHTML = data.tone;
        document.getElementById('modalIngredients').innerHTML = data.ingredients;
        document.getElementById('modalCare').innerHTML = data.care;

        // Nút thêm giỏ hàng trong modal
        document.getElementById('modalAddToCart').onclick = () => {
            const priceNum = parseInt(price.replace(/\D/g, ''));
            addToCart(title, priceNum, img);
            document.getElementById('productModal').classList.remove('active');
        };

        // Nút yêu thích trong modal
        const favBtn = document.getElementById('modalFavBtn');
        const favorites = JSON.parse(localStorage.getItem("flores_favorites") || "[]");
        const isLiked = favorites.some(f => f.name === title);
        favBtn.innerHTML = isLiked ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
        favBtn.classList.toggle('liked', isLiked);

        favBtn.onclick = () => toggleFavorite(title, img, favBtn);

        // Mở modal
        document.getElementById('productModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Đóng modal (giữ nguyên)
document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
});
document.getElementById('productModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('productModal')) {
        document.getElementById('productModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});