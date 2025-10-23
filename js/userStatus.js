document.addEventListener("DOMContentLoaded", function () {
  const authArea = document.getElementById("authArea");
  const userInfo = document.getElementById("userInfo");
  const welcomeText = document.getElementById("welcomeText");
  const logoutBtn = document.getElementById("logoutBtn");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.name) {
    authArea && (authArea.style.display = "none");
    userInfo && (userInfo.style.display = "flex");
    welcomeText && (welcomeText.textContent = `Xin chào, ${currentUser.name}! 👋`);
  } else {
    authArea && (authArea.style.display = "flex");
    userInfo && (userInfo.style.display = "none");
  }

  logoutBtn?.addEventListener("click", function () {
    if (!confirm("Bạn có chắc muốn đăng xuất không?")) return;
    localStorage.removeItem("currentUser");
    const inPages = location.pathname.includes("/pages/");
    location.href = inPages ? "login.html" : "pages/login.html";
  });
});
