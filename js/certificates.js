(function () {
  "use strict";

  const modal    = document.getElementById("cert-modal");
  const backdrop = modal?.querySelector(".cert-modal-backdrop");
  const modalImg = modal?.querySelector(".cert-modal-img");
  const modalH3  = modal?.querySelector(".cert-modal-footer h3");
  const modalP   = modal?.querySelector(".cert-modal-footer p");
  const closeBtn = modal?.querySelector(".cert-modal-close");

  if (!modal) return;

  function openModal(src, title, issuer) {
    if (src && src !== "#") {
      modalImg.src = src;
      modalImg.style.display = "block";
    } else {
      modalImg.style.display = "none";
    }
    modalH3.textContent = title  || "";
    modalP.textContent  = issuer || "";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { modalImg.src = ""; }, 300);
  }

  // Attach open to each cert card
  document.querySelectorAll(".cert-card").forEach((card) => {
    card.addEventListener("click", () => {
      const imgEl   = card.querySelector(".cert-img-wrap img");
      const title   = card.querySelector(".cert-info h4")?.textContent;
      const issuer  = card.querySelector(".cert-issuer")?.textContent;
      const src     = imgEl ? imgEl.src : null;
      openModal(src, title, issuer);
    });
  });

  // Also wire preview button explicitly
  document.querySelectorAll(".cert-preview-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const card    = btn.closest(".cert-card");
      const imgEl   = card?.querySelector(".cert-img-wrap img");
      const title   = card?.querySelector(".cert-info h4")?.textContent;
      const issuer  = card?.querySelector(".cert-issuer")?.textContent;
      openModal(imgEl ? imgEl.src : null, title, issuer);
    });
  });

  // Close
  closeBtn?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

})();
