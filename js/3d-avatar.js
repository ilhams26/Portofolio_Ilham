/**
 * 3d-avatar.js
 * Three.js wireframe icosahedron + particle field around the hero avatar.
 * Runs only if Three.js and the container are available.
 * Pauses rendering when not visible (IntersectionObserver) for performance.
 */

(function () {
  "use strict";

  if (typeof THREE === "undefined") return;

  const container = document.getElementById("canvas-container-3d");
  if (!container) return;

  /* ─── Scene Setup ─── */
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2x for perf
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  /* ─── Wireframe Icosahedron ─── */
  const geoSphere = new THREE.IcosahedronGeometry(1.9, 1);
  const matSphere = new THREE.MeshBasicMaterial({
    color:       0xc084fc,
    wireframe:   true,
    transparent: true,
    opacity:     0.14,
  });
  const sphere = new THREE.Mesh(geoSphere, matSphere);
  scene.add(sphere);

  /* ─── Particle Field ─── */
  const COUNT = 600;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r     = 2.5 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(Math.random() * 2 - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geoParticles = new THREE.BufferGeometry();
  geoParticles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Soft circular sprite
  const spriteCanvas = Object.assign(document.createElement("canvas"), { width: 16, height: 16 });
  const sc = spriteCanvas.getContext("2d");
  const grad = sc.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  sc.fillStyle = grad;
  sc.fillRect(0, 0, 16, 16);

  const matParticles = new THREE.PointsMaterial({
    size:        0.09,
    color:       0x7c5cfc,
    transparent: true,
    opacity:     0.55,
    map:         new THREE.CanvasTexture(spriteCanvas),
    blending:    THREE.AdditiveBlending,
    depthWrite:  false,
  });
  const particles = new THREE.Points(geoParticles, matParticles);
  scene.add(particles);

  /* ─── Mouse Interactivity ─── */
  let targetX = 0, targetY = 0;
  document.addEventListener("mousemove", (e) => {
    targetX = (e.clientX - window.innerWidth  / 2) * 0.0008;
    targetY = (e.clientY - window.innerHeight / 2) * 0.0008;
  }, { passive: true });

  /* ─── Animation ─── */
  let isVisible = true;
  const clock   = new THREE.Clock();

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  });
  observer.observe(container);

  (function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const t = clock.getElapsedTime();

    sphere.rotation.x    += 0.001;
    sphere.rotation.y    += 0.0015;
    particles.rotation.y  = t * 0.018;
    particles.rotation.x  = t * 0.009;

    sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y) * 0.2;
    sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x) * 0.2;

    renderer.render(scene, camera);
  })();

  /* ─── Resize ─── */
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }, { passive: true });

})();
