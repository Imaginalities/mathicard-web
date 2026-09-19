/**
 * =============================================================================
 * MATHICARD - CHƯƠNG TRÌNH ĐIỀU KHIỂN CHÍNH (web/js/main.js)
 * =============================================================================
 * - Kết nối dữ liệu từ content.js vào giao diện người dùng (DOM).
 * - Khởi tạo WebGL Shader nền và hiệu ứng thẻ bài Balatro-inspired.
 * - Quản lý tương tác: Lật bài, Tally điểm số, Modal PDF, Lightbox, Video phụ đề.
 * - Tuân thủ tiêu chuẩn kỹ thuật: Cyclomatic Complexity <= 8 cho mỗi hàm,
 *   tối ưu hiệu năng, responsive và accessibility.
 * =============================================================================
 */

import { siteContent } from "./content.js";
import { SwirlShader } from "./shader.js";

// Trạng thái ứng dụng
const AppState = {
  activeCategory: "all",
  hasScoreRevealed: false,
  activeModal: null
};

/** Khởi động ứng dụng khi DOM sẵn sàng */
document.addEventListener("DOMContentLoaded", () => {
  initShader();
  renderNavigation();
  renderHero();
  renderTrailer();
  renderOverviewPhases();
  renderCardGallery();
  renderReviewSection();
  renderMediaLibrary();
  renderAcademicDocs();
  renderTeamSection();
  renderFooter();
  setupGlobalInteractions();
  setupModals();
  checkInitialHash();
});

function checkInitialHash() {
  const hash = window.location.hash;
  if (!hash) return;

  if (hash === "#card-modal" || hash === "#the-bai-modal") {
    openCardInspectorModal(siteContent.cardGallery.cards[0]);
  } else if (hash === "#danh-gia" || hash === "#review-score") {
    const reviewSection = document.getElementById("danh-gia");
    const reviewCard = document.getElementById("review-flip-card");
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: "instant" });
    }
    if (reviewCard) {
      triggerScoreReveal(reviewCard);
    }
  } else {
    try {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "instant" });
      }
    } catch (e) {
      // Bỏ qua nếu hash không hợp lệ
    }
  }
}

/* =============================================================================
   1. KHỞI TẠO SHADER NỀN
============================================================================= */
function initShader() {
  try {
    new SwirlShader("bg-shader-canvas");
  } catch (err) {
    console.warn("Không thể khởi động WebGL Shader, chuyển sang CSS gradient fallback:", err);
    document.body.classList.add("shader-fallback");
  }
}

/* =============================================================================
   2. THANH ĐIỀU HƯỚNG (NAVBAR)
============================================================================= */
function renderNavigation() {
  const brandLogo = document.getElementById("nav-logo");
  if (brandLogo) {
    brandLogo.src = siteContent.hero.logoImg;
    brandLogo.alt = siteContent.hero.logoAlt;
  }

  const navLinksContainer = document.getElementById("nav-menu-links");
  if (!navLinksContainer) return;

  const links = [
    { href: "#hero", label: "Trang chủ" },
    { href: "#gioi-thieu", label: "Luật chơi" },
    { href: "#cac-loai-the", label: "Bộ thẻ" },
    { href: "#danh-gia", label: "Đánh giá" },
    { href: "#media", label: "Media" },
    { href: "#tai-lieu", label: "Tài liệu BTL" },
    { href: "#nhom", label: "Nhóm 68PM1" }
  ];

  navLinksContainer.innerHTML = links
    .map(
      (link) => `
      <li><a href="${link.href}" class="nav-link">${link.label}</a></li>
    `
    )
    .join("");

  setupMobileMenu();
}

function setupMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu-links");
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggleBtn.innerHTML = isOpen ? "✕" : "☰";
  });

  // Đóng menu khi bấm vào link
  navMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navMenu.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.innerHTML = "☰";
    }
  });
}

/* =============================================================================
   3. HERO SECTION (BANNER & XÒE BÀI TƯƠNG TÁC)
============================================================================= */
function renderHero() {
  const heroBadge = document.getElementById("hero-badge");
  if (heroBadge) heroBadge.textContent = siteContent.hero.badgeText;

  const heroLogo = document.getElementById("hero-logo-img");
  if (heroLogo) {
    heroLogo.src = siteContent.hero.logoImg;
    heroLogo.alt = siteContent.hero.logoAlt;
  }

  const heroSlogan = document.getElementById("hero-slogan");
  if (heroSlogan) heroSlogan.textContent = siteContent.hero.slogan;

  const heroDesc = document.getElementById("hero-desc");
  if (heroDesc) heroDesc.textContent = siteContent.hero.description;

  renderHeroCardFan();
}

