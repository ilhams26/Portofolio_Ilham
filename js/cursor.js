(function () {
  "use strict";

  if (window.matchMedia("(pointer: coarse)").matches) return;

  const dot  = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;
  
  // Magnetic cursor state
  let magneticTarget = null;
  let magneticX = 0, magneticY = 0;
  
  // Particle trail system
  const particles = [];
  const maxParticles = 20;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Apply magnetic effect if hovering over interactive element
    if (magneticTarget) {
      const rect = magneticTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
      );
      
      const maxDistance = Math.max(rect.width, rect.height) / 2 + 50;
      
      if (distance < maxDistance) {
        const strength = 1 - (distance / maxDistance);
        magneticX = centerX + (mouseX - centerX) * 0.3;
        magneticY = centerY + (mouseY - centerY) * 0.3;
        
        // Apply magnetic pull to element
        const pullX = (mouseX - centerX) * strength * 0.3;
        const pullY = (mouseY - centerY) * strength * 0.3;
        magneticTarget.style.transform = `translate(${pullX}px, ${pullY}px)`;
      } else {
        magneticX = mouseX;
        magneticY = mouseY;
        magneticTarget.style.transform = 'translate(0, 0)';
      }
    } else {
      magneticX = mouseX;
      magneticY = mouseY;
    }
    
    dot.style.left = magneticX + "px";
    dot.style.top  = magneticY + "px";
    
    // Create particle trail
    if (Math.random() < 0.3) {
      createParticle(magneticX, magneticY);
    }
  });

  function createParticle(x, y) {
    if (particles.length >= maxParticles) {
      const oldParticle = particles.shift();
      if (oldParticle && oldParticle.element.parentNode) {
        oldParticle.element.parentNode.removeChild(oldParticle.element);
      }
    }
    
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 4px;
      height: 4px;
      background: var(--accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9997;
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
      box-shadow: 0 0 10px var(--accent-glow);
    `;
    
    document.body.appendChild(particle);
    
    const particleData = { element: particle, life: 1 };
    particles.push(particleData);
    
    // Animate particle
    let frame = 0;
    const animate = () => {
      frame++;
      particleData.life -= 0.02;
      
      if (particleData.life <= 0) {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
        const index = particles.indexOf(particleData);
        if (index > -1) particles.splice(index, 1);
        return;
      }
      
      const scale = particleData.life * 0.8;
      particle.style.opacity = particleData.life * 0.6;
      particle.style.transform = `translate(-50%, -50%) scale(${scale})`;
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }

  function animateRing() {
    ringX += (magneticX - ringX) * 0.14;
    ringY += (magneticY - ringY) * 0.14;
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
      magneticTarget = el;
      el.style.transition = 'transform 0.3s ease';
      
      dot.style.transform  = "translate(-50%, -50%) scale(0.4)";
      ring.style.width     = "50px";
      ring.style.height    = "50px";
      ring.style.opacity   = "0.7";
      ring.style.borderColor = "var(--accent)";
    });
    
    el.addEventListener("mouseleave", () => {
      magneticTarget = null;
      el.style.transform = 'translate(0, 0)';
      
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
