import { EmptyState, StatusBadge } from "../../components/index.js";
import {
  cancelOrder,
  getCurrentUser,
  getMyOrders,
  getOrder,
  getProduct,
  reorder,
  submitReturnRequest,
  submitReview
} from "../../services/store.js";
import { escapeHtml, formatCurrency, formatDate, statusLabel } from "../../utils/format.js";
import { orderUrl, redirectTo, ROUTES } from "../../utils/routes.js";

function canRequestCancellation(order) {
  return ["PENDING", "CONFIRMED"].includes(order.status)
    && order.cancellationRequest?.status !== "PENDING";
}

function cancellationNotice(order) {
  if (!order.cancellationRequest) return "";
  const labels = {
    PENDING: "Yêu cầu hủy đang chờ duyệt",
    APPROVED: "Yêu cầu hủy đã được duyệt",
    REJECTED: "Yêu cầu hủy đã bị từ chối"
  };
  const status = order.cancellationRequest.status.toLowerCase();
  return `<p class="cancellation-notice cancellation-notice--${status}"><strong>${labels[order.cancellationRequest.status] || "Yêu cầu hủy"}</strong><span>${escapeHtml(order.cancellationRequest.reason)}</span></p>`;
}

export function OrdersPage() {
  if (!getCurrentUser()) {
    return `<section class="section"><div class="container">${EmptyState({ title: "Cần đăng nhập", description: "Đăng nhập để xem đơn hàng của bạn.", actionLabel: "Đăng nhập", actionHref: ROUTES.login })}</div></section>`;
  }
  const orders = getMyOrders();
  return `
    <section class="page-hero">
      <div class="container"><p class="eyebrow">Tài khoản</p><h1>Đơn hàng của tôi</h1><p class="muted">Theo dõi hành trình từ khi hồ sơ được tiếp nhận đến lúc giao thành công.</p></div>
    </section>
    <section class="section">
      <div class="container">
        ${orders.length ? `<div class="order-list">${orders.map((order) => `
          <article class="order-card surface">
            <div class="order-card__header">
              <div><p class="eyebrow">${escapeHtml(formatDate(order.createdAt))}</p><h3>${escapeHtml(order.code)}</h3></div>
              ${StatusBadge(order.status)}
            </div>
            <div class="summary-line"><span>${order.items.length} dòng sản phẩm</span><strong>${formatCurrency(order.total)}</strong></div>
            <div class="order-preview-list">
              ${order.items.slice(0, 3).map((item) => {
                const product = getProduct(item.productId);
                return `<div class="order-preview"><img src="${escapeHtml(product?.images[0] || "")}" alt=""><span><strong>${escapeHtml(product?.name || "Sản phẩm")}</strong><small>Số lượng: ${item.quantity}</small></span></div>`;
              }).join("")}
            </div>
            ${cancellationNotice(order)}
            <div class="button-row">
              <a class="button button--primary button--small" href="${orderUrl(order.id)}">Xem chi tiết</a>
              <button class="button button--ghost button--small" type="button" data-order-action="reorder" data-order-id="${order.id}">Mua lại</button>
              ${canRequestCancellation(order) ? `<button class="button button--danger button--small" type="button" data-order-action="cancel" data-order-id="${order.id}">${order.status === "PENDING" ? "Hủy đơn" : "Yêu cầu hủy"}</button>` : ""}
            </div>
          </article>
        `).join("")}</div>` : EmptyState({ title: "Chưa có đơn hàng", description: "Đơn hàng đầu tiên của bạn sẽ xuất hiện tại đây.", actionLabel: "Khám phá sản phẩm", actionHref: ROUTES.products })}
        <p class="form-message" id="order-message"></p>
        ${cancelOrderDialog()}
      </div>
    </section>
  `;
}