function renderHeroCardFan() {
  const fanContainer = document.getElementById("hero-card-fan");
  if (!fanContainer) return;

  const cards = siteContent.hero.fannedCards;
  const total = cards.length;
  const middle = (total - 1) / 2;

  fanContainer.innerHTML = cards
    .map((card, idx) => {
      const offset = idx - middle;
      const rot = offset * 6; // Góc xoay quạt
      const translateY = Math.abs(offset) * 12;
      const delay = (idx * 0.15).toFixed(2);

      return `
        <div class="fanned-card card-wobble" 
             style="--fan-rot: ${rot}deg; --fan-y: ${translateY}px; --wobble-delay: ${delay}s; z-index: ${10 + idx};"
             data-title="${card.title}"
             data-type="${card.type}">
          <div class="card-inner">
            <img src="${card.image}" alt="${card.title}" width="160" height="235" />
            <div class="card-badge">${card.subtitle}</div>
          </div>
        </div>
      `;
    })
    .join("");

  attachCardTiltEffects(".fanned-card");
}

/* =============================================================================
   4. TRAILER SECTION (VIDEO, FALLBACK & PHỤ ĐỀ WEBVTT)
============================================================================= */
function renderTrailer() {
  const title = document.getElementById("trailer-title");
  if (title) title.textContent = siteContent.trailer.sectionTitle;

  const sub = document.getElementById("trailer-sub");
  if (sub) sub.textContent = siteContent.trailer.sectionSubtitle;

  const videoElem = document.getElementById("main-trailer-video");
  const fallbackElem = document.getElementById("trailer-fallback");
  const trackElem = document.getElementById("trailer-subtitles-track");

  if (videoElem) {
    videoElem.poster = siteContent.trailer.posterImg;
    videoElem.src = siteContent.trailer.videoSrc;

    // Thiết lập phụ đề tiếng Việt
    if (trackElem) {
      trackElem.src = siteContent.trailer.trackSrc;
      trackElem.srclang = siteContent.trailer.trackLang;
      trackElem.label = siteContent.trailer.trackLabel;
      trackElem.default = true;
    }

    // Bắt sự kiện lỗi khi file video MP4 chưa được đặt vào thư mục
    videoElem.addEventListener("error", () => {
      handleVideoMissing(videoElem, fallbackElem);
    });

    // Mở video modal khi bấm nút xem
    const watchBtn = document.getElementById("hero-btn-trailer");
    if (watchBtn) {
      watchBtn.addEventListener("click", () => {
        openVideoModal();
      });
    }
  }
}

function handleVideoMissing(videoElem, fallbackElem) {
  if (!videoElem || !fallbackElem) return;
  videoElem.style.display = "none";
  fallbackElem.style.display = "flex";
  fallbackElem.innerHTML = `
    <div class="trailer-poster-art">
      <img src="${siteContent.trailer.posterImg}" alt="Poster trailer Mathicard" class="poster-backdrop" />
      <div class="poster-overlay">
        <span class="pixel-badge">THÔNG BÁO MEDIA</span>
        <h3>${siteContent.trailer.placeholderTitle}</h3>
        <p>${siteContent.trailer.placeholderMessage}</p>
        <span class="sub-info">${siteContent.trailer.durationText}</span>
      </div>
    </div>
  `;
}

function openVideoModal() {
  const modal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video-elem");
  if (!modal || !modalVideo) return;

  modalVideo.src = siteContent.trailer.videoSrc;
  modalVideo.poster = siteContent.trailer.posterImg;

  const track = modalVideo.querySelector("track");
  if (track) {
    track.src = siteContent.trailer.trackSrc;
  }

  openModal(modal);

  modalVideo.play().catch(() => {
    // Tự động dừng nếu trình duyệt chặn autoplay hoặc file chưa có
  });
}

