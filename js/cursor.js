// ===== CUSTOM CURSOR =====
const cursorEl = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});
function animCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cursorEl.style.left = mx + "px";
  cursorEl.style.top = my + "px";
  cursorRing.style.left = rx + "px";
  cursorRing.style.top = ry + "px";
  requestAnimationFrame(animCursor);
}
animCursor();
document
  .querySelectorAll("a,button,.service-card,.project-card,.social-link")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorEl.style.width = "20px";
      cursorEl.style.height = "20px";
      cursorRing.style.width = "56px";
      cursorRing.style.height = "56px";
    });
    el.addEventListener("mouseleave", () => {
      cursorEl.style.width = "12px";
      cursorEl.style.height = "12px";
      cursorRing.style.width = "36px";
      cursorRing.style.height = "36px";
    });
  });
