window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docH) * 100;
  document.getElementById("scroll-line").style.width = pct + "%";
  updateActiveNav(scrollTop);

  if (typeof revealElements === "function") {
    revealElements();
  }
});

function updateActiveNav(scrollTop) {
  const sections = [
    "home",
    "about",
    "services",
    "projects",
    "experience",
    "contact",
  ];
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop - 120;
    const bottom = top + el.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollTop >= top && scrollTop < bottom) link.classList.add("active");
      else link.classList.remove("active");
    }
  });
}

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const isDark = html.getAttribute("data-theme") === "dark";
  html.setAttribute("data-theme", isDark ? "light" : "dark");
});

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileNav.classList.toggle("open");
});
mobileNav.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileNav.classList.remove("open");
  });
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});


function handleSubmit(btn) {
  btn.textContent = "✅ Terkirim!";
  btn.style.background = "#22c55e";
  setTimeout(() => {
    btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Kirim Pesan`;
    btn.style.background = "";
  }, 3000);
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