/* =============================================================================
   5. GIỚI THIỆU GAME & 5 GIAI ĐOẠN VÁN ĐẤU (3D FLIP CARDS)
============================================================================= */
function renderOverviewPhases() {
  const pitchElem = document.getElementById("overview-pitch");
  if (pitchElem) pitchElem.textContent = siteContent.overview.pitch;

  const phasesContainer = document.getElementById("phases-grid");
  if (!phasesContainer) return;

  phasesContainer.innerHTML = siteContent.overview.phases
    .map(
      (phase) => `
      <div class="phase-card-wrapper" tabindex="0" role="button" aria-label="Giai đoạn ${phase.id}: ${phase.name}">
        <div class="phase-card flip-card">
          <!-- MẶT TRƯỚC (FRONT) -->
          <div class="card-face card-front">
            <div class="phase-step-badge">BƯỚC ${phase.stepNumber}</div>
            <div class="phase-icon-box">
              <img src="${phase.iconImg}" alt="${phase.iconAlt}" width="140" height="90" loading="lazy" />
            </div>
            <h3 class="phase-name">${phase.name}</h3>
            <span class="phase-sub">${phase.subtitle}</span>
            <p class="phase-brief">${phase.brief}</p>
            <div class="flip-hint"><span>↻ Bấm để xem chi tiết</span></div>
          </div>
          <!-- MẶT SAU (BACK) -->
          <div class="card-face card-back">
            <div class="phase-step-badge back-badge">CHI TIẾT BƯỚC ${phase.stepNumber}</div>
            <h4 class="back-title">${phase.name}</h4>
            <p class="phase-detail">${phase.detail}</p>
            <div class="flip-hint"><span>↺ Bấm để lật lại</span></div>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  // Tương tác lật thẻ khi bấm chuột hoặc Enter/Space
  phasesContainer.querySelectorAll(".phase-card-wrapper").forEach((wrapper) => {
    const flipCard = wrapper.querySelector(".flip-card");
    const toggleFlip = () => flipCard.classList.toggle("flipped");

    wrapper.addEventListener("click", toggleFlip);
    wrapper.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
    });
  });

  attachCardTiltEffects(".phase-card");
}

/* =============================================================================
   6. BỘ SƯU TẬP THẺ BÀI (GALLERY TABS & INSPECTOR MODAL)
============================================================================= */
function renderCardGallery() {
  renderGalleryTabs();
  renderGalleryItems();
}

function renderGalleryTabs() {
  const tabsContainer = document.getElementById("gallery-filter-tabs");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = siteContent.cardGallery.categories
    .map(
      (cat) => `
      <button class="filter-tab-btn ${cat.key === AppState.activeCategory ? "active" : ""}" 
              data-category="${cat.key}">
        ${cat.label}
      </button>
    `
    )
    .join("");

  tabsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-tab-btn");
    if (!btn) return;

    tabsContainer.querySelectorAll(".filter-tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    AppState.activeCategory = btn.dataset.category;
    renderGalleryItems();
  });
}

function renderGalleryItems() {
  const grid = document.getElementById("gallery-cards-grid");
  if (!grid) return;

  const filteredCards = siteContent.cardGallery.cards.filter((card) => {
    if (AppState.activeCategory === "all") return true;
    return card.category === AppState.activeCategory;
  });

  grid.innerHTML = filteredCards
    .map((card, idx) => {
      const delay = ((idx % 6) * 0.12).toFixed(2);
      return `
      <article class="gallery-card card-wobble" 
               style="--wobble-delay: ${delay}s;" 
               tabindex="0" 
               role="button"
               data-card-id="${card.id}">
        <div class="card-item-inner">
          <div class="card-rarity-badge ${card.category}">${card.rarity}</div>
          <div class="card-image-wrap">
            <img src="${card.image}" alt="${card.name}" width="200" height="290" loading="lazy" />
          </div>
          <div class="card-info">
            <h4 class="card-title">${card.name}</h4>
            <span class="card-tag">${card.tag}</span>
            <p class="card-desc">${card.desc}</p>
          </div>
        </div>
      </article>
    `;
    })
    .join("");

  // Sự kiện click/Enter mở modal xem chi tiết
  grid.querySelectorAll(".gallery-card").forEach((elem) => {
    const cardId = elem.dataset.cardId;
    const cardData = siteContent.cardGallery.cards.find((c) => c.id === cardId);

    const onSelect = () => {
      elem.classList.add("card-pop");
      setTimeout(() => elem.classList.remove("card-pop"), 400);
      openCardInspectorModal(cardData);
    };

    elem.addEventListener("click", onSelect);
    elem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect();
      }
    });
  });

  attachCardTiltEffects(".gallery-card");
}

function openCardInspectorModal(card) {
  if (!card) return;
  const modal = document.getElementById("card-modal");
  const modalBody = document.getElementById("card-modal-content");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-card-display">
      <img src="${card.image}" alt="${card.name}" class="modal-card-img" />
    </div>
    <div class="modal-card-details">
      <div class="modal-rarity-tag ${card.category}">${card.rarity} · ${card.tag}</div>
      <h2 class="modal-card-heading">${card.name}</h2>
      <div class="modal-card-meta">
        <span>Phân loại: <strong>${card.category.toUpperCase()}</strong></span>
        <span>Mã định danh: <strong>#${card.id}</strong></span>
      </div>
      <div class="modal-card-desc-box">
        <label>HIỆU ỨNG & CƠ CHẾ:</label>
        <p>${card.desc}</p>
      </div>
      <div class="modal-card-tip">
        <span>💡 Mẹo chiến thuật: Sử dụng thẻ này trong các vòng đấu then chốt để đột phá điểm số!</span>
      </div>
    </div>
  `;

  openModal(modal);
}

/* =============================================================================
   7. ĐÁNH GIÁ (REVIEW CARD FLIP, SCORE TALLY & SCREEN SHAKE)
============================================================================= */
function renderReviewSection() {
  const title = document.getElementById("review-title");
  if (title) title.textContent = siteContent.review.sectionTitle;

  const quote = document.getElementById("review-quote");
  if (quote) quote.textContent = `"${siteContent.review.quote}"`;

  renderReviewCriteria();
  renderReviewProsCons();
  setupReviewScrollObserver();
}

function renderReviewCriteria() {
  const container = document.getElementById("review-criteria-bars");
  if (!container) return;

  container.innerHTML = siteContent.review.subScores
    .map(
      (sub) => `
      <div class="criteria-row">
        <div class="criteria-info">
          <span class="criteria-label">${sub.label}</span>
          <span class="criteria-score">${sub.score.toFixed(1)} / 10</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="--target-width: ${sub.percent}%;"></div>
        </div>
      </div>
    `
    )
    .join("");
}

function renderReviewProsCons() {
  const prosList = document.getElementById("review-pros");
  if (prosList) {
    prosList.innerHTML = siteContent.review.pros
      .map((pro) => `<li><span class="bullet-pro">✔</span> ${pro}</li>`)
      .join("");
  }

  const consList = document.getElementById("review-cons");
  if (consList) {
    consList.innerHTML = siteContent.review.cons
      .map((con) => `<li><span class="bullet-con">✖</span> ${con}</li>`)
      .join("");
  }
}

function setupReviewScrollObserver() {
  const reviewCard = document.getElementById("review-flip-card");
  if (!reviewCard || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !AppState.hasScoreRevealed) {
          AppState.hasScoreRevealed = true;
          triggerScoreReveal(reviewCard);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(reviewCard);

  // Cho phép bấm trực tiếp vào thẻ úp để lật thủ công
  reviewCard.addEventListener("click", () => {
    if (!reviewCard.classList.contains("revealed")) {
      triggerScoreReveal(reviewCard);
    }
  });
}

function triggerScoreReveal(reviewCard) {
  reviewCard.classList.add("revealed");

  // Đếm số điểm (Tally counter)
  const scoreNumberElem = document.getElementById("tally-score-number");
  if (!scoreNumberElem) return;

  const targetScore = siteContent.review.overallScore;
  const duration = 1500;
  const startTimestamp = performance.now();

  function animateTally(now) {
    const elapsed = now - startTimestamp;
    const progress = Math.min(elapsed / duration, 1.0);
    // Easing out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentVal = (eased * targetScore).toFixed(1);

    scoreNumberElem.textContent = currentVal;

    if (progress < 1.0) {
      requestAnimationFrame(animateTally);
    } else {
      scoreNumberElem.textContent = targetScore.toFixed(1);
      triggerScreenShake();
      animateRatingBars();
    }
  }

  requestAnimationFrame(animateTally);
}

function triggerScreenShake() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const reviewSection = document.getElementById("danh-gia");
  if (!reviewSection) return;

  reviewSection.classList.add("screen-shake");
  setTimeout(() => {
    reviewSection.classList.remove("screen-shake");
  }, 450);
}

function animateRatingBars() {
  const fills = document.querySelectorAll(".progress-fill");
  fills.forEach((fill) => {
    fill.classList.add("animate");
  });
}

/* =============================================================================
   8. THƯ VIỆN MEDIA & FONT CHỮ THIẾT KẾ
============================================================================= */
function renderMediaLibrary() {
  renderFontShowcase();
  renderMediaImageGrid();
  renderAnimatedGrid();
}

function renderFontShowcase() {
  const fontData = siteContent.media.fontShowcase;

  const alphabetImg = document.getElementById("font-alphabet-img");
  if (alphabetImg) {
    alphabetImg.src = fontData.alphabetImg;
    alphabetImg.alt = fontData.alphabetAlt;
  }

  const conceptNote = document.getElementById("font-concept-note");
  if (conceptNote) conceptNote.textContent = fontData.conceptNote;

  const paletteGrid = document.getElementById("media-palette-grid");
  if (!paletteGrid) return;

  paletteGrid.innerHTML = fontData.paletteSwatches
    .map(
      (swatch) => `
      <div class="swatch-item" role="button" tabindex="0" title="Bấm để sao chép mã màu ${swatch.hex}">
        <div class="swatch-color" style="background-color: ${swatch.hex};"></div>
        <div class="swatch-details">
          <span class="swatch-name">${swatch.name}</span>
          <span class="swatch-hex">${swatch.hex}</span>
          <span class="swatch-role">${swatch.role}</span>
        </div>
      </div>
    `
    )
    .join("");

  // Bấm swatch để sao chép mã màu
  paletteGrid.querySelectorAll(".swatch-item").forEach((item) => {
    item.addEventListener("click", () => {
      const hex = item.querySelector(".swatch-hex").textContent;
      navigator.clipboard.writeText(hex).then(() => {
        item.classList.add("copied");
        setTimeout(() => item.classList.remove("copied"), 1200);
      });
    });
  });
}

function renderMediaImageGrid() {
  const grid = document.getElementById("media-images-grid");
  if (!grid) return;

  grid.innerHTML = siteContent.media.imagesGrid
    .map(
      (img) => `
      <div class="media-thumb-card" tabindex="0" role="button" data-src="${img.src}" data-caption="${img.caption}">
        <div class="thumb-img-wrap">
          <img src="${img.src}" alt="${img.alt}" loading="lazy" />
        </div>
        <div class="thumb-caption">${img.caption}</div>
      </div>
    `
    )
    .join("");

  grid.querySelectorAll(".media-thumb-card").forEach((card) => {
    card.addEventListener("click", () => openLightbox(card.dataset.src, card.dataset.caption));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(card.dataset.src, card.dataset.caption);
      }
    });
  });
}

