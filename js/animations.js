(function () {
  "use strict";

  /* Scroll Reveal */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  /* Typewriter */
  const texts = [
    "Junior Developer",
    "Web Enthusiast",
    "UI/UX Learner",
    "Problem Solver",
    "Creative Coder",
  ];

  const tEl = document.querySelector(".typewriter-text");
  if (tEl) {
    let tIdx = 0, cIdx = 0, isDeleting = false;

    function typeWriter() {
      const current = texts[tIdx];
      tEl.textContent = isDeleting
        ? current.substring(0, cIdx - 1)
        : current.substring(0, cIdx + 1);

      isDeleting ? cIdx-- : cIdx++;

      if (!isDeleting && cIdx === current.length) {
        isDeleting = true;
        setTimeout(typeWriter, 1800);
        return;
      }
      if (isDeleting && cIdx === 0) {
        isDeleting = false;
        tIdx = (tIdx + 1) % texts.length;
      }

      setTimeout(typeWriter, isDeleting ? 55 : 95);
    }
    typeWriter();
  }

  /* Counter Animation */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        let count = 0;
        const duration = 1200; // ms
        const step = target / (duration / 16);

        const tick = () => {
          count += step;
          if (count >= target) {
            el.textContent = target + "+";
            return;
          }
          el.textContent = Math.floor(count) + "+";
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => {
    counterObserver.observe(el);
  });

  /* ===== TIMELINE STAR ANIMATION ===== */
  const timeline = document.querySelector(".timeline");
  const star = document.querySelector(".timeline-star");
  
  if (timeline && star) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const timelineRect = timeline.getBoundingClientRect();
      const absoluteTop = timelineRect.top + scrollY;
      const timelineHeight = timeline.offsetHeight;
      
      // Star moves when timeline enters the middle of viewport
      const viewportMiddle = window.innerHeight / 2;
      const startPoint = absoluteTop - viewportMiddle;
      const endPoint = absoluteTop + timelineHeight - viewportMiddle;
      
      let progress = 0;
      if (scrollY >= startPoint && scrollY <= endPoint) {
        progress = (scrollY - startPoint) / (endPoint - startPoint);
      } else if (scrollY > endPoint) {
        progress = 1;
      }
      
      const starTop = progress * timelineHeight;
      star.style.top = `${starTop}px`;
    }, { passive: true });
  }

  /* ===== 3D TILT EFFECT ===== */
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -7;
      const rotY = ((x - cx) / cx) * 7;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
      card.style.transition = "transform 0.5s ease";
    });
    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease";
    });
  });

})();
