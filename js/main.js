(function () {
  "use strict";

  //SCROLL PROGRESS BAR
  const scrollLine = document.getElementById("scroll-line");

  function updateScroll() {
    if (!scrollLine) return;
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    scrollLine.style.width = ((scrollTop / docH) * 100).toFixed(2) + "%";
    updateActiveNav(scrollTop);
  }

  window.addEventListener("scroll", updateScroll, { passive: true });

  //ACTIVE NAV HIGHLIGHT
  const NAV_SECTIONS = ["home", "about", "services", "projects", "certificates", "experience", "contact"];

  function updateActiveNav(scrollTop) {
    NAV_SECTIONS.forEach((id) => {
      const el   = document.getElementById(id);
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!el || !link) return;
      const top    = el.offsetTop - 120;
      const bottom = top + el.offsetHeight;
      if (scrollTop >= top && scrollTop < bottom) link.classList.add("active");
      else link.classList.remove("active");
    });
  }

  // THEME TOGGLE
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY   = "portfolio-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark");
  });

  // HAMBURGER MENU
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileNav?.classList.toggle("open");
  });

  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger?.classList.remove("open");
      mobileNav?.classList.remove("open");
    });
  });

  // SMOOTH SCROLL (anchor links)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href   = a.getAttribute("href");
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // CONTACT FORM SUBMIT
  window.handleSubmit = function (btn) {
    const originalHTML = btn.innerHTML;
    btn.textContent    = "✅ Terkirim!";
    btn.style.background = "#22c55e";
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML    = originalHTML;
      btn.style.background = "";
      btn.disabled = false;
    }, 3000);
  };

  // NAV SCROLL EFFECT
  const nav = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) nav?.classList.add("scrolled");
    else nav?.classList.remove("scrolled");
  }, { passive: true });

})();