function renderAnimatedGrid() {
  const grid = document.getElementById("media-animated-grid");
  if (!grid) return;

  grid.innerHTML = siteContent.media.animatedGrid
    .map(
      (gif) => `
      <div class="media-thumb-card gif-card" tabindex="0" role="button" data-src="${gif.src}" data-caption="${gif.caption}">
        <div class="thumb-img-wrap">
          <img src="${gif.src}" alt="${gif.alt}" loading="lazy" />
          <span class="gif-badge">GIF ANIMATION</span>
        </div>
        <div class="thumb-caption">${gif.caption}</div>
      </div>
    `
    )
    .join("");

  grid.querySelectorAll(".media-thumb-card").forEach((card) => {
    card.addEventListener("click", () => openLightbox(card.dataset.src, card.dataset.caption));
  });
}

function openLightbox(src, caption) {
  const modal = document.getElementById("lightbox-modal");
  const imgElem = document.getElementById("lightbox-img");
  const captionElem = document.getElementById("lightbox-caption");
  if (!modal || !imgElem) return;

  imgElem.src = src;
  if (captionElem) captionElem.textContent = caption || "";
  openModal(modal);
}

/* =============================================================================
   9. TÀI LIỆU HỌC THUẬT BTL (DOCUMENTS & MODAL PDF VIEWER)
============================================================================= */
function renderAcademicDocs() {
  const container = document.getElementById("academic-docs-grid");
  if (!container) return;

  container.innerHTML = siteContent.academicDocs.deliverables
    .map((doc) => {
      const isReady = doc.isReady;
      const statusBadge = isReady
        ? `<span class="doc-badge ready">SẴN SÀNG</span>`
        : `<span class="doc-badge pending">ĐANG CẬP NHẬT</span>`;

      // Nút xem PDF (chỉ kích hoạt nếu isReady và có file PDF)
      const previewBtn = isReady && doc.pdfFile
        ? `<button class="pixel-btn btn-secondary btn-view-pdf" data-pdf="${doc.pdfFile}" data-title="${doc.title}">Xem</button>`
        : `<button class="pixel-btn btn-secondary disabled" disabled title="Tài liệu đang được nhóm cập nhật">Xem</button>`;

      // Nút tải file gốc
      const downloadBtn = isReady && doc.downloadFile
        ? `<a href="${doc.downloadFile}" download class="pixel-btn btn-primary">Tải về</a>`
        : `<button class="pixel-btn btn-primary disabled" disabled title="Tài liệu đang được nhóm cập nhật">Tải về</button>`;

      return `
        <article class="doc-card ${isReady ? "" : "doc-pending"}">
          <div class="doc-card-header">
            <span class="doc-tag">${doc.tag}</span>
            ${statusBadge}
          </div>
          <h3 class="doc-title">${doc.title}</h3>
          <p class="doc-scope">${doc.scope}</p>
          <p class="doc-desc">${doc.description}</p>
          <div class="doc-author">
            <span>Tác giả / Phụ trách: <strong>${doc.author}</strong></span>
          </div>
          <div class="doc-actions">
            ${previewBtn}
            ${downloadBtn}
          </div>
        </article>
      `;
    })
    .join("");

  // Bắt sự kiện bấm Xem PDF
  container.querySelectorAll(".btn-view-pdf").forEach((btn) => {
    btn.addEventListener("click", () => {
      openPdfModal(btn.dataset.pdf, btn.dataset.title);
    });
  });
}

