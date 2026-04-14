document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const slides = carousel.querySelectorAll('.program-card');
  const dots = carousel.querySelectorAll('.dot');
  const visibleCount = 3;
  let index = 0;
  const groupCount = Math.ceil(slides.length / visibleCount);

  function showGroup(i) {
    index = (i + groupCount) % groupCount;
    slides.forEach(slide => (slide.style.display = 'none'));
    const start = index * visibleCount;
    for (let j = start; j < start + visibleCount && j < slides.length; j++) {
      slides[j].style.display = 'flex';
    }
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }

  let timer = setInterval(() => {
    showGroup(index + 1);
  }, 5000);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showGroup(i);
      clearInterval(timer);
      timer = setInterval(() => {
        showGroup(index + 1);
      }, 5000);
    });
  });

  showGroup(0);
});

const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const loginIcon = document.getElementById("loginIcon");
const modalOverlay = document.querySelector(".modal-overlay");

function openModal() {
  container.classList.add("active");
  container.style.display = "block";
  modalOverlay.style.display = "block";
}
function closeModal() {
  container.classList.remove("active");
  container.style.display = "none";
  modalOverlay.style.display = "none";
}
loginIcon.addEventListener("click", openModal);
loginIcon.parentElement.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openModal();
});
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
  modalOverlay.style.display = "block";
});
loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
  modalOverlay.style.display = "block";
});
modalOverlay.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    document.body.classList.add("scrolled");
  } else {
    document.body.classList.remove("scrolled");
  }
});
