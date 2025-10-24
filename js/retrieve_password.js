document.addEventListener("DOMContentLoaded", () => {
  const form         = document.querySelector(".main_reset form");
  const phoneInput   = document.getElementById("sdt");
  const emailInput   = document.getElementById("email");
  const newPass      = document.getElementById("pass");
  const confirmPass  = document.getElementById("passwd");
  const strengthText = document.querySelector(".content_begin_reset .strength-text");

  if (!form || !phoneInput || !emailInput || !newPass || !confirmPass) {
    console.error("Thiếu phần tử trong form đổi mật khẩu.");
    return;
  }

  //  Hàm đánh giá độ mạnh mật khẩu
  function checkPasswordStrength(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    if (password.length < 6) return "Yếu";
    const score = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
    if (password.length >= 10 && score >= 3) return "Mạnh";
    return "Trung bình";
  }

  //  Cập nhật hiển thị độ mạnh
  if (strengthText) {
    newPass.addEventListener("input", () => {
      const s = checkPasswordStrength(newPass.value);
      strengthText.textContent = "Độ bảo mật: " + s;
      strengthText.style.color =
        s === "Mạnh" ? "#0a7d2a" :
        s === "Trung bình" ? "#b07000" :
        "#c30000";
    });
  }

  //  Xử lý submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const phone = (phoneInput.value || "").trim();
    const email = (emailInput.value || "").trim();
    const pass = (newPass.value || "").trim();
    const repass = (confirmPass.value || "").trim();

    // ==== KIỂM TRA HỢP LỆ ====
    if (!phone && !email) {
      alert("Vui lòng nhập số điện thoại hoặc email để đặt lại mật khẩu!");
      return;
    }

    if (phone && !/^0\d{9}$/.test(phone)) {
      alert("Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0).");
      phoneInput.focus();
      return;
    }

    if (!pass || !repass) return alert("Vui lòng nhập đầy đủ mật khẩu.");
    if (pass.length < 6) return alert("Mật khẩu tối thiểu 6 ký tự.");
    if (pass !== repass) return alert("Mật khẩu xác nhận không khớp.");

    // ==== CẬP NHẬT MẬT KHẨU ====
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let index = -1;

    if (phone) {
      index = users.findIndex(u => u.phone === phone);
    } else if (email) {
      index = users.findIndex(u => u.email === email);
    }

    if (index === -1) {
      alert("Không tìm thấy tài khoản khớp với thông tin bạn nhập!");
      return;
    }

    // Cập nhật mật khẩu
    users[index].password = pass;
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Mật khẩu đã được đổi thành công!");
    form.reset();

    if (strengthText) {
      strengthText.textContent = "Độ bảo mật: Không";
      strengthText.style.color = "";
    }

    // Quay lại trang đăng nhập
    window.location.href = "login.html";
  });
});
