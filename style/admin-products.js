let editingId = null;

// Kiểm tra quyền Admin
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || !currentUser.isAdmin) {
  alert("Access Denied: Chỉ Admin mới được vào!");
  window.location.href = "index.html";
}

// Load sản phẩm
function loadProducts() {
  const products = JSON.parse(localStorage.getItem("flores_products") || "[]");
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  if (products.length === 0) {
    grid.innerHTML = "<p style='text-align:center; color:#94a3b8; font-size:1.2rem;'>Chưa có sản phẩm nào. Hãy thêm bó hoa đầu tiên!</p>";
    return;
  }

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <div class="product-actions">
          <button class="btn-edit" onclick="editProduct(${p.id})">Sửa</button>
          <button class="btn-delete" onclick="deleteProduct(${p.id})">Xóa</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Mở modal thêm
function openAddModal() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "Thêm bó hoa mới";
  document.getElementById("productForm").reset();
  document.getElementById("productModal").classList.add("active");
}

// Đóng modal
function closeModal() {
  document.getElementById("productModal").classList.remove("active");
}

// Sửa sản phẩm
function editProduct(id) {
  const products = JSON.parse(localStorage.getItem("flores_products") || "[]");
  const product = products.find(p => p.id === id);
  if (!product) return;

  editingId = id;
  document.getElementById("modalTitle").textContent = "Chỉnh sửa sản phẩm";
  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.priceNum || product.price.replace(/[^0-9]/g, "");
  document.getElementById("image").value = product.image;
  document.getElementById("tone").value = product.tone || "";
  document.getElementById("ingredients").value = product.ingredients || "";
  document.getElementById("care").value = product.care || "";

  document.getElementById("productModal").classList.add("active");
}

// Xóa sản phẩm
function deleteProduct(id) {
  if (!confirm("Xóa bó hoa này khỏi cửa hàng?")) return;
  let products = JSON.parse(localStorage.getItem("flores_products") || "[]");
  products = products.filter(p => p.id !== id);
  localStorage.setItem("flores_products", JSON.stringify(products));
  loadProducts();
}

// Lưu sản phẩm (thêm hoặc sửa)
document.getElementById("productForm").onsubmit = function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = Number(document.getElementById("price").value);
  const image = document.getElementById("image").value.trim();

  if (!name || !price || !image) {
    alert("Vui lòng điền đầy đủ Tên, Giá và Ảnh!");
    return;
  }

  let products = JSON.parse(localStorage.getItem("flores_products") || "[]");

  if (editingId) {
    // Sửa
    products = products.map(p => p.id === editingId ? {
      ...p,
      name,
      price: price.toLocaleString('vi-VN') + ' VNĐ',
      priceNum: price,
      image,
      tone: document.getElementById("tone").value,
      ingredients: document.getElementById("ingredients").value,
      care: document.getElementById("care").value
    } : p);
    alert("Đã cập nhật sản phẩm!");
  } else {
    // Thêm mới
    const newProduct = {
      id: Date.now(),
      name,
      price: price.toLocaleString('vi-VN') + ' VNĐ',
      priceNum: price,
      image,
      tone: document.getElementById("tone").value || "Không xác định",
      ingredients: document.getElementById("ingredients").value || "Đang cập nhật...",
      care: document.getElementById("care").value || "Giữ ở nơi thoáng mát",
      addedAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    alert(`Đã thêm "${name}" vào cửa hàng!`);
  }

  localStorage.setItem("flores_products", JSON.stringify(products));
  loadProducts();
  closeModal();
};

// Đăng xuất
function logout() {
  if (confirm("Đăng xuất tài khoản Admin?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "signup.html";
  }
}

// Load khi mở trang
window.onload = loadProducts;


 // Scroll effect cho navbar
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });

  // Hamburger menu
  document.getElementById('hamburger')?.addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('active');
  });

  // Đăng xuất
  function logout() {
    if (confirm('Đăng xuất khỏi tài khoản Admin?')) {
      localStorage.removeItem('currentUser');
      window.location.href = 'signup.html';
    }
  }
