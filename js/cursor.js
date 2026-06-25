(function () {
  "use strict";

  if (window.matchMedia("(pointer: coarse)").matches) return;

  const dot  = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverEls = document.querySelectorAll(
    "a, button, .cert-card, .project-card, .service-card, .skill-chip, .theme-toggle, .hamburger"
  );
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      dot.style.transform  = "translate(-50%, -50%) scale(0.4)";
      ring.style.width     = "50px";
      ring.style.height    = "50px";
      ring.style.opacity   = "0.7";
      ring.style.borderColor = "var(--accent)";
    });
    el.addEventListener("mouseleave", () => {
      dot.style.transform  = "translate(-50%, -50%) scale(1)";
      ring.style.width     = "34px";
      ring.style.height    = "34px";
      ring.style.opacity   = "0.45";
      ring.style.borderColor = "var(--accent)";
    });
  });

  document.addEventListener("mouseleave", () => {
    dot.style.opacity  = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity  = "1";
    ring.style.opacity = "0.45";
  });

})();
