
document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll(".news-card");
    const btn = document.getElementById("toggleNewsBtn");
    let expanded = false;

    // Hiện 3 tin đầu tiên lúc đầu
    for (let i = 0; i < 3 && i < cards.length; i++) {
      cards[i].classList.add("visible");
    }

    btn.addEventListener("click", () => {
      expanded = !expanded;

      if (expanded) {
        cards.forEach(card => card.classList.add("visible"));
        btn.textContent = "THU GỌN";
      } else {
        cards.forEach((card, index) => {
          if (index >= 3) card.classList.remove("visible");
        });
        btn.textContent = "XEM THÊM";
      }
    });
});

