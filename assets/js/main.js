document.getElementById("year").textContent = new Date().getFullYear();

const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
const mobileBackdrop = document.getElementById("mobile-menu-backdrop");
const mobileMedia = window.matchMedia("(max-width: 760px)");
const pdfModal = document.getElementById("pdf-modal");
const pdfFrame = document.getElementById("pdf-preview-frame");
const pdfModalTitle = document.getElementById("pdf-modal-title");
const pdfModalOpen = document.getElementById("pdf-modal-open");
let lastFocusedElement = null;

const syncTopbar = () => {
  if (window.scrollY > 8) {
    topbar.classList.add("scrolled");
  } else {
    topbar.classList.remove("scrolled");
  }
};

const forceCloseMobileMenu = () => {
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("is-open");
  mobileBackdrop.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

const closeMobileMenu = () => {
  if (!mobileMedia.matches) return;
  forceCloseMobileMenu();
};

menuToggle.addEventListener("click", () => {
  if (!mobileMedia.matches) return;
  const isOpen = menuToggle.classList.toggle("is-open");
  mobileNav.classList.toggle("is-open", isOpen);
  mobileBackdrop.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

mobileBackdrop.addEventListener("click", closeMobileMenu);

mobileMedia.addEventListener("change", () => {
  if (!mobileMedia.matches) {
    forceCloseMobileMenu();
  }
});

const closePdfModal = () => {
  if (!pdfModal || pdfModal.hidden) return;

  pdfModal.hidden = true;
  pdfFrame.removeAttribute("src");
  document.body.classList.remove("modal-open");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
};

const openPdfModal = (link) => {
  if (!pdfModal) return;

  const pdfUrl = link.getAttribute("href");
  const pdfTitle = link.dataset.pdfTitle || "Presentation PDF";

  lastFocusedElement = document.activeElement;
  forceCloseMobileMenu();
  pdfModalTitle.textContent = pdfTitle;
  pdfModalOpen.href = pdfUrl;
  pdfFrame.src = pdfUrl;
  pdfFrame.title = `${pdfTitle} preview`;
  pdfModal.hidden = false;
  document.body.classList.add("modal-open");
  pdfModal.querySelector(".pdf-modal-close").focus();
};

document.querySelectorAll("[data-pdf-preview]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openPdfModal(link);
  });
});

document.querySelectorAll("[data-pdf-close]").forEach((control) => {
  control.addEventListener("click", closePdfModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (pdfModal && !pdfModal.hidden) {
    closePdfModal();
  } else {
    closeMobileMenu();
  }
});

window.addEventListener("scroll", syncTopbar, { passive: true });
syncTopbar();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el, idx) => {
  el.style.transitionDelay = `${idx * 45}ms`;
  observer.observe(el);
});
