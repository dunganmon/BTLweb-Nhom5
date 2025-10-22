const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let index = 0;
let interval;

slidesContainer.appendChild(slides[0].cloneNode(true));
slidesContainer.insertBefore(slides[slides.length - 1].cloneNode(true), slides[0]);

slidesContainer.style.transform = 'translateX(-100%)';

function moveSlide(n, transition = true) {
  slidesContainer.style.transition = transition ? 'transform 0.7s ease-in-out' : 'none';
  slidesContainer.style.transform = `translateX(-${(n + 1) * 100}%)`;
  
  dots.forEach((dot, i) => dot.classList.toggle("active", i === n));
}

function nextSlide() {
  index++;
  moveSlide(index);
  
  if (index === slides.length) {
    setTimeout(() => {
      index = 0;
      moveSlide(0, false);
    }, 700);
  }
}

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    clearInterval(interval);
    index = i;
    moveSlide(index);
    interval = setInterval(nextSlide, 3000);
  });
});

interval = setInterval(nextSlide, 3000);