export function OrderDetailPage(orderId) {
  const order = getOrder(orderId);
  const user = getCurrentUser();
  if (!user || !order || order.userId !== user.id) {
    return `<section class="section"><div class="container">${EmptyState({ title: "Không tìm thấy đơn hàng", description: "Đơn hàng không tồn tại hoặc không thuộc tài khoản này.", actionLabel: "Về danh sách đơn", actionHref: ROUTES.orders })}</div></section>`;
  }
  return `
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumbs"><a href="${ROUTES.home}">Trang chủ</a><span>/</span><a href="${ROUTES.orders}">Đơn hàng</a><span>/</span><span>${escapeHtml(order.code)}</span></nav>
        <p class="eyebrow">Chi tiết đơn hàng</p>
        <h1>${escapeHtml(order.code)}</h1>
        ${StatusBadge(order.status)}
        <div class="button-row order-detail-navigation" aria-label="Điều hướng đơn hàng">
          <a class="button button--ghost" href="${ROUTES.orders}">← Quay lại danh sách đơn</a>
          <a class="button button--secondary" href="${ROUTES.products}">Tiếp tục mua hàng</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container two-column-layout">
        <div class="checkout-steps">
          <section class="checkout-step surface">
            <h2>Sản phẩm</h2>
            ${order.items.map((item) => {
              const product = getProduct(item.productId);
              return `<div class="cart-item"><img src="${escapeHtml(product?.images[0] || "")}" alt="${escapeHtml(product?.name || "Sản phẩm")}"><div><h3>${escapeHtml(product?.name || "Sản phẩm")}</h3><p class="muted">Số lượng: ${item.quantity}</p></div><strong>${formatCurrency(item.unitPrice * item.quantity)}</strong></div>`;
            }).join("")}
          </section>
          <section class="checkout-step surface">
            <h2>Hành trình đơn hàng</h2>
            <div class="timeline">
              ${order.timeline.map((item) => `<div class="timeline-item"><span class="timeline-dot"></span><div><strong>${escapeHtml(statusLabel(item.status))}</strong><p class="muted">${escapeHtml(formatDate(item.at))}</p></div></div>`).join("")}
            </div>
          </section>
          ${order.status === "DELIVERED" ? deliveredActions(order) : ""}
          <p class="form-message" id="order-message"></p>
        </div>
        <aside class="summary-card surface">
          <p class="eyebrow">Thông tin giao nhận</p>
          <h2>${escapeHtml(order.address.receiverName)}</h2>
          <p>${escapeHtml(order.address.receiverPhone)}</p>
          <p class="muted">${escapeHtml(order.address.detail)}</p>
          <div class="summary-line"><span>Tạm tính</span><strong>${formatCurrency(order.subtotal)}</strong></div>
          <div class="summary-line"><span>Giảm giá</span><strong>-${formatCurrency(order.discount)}</strong></div>
          <div class="summary-line"><span>Phí vận chuyển</span><strong>${formatCurrency(order.shippingFee)}</strong></div>
          <div class="summary-line summary-line--total"><span>Tổng cộng</span><strong>${formatCurrency(order.total)}</strong></div>
          <div class="button-row">
            <button class="button button--secondary" type="button" data-order-action="reorder" data-order-id="${order.id}">Mua lại</button>
            ${canRequestCancellation(order) ? `<button class="button button--danger" type="button" data-order-action="cancel" data-order-id="${order.id}">${order.status === "PENDING" ? "Hủy đơn" : "Yêu cầu hủy"}</button>` : ""}
          </div>
          ${cancellationNotice(order)}
        </aside>
      </div>
      ${cancelOrderDialog()}
    </section>
  `;
}

