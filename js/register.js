const form = document.querySelector(".form_main");
const hoInput = document.getElementById("ho");
const tenInput = document.getElementById("name");
const sdtInput = document.getElementById("sdt");
const mailInput = document.getElementById("mail");
const passInput = document.getElementById("pass");
const confirmPassInput = document.getElementById("xacnhan");
const agreeInput = document.getElementById("agree1");
const securityText = document.getElementById("baomat");

function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return "Yếu";
  if (strength === 3) return "Trung bình";
  return "Mạnh";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
  return /^0\d{9}$/.test(phone);
}

passInput.addEventListener("input", () => {
  const value = passInput.value;
  if (!value) {
    securityText.textContent = "Độ bảo mật: Không";
    securityText.style.color = "#333";
    return;
  }
  const strength = checkPasswordStrength(value);
  securityText.textContent = "Độ bảo mật: " + strength;
  securityText.style.color =
    strength === "Yếu" ? "red" : strength === "Trung bình" ? "orange" : "green";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!hoInput.value.trim()) return alert("Họ không được để trống");
  if (!tenInput.value.trim()) return alert("Tên không được để trống");
  if (!sdtInput.value.trim()) return alert("Số điện thoại không được để trống");
  if (!isValidPhone(sdtInput.value.trim())) return alert("❌ Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0");

  if (!mailInput.value.trim()) return alert("Email không được để trống");
  if (!isValidEmail(mailInput.value.trim())) return alert("Email không hợp lệ (vd: ten@example.com)");

  if (!passInput.value) return alert("Mật khẩu không được để trống");
  if (!confirmPassInput.value) return alert("Xác nhận mật khẩu không được để trống");
  if (passInput.value !== confirmPassInput.value) return alert("Mật khẩu xác nhận không trùng khớp");

  const level = checkPasswordStrength(passInput.value);
  if (level === "Yếu")
    return alert("Mật khẩu quá yếu (≥8 ký tự, gồm chữ hoa, chữ thường, số/ký tự đặc biệt)");

  if (!agreeInput.checked) return alert("Bạn cần đồng ý với chính sách của chúng tôi");


  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(u => u.email === mailInput.value.trim() || u.phone === sdtInput.value.trim())) {
    alert("Email hoặc số điện thoại đã được đăng ký!");
    return;
  }

  const newUser = {
    ho: hoInput.value.trim(),
    name: tenInput.value.trim(),
    phone: sdtInput.value.trim(),
    email: mailInput.value.trim(),
    password: passInput.value,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert(`🎉 ${tenInput.value.trim()} đăng ký thành công!`);
  form.reset();
  securityText.textContent = "Độ bảo mật: Không";
  securityText.style.color = "#333";

  window.location.href = "login.html";
});
