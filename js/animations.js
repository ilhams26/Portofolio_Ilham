// ===== SCROLL REVEAL =====
function revealElements() {
  document.querySelectorAll(".reveal").forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) el.classList.add("visible");
  });
}
revealElements();

// ===== TYPEWRITER =====
const texts = [
  "Ilham Ghazali",
  "Junior Developer",
  "Web Enthusiast",
  "UI/UX Learner",
  "Problem Solver",
];
let tIdx = 0,
  cIdx = 0,
  isDeleting = false;
const tEl = document.querySelector(".typewriter-text");
function typeWriter() {
  const current = texts[tIdx];
  if (!isDeleting) {
    tEl.textContent = current.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === current.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    tEl.textContent = current.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      isDeleting = false;
      tIdx = (tIdx + 1) % texts.length;
    }
  }
  setTimeout(typeWriter, isDeleting ? 60 : 100);
}
typeWriter();

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"));
    let count = 0;
    const step = target / 50;
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        el.textContent = target + "+";
        clearInterval(interval);
      } else el.textContent = Math.floor(count) + "+";
    }, 40);
  });
}
setTimeout(animateCounters, 800);

// ===== 3D TILT EFFECT =====
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2,
      cy = rect.height / 2;
    const rx2 = ((y - cy) / cy) * -8;
    const ry2 = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rx2}deg) rotateY(${ry2}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  });
});