function cancelOrderDialog() {
  return `
    <dialog class="confirm-dialog" id="cancel-order-dialog">
      <form method="dialog" id="cancel-order-form">
        <p class="eyebrow">Xác nhận thao tác</p>
        <h2>Hủy đơn hàng?</h2>
        <p class="muted" id="cancel-order-description">Vui lòng cho ẨN Store biết lý do hủy đơn.</p>
        <input type="hidden" name="orderId">
        <label class="form-field"><span class="form-label">Lý do hủy</span><select class="form-control" name="reasonChoice" required><option value="">Chọn lý do</option><option>Tôi muốn cập nhật địa chỉ hoặc SĐT nhận hàng</option><option>Tôi muốn thêm hoặc thay đổi mã giảm giá</option><option>Tôi muốn thay đổi sản phẩm hoặc số lượng</option><option>Thủ tục thanh toán không thuận tiện</option><option>Tôi tìm thấy nơi mua khác phù hợp hơn</option><option>Tôi không còn nhu cầu mua nữa</option><option value="OTHER">Lý do khác</option></select></label>
        <label class="form-field is-hidden" id="cancel-reason-detail"><span class="form-label">Mô tả lý do</span><textarea class="form-control" name="reasonDetail" minlength="5" maxlength="500" placeholder="Nhập lý do cụ thể"></textarea></label>
        <p class="form-message" id="cancel-order-message"></p>
        <div class="button-row"><button class="button button--ghost" type="button" data-dialog-action="close">Quay lại</button><button class="button button--danger" type="submit">Xác nhận hủy</button></div>
      </form>
    </dialog>
  `;
}

function deliveredActions(order) {
  return `
    <section class="checkout-step surface">
      <p class="eyebrow">Hậu mãi</p>
      <h2>Đổi/ Trả và đánh giá</h2>
      <div class="detail-copy">
        <form id="return-form" class="form-grid">
          <input type="hidden" name="orderId" value="${order.id}">
          <label class="form-field form-field--full"><span class="form-label">Sản phẩm đổi/trả</span><select class="form-control" name="productId">${order.items.map((item) => `<option value="${item.productId}">${escapeHtml(getProduct(item.productId)?.name || "Sản phẩm")}</option>`).join("")}</select></label>
          <label class="form-field"><span class="form-label">Loại yêu cầu</span><select class="form-control" name="type"><option value="RETURN">Trả hàng</option><option value="EXCHANGE">Đổi hàng</option></select></label>
          <label class="form-field"><span class="form-label">Import ảnh minh chứng</span><input class="form-control" type="file" name="evidence" accept="image/*"></label>
          <label class="form-field form-field--full"><span class="form-label">Lý do</span><textarea class="form-control" name="reason" required></textarea></label>
          <button class="button button--secondary" type="submit">Gửi yêu cầu đổi/ trả</button>
        </form>
        <form id="review-form" class="form-grid">
          <input type="hidden" name="orderId" value="${order.id}">
          <label class="form-field form-field--full"><span class="form-label">Sản phẩm đánh giá</span><select class="form-control" name="productId">${order.items.map((item) => `<option value="${item.productId}">${escapeHtml(getProduct(item.productId)?.name || "Sản phẩm")}</option>`).join("")}</select></label>
          <label class="form-field"><span class="form-label">Điểm sao</span><select class="form-control" name="rating"><option value="5">5 sao</option><option value="4">4 sao</option><option value="3">3 sao</option><option value="2">2 sao</option><option value="1">1 sao</option></select></label>
          <label class="form-field"><span class="form-label">Import ảnh review</span><input class="form-control" type="file" name="image" accept="image/*"></label>
          <div class="form-field form-field--full review-suggestions"><span class="form-label">Gợi ý đánh giá nhanh</span><div class="suggestion-chip-row"><button type="button" data-review-suggestion="Sản phẩm ổn, đúng mô tả.">Sản phẩm ổn</button><button type="button" data-review-suggestion="Hàng đẹp, đóng gói kỹ, giao nhanh.">Đóng gói kỹ</button><button type="button" data-review-suggestion="Rất hài lòng, sản phẩm chất lượng, sẽ ủng hộ shop tiếp.">Rất hài lòng</button><button type="button" data-review-suggestion="Shop tư vấn nhiệt tình, phản hồi nhanh.">Shop nhiệt tình</button><button type="button" data-review-suggestion="">Khác</button></div></div>
          <label class="form-field form-field--full"><span class="form-label">Nhận xét</span><textarea class="form-control" name="comment" required></textarea></label>
          <button class="button button--primary" type="submit">Gửi đánh giá</button>
        </form>
      </div>
    </section>
  `;
}

