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
import { cardsData } from "./cards-data.js";
import { SwirlShader } from "./shader.js";

// Trạng thái ứng dụng
const AppState = {
  activeCategory: "all",
  activeRarity: "all",
  searchQuery: "",
  page: 1,
  pageSize: 24,
  activeModal: null
};

/** Khởi động ứng dụng khi DOM sẵn sàng */
document.addEventListener("DOMContentLoaded", () => {
  initShader();
  initBrandIcons();
  renderNavigation();
  renderHero();
  renderTrailer();
  renderOverviewPhases();
  renderCardGallery();
  renderDevEvaluation();
  renderMediaLibrary();
  renderAcademicDocs();
  renderTeamSection();
  renderFooter();
  setupGlobalInteractions();
  setupModals();
  checkInitialHash();
  window.addEventListener("hashchange", checkInitialHash);
});

/** Kiểm tra sự tồn tại của tệp thông qua HTTP HEAD tại runtime */
export async function checkFileExists(url) {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

/** Tự động cập nhật favicon */
async function initBrandIcons() {
  const hasIcon = await checkFileExists("assets/logo/Logo_Mathicard_Icon.png");
  const iconSrc = hasIcon ? "assets/logo/Logo_Mathicard_Icon.png" : "assets/logo/Logo_Mathicard_Icon_placeholder.png";

  const favicon = document.getElementById("site-favicon");
  if (favicon) favicon.href = iconSrc;
}

function checkInitialHash() {
  const hash = window.location.hash;
  if (!hash) return;

  if (hash === "#card-modal" || hash === "#the-bai-modal") {
    if (cardsData && cardsData.length > 0) {
      openCardInspectorModal(cardsData[0]);
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
   HẰNG SỐ & HÀM TIỆN ÍCH THẺ BÀI
============================================================================= */
export const RARITY_LABELS = {
  all: "Tất cả độ hiếm",
  common: "Phổ biến",
  rare: "Hiếm",
  epic: "Sử thi",
  legendary: "Huyền thoại",
  special: "Đặc biệt"
};

export const TYPE_LABELS = {
  all: "Tất cả",
  value: "Giá trị",
  operator: "Toán tử",
  item: "Vật phẩm",
  course: "Khóa học",
  document: "Tài liệu",
  decoration: "Trang trí",
  sticker: "Nhãn dán",
  event: "Sự kiện",
  pack: "Gói bài"
};

/** Chuyển tiếng Việt có dấu sang không dấu để tìm kiếm không phân biệt dấu */
export function removeVietnameseTones(str) {
  if (!str) return "";
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, (m) => (m === "đ" ? "d" : "D"))
    .toLowerCase()
    .trim();
}

export function getSymbolLengthClass(symbol) {
  const len = String(symbol || "").length;
  if (len >= 4) return "len-long";
  if (len === 3) return "len-3";
  if (len === 2) return "len-2";
  return "";
}

export function getCornerLengthClass(symbol) {
  return String(symbol || "").length >= 4 ? "len-long" : "";
}

function resolveCardColor(card, symbol) {
  if (card.type === "operator") return "dark";
  if (card.color) return card.color;
  return "dark";
}

/** Render thẻ bài thuần CSS/HTML text card cho thẻ giá trị & toán tử */
export function renderCardFaceHtml(card) {
  if (!card) return "";
  const isValue = card.type === "value";
  const symbol = isValue ? (card.value || "?") : (card.symbol || card.value || "?");
  const color = resolveCardColor(card, symbol);
  const centerLen = getSymbolLengthClass(symbol);
  const cornerLen = getCornerLengthClass(symbol);

  return `
    <div class="card-rendered" data-type="${card.type}" data-color="${color}">
      <span class="card-corner top-left ${cornerLen}">${symbol}</span>
      <div class="card-center-symbol ${centerLen}">${symbol}</div>
      <span class="card-corner bottom-right ${cornerLen}">${symbol}</span>
    </div>
  `;
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
async function renderNavigation() {
  const brandWordmark = document.getElementById("nav-logo-wordmark");
  const brandLogo = document.getElementById("nav-logo");

  const hasLogoNgang = await checkFileExists(siteContent.hero.logoImg);
  if (hasLogoNgang && brandLogo) {
    brandLogo.src = siteContent.hero.logoImg;
    brandLogo.alt = siteContent.hero.logoAlt;
    brandLogo.style.display = "block";
    if (brandWordmark) brandWordmark.style.display = "none";
  } else {
    if (brandWordmark) brandWordmark.style.display = "inline-block";
    if (brandLogo) brandLogo.style.display = "none";
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
async function renderHero() {
  const heroBadge = document.getElementById("hero-badge");
  if (heroBadge) heroBadge.textContent = siteContent.hero.badgeText;

  const heroWordmark = document.getElementById("hero-logo-wordmark");
  const heroLogo = document.getElementById("hero-logo-img");

  const hasLogoNgang = await checkFileExists(siteContent.hero.logoImg);
  if (hasLogoNgang && heroLogo) {
    heroLogo.src = siteContent.hero.logoImg;
    heroLogo.alt = siteContent.hero.logoAlt;
    heroLogo.style.display = "block";
    if (heroWordmark) heroWordmark.style.display = "none";
  } else {
    if (heroWordmark) heroWordmark.style.display = "block";
    if (heroLogo) heroLogo.style.display = "none";
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
      const rot = offset * 7; // Góc xoay quạt
      const translateY = Math.abs(offset) * 6;
      const delay = (idx * 0.15).toFixed(2);
      const cardFace = renderCardFaceHtml(card);

      return `
        <div class="fanned-card" 
             style="--fan-rot: ${rot}deg; --fan-y: ${translateY}px; z-index: ${10 + idx};"
             data-title="${card.title}"
             data-type="${card.type}"
             title="${card.title}">
          <div class="card-wobble" style="--wobble-delay: ${delay}s;">
            <div class="card-inner">
              ${cardFace}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  attachCardTiltEffects(".fanned-card .card-inner");
}

/* =============================================================================
   4. TRAILER SECTION (VIDEO, FALLBACK & PHỤ ĐỀ WEBVTT)
============================================================================= */
async function renderTrailer() {
  const title = document.getElementById("trailer-title");
  if (title) title.textContent = siteContent.trailer.sectionTitle;

  const sub = document.getElementById("trailer-sub");
  if (sub) sub.textContent = siteContent.trailer.sectionSubtitle;

  const videoElem = document.getElementById("main-trailer-video");
  const fallbackElem = document.getElementById("trailer-fallback");

  if (videoElem) {
    videoElem.poster = siteContent.trailer.posterImg;
    videoElem.src = siteContent.trailer.videoSrc;

    // Phụ đề WebVTT chỉ thêm khi file tồn tại thực tế qua HTTP HEAD
    const hasTrack = await checkFileExists(siteContent.trailer.trackSrc);
    if (hasTrack && !videoElem.querySelector("track")) {
      const trackElem = document.createElement("track");
      trackElem.src = siteContent.trailer.trackSrc;
      trackElem.srclang = siteContent.trailer.trackLang || "vi";
      trackElem.label = siteContent.trailer.trackLabel || "Tiếng Việt";
      trackElem.default = true;
      videoElem.appendChild(trackElem);
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

async function openVideoModal() {
  const modal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video-elem");
  const modalFallback = document.getElementById("modal-video-fallback");
  if (!modal || !modalVideo) return;

  const mainVideo = document.getElementById("main-trailer-video");
  const isVideoMissing = mainVideo && mainVideo.style.display === "none";

  if (isVideoMissing) {
    showModalVideoFallback(modalVideo, modalFallback);
  } else {
    if (modalFallback) modalFallback.style.display = "none";
    modalVideo.style.display = "block";
    modalVideo.src = siteContent.trailer.videoSrc;
    modalVideo.poster = siteContent.trailer.posterImg;

    const hasTrack = await checkFileExists(siteContent.trailer.trackSrc);
    if (hasTrack && !modalVideo.querySelector("track")) {
      const track = document.createElement("track");
      track.src = siteContent.trailer.trackSrc;
      track.srclang = siteContent.trailer.trackLang || "vi";
      track.label = siteContent.trailer.trackLabel || "Tiếng Việt";
      track.default = true;
      modalVideo.appendChild(track);
    }

    modalVideo.addEventListener("error", () => {
      showModalVideoFallback(modalVideo, modalFallback);
    }, { once: true });

    modalVideo.play().catch(() => {});
  }

  openModal(modal);
}

function showModalVideoFallback(modalVideo, modalFallback) {
  if (modalVideo) modalVideo.style.display = "none";
  if (!modalFallback) return;
  modalFallback.style.display = "flex";
  modalFallback.innerHTML = `
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

/* =============================================================================
   5. GIỚI THIỆU GAME & 5 GIAI ĐOẠN VÁN ĐẤU (3D FLIP CARDS)
============================================================================= */
function setTextContent(elemId, text) {
  if (!text) return;
  const elem = document.getElementById(elemId);
  if (elem) elem.textContent = text;
}

async function renderOverviewPhases() {
  setTextContent("overview-badge", siteContent.overview.sectionBadge);
  setTextContent("overview-title", siteContent.overview.sectionTitle);
  setTextContent("overview-sub", siteContent.overview.sectionSubtitle);
  setTextContent("overview-pitch", siteContent.overview.pitch);

  const phasesContainer = document.getElementById("phases-grid");
  if (!phasesContainer) return;

  const resolvedPhases = await Promise.all(
    siteContent.overview.phases.map(async (phase) => {
      const exists = await checkFileExists(phase.iconImg);
      return { ...phase, exists };
    })
  );

  phasesContainer.innerHTML = resolvedPhases.map(renderPhaseCardTemplate).join("");
  setupPhaseCardInteractions(phasesContainer);
  attachCardTiltEffects(".phase-card");
}

function renderPhaseCardTemplate(phase) {
  const iconMarkup = phase.exists
    ? `<img src="${phase.iconImg}" alt="${phase.iconAlt}" width="140" height="90" loading="lazy" />`
    : `<div class="screen-fallback-tile"><span class="fallback-icon">🖼</span><span class="fallback-text">Ảnh sắp cập nhật</span></div>`;

  return `
    <div class="phase-card-wrapper" tabindex="0" role="button" aria-label="Giai đoạn ${phase.id}: ${phase.name}">
      <div class="phase-card flip-card">
        <!-- MẶT TRƯỚC (FRONT) -->
        <div class="card-face card-front">
          <div class="phase-step-badge">BƯỚC ${phase.stepNumber}</div>
          <div class="phase-icon-box">
            ${iconMarkup}
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
  `;
}

function setupPhaseCardInteractions(container) {
  container.querySelectorAll(".phase-card-wrapper").forEach((wrapper) => {
    const flipCard = wrapper.querySelector(".flip-card");
    const toggleFlip = () => {
      flipCard.style.transform = "";
      flipCard.classList.toggle("flipped");
    };

    wrapper.addEventListener("click", toggleFlip);
    wrapper.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
    });
  });
}


/* =============================================================================
   6. BỘ SƯU TẬP THẺ BÀI (GALLERY TABS, RARITY CHIPS, SEARCH & INSPECTOR MODAL)
============================================================================= */
function renderCardGallery() {
  setTextContent("gallery-badge", siteContent.cardGallery.sectionBadge);
  setTextContent("gallery-title", siteContent.cardGallery.sectionTitle);
  setTextContent("gallery-sub", siteContent.cardGallery.sectionSubtitle);

  renderGalleryTabs();
  renderRarityChips();
  setupCardSearch();
  setupGalleryPagination();
  renderGalleryItems();
}

function getTypeCount(typeKey) {
  if (typeKey === "all") return cardsData.length;
  return cardsData.filter((c) => c.type === typeKey).length;
}

function renderGalleryTabs() {
  const tabsContainer = document.getElementById("gallery-filter-tabs");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = siteContent.cardGallery.categories
    .map((cat) => {
      const count = getTypeCount(cat.key);
      const isActive = cat.key === AppState.activeCategory ? "active" : "";
      return `
        <button class="filter-tab-btn ${isActive}" data-category="${cat.key}" role="tab" aria-selected="${cat.key === AppState.activeCategory}">
          <span>${cat.label}</span>
          <span class="tab-count-badge">${count}</span>
        </button>
      `;
    })
    .join("");

  tabsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-tab-btn");
    if (!btn) return;

    tabsContainer.querySelectorAll(".filter-tab-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    AppState.activeCategory = btn.dataset.category;
    AppState.page = 1;
    renderGalleryItems();
  });
}

function renderRarityChips() {
  const container = document.getElementById("gallery-rarity-filters");
  if (!container) return;

  container.innerHTML = siteContent.cardGallery.rarities
    .map((r) => {
      const isActive = r.key === AppState.activeRarity ? "active" : "";
      return `
        <button class="rarity-chip ${isActive}" data-rarity="${r.key}" type="button">
          ${r.label}
        </button>
      `;
    })
    .join("");

  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".rarity-chip");
    if (!chip) return;

    container.querySelectorAll(".rarity-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    AppState.activeRarity = chip.dataset.rarity;
    AppState.page = 1;
    renderGalleryItems();
  });
}

function setupCardSearch() {
  const searchInput = document.getElementById("card-search-input");
  const clearBtn = document.getElementById("card-search-clear");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    AppState.searchQuery = e.target.value.trim();
    if (clearBtn) {
      clearBtn.style.display = AppState.searchQuery ? "block" : "none";
    }
    AppState.page = 1;
    renderGalleryItems();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      AppState.searchQuery = "";
      clearBtn.style.display = "none";
      AppState.page = 1;
      renderGalleryItems();
      searchInput.focus();
    });
  }
}

