(function () {
  "use strict";

  /* ===== DETECT TOUCH DEVICE ===== */
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  /* ===== SCROLL REVEAL WITH STAGGER ANIMATION ===== */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          
          // Stagger animation for child elements - reduced delay on mobile
          const staggerDelay = isMobile ? 0.05 : 0.1;
          const children = entry.target.querySelectorAll('.stagger-child, .skill-chip, .service-card, .project-card, .cert-card, .project-tag');
          children.forEach((child, index) => {
            child.style.transitionDelay = `${index * staggerDelay}s`;
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            setTimeout(() => {
              child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, 50);
          });
          
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: isMobile ? 0.05 : 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  /* ===== PARALLAX SCROLLING (Disabled on mobile/touch devices) ===== */
  if (!isMobile && !isTouchDevice && window.matchMedia('(min-width: 769px)').matches) {
    let ticking = false;
    
    function updateParallax() {
      const scrollY = window.scrollY;
      
      // Hero visual parallax
      const heroVisual = document.querySelector('.hero-visual');
      if (heroVisual) {
        const heroOffset = scrollY * 0.5;
        heroVisual.style.transform = `translateY(${heroOffset}px)`;
      }
      
      // Background shapes parallax (avatar rings, badges)
      const parallaxShapes = document.querySelectorAll('.avatar-ring, .float-badge, .about-deco');
      parallaxShapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        const offset = scrollY * speed;
        shape.style.transform = `translateY(${offset}px)`;
      });
      
      ticking = false;
    }
    
    function requestParallaxTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', requestParallaxTick, { passive: true });
  }

  /* ===== SPLIT TEXT ANIMATION FOR HERO H1 ===== */
  function splitTextReveal() {
    const heroH1 = document.querySelector('.hero-text h1');
    if (!heroH1) return;
    
    // Avoid double splitting
    if (heroH1.dataset.splitDone) return;
    heroH1.dataset.splitDone = 'true';
    
    const textElements = heroH1.querySelectorAll('.name, .line2');
    textElements.forEach((element) => {
      const isName = element.classList.contains('name');
      const text = element.textContent.trim();
      element.textContent = '';
      element.style.display = 'inline-block';
      
      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px) scale(0.8)';
        span.style.transition = `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s`;
        if (isName) {
          span.style.background = 'var(--gradient-accent)';
          span.style.webkitBackgroundClip = 'text';
          span.style.backgroundClip = 'text';
          span.style.webkitTextFillColor = 'transparent';
        }
        element.appendChild(span);
        
        // Trigger animation
        requestAnimationFrame(() => {
          setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0) scale(1)';
          }, 50);
        });
      });
    });
  }
  
  // Execute on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', splitTextReveal);
  } else {
    splitTextReveal();
  }

  /* ===== SCROLL PROGRESS INDICATOR ===== */
  function updateScrollProgress() {
    const scrollLine = document.getElementById('scroll-line');
    if (!scrollLine) return;
    
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollLine.style.width = `${scrolled}%`;
  }
  
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ===== SMOOTH PAGE TRANSITIONS ===== */
  function createPageTransition() {
    const transition = document.createElement('div');
    transition.id = 'page-transition';
    transition.style.cssText = `
      position: fixed;
      inset: 0;
      background: var(--bg);
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    `;
    document.body.appendChild(transition);
    return transition;
  }
  
  const pageTransition = createPageTransition();
  
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href === '#!') return;
      
      e.preventDefault();
      
      // Fade in overlay
      pageTransition.style.pointerEvents = 'all';
      pageTransition.style.opacity = '1';
      
      setTimeout(() => {
        // Scroll to target
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Fade out overlay
        setTimeout(() => {
          pageTransition.style.opacity = '0';
          setTimeout(() => {
            pageTransition.style.pointerEvents = 'none';
          }, 400);
        }, 300);
      }, 200);
    });
  });

  /* ===== PROJECT CARD IMAGE PARALLAX ON HOVER (Desktop only) ===== */
  if (!isTouchDevice) {
    document.querySelectorAll('.project-card').forEach((card) => {
      const img = card.querySelector('.project-img img, .project-img-placeholder');
      if (!img) return;
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        const moveX = percentX * 15;
        const moveY = percentY * 15;
        
        img.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1) translate(0, 0)';
      });
    });
  } else {
    // On touch devices, add tap-to-expand effect for project cards
    document.querySelectorAll('.project-card').forEach((card) => {
      let expanded = false;
      card.addEventListener('click', (e) => {
        // Don't prevent default - allow normal link navigation
        if (!expanded) {
          card.style.transform = 'scale(1.02)';
          setTimeout(() => {
            card.style.transform = '';
          }, 200);
        }
      });
    });
  }

  /* ===== TYPEWRITER ===== */
  const texts = [
    "IT Support",
    "Junior Software Developer",
    "UI/UX Enthusiast",
    "Web Development Enthusiast"
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

  /* ===== COUNTER ANIMATION ===== */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        let count = 0;
        const duration = 1200;
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

  /* ===== 3D TILT EFFECT (Desktop only) ===== */
  if (!isTouchDevice) {
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
  }

  /* ===== BUTTON RIPPLE EFFECT ===== */
  function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  document.querySelectorAll(
    '.btn-primary, .btn-secondary, .btn-contact, .overlay-btn, .cert-preview-btn, button[type="submit"]'
  ).forEach(button => {
    button.addEventListener('click', createRipple);
  });

  /* ===== SMART NAVBAR HIDE/SHOW ON SCROLL ===== */
  let lastScrollY = window.scrollY;
  let navTicking = false;
  const navbar = document.querySelector('.navbar');

  function updateNavbar() {
    const scrollY = window.scrollY;
    if (navbar) {
      if (scrollY > lastScrollY && scrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    }
    lastScrollY = scrollY;
    navTicking = false;
  }

  if (navbar) {
    navbar.style.transition = 'transform 0.3s ease, background 0.3s ease, border-color 0.3s ease';
    window.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(updateNavbar);
        navTicking = true;
      }
    }, { passive: true });
  }

  /* ===== ACTIVE NAV LINK ON SCROLL ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ===== FORM INPUT SHAKE ANIMATION ON INVALID ===== */
  document.querySelectorAll('.form-group input, .form-group textarea').forEach((input) => {
    input.addEventListener('invalid', function () {
      this.classList.add('shake');
      setTimeout(() => this.classList.remove('shake'), 500);
    });
  });

})();
