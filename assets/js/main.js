document.querySelectorAll(".year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const topbar = document.querySelector(".topbar");
const siteBrand = document.getElementById("site-brand");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
const mobileBackdrop = document.getElementById("mobile-menu-backdrop");
const mobileMedia = window.matchMedia("(max-width: 760px)");
const languageToggle = document.querySelector("[data-language-toggle]");
const languageSwitchMark = document.querySelector(".language-switch-mark");
const languagePanels = document.querySelectorAll("[data-language-panel]");
const navLinks = document.querySelectorAll("[data-nav-section]");
const metaDescription = document.querySelector('meta[name="description"]');
const pdfModal = document.getElementById("pdf-modal");
const pdfFrame = document.getElementById("pdf-preview-frame");
const pdfModalTitle = document.getElementById("pdf-modal-title");
const pdfModalOpen = document.getElementById("pdf-modal-open");
const pdfModalClose = document.querySelector(".pdf-modal-close");
let lastFocusedElement = null;
let currentLanguage = "en";

const languageCopy = {
  en: {
    title: "Gyeongmin Park | Portfolio CV",
    description:
      "Portfolio CV of Gyeongmin Park with education, research, talks, teaching, awards, and professional experience.",
    htmlLang: "en",
    menuLabel: "Toggle navigation menu",
    mobileNavLabel: "Mobile section navigation",
    switchLabel: "View Korean version",
    switchMark: "KO",
    pdfTitle: "Presentation PDF",
    pdfOpen: "Open PDF",
    pdfClose: "Close",
    pdfFrameTitle: "Presentation PDF preview"
  },
  ko: {
    title: "박경민 | 이력서",
    description: "박경민의 학력, 연구, 발표, 교육, 수상 및 경력 정보를 담은 이력서 페이지입니다.",
    htmlLang: "ko",
    menuLabel: "메뉴 열기",
    mobileNavLabel: "모바일 섹션 내비게이션",
    switchLabel: "영어 버전 보기",
    switchMark: "EN",
    pdfTitle: "발표 PDF",
    pdfOpen: "PDF 열기",
    pdfClose: "닫기",
    pdfFrameTitle: "발표 PDF 미리보기"
  }
};

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

const revealLanguagePanel = (language) => {
  const activePanel = document.querySelector(`[data-language-panel="${language}"]`);
  if (!activePanel) return;

  activePanel.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("show");
  });
};

const applyLanguage = (language, options = {}) => {
  const copy = languageCopy[language] || languageCopy.en;
  currentLanguage = languageCopy[language] ? language : "en";

  if (options.closeOverlays) {
    closePdfModal();
    forceCloseMobileMenu();
  }

  document.documentElement.lang = copy.htmlLang;
  document.body.dataset.language = currentLanguage;
  document.title = languageCopy.en.title;
  metaDescription.setAttribute("content", copy.description);
  siteBrand.textContent = "Gyeongmin Park";
  menuToggle.setAttribute("aria-label", copy.menuLabel);
  mobileNav.setAttribute("aria-label", copy.mobileNavLabel);
  languageToggle.setAttribute("aria-label", copy.switchLabel);
  languageToggle.setAttribute("title", copy.switchLabel);
  languageSwitchMark.textContent = copy.switchMark;
  pdfModalTitle.textContent = copy.pdfTitle;
  pdfModalOpen.textContent = copy.pdfOpen;
  pdfModalClose.textContent = copy.pdfClose;
  pdfFrame.title = copy.pdfFrameTitle;

  languagePanels.forEach((panel) => {
    panel.hidden = panel.dataset.languagePanel !== currentLanguage;
  });

  navLinks.forEach((link) => {
    const section = link.dataset.navSection;
    link.setAttribute("href", currentLanguage === "ko" ? `#ko-${section}` : `#${section}`);
  });

  if (options.reveal) {
    revealLanguagePanel(currentLanguage);
  }
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

languageToggle.addEventListener("click", () => {
  const nextLanguage = currentLanguage === "en" ? "ko" : "en";
  applyLanguage(nextLanguage, { closeOverlays: true, reveal: true });
});

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
  pdfFrame.title = `${pdfTitle} ${currentLanguage === "ko" ? "미리보기" : "preview"}`;
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

applyLanguage("en");

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