function setupGalleryPagination() {
  const loadMoreBtn = document.getElementById("gallery-load-more-btn");
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener("click", () => {
    AppState.page++;
    renderGalleryItems();
  });
}

function cardMatchesSearch(card, queryNorm) {
  if (!queryNorm) return true;
  if (removeVietnameseTones(card.nameVi).includes(queryNorm)) return true;
  if (removeVietnameseTones(card.descriptionVi).includes(queryNorm)) return true;
  if (removeVietnameseTones(card.id).includes(queryNorm)) return true;
  if (card.value && removeVietnameseTones(card.value).includes(queryNorm)) return true;
  if (card.symbol && removeVietnameseTones(card.symbol).includes(queryNorm)) return true;
  return false;
}

function getFilteredCards() {
  const qNorm = removeVietnameseTones(AppState.searchQuery);
  return cardsData.filter((card) => {
    const matchesCat = AppState.activeCategory === "all" || card.type === AppState.activeCategory;
    if (!matchesCat) return false;

    const matchesRar = AppState.activeRarity === "all" || card.rarity === AppState.activeRarity;
    if (!matchesRar) return false;

    return cardMatchesSearch(card, qNorm);
  });
}

function renderGalleryItems() {
  const grid = document.getElementById("gallery-cards-grid");
  const counterText = document.getElementById("gallery-counter-text");
  const paginationWrap = document.getElementById("gallery-pagination-wrap");
  if (!grid) return;

  const filtered = getFilteredCards();
  const totalCount = filtered.length;
  const displayLimit = AppState.page * AppState.pageSize;
  const displayedCards = filtered.slice(0, displayLimit);

  if (counterText) {
    if (totalCount === 0) {
      counterText.textContent = "Không tìm thấy thẻ bài phù hợp";
    } else {
      counterText.textContent = `Hiển thị ${displayedCards.length} / ${totalCount} thẻ bài`;
    }
  }

  if (paginationWrap) {
    paginationWrap.style.display = displayedCards.length < totalCount ? "flex" : "none";
  }

  grid.innerHTML = displayedCards.map(renderGalleryCardArticle).join("");
  setupGalleryCardClicks(grid);
  attachCardTiltEffects(".gallery-card");
}

