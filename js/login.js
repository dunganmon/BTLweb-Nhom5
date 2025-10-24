document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".main");
  const username = document.getElementById("username");
  const password = document.getElementById("pass");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (username.value.trim() === "" || password.value.trim() === "") {
        alert("Vui lòng nhập đầy đủ Email/Số điện thoại và Mật khẩu!");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.length === 0) {
        alert("Chưa có tài khoản nào được đăng ký!");
        return;
      }

      const matchedUser = users.find(
        (u) =>
          (u.email === username.value.trim() || u.phone === username.value.trim()) &&
          u.password === password.value
      );

      if (matchedUser) {
        alert(`${matchedUser.name} đăng nhập thành công! 🎉`);
        localStorage.setItem("currentUser", JSON.stringify(matchedUser));
        window.location.href = "../index.html";
      } else {
        alert("Sai tài khoản hoặc mật khẩu!");
      }
    });
  }

const googleBtn = document.querySelector(".social-btn.gg");
if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    alert("🚧 Tính năng đăng nhập bằng Google hiện đang được phát triển.\nVui lòng thử lại sau!");
  });
}

const fbBtn = document.querySelector(".social-btn.fb");
if (fbBtn) {
  fbBtn.addEventListener("click", () => {
    alert("🚧 Tính năng đăng nhập bằng Facebook hiện đang được phát triển.\nVui lòng thử lại sau!");
  });
}

});
