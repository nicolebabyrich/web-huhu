import { categories } from "../data/catalog.js";
import { getCartCount, getCurrentUser } from "../services/store.js";
import { escapeHtml, formatCurrency, formatDate, statusLabel } from "../utils/format.js";
import { productUrl, ROUTES, withQuery } from "../utils/routes.js";

export function BootstrapIcon(name) {
  const paths = {
    "arrow-left": `<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>`,
    "arrow-right": `<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>`,
    "person": `<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>`,
    "cart3": `<path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1.5 7A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.49-.402L1.61 2H.5a.5.5 0 0 1-.5-.5M3.14 4l1.25 6h8.22l1.286-6zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>`,
    "list": `<path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>`,
    "box-seam": `<path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5z"/><path d="M15 4.239 8.5 6.839v7.922l6.5-2.6z"/><path d="M7.5 14.762V6.838L1 4.239v7.923z"/><path d="M1.245 3.089 7.814.461a.5.5 0 0 1 .372 0l6.569 2.628A.5.5 0 0 1 15 3.554v8.892a.5.5 0 0 1-.314.464l-6.5 2.6a.5.5 0 0 1-.372 0l-6.5-2.6A.5.5 0 0 1 1 12.446V3.554a.5.5 0 0 1 .245-.465"/>`,
    "credit-card": `<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2H0z"/><path d="M0 5v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5zm3 3h5a.5.5 0 0 1 0 1H3a.5.5 0 0 1 0-1m0 2h3a.5.5 0 0 1 0 1H3a.5.5 0 0 1 0-1"/>`,
    "qr-code": `<path d="M2 2h2v2H2zM1 1v4h4V1zM2 12h2v2H2zm-1-1v4h4v-4zm11-9h2v2h-2zm-1-1v4h4V1z"/><path d="M6 1h1v1H6zm2 0h1v2H8zM6 4h1v1H6zm3 0h1v2H9zM1 6h1v1H1zm3 0h2v1H4zm3 0h1v1H7zm2 0h1v1H9zm2 0h1v1h-1zm3 0h1v1h-1zM6 8h1v1H6zm2 0h3v1H8zm4 0h1v2h-1zm2 0h1v1h-1zM6 10h2v1H6zm3 0h1v1H9zm2 0h1v1h-1zm3 0h1v1h-1zM6 12h1v3H6zm2 0h1v1H8zm2 0h2v1h-2zm3 0h2v3h-2zm-4 2h3v1H9z"/>`,
    "check-circle": `<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>`,
    "eye": `<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>`,
    "eye-slash": `<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755q-.252.252-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.266.235-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/><path fill-rule="evenodd" d="M13.646 14.354-1.354-.646l.708-.708 15 15z"/>`,
    "chevron-left": `<path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>`,
    "chevron-right": `<path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>`,
    "journal-text": `<path d="M5 10.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/><path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/><path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1H2v1h.5a.5.5 0 0 1 0 1H2v1h.5a.5.5 0 0 1 0 1H2v.5a.5.5 0 0 1-1 0V10H.5a.5.5 0 0 1 0-1H1V8H.5a.5.5 0 0 1 0-1H1V6H.5a.5.5 0 0 1 0-1z"/>`
  };
  return `<svg class="bi bi-${name}" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${paths[name] || ""}</svg>`;
}
export function Button({
  label,
  href = "",
  variant = "primary",
  size = "",
  action = "",
  disabled = false,
  type = "button",
  extraClass = "",
  attributes = ""
}) {
  const className = ["button", "button--" + variant, size ? "button--" + size : "", extraClass].filter(Boolean).join(" ");
  if (href) {
    return `<a class="${className}" href="${escapeHtml(href)}" ${attributes}>${escapeHtml(label)}</a>`;
  }
  return `<button class="${className}" type="${type}" ${action ? `data-action="${action}"` : ""} ${disabled ? "disabled" : ""} ${attributes}>${escapeHtml(label)}</button>`;
}

export function SectionTitle({ eyebrow, title, description = "", actionLabel = "", actionHref = "" }) {
  return `
    <div class="section-title">
      <div>
        ${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
        <h2>${escapeHtml(title)}</h2>
        ${description ? `<p>${escapeHtml(description)}</p>` : ""}
      </div>
      ${actionLabel ? Button({ label: actionLabel, href: actionHref, variant: "secondary" }) : ""}
    </div>
  `;
}

export function PriceDisplay(product) {
  const current = product.discountPrice ?? product.price;
  return `
    <div class="price">
      <span class="price-current">${formatCurrency(current)}</span>
      ${product.discountPrice ? `<span class="price-old">${formatCurrency(product.price)}</span>` : ""}
    </div>
  `;
}

