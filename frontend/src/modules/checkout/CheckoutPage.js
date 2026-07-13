import { BootstrapIcon, EmptyState } from "../../components/index.js";
import {
  cartSummary,
  checkoutOrder,
  getCurrentUser,
  getUserAddresses,
  validateVoucher
} from "../../services/store.js";
import { escapeHtml, formatCurrency } from "../../utils/format.js";
import { redirectTo, ROUTES, withQuery } from "../../utils/routes.js";

function queryParams() {
  return new URLSearchParams(location.search);
}

export function CheckoutPage() {
  const user = getCurrentUser();
  if (!user) return "";
  let addresses = [];
  try {
    addresses = getUserAddresses();
  } catch {
    addresses = [];
  }
  if (!addresses.length) {
    return `<section class="section"><div class="container">${EmptyState({ title: "Chưa có địa chỉ giao hàng", description: "Hãy thêm địa chỉ trước khi tiếp tục checkout.", actionLabel: "Thêm địa chỉ", actionHref: ROUTES.addresses, symbol: "⌖" })}</div></section>`;
  }
  const params = queryParams();
  const voucherCode = params.get("voucher") || "";
  let summary;
  let voucherError = "";
  try {
    summary = cartSummary(voucherCode);
  } catch (error) {
    voucherError = error.message;
    summary = cartSummary();
  }
  if (!summary.items.length) {
    return `<section class="section"><div class="container">${EmptyState({ title: "Chưa chọn sản phẩm", description: "Quay lại giỏ hàng và tích chọn ít nhất một sản phẩm cần thanh toán.", actionLabel: "Về giỏ hàng", actionHref: ROUTES.cart })}</div></section>`;
  }
  return `
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumbs"><a href="${ROUTES.home}">Trang chủ</a><span>/</span><a href="${ROUTES.cart}">Giỏ hàng</a><span>/</span><span>Checkout</span></nav>
        <p class="eyebrow">Checkout bảo mật</p>
        <h1>Xác nhận hồ sơ đặt hàng</h1>
        <p class="muted">Mã đơn sẽ được tạo trước khi thanh toán giả lập.</p>
      </div>
    </section>
    <section class="section">
      <div class="container two-column-layout">
        <form class="checkout-steps" id="checkout-form">
          <section class="checkout-step surface">
            <div class="checkout-step__title"><span class="step-number">1</span><div><p class="eyebrow">Giao nhận</p><h2>Chọn địa chỉ</h2></div></div>
            <div class="address-list">
              ${addresses.map((address) => `
                <label class="radio-card">
                  <input type="radio" name="addressId" value="${address.id}" ${address.isDefault ? "checked" : ""} required>
                  <span><strong>${escapeHtml(address.label)} · ${escapeHtml(address.receiverName)}</strong><br><span class="muted">${escapeHtml(address.receiverPhone)} · ${escapeHtml([address.detailAddress, address.ward, address.district, address.province].filter(Boolean).join(", "))}</span></span>
                </label>
              `).join("")}
            </div>
            <a class="nav-link" href="${ROUTES.addresses}">Quản lý địa chỉ</a>
          </section>

          <section class="checkout-step surface">
            <div class="checkout-step__title"><span class="step-number">2</span><div><p class="eyebrow">Ưu đãi</p><h2>Áp dụng voucher</h2></div></div>
            <div class="newsletter-form">
              <label class="form-field"><span class="form-label">Mã voucher</span><input class="form-control" id="voucher-code" value="${escapeHtml(voucherCode)}" placeholder="Thử mã AN10"></label>
              <button class="button button--secondary" type="button" id="apply-voucher">Áp dụng</button>
            </div>
            <p class="form-message ${summary.voucher ? "form-message--success" : ""}" id="voucher-message">${summary.voucher ? "Đã áp dụng " + escapeHtml(summary.voucher.code) : escapeHtml(voucherError)}</p>
          </section>

          <section class="checkout-step surface">
            <div class="checkout-step__title"><span class="step-number">3</span><div><p class="eyebrow">Thanh toán</p><h2>Phương thức thanh toán</h2></div></div>
            <div class="payment-method-list">
              <label class="radio-card payment-radio-card">
                <input type="radio" name="paymentMethod" value="COD" checked>
                <span class="payment-method-card__icon" aria-hidden="true">${BootstrapIcon("credit-card")}</span>
                <span><strong>Thanh toán khi nhận hàng (COD)</strong><br><span class="muted">Kiểm tra kiện hàng và thanh toán cho đơn vị vận chuyển khi nhận hàng.</span></span>
              </label>
              <label class="radio-card payment-radio-card">
                <input type="radio" name="paymentMethod" value="MOCK_CARD">
                <span class="payment-method-card__icon" aria-hidden="true">${BootstrapIcon("qr-code")}</span>
                <span><strong>Thanh toán online bằng mã QR</strong><br><span class="muted">Tính năng demo: hiển thị mã QR để quét, chưa kết nối cổng thanh toán thật.</span></span>
              </label>
            </div>
            <button class="button button--secondary button--small" type="button" id="show-payment-qr">Xem mã QR thanh toán</button>
            <p class="form-message" id="checkout-message"></p>
            <button class="button button--primary" type="submit">Đặt hàng</button>
          </section>
        </form>

        <aside class="summary-card surface">
          <p class="eyebrow">Đơn hàng của ${escapeHtml(user.fullName)}</p>
          <h2>Tóm tắt thanh toán</h2>
          ${summary.items.map((item) => `<div class="summary-line"><span>${escapeHtml(item.product.name)} × ${item.quantity}</span><strong>${formatCurrency((item.product.discountPrice ?? item.product.price) * item.quantity)}</strong></div>`).join("")}
          <div class="summary-line"><span>Tạm tính</span><strong>${formatCurrency(summary.subtotal)}</strong></div>
          <div class="summary-line"><span>Giảm giá${summary.voucher ? " · " + escapeHtml(summary.voucher.code) : ""}</span><strong>-${formatCurrency(summary.discount)}</strong></div>
          ${summary.voucher ? `<p class="voucher-applied-note">Voucher đã áp dụng, đơn hàng giảm ${formatCurrency(summary.discount)}.</p>` : `<p class="voucher-applied-note">Bạn có thể nhập mã voucher ở bước ưu đãi để hệ thống tự tính giảm giá.</p>`}
          <div class="summary-line"><span>Phí vận chuyển</span><strong>${summary.shippingFee ? formatCurrency(summary.shippingFee) : "Miễn phí"}</strong></div>
          <div class="summary-line summary-line--total"><span>Thanh toán</span><strong>${formatCurrency(summary.total)}</strong></div>
        </aside>
      </div>
    </section>
  `;
}

