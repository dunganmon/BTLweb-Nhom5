document.addEventListener("DOMContentLoaded", function () {
  const authArea = document.getElementById("authArea");
  const userInfo = document.getElementById("userInfo");
  const welcomeText = document.getElementById("welcomeText");
  const logoutBtn = document.getElementById("logoutBtn");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.name) {
    authArea.style.display = "none"; 
    userInfo.style.display = "flex"; 
    welcomeText.textContent = `Xin chào, ${currentUser.name}! 👋`;
  } else {
    authArea.style.display = "flex";
    userInfo.style.display = "none";
  }

  logoutBtn.addEventListener("click", function () {
    if (confirm("Bạn có chắc muốn đăng xuất không?")) {
      localStorage.removeItem("currentUser"); 
      window.location.href = "pages/login.html";
    }
  });
});