export function StatusBadge(status) {
  const modifier = status === "OUT_OF_STOCK" || status === "CANCELLED" || status === "REJECTED"
    ? " status-badge--danger"
    : status === "HIDDEN" || status === "PENDING"
      ? " status-badge--warning"
      : "";
  return `<span class="status-badge${modifier}">${escapeHtml(statusLabel(status))}</span>`;
}

export function ProductCard(product) {
  const soldOut = product.status === "OUT_OF_STOCK" || product.stock <= 0;
  const category = categories.find((item) => item.id === product.category)?.name || product.category;
  return `
    <article class="product-card" data-product-id="${product.id}">
      <a class="product-card__media" href="${productUrl(product.id)}" aria-label="Xem ${escapeHtml(product.name)}">
        <img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}" loading="lazy">
        <span class="product-card__badge">${soldOut ? "Hết hàng" : escapeHtml(category)}</span>
      </a>
      <div class="product-card__body">
        <span class="product-card__category">${escapeHtml(category)}</span>
        <a class="product-card__title" href="${productUrl(product.id)}">${escapeHtml(product.name)}</a>
        ${PriceDisplay(product)}
        <div class="product-card__actions">
          ${soldOut ? `<button class="button button--ghost button--small" type="button" disabled>Hết hàng</button>` : Button({ label: "Mua ngay", href: productUrl(product.id), variant: "ghost", size: "small" })}
          <button class="button button--primary button--small button--cart-icon" type="button" data-action="add-to-cart" data-product-id="${product.id}" ${soldOut ? "disabled" : ""} aria-label="Thêm ${escapeHtml(product.name)} vào giỏ">${BootstrapIcon("cart3")}</button>
        </div>
      </div>
    </article>
  `;
}

export function EmptyState({ title, description, actionLabel = "", actionHref = "", symbol = "◇" }) {
  return `
    <div class="empty-state">
      <div>
        <div class="empty-state__symbol" aria-hidden="true">${symbol}</div>
        <h3>${escapeHtml(title)}</h3>
        <p class="muted">${escapeHtml(description)}</p>
        ${actionLabel ? Button({ label: actionLabel, href: actionHref }) : ""}
      </div>
    </div>
  `;
}

export function LoadingState(label = "Đang mở hồ sơ...") {
  return `
    <div class="loading-state" role="status">
      <div>
        <div class="loading-dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <p>${escapeHtml(label)}</p>
      </div>
    </div>
  `;
}

export function HistoryNavigation() {
  return `
    <nav class="history-navigation" aria-label="Điều hướng lịch sử trang">
      <button class="history-navigation__button" type="button" data-action="history-back" aria-label="Quay lại trang trước" title="Quay lại">
        ${BootstrapIcon("arrow-left")}
      </button>
      <button class="history-navigation__button" type="button" data-action="history-forward" aria-label="Đi tới trang tiếp theo" title="Đi tiếp">
        ${BootstrapIcon("arrow-right")}
      </button>
    </nav>
  `;
}

export function Navbar(activePath = "/") {
  const user = getCurrentUser();
  const cartCount = getCartCount();
  const links = [
    ["home", ROUTES.home, "Trang chủ"],
    ["products", ROUTES.products, "Sản phẩm"],
    ["blog", ROUTES.blog, "Blog"],
    ["orders", ROUTES.orders, "Đơn hàng"],
    ["account", ROUTES.account, "Tài khoản"]
  ];
  return `
    <header class="site-header">
      <div class="container navbar">
        ${HistoryNavigation()}
        <a class="brand" href="${ROUTES.home}" aria-label="ẨN Store - Trang chủ">
          <span class="brand-mark" aria-hidden="true"><img src="/asset/Asset%202@4x.png?v=20260708" alt=""></span>
        </a>
        <nav class="nav-links" id="site-navigation" aria-label="Điều hướng chính">
          ${links.map(([key, href, label]) => `<a class="nav-link ${activePath === key ? "is-active" : ""}" href="${href}">${label}</a>`).join("")}
        </nav>
        <div class="nav-actions">
          <a class="icon-link" href="${user ? ROUTES.account : ROUTES.login}" aria-label="${user ? "Tài khoản " + escapeHtml(user.fullName) : "Đăng nhập"}">${BootstrapIcon("person")}</a>
          <a class="icon-link" href="${ROUTES.cart}" aria-label="Giỏ hàng có ${cartCount} sản phẩm">${BootstrapIcon("cart3")}<span class="cart-count">${cartCount}</span></a>
          <button class="menu-toggle" type="button" data-action="toggle-menu" aria-controls="site-navigation" aria-expanded="false">${BootstrapIcon("list")}</button>
        </div>
      </div>
    </header>
  `;
}