function renderGalleryCardArticle(card, idx) {
  const delay = ((idx % 6) * 0.1).toFixed(2);
  const rarityLabel = RARITY_LABELS[card.rarity] || card.rarity;
  const typeLabel = TYPE_LABELS[card.type] || card.type;
  const priceLabel = card.price ? `${card.price} Coin` : "Miễn phí";

  const visualMarkup = (card.render === "text" || card.type === "value" || card.type === "operator")
    ? renderCardFaceHtml(card)
    : `<img src="${card.image}" alt="${card.nameVi}" width="200" height="280" loading="lazy" />`;

  return `
    <article class="gallery-card card-wobble" 
             style="--wobble-delay: ${delay}s;" 
             tabindex="0" 
             role="button"
             aria-label="${card.nameVi}"
             data-card-id="${card.id}">
      <div class="card-item-inner">
        <div class="card-rarity-badge ${card.rarity}">${rarityLabel}</div>
        <div class="card-image-wrap">
          ${visualMarkup}
        </div>
        <div class="card-info">
          <h4 class="card-title">${card.nameVi}</h4>
          <span class="card-tag">${typeLabel} · ${priceLabel}</span>
          <p class="card-desc">${card.descriptionVi || ""}</p>
        </div>
      </div>
    </article>
  `;
}

