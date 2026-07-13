import {
  BootstrapIcon,
  EmptyState,
  PriceDisplay,
  ProductCard,
  SectionTitle,
  StatusBadge
} from "../../components/index.js";
import { categories } from "../../data/catalog.js";
import { getProduct, getProductReviews, getProducts } from "../../services/store.js";
import { escapeHtml, formatCurrency, formatDate } from "../../utils/format.js";
import { ROUTES, withQuery } from "../../utils/routes.js";

function pageParams() {
  return new URLSearchParams(location.search);
}

export function ProductListPage() {
  const params = pageParams();
  const search = params.get("search") || "";
  const category = params.get("category") || "all";
  const minPrice = Number(params.get("min") || 0);
  const maxPrice = Number(params.get("max") || 1500000);
  const sort = params.get("sort") || "newest";
  let filtered = getProducts().filter((product) => {
    const currentPrice = product.discountPrice ?? product.price;
    return product.name.toLowerCase().includes(search.toLowerCase())
      && (category === "all" || product.category === category)
      && currentPrice >= minPrice
      && currentPrice <= maxPrice;
  });

  filtered = filtered.sort((a, b) => {
    if (sort === "price-asc") return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
    if (sort === "price-desc") return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return `
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Đường dẫn"><a href="${ROUTES.home}">Trang chủ</a><span>/</span><span>Sản phẩm</span></nav>
        <p class="eyebrow">Kho lưu trữ</p>
        <h1>Tất cả sản phẩm</h1>
        <p class="muted">Duyệt hồ sơ theo danh mục, giá và cấp độ trải nghiệm.</p>
      </div>
    </section>
    <section class="section">
      <div class="container catalog-layout">
        <aside class="catalog-sidebar surface" aria-label="Bộ lọc sản phẩm">
          <form id="product-filter-form">
            <div class="filter-group">
              <h3>Tìm kiếm</h3>
              <input class="form-control" type="search" name="search" value="${escapeHtml(search)}" placeholder="Tên sản phẩm...">
            </div>
            <div class="filter-group">
              <h3>Danh mục</h3>
              ${categories.map((item) => `
                <label class="filter-option">
                  <input type="radio" name="category" value="${item.id}" ${category === item.id ? "checked" : ""}>
                  <span>${escapeHtml(item.name)}</span>
                </label>
              `).join("")}
            </div>
            <div class="filter-group">
              <h3>Khoảng giá</h3>
              <div class="range-row">
                <label class="form-field"><span class="form-label">Từ</span><input class="form-control" type="number" min="0" step="50000" name="min" value="${minPrice}"></label>
                <label class="form-field"><span class="form-label">Đến</span><input class="form-control" type="number" min="0" step="50000" name="max" value="${maxPrice}"></label>
              </div>
              <button class="button button--secondary button--small" type="submit">Áp dụng bộ lọc</button>
              <a class="button button--ghost button--small" href="${ROUTES.products}">Đặt lại</a>
            </div>
          </form>
        </aside>
        <div>
          <div class="catalog-toolbar">
            <p><strong>${filtered.length}</strong> sản phẩm phù hợp</p>
            <div class="catalog-toolbar__controls">
              <label class="form-field sort-select-field">
                <span class="form-label">Sắp xếp</span>
                <select class="form-control product-sort-select" id="product-sort">
                  <option value="newest" ${sort === "newest" ? "selected" : ""}>Mới nhất</option>
                  <option value="price-asc" ${sort === "price-asc" ? "selected" : ""}>Giá tăng dần</option>
                  <option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>Giá giảm dần</option>
                </select>
              </label>
            </div>
          </div>
          ${filtered.length
            ? `<div class="product-grid">${filtered.map(ProductCard).join("")}</div>`
            : EmptyState({ title: "Chưa tìm thấy hồ sơ", description: "Hãy thử thay đổi từ khóa hoặc khoảng giá.", actionLabel: "Xóa bộ lọc", actionHref: ROUTES.products })}
        </div>
      </div>
    </section>
  `;
}

function StockMeter(product) {
  const baseline = Math.max(product.stock, 40);
  const percent = Math.max(0, Math.min(100, Math.round(product.stock / baseline * 100)));
  const label = product.stock <= 0 ? "Hết hàng" : product.stock <= 5 ? "Sắp hết hàng" : "Còn hàng";
  return `<div class="stock-meter" aria-label="Tình trạng tồn kho"><span class="stock-meter__icon" aria-hidden="true">${BootstrapIcon("box-seam")}</span><div class="stock-meter__body"><div class="stock-meter__track"><span style="width: ${percent}%"></span></div><small>${label} · còn ${product.stock} sản phẩm</small></div></div>`;
}

function ProductImmersivePanel(product) {
  if (!product.model3d && !product.demoVideo) return "";
  return `
    <section class="immersive-panel surface" aria-labelledby="immersive-title">
      <div>
        <p class="eyebrow">Trải nghiệm bứt phá</p>
        <h2 id="immersive-title">MÔ HÌNH 3D</h2>
        <p class="muted">Quan sát sản phẩm 360° từ nhiều góc độ trước khi đặt hàng.</p>
        <div class="button-row">
          ${product.model3d ? `<button class="button button--primary" type="button" data-action="open-3d-model" data-model-title="${escapeHtml(product.name)}" data-model-src="${escapeHtml(product.model3d)}" data-model-poster="${escapeHtml(product.images[0])}">Xem mô hình 3D</button>` : ""}
          ${product.demoVideo ? `<a class="button button--secondary" href="#product-demo-video">Xem video demo</a>` : ""}
        </div>
      </div>
      ${product.model3d ? `<model-viewer class="product-model-preview" src="${escapeHtml(product.model3d)}" poster="${escapeHtml(product.images[0])}" camera-controls auto-rotate ar shadow-intensity="0.85" exposure="1" alt="Mô hình 3D ${escapeHtml(product.name)}"><div class="model-viewer-fallback" slot="poster"><p>Đang mở mô hình 3D...</p></div></model-viewer>` : ""}
      ${product.demoVideo ? `<div class="product-demo-video" id="product-demo-video"><video controls preload="metadata" poster="${escapeHtml(product.images[0])}"><source src="${escapeHtml(product.demoVideo)}" type="video/mp4">Trình duyệt của bạn chưa hỗ trợ video.</video><p class="muted">Video demo sản phẩm Ly Sứ ẨN.</p></div>` : ""}
    </section>
  `;
}
export function ProductDetailPage(productId) {
  const product = getProduct(productId);
  if (!product) {
    return `<section class="section"><div class="container">${EmptyState({ title: "Hồ sơ không tồn tại", description: "Sản phẩm có thể đã được di chuyển.", actionLabel: "Về trang sản phẩm", actionHref: ROUTES.products })}</div></section>`;
  }
  const soldOut = product.status === "OUT_OF_STOCK" || product.stock <= 0;
  const category = categories.find((item) => item.id === product.category);
  const related = getProducts().filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const reviews = getProductReviews(product.id);
  return `
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Đường dẫn"><a href="${ROUTES.home}">Trang chủ</a><span>/</span><a href="${ROUTES.products}">Sản phẩm</a><span>/</span><span>${escapeHtml(product.name)}</span></nav>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <article class="product-detail">
          <div class="product-gallery">
            <div class="gallery-thumbs" aria-label="Ảnh phụ">
              ${product.images.map((image, index) => `
                <button class="gallery-thumb ${index === 0 ? "is-active" : ""}" type="button" data-action="gallery-image" data-image="${escapeHtml(image)}">
                  <img src="${escapeHtml(image)}" alt="Ảnh ${index + 1} của ${escapeHtml(product.name)}">
                </button>
              `).join("")}
            </div>
            <div class="gallery-main" data-gallery-count="${product.images.length}">
              <button class="gallery-nav gallery-nav--prev" type="button" data-action="gallery-prev" aria-label="Ảnh trước">
                ${BootstrapIcon("chevron-left")}
              </button>
              <img id="product-main-image" src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}" data-gallery-index="0">
              <button class="gallery-nav gallery-nav--next" type="button" data-action="gallery-next" aria-label="Ảnh tiếp theo">
                ${BootstrapIcon("chevron-right")}
              </button>
            </div>
          </div>
          <div class="product-info">
            <p class="eyebrow">${escapeHtml(category?.name || product.category)}</p>
            <h1>${escapeHtml(product.name)}</h1>
            ${StatusBadge(product.status)}
            ${PriceDisplay(product)}
            <p>${escapeHtml(product.description)}</p>
            ${StockMeter(product)}
            <p class="muted">Tồn kho khả dụng: <strong>${product.stock}</strong></p>
            <div class="quantity-control" aria-label="Chọn số lượng">
              <button type="button" data-action="quantity-down" aria-label="Giảm số lượng">-</button>
              <input id="product-quantity" type="number" min="1" max="${product.stock}" value="1" aria-label="Số lượng">
              <button type="button" data-action="quantity-up" aria-label="Tăng số lượng">+</button>
            </div>
            <div class="button-row">
              <button class="button button--primary" type="button" data-action="buy-now" data-product-id="${product.id}" ${soldOut ? "disabled" : ""}>${soldOut ? "Hết hàng" : "Mua ngay"}</button>
              <button class="button button--secondary" type="button" data-action="add-to-cart" data-product-id="${product.id}" ${soldOut ? "disabled" : ""}>Thêm vào giỏ hàng</button>
            </div>
            <div class="product-specs">
              <div class="spec-item"><span>Bối cảnh lịch sử</span><strong>${escapeHtml(product.historicalPeriod)}</strong></div>
              <div class="spec-item"><span>Thể loại</span><strong>${escapeHtml(product.gameType)}</strong></div>
              <div class="spec-item"><span>Số người chơi</span><strong>${escapeHtml(product.playerCount)}</strong></div>
              <div class="spec-item"><span>Độ tuổi</span><strong>${escapeHtml(product.ageRating)}</strong></div>
              <div class="spec-item"><span>Thời lượng</span><strong>${escapeHtml(product.duration)}</strong></div>
              <div class="spec-item"><span>Độ khó</span><strong>${escapeHtml(product.difficulty)}</strong></div>
            </div>
          </div>
        </article>
        ${ProductImmersivePanel(product)}
        <div class="detail-copy detail-copy--accordion">
          <details class="info-disclosure" open><summary><span>Thành phần trong hộp</span></summary><p>${escapeHtml(product.components)}</p></details>
          <details class="info-disclosure" open><summary><span>Tóm tắt cốt truyện</span></summary><p>${escapeHtml(product.storySummary)}</p></details>
          <details class="info-disclosure play-guide-disclosure"><summary><span>Đánh giá và hướng dẫn cách chơi ẨN</span></summary>
            <div class="play-guide-card">
              <img src="/img/products/14.png" alt="Minh họa hướng dẫn cách chơi ẨN" loading="lazy">
              <div>
                <p>ẨN mang đến một lối chơi độc đáo, kết hợp giữa giải đố, suy luận và nhập vai tương tác. Người chơi cần quan sát chi tiết, đọc lời khai, đối chiếu vật chứng và cùng nhau dựng lại mạch sự kiện.</p>
                <ol>
                  <li><strong>Nhận vai và đọc hồ sơ:</strong> mỗi người chơi nhận thông tin nhân vật, mục tiêu và giới hạn được tiết lộ.</li>
                  <li><strong>Thu thập vật chứng:</strong> lần lượt mở thẻ manh mối, ghi chú điểm nghi vấn và đặt câu hỏi cho các nhân chứng.</li>
                  <li><strong>Đối chiếu giả thuyết:</strong> nhóm so sánh thời gian, động cơ, lời khai và dấu vết để loại trừ thông tin nhiễu.</li>
                  <li><strong>Kết án:</strong> ở cuối ván, người chơi thống nhất hung thủ, động cơ và chuỗi hành động chính.</li>
                </ol>
                <p>Trò chơi phù hợp với nhóm yêu lịch sử, trinh thám và trải nghiệm nhập vai. Với luật học nhanh nhưng nhiều lớp suy luận, ẨN đem lại cảm giác như đang mở một hồ sơ cổ ngay trên bàn chơi.</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>
    <section class="section section--paper">
      <div class="container">
        ${SectionTitle({ eyebrow: "Lời khai người chơi", title: "Đánh giá sản phẩm", description: "Nhận xét chỉ đến từ khách hàng đã mua sản phẩm." })}
        ${reviews.length ? `<div class="review-list">${reviews.map((review) => `
          <article class="review-card"><div class="stars" aria-label="${review.rating} trên 5 sao">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div><p>${escapeHtml(review.comment)}</p><small>${escapeHtml(review.customerName || "khac****an***")} · ${escapeHtml(formatDate(review.createdAt))}</small></article>
        `).join("")}</div>` : EmptyState({ title: "Chưa có lời khai", description: "Hãy là khách hàng đầu tiên đánh giá sản phẩm này." })}
      </div>
    </section>
    ${related.length ? `<section class="section"><div class="container">${SectionTitle({ eyebrow: "Cùng ngăn lưu trữ", title: "Sản phẩm liên quan" })}<div class="product-grid">${related.map(ProductCard).join("")}</div></div></section>` : ""}
  `;
}

export function mountProductPage() {
  const filterForm = document.querySelector("#product-filter-form");
  filterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(filterForm);
    const params = new URLSearchParams();
    for (const key of ["search", "category", "min", "max"]) {
      const value = data.get(key);
      if (value && !(key === "category" && value === "all")) params.set(key, value);
    }
    const sort = document.querySelector("#product-sort")?.value;
    if (sort && sort !== "newest") params.set("sort", sort);
    window.location.assign(withQuery(ROUTES.products, Object.fromEntries(params.entries())));
  });
  document.querySelectorAll('input[name="category"]').forEach((input) => {
    input.addEventListener("change", () => filterForm?.requestSubmit());
  });
  document.querySelector("#product-sort")?.addEventListener("change", () => filterForm?.requestSubmit());
}
















