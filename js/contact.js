//Form
const form = document.getElementById("contact-form");
if (form) {
  const fields = {
    name: { el: form.querySelector("#name"), msg: "Họ và tên không được để trống" },
    email: { el: form.querySelector("#email"), msg: "Email không hợp lệ", regex: /^\S+@\S+\.\S+$/ },
    phone: { el: form.querySelector("#phone"), msg: "Số điện thoại phải từ 10-11 chữ số", regex: /^[0-9]{10,11}$/ },
    message: { el: form.querySelector("#message"), msg: "Vui lòng nhập nội dung liên hệ" }
  };

  const showError = (el, msg) => {
    let err = el.nextElementSibling;
    if (!err?.classList.contains("error-msg")) {
      err = document.createElement("p");
      err.className = "error-msg";
      el.after(err);
    }
    err.textContent = msg;
  };

  const clearError = el => el.nextElementSibling?.classList.contains("error-msg") && el.nextElementSibling.remove();

  form.onsubmit = e => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(({ el, msg, regex }) => {
      const val = el.value.trim();
      if (!val || (regex && !regex.test(val))) {
        showError(el, msg);
        valid = false;
      } else clearError(el);
    });

    if (valid) {
      alert("🎉 Gửi liên hệ thành công!");
      form.reset();
    }
  };
}
//FAQ
document.querySelectorAll(".faq-header").forEach(header => {
  header.onclick = () => {
    const item = header.parentElement;
    document.querySelectorAll(".faq-item").forEach(i => {
      i.classList.toggle("active", i === item && !i.classList.contains("active"));
    });
  };
});
