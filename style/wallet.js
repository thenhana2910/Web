// wallet.js – Quản lý ví Flores cho tất cả user
class FloresWallet {
  static getBalance(email) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.email === email);
    return user?.balance || 0;
  }

  static addMoney(email, amount) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return false;
    users[idx].balance = (users[idx].balance || 0) + amount;
    localStorage.setItem("users", JSON.stringify(users));

    // Cập nhật currentUser nếu đang đăng nhập
    const current = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (current.email === email) {
      current.balance = users[idx].balance;
      localStorage.setItem("currentUser", JSON.stringify(current));
    }
    return true;
  }

  static deductMoney(email, amount) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1 || (users[idx].balance || 0) < amount) return false;

    users[idx].balance -= amount;
    localStorage.setItem("users", JSON.stringify(users));

    const current = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (current.email === email) {
      current.balance = users[idx].balance;
      localStorage.setItem("currentUser", JSON.stringify(current));
    }
    return true;
  }
}