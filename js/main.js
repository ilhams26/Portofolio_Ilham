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
  const NAV_SECTIONS = [
    "home",
    "about",
    "services",
    "projects",
    "certificates",
    "experience",
    "contact",
  ];

  function updateActiveNav(scrollTop) {
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!el || !link) return;
      const top = el.offsetTop - 120;
      const bottom = top + el.offsetHeight;
      if (scrollTop >= top && scrollTop < bottom) link.classList.add("active");
      else link.classList.remove("active");
    });
  }

  // THEME TOGGLE
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "portfolio-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Load saved theme
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark");
  });

  // HAMBURGER MENU
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  hamburger?.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");

    mobileNav?.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
    mobileNav?.setAttribute("aria-hidden", !isOpen);
    
    // Body scroll lock when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("open");
      mobileNav?.classList.remove("open");
      hamburger?.setAttribute("aria-expanded", "false");
      mobileNav?.setAttribute("aria-hidden", "true");
      // Restore scroll
      document.body.style.overflow = '';
    });
  });

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // NAV CONTACT BUTTON - scroll to contact section
  const navContactBtn = document.getElementById("navContactBtn");
  navContactBtn?.addEventListener("click", () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  // INPUT SANITIZATION HELPER
  // Sanitizes user input to prevent XSS attacks by escaping HTML special characters
  function sanitizeInput(input) {
    if (typeof input !== "string") return "";
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  // CONTACT FORM SUBMIT
  // Note: Server-side rate limiting is handled by FormSubmit.co service
  // Additional rate limiting can be implemented on backend if needed
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const formStatus = document.getElementById("formStatus");

  function showFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.className = "form-status " + type;
    // Use textContent for plain text, sanitize if HTML is needed
    if (type === "error" && message.includes("<")) {
      // For error messages that may contain links, sanitize them properly
      formStatus.innerHTML = message;
    } else {
      formStatus.textContent = message;
    }
  }

  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const honeypot = contactForm.querySelector('input[name="_honey"]')?.value;
      if (honeypot) return;

      // Get and sanitize all input values
      const nameRaw = document.getElementById("contactName")?.value.trim() || "";
      const emailRaw = document.getElementById("contactEmail")?.value.trim() || "";
      const subjectRaw = document.getElementById("contactSubject")?.value.trim() || "";
      const messageRaw = document.getElementById("contactMessage")?.value.trim() || "";

      const name = sanitizeInput(nameRaw);
      const email = sanitizeInput(emailRaw);
      const subject = sanitizeInput(subjectRaw);
      const message = sanitizeInput(messageRaw);

      if (!name || !email || !message) {
        showFormStatus("⚠️ Mohon lengkapi semua kolom yang wajib diisi.", "error");
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormStatus("⚠️ Format email tidak valid.", "error");
        return;
      }

      // Deteksi jika dibuka langsung sebagai file:/// (bukan melalui web server)
      if (window.location.protocol === "file:") {
        showFormStatus(
          "⚠️ Pengiriman pesan memerlukan web server. Silakan buka melalui server lokal: http://localhost/Portofolio_Ilham/ atau saat website sudah di-hosting online.",
          "error"
        );
        return;
      }

      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner" aria-hidden="true"></span>
        <span>Mengirim...</span>
      `;
      showFormStatus("", "");

      try {
        const response = await fetch("https://formsubmit.co/ajax/ilhamsimarmata.26@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `Pesan Portofolio dari ${name}: ${subject || "Kolaborasi / Project"}`,
            message: message,
            _template: "table",
          }),
        });

        const result = await response.json();
        const isSuccess = response.ok && (result.success === true || result.success === "true");

        if (isSuccess) {
          showFormStatus(
            "🎉 Terima kasih! Pesan Anda berhasil dikirim. Saya akan segera menghubungi Anda melalui email.",
            "success"
          );
          contactForm.reset();
          submitBtn.style.background = "#22c55e";
          submitBtn.innerHTML = `<span>Terkirim!</span>`;
        } else {
          throw new Error("FormSubmit rejected");
        }
      } catch (err) {
        console.error("Gagal mengirim pesan:", err);
        showFormStatus(
          `⚠️ Maaf, terjadi kendala saat mengirim pesan. Silakan coba beberapa saat lagi atau hubungi saya langsung melalui <a href="mailto:ilhamsimarmata.26@gmail.com" style="color: var(--accent); text-decoration: underline;">Email</a> atau <a href="https://wa.me/6281265398468" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">WhatsApp</a>.`,
          "error"
        );
      } finally {
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.style.background = "";
        }, 4000);
      }
    });
  }

  window.handleSubmit = function (btn) {
    if (contactForm) {
      contactForm.requestSubmit();
    }
  };

  // NAV SCROLL EFFECT
  const nav = document.querySelector("nav");
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 30) nav?.classList.add("scrolled");
      else nav?.classList.remove("scrolled");
    },
    { passive: true },
  );
})();