function showOrderMessage(message, success = false) {
  const target = document.querySelector("#order-message");
  if (target) {
    target.textContent = message;
    target.classList.toggle("form-message--success", success);
  }
  document.querySelector(".order-floating-message")?.remove();
  const popup = document.createElement("div");
  popup.className = "order-floating-message" + (success ? " order-floating-message--success" : "");
  popup.textContent = message;
  document.body.append(popup);
  window.setTimeout(() => popup.remove(), 3600);
}

export function mountOrdersPage(render) {
  document.querySelectorAll("[data-order-action]").forEach((button) => {
    button.addEventListener("click", () => {
      try {
        if (button.dataset.orderAction === "cancel") {
          const dialog = document.querySelector("#cancel-order-dialog");
          const order = getOrder(button.dataset.orderId);
          dialog.querySelector('[name="orderId"]').value = button.dataset.orderId;
          const description = dialog.querySelector("#cancel-order-description");
          if (description) {
            description.textContent = order?.status === "PENDING"
              ? "Đơn đang chờ xác nhận và sẽ được hủy ngay sau khi bạn xác nhận."
              : "Đơn đã được xử lý; yêu cầu hủy sẽ được gửi đến quản trị viên để xét duyệt.";
          }
          dialog.showModal();
          return;
        }
        if (button.dataset.orderAction === "reorder") {
          reorder(button.dataset.orderId);
          redirectTo(ROUTES.cart);
          return;
        }
        render();
      } catch (error) {
        showOrderMessage(error.message);
      }
    });
  });
  document.querySelector('[data-dialog-action="close"]')?.addEventListener("click", () => {
    document.querySelector("#cancel-order-dialog")?.close();
  });
  document.querySelector('[name="reasonChoice"]')?.addEventListener("change", (event) => {
    const isOther = event.currentTarget.value === "OTHER";
    document.querySelector("#cancel-reason-detail")?.classList.toggle("is-hidden", !isOther);
    const detail = document.querySelector('[name="reasonDetail"]');
    if (detail) detail.required = isOther;
  });
  document.querySelector("#cancel-order-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const reason = form.elements.reasonChoice.value === "OTHER"
        ? form.elements.reasonDetail.value
        : form.elements.reasonChoice.value;
      const result = cancelOrder(form.elements.orderId.value, reason);
      document.querySelector("#cancel-order-dialog")?.close();
      render();
      showOrderMessage(result.message, true);
    } catch (error) {
      const message = document.querySelector("#cancel-order-message");
      if (message) message.textContent = error.message;
    }
  });
  document.querySelectorAll("[data-review-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      const textarea = document.querySelector('#review-form textarea[name="comment"]');
      if (textarea) {
        textarea.value = button.dataset.reviewSuggestion;
        textarea.focus();
      }
    });
  });
  document.querySelector("#return-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.evidenceName = form.elements.evidence.files[0]?.name || null;
    try {
      submitReturnRequest(data);
      form.reset();
      showOrderMessage("Đã Gửi yêu cầu đổi/ trả. Trạng thái hiện tại: Chờ duyệt.", true);
    } catch (error) {
      showOrderMessage(error.message);
    }
  });
  document.querySelector("#review-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.imageName = form.elements.image.files[0]?.name || null;
    try {
      submitReview(data);
      form.reset();
      showOrderMessage("Đánh giá đã được ghi nhận.", true);
    } catch (error) {
      showOrderMessage(error.message);
    }
  });
}








