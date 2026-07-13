import { EmptyState, PriceDisplay } from "../../components/index.js";
import {
  cartSummary,
  getCartItems,
  removeFromCart,
  setAllCartItemsSelected,
  setCartItemSelected,
  updateCartQuantity
} from "../../services/store.js";
import { escapeHtml, formatCurrency } from "../../utils/format.js";
import { productUrl, ROUTES } from "../../utils/routes.js";

export function CartPage() {
  const items = getCartItems();
  if (!items.length) {
    return `
      <section class="page-hero"><div class="container"><p class="eyebrow">Giỏ hàng</p><h1>Hồ sơ đang chọn</h1></div></section>
      <section class="section"><div class="container">${EmptyState({ title: "Giỏ hàng đang trống", description: "Kho lưu trữ vẫn còn nhiều hồ sơ đang chờ được mở.", actionLabel: "Tiếp tục mua hàng", actionHref: ROUTES.products, symbol: "⌑" })}</div></section>
    `;
  }
  const summary = cartSummary();
  const selectedCount = items.filter((item) => item.selected).length;
  const allSelected = selectedCount === items.length;
  return `
    <section class="page-hero">
      <div class="container">
        <nav class="breadcrumbs"><a href="${ROUTES.home}">Trang chủ</a><span>/</span><span>Giỏ hàng</span></nav>
        <p class="eyebrow">Giỏ hàng</p>
        <h1>Hồ sơ đang chọn</h1>
      </div>
    </section>
    <section class="section">
      <div class="container two-column-layout">
        <div class="cart-list">
          <label class="cart-select-all surface">
            <input type="checkbox" id="select-all-cart-items" ${allSelected ? "checked" : ""}>
            <span>Chọn tất cả (${items.length} sản phẩm)</span>
          </label>
          ${items.map((item) => {
            const product = item.product;
            const currentPrice = product.discountPrice ?? product.price;
            return `
              <article class="cart-item surface">
                <label class="cart-item__select" aria-label="Chọn ${escapeHtml(product.name)} để thanh toán"><input type="checkbox" data-cart-select="${product.id}" ${item.selected ? "checked" : ""}></label>
                <a href="${productUrl(product.id)}"><img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(product.name)}"></a>
                <div>
                  <p class="eyebrow">${escapeHtml(product.category)}</p>
                  <h3><a href="${productUrl(product.id)}">${escapeHtml(product.name)}</a></h3>
                  ${PriceDisplay(product)}
                  <div class="quantity-control" aria-label="Số lượng ${escapeHtml(product.name)}">
                    <button type="button" data-cart-action="decrease" data-product-id="${product.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="${product.stock}" data-cart-quantity="${product.id}" aria-label="Số lượng">
                    <button type="button" data-cart-action="increase" data-product-id="${product.id}">+</button>
                  </div>
                  <small class="stock-note">Còn ${product.stock} sản phẩm</small>
                  <button class="button button--ghost button--small" type="button" data-cart-action="remove" data-product-id="${product.id}">Xóa sản phẩm</button>
                </div>
                <div class="cart-item__price"><span class="muted">Thành tiền</span><strong>${formatCurrency(currentPrice * item.quantity)}</strong></div>
              </article>
            `;
          }).join("")}
          <p class="form-message" id="cart-message"></p>
          <a class="button button--secondary" href="${ROUTES.products}">Tiếp tục mua hàng</a>
          ${cartRemoveDialog()}
        </div>
        <aside class="summary-card surface">
          <p class="eyebrow">Tóm tắt</p>
          <h2>Chi phí dự kiến</h2>
          <div class="summary-line"><span>Tạm tính</span><strong>${formatCurrency(summary.subtotal)}</strong></div>
          <div class="summary-line"><span>Phí vận chuyển</span><strong>${summary.shippingFee ? formatCurrency(summary.shippingFee) : "Miễn phí"}</strong></div>
          <div class="summary-line summary-line--total"><span>Tổng dự kiến</span><strong>${formatCurrency(summary.total)}</strong></div>
          ${selectedCount
            ? `<a class="button button--primary" href="${ROUTES.checkout}">Tiến hành thanh toán</a>`
            : '<button class="button button--primary" type="button" disabled>Chọn sản phẩm để thanh toán</button>'}

        </aside>
      </div>
    </section>
  `;
}

function cartRemoveDialog() {
  return `<dialog class="confirm-dialog cart-remove-dialog" id="cart-remove-dialog"><form method="dialog" id="cart-remove-form"><p class="eyebrow">Xác nhận thao tác</p><h2>Xóa sản phẩm khỏi giỏ?</h2><p class="muted">Sản phẩm sẽ được bỏ khỏi giỏ hàng hiện tại. Bạn vẫn có thể thêm lại từ trang sản phẩm.</p><input type="hidden" name="productId"><div class="button-row"><button class="button button--ghost" type="button" data-cart-dialog="close">Quay lại</button><button class="button button--danger" type="submit">Xóa sản phẩm</button></div></form></dialog>`;
}

function requestCartRemoval(productId) {
  const dialog = document.querySelector("#cart-remove-dialog");
  const input = dialog?.querySelector('input[name="productId"]');
  if (!dialog || !input) return false;
  input.value = String(productId);
  if (typeof dialog.showModal === "function") dialog.showModal();
  else if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng?")) removeFromCart(productId);
  return true;
}
function showCartMessage(message) {
  const target = document.querySelector("#cart-message");
  if (target) target.textContent = message;
}

export function mountCartPage(render) {
  document.querySelector("#select-all-cart-items")?.addEventListener("change", (event) => {
    setAllCartItemsSelected(event.currentTarget.checked);
    render();
  });
  document.querySelectorAll("[data-cart-select]").forEach((input) => {
    input.addEventListener("change", () => {
      setCartItemSelected(input.dataset.cartSelect, input.checked);
      render();
    });
  });
  document.querySelectorAll("[data-cart-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.productId);
      const item = getCartItems().find((entry) => entry.productId === productId);
      if (!item) return;
      try {
        if (button.dataset.cartAction === "increase") updateCartQuantity(productId, item.quantity + 1);
        if (button.dataset.cartAction === "decrease") {
          if (item.quantity <= 1) {
            requestCartRemoval(productId);
            return;
          }
          updateCartQuantity(productId, item.quantity - 1);
        }
        if (button.dataset.cartAction === "remove") {
          requestCartRemoval(productId);
          return;
        }
        render();
      } catch (error) {
        showCartMessage(error.message);
      }
    });
  });
  document.querySelector("#cart-remove-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const productId = Number(new FormData(form).get("productId"));
    removeFromCart(productId);
    document.querySelector("#cart-remove-dialog")?.close();
    render();
  });
  document.querySelector('[data-cart-dialog="close"]')?.addEventListener("click", () => document.querySelector("#cart-remove-dialog")?.close());
  document.querySelectorAll("[data-cart-quantity]").forEach((input) => {
    input.addEventListener("change", () => {
      try {
        const nextQuantity = Number(input.value);
        if (nextQuantity < 1) {
          requestCartRemoval(Number(input.dataset.cartQuantity));
          return;
        }
        updateCartQuantity(Number(input.dataset.cartQuantity), nextQuantity);
        render();
      } catch (error) {
        showCartMessage(error.message);
      }
    });
  });
}