function setupGalleryCardClicks(grid) {
  grid.querySelectorAll(".gallery-card").forEach((elem) => {
    const cardId = elem.dataset.cardId;
    const cardData = cardsData.find((c) => c.id === cardId);

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
}

function openCardInspectorModal(card) {
  if (!card) return;
  const modal = document.getElementById("card-modal");
  const modalBody = document.getElementById("card-modal-content");
  if (!modal || !modalBody) return;

  const rarityLabel = RARITY_LABELS[card.rarity] || card.rarity;
  const typeLabel = TYPE_LABELS[card.type] || card.type;
  const priceLabel = card.price ? `${card.price} Coin` : "Miễn phí";

  const visualMarkup = (card.render === "text" || card.type === "value" || card.type === "operator")
    ? renderCardFaceHtml(card)
    : `<img src="${card.image}" alt="${card.nameVi}" class="modal-card-img" />`;

  modalBody.innerHTML = `
    <div class="modal-card-display">
      ${visualMarkup}
    </div>
    <div class="modal-card-details">
      <div class="modal-rarity-tag ${card.rarity}">${rarityLabel} · ${typeLabel}</div>
      <h2 class="modal-card-heading">${card.nameVi}</h2>
      <div class="modal-card-meta">
        <span>Phân loại: <strong>${typeLabel.toUpperCase()}</strong></span>
        <span>Mã định danh: <strong>#${card.id}</strong></span>
        <span>Giá cửa hàng: <strong>${priceLabel}</strong></span>
      </div>
      <div class="modal-card-desc-box">
        <label>HIỆU ỨNG & CƠ CHẾ:</label>
        <p>${card.descriptionVi || "Thẻ bài cơ bản không có hiệu ứng đặc biệt."}</p>
      </div>
      <div class="modal-card-tip">
        <span>💡 Mẹo chiến thuật: Sử dụng thẻ này trong các vòng đấu then chốt để đột phá điểm số!</span>
      </div>
    </div>
  `;

  openModal(modal);
}

/* =============================================================================
   7. ĐÁNH GIÁ & NHÌN NHẬN (DEV EVALUATION - 3 CỘT)
============================================================================= */
function renderDevEvaluation() {
  const evalData = siteContent.devEvaluation;
  if (!evalData) return;

  setTextContent("review-badge", evalData.sectionBadge);
  setTextContent("review-title", evalData.sectionTitle);
  setTextContent("review-sub", evalData.sectionSubtitle);

  const grid = document.getElementById("dev-eval-grid");
  if (grid && evalData.columns) {
    grid.innerHTML = evalData.columns.map((col) => `
      <div class="eval-column-card col-${col.id}">
        <div class="eval-col-header">
          <span class="eval-col-icon" aria-hidden="true">${col.icon}</span>
          <h3 class="eval-col-title">${col.title}</h3>
        </div>
        <span class="eval-col-tag">${col.tag}</span>
        <ul class="eval-list">
          ${col.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `).join("");
  }

  const quotesWrap = document.getElementById("playtest-quotes-wrap");
  if (quotesWrap) {
    if (evalData.playtestQuotes && evalData.playtestQuotes.length > 0) {
      quotesWrap.style.display = "grid";
      quotesWrap.innerHTML = evalData.playtestQuotes.map((q) => `
        <blockquote class="playtest-quote-card">
          <p class="quote-text">"${q.text}"</p>
          <cite class="quote-author">— ${q.author}</cite>
        </blockquote>
      `).join("");
    } else {
      quotesWrap.style.display = "none";
      quotesWrap.innerHTML = "";
    }
  }
}

/* =============================================================================
   8. THƯ VIỆN MEDIA & FONT CHỮ THIẾT KẾ
============================================================================= */
function renderMediaLibrary() {
  const badge = document.getElementById("media-badge");
  if (badge && siteContent.media.sectionBadge) badge.textContent = siteContent.media.sectionBadge;

  const title = document.getElementById("media-title");
  if (title && siteContent.media.sectionTitle) title.textContent = siteContent.media.sectionTitle;

  const sub = document.getElementById("media-sub");
  if (sub && siteContent.media.sectionSubtitle) sub.textContent = siteContent.media.sectionSubtitle;

  const fontTitle = document.getElementById("font-showcase-title");
  if (fontTitle && siteContent.media.fontShowcase && siteContent.media.fontShowcase.title) {
    fontTitle.textContent = siteContent.media.fontShowcase.title;
  }

  renderFontShowcase();
  renderMediaImageGrid();
  renderAnimatedGrid();
}

async function renderFontShowcase() {
  const fontData = siteContent.media.fontShowcase;

  const alphabetImg = document.getElementById("font-alphabet-img");
  if (alphabetImg) {
    const hasAlphabet = await checkFileExists(fontData.alphabetImg);
    alphabetImg.src = hasAlphabet ? fontData.alphabetImg : (fontData.alphabetPlaceholderImg || "assets/logo/BangChu_Mathicard_placeholder.png");
    alphabetImg.alt = fontData.alphabetAlt || "Bảng font chữ pixel tự tạo";
  }

  const conceptNote = document.getElementById("font-concept-note");
  if (conceptNote) conceptNote.textContent = fontData.conceptNote;

  const paletteGrid = document.getElementById("media-palette-grid");
  if (!paletteGrid) return;

  paletteGrid.innerHTML = fontData.paletteSwatches
    .map(
      (swatch) => `
      <div class="swatch-item" role="button" tabindex="0" title="Bấm hoặc nhấn Enter để sao chép mã màu ${swatch.hex}">
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

  // Bấm swatch hoặc nhấn Enter/Space để sao chép mã màu
  paletteGrid.querySelectorAll(".swatch-item").forEach((item) => {
    const onCopy = async () => {
      const hex = item.querySelector(".swatch-hex").textContent;
      const ok = await copyToClipboard(hex);
      if (ok) {
        item.classList.add("copied");
        setTimeout(() => item.classList.remove("copied"), 1200);
      }
    };

    item.addEventListener("click", onCopy);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onCopy();
      }
    });
  });
}

async function renderMediaImageGrid() {
  const grid = document.getElementById("media-images-grid");
  if (!grid) return;

  const resolvedImages = await Promise.all(
    siteContent.media.imagesGrid.map(async (img) => {
      const exists = await checkFileExists(img.src);
      return { ...img, exists };
    })
  );

  grid.innerHTML = resolvedImages
    .map((img) => {
      const imgMarkup = img.exists
        ? `<img src="${img.src}" alt="${img.alt}" loading="lazy" />`
        : `<div class="screen-fallback-tile"><span class="fallback-icon">🖼</span><span class="fallback-text">Ảnh sắp cập nhật</span></div>`;

      return `
        <div class="media-thumb-card" tabindex="0" role="button" data-src="${img.exists ? img.src : ''}" data-caption="${img.caption}">
          <div class="thumb-img-wrap">
            ${imgMarkup}
          </div>
          <div class="thumb-caption">${img.caption}</div>
        </div>
      `;
    })
    .join("");

  grid.querySelectorAll(".media-thumb-card").forEach((card) => {
    if (!card.dataset.src) return;
    const onSelect = () => openLightbox(card.dataset.src, card.dataset.caption);
    card.addEventListener("click", onSelect);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect();
      }
    });
  });
}

async function renderAnimatedGrid() {
  const grid = document.getElementById("media-animated-grid");
  if (!grid) return;

  const resolvedGifs = await Promise.all(
    siteContent.media.animatedGrid.map(async (gif) => {
      const exists = await checkFileExists(gif.src);
      const activeSrc = exists ? gif.src : (gif.placeholderSrc || gif.src);
      return { ...gif, activeSrc };
    })
  );

  grid.innerHTML = resolvedGifs
    .map(
      (gif) => `
      <div class="media-thumb-card gif-card" tabindex="0" role="button" data-src="${gif.activeSrc}" data-caption="${gif.caption}">
        <div class="thumb-img-wrap">
          <img src="${gif.activeSrc}" alt="${gif.alt}" loading="lazy" />
          <span class="gif-badge">ẢNH ĐỘNG GIF</span>
        </div>
        <div class="thumb-caption">${gif.caption}</div>
      </div>
    `
    )
    .join("");

  grid.querySelectorAll(".media-thumb-card").forEach((card) => {
    const onSelect = () => openLightbox(card.dataset.src, card.dataset.caption);
    card.addEventListener("click", onSelect);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect();
      }
    });
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
async function renderAcademicDocs() {
  setTextContent("academic-badge", siteContent.academicDocs.sectionBadge);
  setTextContent("academic-title", siteContent.academicDocs.sectionTitle);
  setTextContent("academic-sub", siteContent.academicDocs.sectionSubtitle);

  const container = document.getElementById("academic-docs-grid");
  if (!container) return;

  // Kiểm tra trạng thái tồn tại của tệp qua HTTP HEAD tại runtime
  const docStatuses = await Promise.all(
    siteContent.academicDocs.deliverables.map(async (doc) => {
      const hasPdf = doc.pdfFile ? await checkFileExists(doc.pdfFile) : false;
      const hasDownload = doc.downloadFile ? await checkFileExists(doc.downloadFile) : false;
      return { ...doc, hasPdf, hasDownload, isReady: hasPdf || hasDownload };
    })
  );

  container.innerHTML = docStatuses.map(renderDocCard).join("");
  setupDocPreviewActions(container);
}

function renderDocCard(doc) {
  const isReady = Boolean(doc.isReady);
  const statusBadge = isReady
    ? `<span class="doc-badge ready">SẴN SÀNG</span>`
    : `<span class="doc-badge pending">ĐANG CẬP NHẬT</span>`;

  const previewTooltip = doc.pdfFile
    ? "Tài liệu đang được nhóm cập nhật"
    : "Mã nguồn - chỉ hỗ trợ tải về trực tiếp, không có bản xem trước PDF";

  const previewBtn = doc.hasPdf
    ? `<button class="pixel-btn btn-secondary btn-view-pdf" data-pdf="${doc.pdfFile}" data-title="${doc.title}">Xem</button>`
    : `<button class="pixel-btn btn-secondary disabled" disabled title="${previewTooltip}">Xem</button>`;

  const downloadBtn = doc.hasDownload
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
}

function setupDocPreviewActions(container) {
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
  const badge = document.getElementById("team-badge");
  if (badge && siteContent.team.sectionBadge) badge.textContent = siteContent.team.sectionBadge;

  const title = document.getElementById("team-title");
  if (title && siteContent.team.sectionTitle) title.textContent = siteContent.team.sectionTitle;

  const sub = document.getElementById("team-sub");
  if (sub && siteContent.team.sectionSubtitle) sub.textContent = siteContent.team.sectionSubtitle;

  const classInfo = document.getElementById("team-class-info");
  if (classInfo) classInfo.textContent = siteContent.team.classInfo;

  const tableBody = document.getElementById("team-table-body");
  if (tableBody) {
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

      const isFlipped = card.classList.contains("flipped");
      const finalRotY = isFlipped ? 180 - rotateY : rotateY;

      card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${finalRotY.toFixed(1)}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/**
 * Sao chép văn bản vào clipboard an toàn (hỗ trợ cả môi trường HTTPS lẫn HTTP/không hỗ trợ API trực tiếp)
 */
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Chuyển sang phương thức fallback nếu không thể truy cập clipboard API
    }
  }
  return fallbackCopyText(text);
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  textArea.setAttribute("readonly", "");
  document.body.appendChild(textArea);
  textArea.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (err) {
    // Bỏ qua lỗi nếu trình duyệt không hỗ trợ execCommand
  }
  document.body.removeChild(textArea);
  return success;
}