function openPdfModal(pdfUrl, title) {
  const modal = document.getElementById("pdf-modal");
  const iframe = document.getElementById("pdf-modal-iframe");
  const modalTitle = document.getElementById("pdf-modal-title");
  if (!modal || !iframe) return;

  iframe.src = pdfUrl;
  if (modalTitle) modalTitle.textContent = title || "Xem Tài Liệu PDF";
  openModal(modal);
}

/* =============================================================================
   10. THÔNG TIN NHÓM & PHÂN CÔNG
============================================================================= */
function renderTeamSection() {
  const classInfo = document.getElementById("team-class-info");
  if (classInfo) classInfo.textContent = siteContent.team.classInfo;

  const tableBody = document.getElementById("team-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = siteContent.team.members
    .map(
      (m) => `
      <tr>
        <td class="col-stt">${m.stt}</td>
        <td class="col-name"><strong>${m.name}</strong></td>
        <td class="col-role"><span class="role-pill">${m.role}</span></td>
        <td class="col-tasks">${m.tasks}</td>
        <td class="col-status"><span class="status-badge ${m.status.includes('Hoàn thành') ? 'done' : 'progress'}">${m.status}</span></td>
      </tr>
    `
    )
    .join("");
}

/* =============================================================================
   11. FOOTER
============================================================================= */
function renderFooter() {
  const copyright = document.getElementById("footer-copyright");
  if (copyright) copyright.textContent = siteContent.footer.copyright;

  const credit = document.getElementById("footer-credit");
  if (credit) credit.textContent = siteContent.footer.credit;
}

/* =============================================================================
   12. TƯƠNG TÁC TOÀN CỤC & MODAL DIALOGS
============================================================================= */
function setupGlobalInteractions() {
  // Cuộn mượt cho tất cả liên kết neo (#)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function setupModals() {
  // Bấm nút đóng (x) hoặc click ra ngoài vùng backdrop
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    const closeBtn = backdrop.querySelector(".modal-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal(backdrop));
    }

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });

  // Phím Escape đóng modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && AppState.activeModal) {
      closeModal(AppState.activeModal);
    }
  });
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  AppState.activeModal = modal;
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  // Dừng video nếu đang chạy trong modal
  const video = modal.querySelector("video");
  if (video) video.pause();

  // Reset iframe src để giải phóng tài nguyên
  const iframe = modal.querySelector("iframe");
  if (iframe) iframe.src = "about:blank";

  AppState.activeModal = null;
}

/**
 * Hiệu ứng 3D Card Tilt theo vị trí con trỏ chuột
 * Giúp tạo cảm giác thẻ bài vật lý sống động chuẩn phong cách retro gaming
 */
function attachCardTiltEffects(selector) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateY = deltaX * 12;
      const rotateX = -deltaY * 12;

      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
