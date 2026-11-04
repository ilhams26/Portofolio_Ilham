(function () {
  "use strict";

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
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  // Apply ripple to all buttons
  const rippleButtons = document.querySelectorAll(
    '.btn-primary, .btn-secondary, .btn-contact, .overlay-btn, .cert-preview-btn, button[type="submit"]'
  );
  
  rippleButtons.forEach(button => {
    button.addEventListener('click', createRipple);
  });

  /* ===== SMOOTH SCROLL WITH ENHANCED ANIMATION ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip empty or placeholder anchors
      if (href === '#' || href === '#!') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      // Smooth scroll with offset for fixed navbar
      const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ===== TIMELINE CARD REVEAL ON SCROLL ===== */
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.timeline-card').forEach((card) => {
    timelineObserver.observe(card);
  });

  /* ===== ENHANCED FORM VALIDATION & ANIMATIONS ===== */
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
  
  formInputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
    
    // Add shake animation on invalid input
    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      this.classList.add('shake');
      setTimeout(() => {
        this.classList.remove('shake');
      }, 500);
    });
  });

  /* ===== SKILL CHIP RANDOM FLOAT ANIMATION ===== */
  const skillChips = document.querySelectorAll('.skill-chip');
  
  skillChips.forEach((chip, index) => {
    chip.style.animationDelay = `${index * 0.1}s`;
    
    chip.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    chip.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });

  /* ===== PROJECT CARD TILT ENHANCEMENT ===== */
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mouseenter', function() {
      this.style.transformStyle = 'preserve-3d';
    });
  });

  /* ===== SMOOTH NAVBAR HIDE/SHOW ON SCROLL ===== */
  let lastScrollY = window.scrollY;
  let ticking = false;
  const navbar = document.querySelector('.navbar');
  
  function updateNavbar() {
    const scrollY = window.scrollY;
    
    if (scrollY > lastScrollY && scrollY > 100) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }
  
  // Add smooth transition to navbar
  if (navbar) {
    navbar.style.transition = 'transform 0.3s ease';
    window.addEventListener('scroll', requestTick, { passive: true });
  }

  /* ===== ENHANCED STATS COUNTER WITH EASING ===== */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /* ===== LAZY LOAD IMAGES WITH FADE-IN ===== */
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.5s ease';
          
          img.onload = () => {
            img.style.opacity = '1';
          };
          
          imageObserver.unobserve(img);
        }
      });
    },
    { rootMargin: '50px' }
  );

  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });

  /* ===== ENHANCED HOVER SOUND EFFECT (Optional) ===== */
  // Subtle hover feedback
  const interactiveElements = document.querySelectorAll(
    'a, button, .project-card, .service-card, .cert-card, .skill-chip'
  );
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', function() {
      // Add subtle visual feedback
      this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });

  /* ===== PARALLAX MOUSE MOVE ON HERO ===== */
  const hero = document.querySelector('#home');
  
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      const floatBadges = hero.querySelectorAll('.float-badge');
      floatBadges.forEach((badge, index) => {
        const speed = (index + 1) * 5;
        const x = xPercent * speed;
        const y = yPercent * speed;
        
        badge.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
    
    hero.addEventListener('mouseleave', () => {
      const floatBadges = hero.querySelectorAll('.float-badge');
      floatBadges.forEach((badge) => {
        badge.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ===== SECTION VISIBILITY TRACKING FOR NAV ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );
  
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  /* ===== PERFORMANCE MONITORING ===== */
  if (window.performance && window.performance.mark) {
    window.performance.mark('micro-interactions-loaded');
  }

})();