export function Footer() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="${ROUTES.home}">
              <span class="brand-mark" aria-hidden="true"><img src="/asset/Asset%202@4x.png?v=20260708" alt=""></span>
              <span class="brand-copy"><strong class="brand-name">ẨN STORE</strong><span class="brand-tagline">Board game lịch sử Việt Nam</span></span>
            </a>
            <p class="muted">Mỗi hộp game là một hồ sơ. Mỗi người chơi là một nhân chứng.</p>
          </div>
          <div>
            <h3 class="footer-title">Khám phá</h3>
            <nav class="footer-links" aria-label="Khám phá">
              <a href="${ROUTES.home}">Trang chủ</a><a href="${ROUTES.products}">Sản phẩm</a><a href="${ROUTES.blog}">Blog</a><a href="${ROUTES.orders}">Đơn hàng</a><a href="${ROUTES.adminLogin}">Khu vực Admin</a>
            </nav>
          </div>
          <div>
            <h3 class="footer-title">Chính sách</h3>
            <div class="footer-links"><button class="footer-link-button" type="button" data-action="open-shipping-policy">Chính sách giao nhận</button><button class="footer-link-button" type="button" data-action="open-return-policy">Chính sách đổi trả</button><button class="footer-link-button" type="button" data-action="open-privacy-policy">Chính sách bảo mật</button></div>
          </div>
          <div>
            <h3 class="footer-title">Hội quán</h3>
            <div class="footer-links"><span>Bản doanh: Lệ Chi Viên, Đại Việt thời Lê</span><span>Đường dây nóng: 090-XXX-XXXX</span><span>Thư tín: matan@anstore.vn</span><a href="https://www.facebook.com/anboardgame/?locale=vi_VN" target="_blank" rel="noopener">Theo dấu nhân gian: Facebook</a></div>
          </div>
        </div>
        <div class="footer-bottom"><span>© 2026 ẨN Store. Lưu giữ giai thoại qua từng ván chơi.</span><span>Thông tin được bảo mật theo chính sách của cửa hàng.</span></div>
      </div>
    </footer>
  `;
}

export function CategoryCard(category, image, count) {
  return `
    <a class="category-card" href="${withQuery(ROUTES.products, { category: category.id })}">
      <img src="${escapeHtml(image)}" alt="" loading="lazy">
      <span class="category-card__overlay" aria-hidden="true"></span>
      <span class="category-card__content">
        <span class="eyebrow">${count} sản phẩm</span>
        <h3>${escapeHtml(category.name)}</h3>
        <p>${escapeHtml(category.description)}</p>
      </span>
    </a>
  `;
}

export function PromotionBanner() {
  return `
    <article class="promotion-banner">
      <div class="promotion-copy">
        <p class="eyebrow">Mật lệnh tháng này</p>
        <h2>Giảm 10% cho cuộc điều tra đầu tiên</h2>
        <p>Áp dụng cho đơn từ 500.000 ₫. Mỗi tài khoản sử dụng một lần, giảm tối đa 150.000 ₫.</p>
        <strong class="promotion-code">AN10</strong>
        <div>${Button({ label: "Mở kho sản phẩm", href: ROUTES.products })}</div>
      </div>
      <div class="promotion-visual"><img src="/img/products/20.png" alt="Combo Sơ Khởi của ẨN Store" loading="lazy"></div>
    </article>
  `;
}

export function BlogCard(post) {
  return `
    <article class="blog-card">
      <img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" loading="lazy">
      <div class="blog-card__body">
        <time>${escapeHtml(formatDate(post.date))}</time>
        <h3>${escapeHtml(post.title)}</h3>
        <p class="muted">${escapeHtml(post.excerpt)}</p>
        <a class="nav-link" href="${ROUTES.blog}">Đọc hồ sơ →</a>
      </div>
    </article>
  `;
}

export function NewsletterForm() {
  return `
    <form class="newsletter-form" id="newsletter-form" novalidate>
      <label class="form-field">
        <span class="form-label">Email nhận mật thư</span>
        <input class="form-control" type="email" name="email" placeholder="ban@example.com" required>
      </label>
      <button class="button button--primary" type="submit">Đăng ký</button>
      <p class="form-message form-field--full" id="newsletter-message" aria-live="polite"></p>
    </form>
  `;
}











