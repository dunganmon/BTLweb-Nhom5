const form = document.querySelector(".form_main");
const hoInput = document.getElementById("ho");
const tenInput = document.getElementById("name");
const sdtInput = document.getElementById("sdt");
const mailInput = document.getElementById("mail");
const passInput = document.getElementById("pass");
const confirmPassInput = document.getElementById("xacnhan");
const agreeInput = document.getElementById("agree1");
const securityText = document.getElementById("baomat");

const hoError = document.getElementById("HoError");
const tenError = document.getElementById("TenError");
const phoneError = document.getElementById("PhoneError");
const emailError = document.getElementById("EmailError");
const passwordError = document.getElementById("PasswordError");
const confirmError = document.getElementById("ConfirmError");
const agreeError = document.getElementById("AgreeError");

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

function showError(input, errorDiv, message) {
  errorDiv.textContent = message;
  errorDiv.style.display = "block";
  input.style.border = "1px solid red";
}

function clearError(input, errorDiv) {
  errorDiv.style.display = "none";
  input.style.border = "1px solid #ccc";
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
  let ok = true;

  [hoError, tenError, phoneError, emailError, passwordError, confirmError, agreeError]
    .forEach(div => div.style.display = "none");

  if (!hoInput.value.trim()) { showError(hoInput, hoError, "Họ không được để trống"); ok = false; }
  if (!tenInput.value.trim()) { showError(tenInput, tenError, "Tên không được để trống"); ok = false; }
  if (!sdtInput.value.trim()) { showError(sdtInput, phoneError, "Số điện thoại không được để trống"); ok = false; }
  if (!mailInput.value.trim()) { showError(mailInput, emailError, "Email không được để trống"); ok = false; }
  if (!passInput.value) { showError(passInput, passwordError, "Mật khẩu không được để trống"); ok = false; }
  if (!confirmPassInput.value) { showError(confirmPassInput, confirmError, "Xác nhận mật khẩu không được để trống"); ok = false; }
  if (!agreeInput.checked) { agreeError.style.display = "block"; ok = false; }


  if (mailInput.value.trim() && !isValidEmail(mailInput.value.trim())) {
    showError(mailInput, emailError, "Email không hợp lệ (vd: ten@example.com)");
    ok = false;
  }

  if (sdtInput.value.trim() && !isValidPhone(sdtInput.value.trim())) {
    showError(sdtInput, phoneError, "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0");
    ok = false;
  }

  if (passInput.value && confirmPassInput.value && passInput.value !== confirmPassInput.value) {
    showError(confirmPassInput, confirmError, "Mật khẩu xác nhận không trùng khớp");
    ok = false;
  }

  const level = checkPasswordStrength(passInput.value);
  if (level === "Yếu") {
    showError(passInput, passwordError, "Mật khẩu quá yếu (≥8 ký tự, gồm chữ hoa, chữ thường, số/ký tự đặc biệt)");
    ok = false;
  }

  if (!ok) return;

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

  alert(`${tenInput.value.trim()} đăng ký thành công 🎉`);
  window.location.href = "/pages/login.html";

  form.reset();
  securityText.textContent = "Độ bảo mật: Không";
  securityText.style.color = "#333";
});