export function CheckoutSuccessPage() {
  const code = queryParams().get("code") || "";
  const isCod = queryParams().get("method") === "COD";
  if (!code) {
    return `<section class="section"><div class="container">${EmptyState({ title: "Chưa có đơn hàng mới", description: "Thông tin checkout cũ đã được làm trống. Hãy quay lại giỏ hàng để tạo đơn mới.", actionLabel: "Về giỏ hàng", actionHref: ROUTES.cart })}</div></section>`;
  }
  return `
    <section class="section">
      <div class="container">
        <div class="empty-state surface">
          <div>
            <div class="success-visual" aria-hidden="true">
              <span class="success-visual__icon">${BootstrapIcon("check-circle")}</span>
              <img src="/asset/Asset%202@4x.png?v=20260708" alt="">
            </div>
            <p class="eyebrow">${isCod ? "Đặt hàng thành công" : "Thanh toán thành công"}</p>
            <h1>Hồ sơ đã được tiếp nhận</h1>
            <p>Mã đơn hàng: <strong>${escapeHtml(code)}</strong></p>
            <p>Cảm ơn bạn đã tin tưởng và chọn ẨN Store.</p>
            <p class="muted">${isCod ? "Đơn hàng đang chờ ẨN Store xác nhận và chuẩn bị giao đến bạn." : "Thanh toán đã hoàn tất. ẨN Store đang chuẩn bị đơn hàng của bạn."}</p>
            <p class="muted">Nếu cần hỗ trợ, vui lòng liên hệ 079 715 9467 hoặc matan@anstore.vn.</p>
            <div class="button-row success-actions">
              <a class="button button--primary" href="${ROUTES.orders}">Xem đơn hàng</a>
              <a class="button button--secondary" href="${ROUTES.products}">Tiếp tục mua hàng</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function mountCheckoutPage() {
  if (!getCurrentUser()) {
    redirectTo(withQuery(ROUTES.login, { redirect: ROUTES.checkout }));
    return;
  }
  document.querySelector("#apply-voucher")?.addEventListener("click", () => {
    const code = document.querySelector("#voucher-code")?.value.trim() || "";
    try {
      const currentSubtotal = cartSummary().subtotal;
      validateVoucher(code, currentSubtotal);
      redirectTo(withQuery(ROUTES.checkout, { voucher: code.toUpperCase() }));
    } catch (error) {
      const message = document.querySelector("#voucher-message");
      if (message) {
        message.textContent = error.message;
        message.classList.remove("form-message--success");
      }
    }
  });
  document.querySelector("#show-payment-qr")?.addEventListener("click", () => {
    document.querySelector("[data-payment-qr-modal]")?.remove();
    const qrSource = new URL("../../../img/payment/qr.jpg", window.location.href).href;
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop payment-qr-backdrop";
    backdrop.dataset.paymentQrModal = "true";
    backdrop.innerHTML = `<article class="modal payment-qr-modal" role="dialog" aria-modal="true" aria-labelledby="payment-qr-title"><button class="modal-close" type="button" data-payment-qr-close aria-label="Đóng">×</button><p class="eyebrow">Thanh toán online mock</p><h2 id="payment-qr-title">Quét mã QR thanh toán</h2><img src="${qrSource}" alt="Mã QR thanh toán AN Store" data-payment-qr-image><p class="form-message payment-qr-error is-hidden" data-payment-qr-error>Không tải được mã QR. Vui lòng kiểm tra file img/payment/qr.jpg.</p><p class="muted">Mã QR chỉ phục vụ demo giao diện. Sau khi chọn phương thức online và bấm Đặt hàng, hệ thống giả lập thanh toán thành công.</p></article>`;
    document.body.append(backdrop);
    backdrop.querySelector("[data-payment-qr-image]")?.addEventListener("error", () => {
      backdrop.querySelector("[data-payment-qr-error]")?.classList.remove("is-hidden");
    });
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-payment-qr-close]")) document.querySelector("[data-payment-qr-modal]")?.remove();
  });
  document.querySelector("#checkout-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.voucherCode = queryParams().get("voucher") || "";
    try {
      const result = checkoutOrder(data);
      if (result.success) {
        redirectTo(withQuery(ROUTES.checkoutSuccess, { code: result.code, method: result.paymentMethod }));
      } else {
        const message = document.querySelector("#checkout-message");
        if (message) message.textContent = result.message + " Mã thử: " + result.code;
      }
    } catch (error) {
      const message = document.querySelector("#checkout-message");
      if (message) message.textContent = error.message;
    }
  });
}









