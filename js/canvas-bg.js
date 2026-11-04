(function () {
  "use strict";

  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W, H, particles = [], animId;
  let mouseX = -1000, mouseY = -1000;
  let gradientOffset = 0;

  // Detect mobile device
  const isMobile = window.innerWidth <= 768;

  const CONFIG = {
    count:      isMobile ? 25 : 55,  // Reduced particle count on mobile
    maxRadius:  2.2,
    speed:      0.35,
    connectDist: 130,
    attractRadius: 180,
    attractStrength: 0.02,
    color:      "124, 92, 252",
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r:  Math.random() * CONFIG.maxRadius + 0.5,
      o:  Math.random() * 0.5 + 0.2,
    };
  }

  function init() {
    particles = [];
    // Update particle count based on current width
    const currentCount = window.innerWidth <= 768 ? 25 : 55;
    for (let i = 0; i < currentCount; i++) particles.push(createParticle());
  }

  // Mouse tracking with passive listener
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Create animated gradient mesh background
  function drawGradientMesh() {
    gradientOffset += 0.5;
    
    // Create multiple radial gradients for mesh effect
    const gradient1 = ctx.createRadialGradient(
      W * 0.2 + Math.sin(gradientOffset * 0.001) * 100,
      H * 0.3 + Math.cos(gradientOffset * 0.002) * 100,
      0,
      W * 0.2,
      H * 0.3,
      W * 0.6
    );
    gradient1.addColorStop(0, `rgba(124, 92, 252, 0.03)`);
    gradient1.addColorStop(1, 'transparent');
    
    const gradient2 = ctx.createRadialGradient(
      W * 0.8 + Math.cos(gradientOffset * 0.0015) * 100,
      H * 0.7 + Math.sin(gradientOffset * 0.0018) * 100,
      0,
      W * 0.8,
      H * 0.7,
      W * 0.5
    );
    gradient2.addColorStop(0, `rgba(160, 92, 252, 0.03)`);
    gradient2.addColorStop(1, 'transparent');
    
    const gradient3 = ctx.createRadialGradient(
      W * 0.5 + Math.sin(gradientOffset * 0.002) * 80,
      H * 0.5 + Math.cos(gradientOffset * 0.0025) * 80,
      0,
      W * 0.5,
      H * 0.5,
      W * 0.4
    );
    gradient3.addColorStop(0, `rgba(140, 110, 252, 0.02)`);
    gradient3.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = gradient3;
    ctx.fillRect(0, 0, W, H);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    // Draw animated gradient mesh
    drawGradientMesh();

    particles.forEach((p) => {
      // Mouse attraction
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < CONFIG.attractRadius) {
        const force = (1 - distance / CONFIG.attractRadius) * CONFIG.attractStrength;
        p.vx += dx * force;
        p.vy += dy * force;
      }
      
      // Apply velocity damping
      p.vx *= 0.99;
      p.vy *= 0.99;
      
      // Ensure minimum speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed < CONFIG.speed * 0.5) {
        const angle = Math.random() * Math.PI * 2;
        p.vx += Math.cos(angle) * 0.01;
        p.vy += Math.sin(angle) * 0.01;
      }
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      
      // Keep within bounds
      p.x = Math.max(0, Math.min(W, p.x));
      p.y = Math.max(0, Math.min(H, p.y));

      // Enhanced glow effect based on proximity to mouse
      let glowIntensity = p.o;
      if (distance < CONFIG.attractRadius) {
        glowIntensity += (1 - distance / CONFIG.attractRadius) * 0.5;
      }
      
      // Draw particle with glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${CONFIG.color}, ${glowIntensity})`;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color}, ${glowIntensity})`;
      ctx.fill();
      
      // Reset shadow for connections
      ctx.shadowBlur = 0;
    });

    // Draw connections with enhanced visuals
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < CONFIG.connectDist) {
          const alpha = (1 - dist / CONFIG.connectDist) * 0.18;
          
          // Check if connection is near mouse for enhanced glow
          const midX = (particles[i].x + particles[j].x) / 2;
          const midY = (particles[i].y + particles[j].y) / 2;
          const distToMouse = Math.sqrt(
            Math.pow(mouseX - midX, 2) + Math.pow(mouseY - midY, 2)
          );
          
          let lineAlpha = alpha;
          let lineWidth = 0.8;
          
          if (distToMouse < CONFIG.attractRadius) {
            const mouseProximity = 1 - (distToMouse / CONFIG.attractRadius);
            lineAlpha += mouseProximity * 0.3;
            lineWidth += mouseProximity * 1.5;
            
            // Add glow to connections near mouse
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(${CONFIG.color}, ${mouseProximity * 0.5})`;
          }
          
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CONFIG.color}, ${lineAlpha})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
          
          ctx.shadowBlur = 0;
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // Init
  resize();
  init();
  draw();

  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      init();
    }, 150);
  }, { passive: true });
})();
