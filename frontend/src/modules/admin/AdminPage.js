import { BootstrapIcon, EmptyState, StatusBadge } from "../../components/index.js";
import {
  addBlog,
  adjustInventory,
  deleteProducts,
  getAdminData,
  getProduct,
  isAdminLoggedIn,
  loginAdmin,
  logoutAdmin,
  resolveCancellationRequest,
  resolveReturn,
  resolveUserBlog,
  saveAdminProduct,
  saveCategory,
  saveVoucher,
  toggleBlog,
  toggleCategory,
  toggleProductVisibility,
  toggleReview,
  toggleVoucher,
  updateOrderStatus
} from "../../services/store.js";
import { escapeHtml, formatCurrency, formatDate, isValidEmail, statusLabel } from "../../utils/format.js";
import { redirectTo, ROUTES, withQuery } from "../../utils/routes.js";

const adminTabs = [
  ["dashboard", "Dashboard"],
  ["products", "Sản phẩm"],
  ["categories", "Danh mục"],
  ["inventory", "Tồn kho"],
  ["orders", "Đơn hàng"],
  ["vouchers", "Voucher"],
  ["returns", "Đổi/ Trả"],
  ["reviews", "Đánh giá"],
  ["blogs", "Blog"]
];

function adminQuery() {
  return new URLSearchParams(location.search);
}

export function AdminLoginPage() {
  return `
    <section class="auth-shell">
      <div class="auth-visual"><img src="/img/products/22.png" alt=""></div>
      <div class="auth-panel">
        <div class="auth-card">
          <p class="eyebrow">Khu vực quản trị riêng</p>
          <h1>Đăng nhập Admin</h1>
          <form id="admin-login-form" class="form-grid">
            <label class="form-field form-field--full"><span class="form-label">Email quản trị</span><input class="form-control" type="email" name="email" value="admin@anstore.vn" required></label>
            <label class="form-field form-field--full password-field"><span class="form-label">Mật khẩu</span><span class="password-input-wrap"><input class="form-control" type="password" name="password" value="password" required><button class="password-toggle" type="button" data-action="toggle-password" aria-label="Hiện mật khẩu" aria-pressed="false"><span class="password-toggle__icon" data-password-eye>${BootstrapIcon("eye")}</span><span class="password-toggle__icon is-hidden" data-password-eye-off>${BootstrapIcon("eye-slash")}</span></button></span></label>
            <p class="form-message form-field--full" id="admin-message"></p>
            <button class="button button--primary form-field--full" type="submit">Vào trang quản trị</button>
          </form>
          <a class="nav-link" href="${ROUTES.home}">Quay lại cửa hàng</a>
        </div>
      </div>
    </section>
  `;
}

export function AdminPage() {
  if (!isAdminLoggedIn()) return "";
  const tab = adminQuery().get("tab") || "dashboard";
  const data = getAdminData();
  return `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <a class="brand" href="${ROUTES.home}"><span class="brand-mark"><img src="/asset/Asset%202@4x.png?v=20260708" alt="Logo ẨN Store"></span><span class="brand-copy"><strong class="brand-name">ẨN ADMIN</strong><span class="brand-tagline">Trung tâm điều phối</span></span></a>
        <nav class="admin-nav" aria-label="Quản trị">
          ${adminTabs.map(([id, label]) => `<button class="${tab === id ? "is-active" : ""}" type="button" data-admin-tab="${id}">${label}</button>`).join("")}
        </nav>
        <div class="button-row">
          <button class="button button--danger button--small" type="button" data-admin-action="logout">Đăng xuất</button>
        </div>
      </aside>
      <main class="admin-main" id="main-content">
        <header class="admin-header">
          <div><p class="eyebrow">ẨN Store · Quản trị</p><h1>${escapeHtml(adminTabs.find(([id]) => id === tab)?.[1] || "Dashboard")}</h1></div>
          <a class="button button--secondary button--small" href="${ROUTES.home}">Xem cửa hàng</a>
        </header>
        <p class="form-message" id="admin-message"></p>
        ${adminContent(tab, data)}
      </main>
    </div>
  `;
}

function adminContent(tab, data) {
  if (tab === "products") return productsPanel(data);
  if (tab === "categories") return categoriesPanel(data);
  if (tab === "inventory") return inventoryPanel(data);
  if (tab === "orders") return ordersPanel(data);
  if (tab === "vouchers") return vouchersPanel(data);
  if (tab === "returns") return returnsPanel(data);
  if (tab === "reviews") return reviewsPanel(data);
  if (tab === "blogs") return blogsPanel(data);
  return dashboardPanel(data);
}

function formatAdminDate(value) {
  const formatted = formatDate(value);
  return formatted || "-";
}

function adminPaymentLabel(order) {
  if (order.paymentMethod === "COD" && order.status !== "DELIVERED") return "COD - Chưa thu tiền";
  if (order.paymentMethod === "COD" && order.status === "DELIVERED") return "COD - Đã thu tiền";
  return statusLabel(order.paymentStatus);
}

function adminUrl(tab, params = {}) {
  return withQuery(ROUTES.admin, { tab, ...params });
}
function dashboardPanel(data) {
  const orders = data.orders || [];
  const products = data.products || [];
  const categories = (data.categories || []).filter((category) => category.id !== "all");
  const paidOrders = orders.filter((order) => order.paymentStatus === "SUCCESS" || order.status === "DELIVERED");
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalOrders = orders.length;
  const averageOrder = paidOrders.length ? Math.round(revenue / paidOrders.length) : 0;
  const completedOrders = orders.filter((order) => order.status === "DELIVERED").length;
  const completionRate = totalOrders ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const lowStock = products.filter((product) => Number(product.stock || 0) <= 5).length;
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const pendingBlogs = (data.userBlogSubmissions || []).filter((post) => post.status === "PENDING").length;
  const pendingReturns = (data.returns || []).filter((item) => item.status === "PENDING").length;
  const totalReviews = data.reviews.length;
  const averageRating = totalReviews ? (data.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews).toFixed(1) : "0.0";
  const statusConfig = [
    ["PENDING", "Chờ xác nhận", "#e2b05b"],
    ["CONFIRMED", "Đã xác nhận", "#c68a46"],
    ["SHIPPING", "Đang giao", "#d95836"],
    ["DELIVERED", "Đã giao", "#89b96f"],
    ["CANCELLED", "Đã hủy", "#9b4b49"]
  ];
  const statusCounts = statusConfig.map(([status, label, color]) => ({ status, label, color, count: orders.filter((order) => order.status === status).length }));
  let donutCursor = 0;
  const donutGradient = statusCounts.filter((item) => item.count > 0).map((item) => {
    const start = donutCursor;
    const size = totalOrders ? (item.count / totalOrders) * 100 : 0;
    donutCursor += size;
    return `${item.color} ${start}% ${donutCursor}%`;
  }).join(", ") || "rgba(255,244,218,0.16) 0% 100%";

  const parseOrderDate = (value) => {
    const match = String(value || "").match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
    if (!match) return new Date();
    return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
  };
  const trendMap = new Map();
  orders.forEach((order) => {
    const date = parseOrderDate(order.createdAt);
    const key = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
    const current = trendMap.get(key) || { label: key, orders: 0, revenue: 0, time: date.getTime() };
    current.orders += 1;
    current.revenue += Number(order.total || 0);
    trendMap.set(key, current);
  });
  const trendRows = [...trendMap.values()].sort((a, b) => a.time - b.time).slice(-6);
  const maxTrendOrders = Math.max(1, ...trendRows.map((row) => row.orders));
  const maxTrendRevenue = Math.max(1, ...trendRows.map((row) => row.revenue));

  const productRows = products.map((product) => {
    const orderItems = orders.flatMap((order) => order.items || []).filter((item) => item.productId === product.id);
    const sold = orderItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const sales = orderItems.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
    const reviews = data.reviews.filter((review) => review.productId === product.id);
    const rating = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : 0;
    return { product, sold, sales, rating, reviewCount: reviews.length };
  }).sort((a, b) => b.sold - a.sold).slice(0, 5);
  const maxSold = Math.max(1, ...productRows.map((row) => row.sold));

  const categoryRows = categories.map((category) => {
    const categoryProducts = products.filter((product) => product.category === category.id);
    const categoryProductIds = new Set(categoryProducts.map((product) => product.id));
    const sales = orders.flatMap((order) => order.items || []).filter((item) => categoryProductIds.has(item.productId)).reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
    return { category, sales };
  });
  const maxCategorySales = Math.max(1, ...categoryRows.map((row) => row.sales));

  return `
    <section class="admin-dashboard-v2">
      <div class="dashboard-kpi-strip">
        <article class="surface dashboard-kpi-card"><span>Doanh thu</span><strong>${formatCurrency(revenue)}</strong><small>Đơn đã thanh toán/đã giao</small></article>
        <article class="surface dashboard-kpi-card"><span>Tổng đơn</span><strong>${totalOrders}</strong><small>${pendingOrders} đơn chờ xác nhận</small></article>
        <article class="surface dashboard-kpi-card"><span>Giá trị TB/đơn</span><strong>${formatCurrency(averageOrder)}</strong><small>AOV theo đơn ghi nhận</small></article>
        <article class="surface dashboard-kpi-card"><span>Tỷ lệ hoàn tất</span><strong>${completionRate}%</strong><small>${completedOrders}/${totalOrders} đơn đã giao</small></article>
        <article class="surface dashboard-kpi-card"><span>Tồn kho thấp</span><strong>${lowStock}</strong><small>Cần kiểm tra nhập kho</small></article>
      </div>

      <div class="dashboard-main-grid">
        <article class="surface dashboard-panel dashboard-panel--wide">
          <div class="dashboard-panel__head"><div><p class="eyebrow">Xu hướng</p><h2>Đơn hàng & doanh thu</h2></div><span class="dashboard-note">Theo ngày phát sinh</span></div>
          <div class="dashboard-trend-chart">${trendRows.map((row) => `<div class="trend-column"><div class="trend-bars"><i class="trend-bar trend-bar--orders" style="height:${Math.max(8, Math.round(row.orders / maxTrendOrders * 100))}%" data-tooltip="${row.orders} đơn" tabindex="0" aria-label="${row.orders} đơn ngày ${row.label}"></i><i class="trend-bar trend-bar--revenue" style="height:${Math.max(8, Math.round(row.revenue / maxTrendRevenue * 100))}%" data-tooltip="${formatCurrency(row.revenue)}" tabindex="0" aria-label="Doanh thu ${formatCurrency(row.revenue)} ngày ${row.label}"></i></div><strong>${row.orders}</strong><span>${row.label}</span></div>`).join("")}</div>
          <div class="dashboard-legend"><span><i class="legend-dot legend-dot--orders"></i>Số đơn</span><span><i class="legend-dot legend-dot--revenue"></i>Doanh thu</span></div>
        </article>

        <article class="surface dashboard-panel dashboard-panel--status">
          <div class="dashboard-panel__head"><div><p class="eyebrow">Vận hành</p><h2>Trạng thái đơn</h2></div></div>
          <div class="dashboard-donut-wrap"><div class="dashboard-donut" style="--donut:${donutGradient}" tabindex="0" aria-label="Xem số lượng đơn theo trạng thái"><span>${totalOrders}</span><small>Tổng đơn</small><div class="dashboard-donut-tooltip" role="tooltip">${statusCounts.map((item) => `<p><i style="background:${item.color}"></i><span>${item.label}</span><strong>${item.count}</strong></p>`).join("")}</div></div><div class="dashboard-status-list">${statusCounts.map((item) => `<div><i style="background:${item.color}"></i><span>${item.label}</span><strong>${item.count}</strong></div>`).join("")}</div></div>
        </article>
      </div>

      <div class="dashboard-main-grid dashboard-main-grid--equal">
        <article class="surface dashboard-panel">
          <div class="dashboard-panel__head"><div><p class="eyebrow">Danh mục</p><h2>Doanh thu theo danh mục</h2></div></div>
          <div class="category-revenue-chart">${categoryRows.map((row) => `<div class="category-revenue-row"><span>${escapeHtml(row.category.name)}</span><div><i style="width:${row.sales ? Math.max(8, Math.round(row.sales / maxCategorySales * 100)) : 0}%" data-tooltip="${formatCurrency(row.sales)}" tabindex="0" aria-label="Doanh thu ${escapeHtml(row.category.name)}: ${formatCurrency(row.sales)}"></i></div><strong>${formatCurrency(row.sales)}</strong></div>`).join("")}</div>
        </article>
        <article class="surface dashboard-panel">
          <div class="dashboard-panel__head"><div><p class="eyebrow">Sản phẩm</p><h2>Top sản phẩm bán chạy</h2></div></div>
          <div class="top-products-chart">${productRows.map((row, index) => `<div class="top-product-row"><span>${index + 1}</span><div><strong>${escapeHtml(row.product.name)}</strong><i style="width:${row.sold ? Math.max(8, Math.round(row.sold / maxSold * 100)) : 0}%" data-tooltip="${row.sold} đã bán" tabindex="0" aria-label="${escapeHtml(row.product.name)}: ${row.sold} đã bán"></i></div><b>${row.sold}</b></div>`).join("")}</div>
        </article>
      </div>

      <div class="dashboard-main-grid dashboard-main-grid--equal">
        <article class="surface dashboard-panel dashboard-alert-panel">
          <div class="dashboard-panel__head"><div><p class="eyebrow">Cảnh báo</p><h2>Cảnh báo vận hành</h2></div></div>
          <div class="operation-alert-grid"><a href="${adminUrl("orders")}"><strong>${pendingOrders}</strong><span>Đơn chờ xác nhận</span></a><a href="${adminUrl("inventory")}"><strong>${lowStock}</strong><span>Sản phẩm tồn kho thấp</span></a><a href="${adminUrl("returns")}"><strong>${pendingReturns}</strong><span>Yêu cầu đổi/trả</span></a><a href="${adminUrl("blogs")}"><strong>${pendingBlogs}</strong><span>Blog user chờ duyệt</span></a></div>
        </article>
        <article class="surface dashboard-panel">
          <div class="dashboard-panel__head"><div><p class="eyebrow">Chất lượng</p><h2>Review & rating</h2></div></div>
          <div class="review-summary-grid"><div><strong>${averageRating}★</strong><span>Rating trung bình</span></div><div><strong>${totalReviews}</strong><span>Tổng đánh giá</span></div><div><strong>${data.reviews.filter((review) => review.status === "VISIBLE").length}</strong><span>Đang hiển thị</span></div></div>
          <p class="muted dashboard-review-note">Dùng để đối chiếu nhanh giữa chất lượng cảm nhận và nhóm sản phẩm đang bán tốt.</p>
        </article>
      </div>

      <section class="section section--compact dashboard-recent-orders">
        <h2>Đơn hàng gần đây</h2>
        ${orderTable(orders.slice(0, 5), false)}
      </section>
    </section>
  `;
}
function productsPanel(data) {
  const categoryFilter = adminQuery().get("category") || "all";
  const visibleProducts = categoryFilter === "all" ? data.products : data.products.filter((product) => product.category === categoryFilter);
  return `
    <section class="surface account-panel">
      <h2>Thêm hoặc sửa sản phẩm</h2>
      <form id="admin-product-form" class="form-grid">
        <input type="hidden" name="id">
        <input type="hidden" name="image" value="/img/products/18.png">
        <label class="form-field form-field--full"><span class="form-label">Tên sản phẩm</span><input class="form-control" name="name" required></label>
        <label class="form-field"><span class="form-label">Danh mục</span><select class="form-control" name="category">${data.categories.filter((item) => item.id !== "all").map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("")}</select></label>
        <label class="form-field"><span class="form-label">Import hình sản phẩm</span><input class="form-control" type="file" name="imageFile" accept="image/*"><small class="muted">Demo sẽ lấy tên file và map về thư mục /img/products/.</small></label>
        <label class="form-field"><span class="form-label">Giá</span><input class="form-control" type="number" name="price" min="0" required></label>
        <label class="form-field"><span class="form-label">Giá giảm</span><input class="form-control" type="number" name="discountPrice" min="0"></label>
        <label class="form-field"><span class="form-label">Tồn kho</span><input class="form-control" type="number" name="stock" min="0" required></label>
        <label class="form-field"><span class="form-label">Bối cảnh</span><input class="form-control" name="historicalPeriod"></label>
        <label class="form-field form-field--full"><span class="form-label">Mô tả</span><textarea class="form-control" name="description"></textarea></label>
        <div class="button-row"><button class="button button--primary" type="submit">Lưu sản phẩm</button><button class="button button--ghost" type="reset">Làm mới</button></div>
      </form>
    </section>
    <section class="section section--compact">
      <div class="admin-toolbar surface">
        <label class="form-field"><span class="form-label">Lọc danh mục</span><select class="form-control" id="admin-product-category-filter"><option value="all">Tất cả sản phẩm</option>${data.categories.filter((item) => item.id !== "all").map((item) => `<option value="${item.id}" ${categoryFilter === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select></label>
        <button class="button button--danger button--small admin-bulk-delete is-hidden" type="button" data-admin-action="delete-selected-products">🗑 Xóa sản phẩm đã chọn</button>
      </div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th><input type="checkbox" id="admin-select-all-products" aria-label="Chọn tất cả sản phẩm"></th><th>Sản phẩm</th><th>Giá</th><th>Kho</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>
        ${visibleProducts.map((product) => `<tr>
          <td><input type="checkbox" data-admin-product-check="${product.id}" aria-label="Chọn ${escapeHtml(product.name)}"></td>
          <td><span class="table-product"><img src="${escapeHtml(product.images[0])}" alt=""><strong>${escapeHtml(product.name)}</strong></span></td>
          <td>${formatCurrency(product.discountPrice ?? product.price)}</td>
          <td class="${product.stock <= 5 ? "low-stock" : ""}">${product.stock}</td>
          <td>${StatusBadge(product.status)}</td>
          <td><div class="button-row"><button class="button button--ghost button--small" type="button" data-admin-action="edit-product" data-product-id="${product.id}">Sửa</button><button class="button button--secondary button--small" type="button" data-admin-action="toggle-product" data-product-id="${product.id}">${product.status === "HIDDEN" ? "Hiện" : "Ẩn"}</button></div></td>
        </tr>`).join("")}
      </tbody></table></div>
    </section>
  `;
}

function categoriesPanel(data) {
  return `
    <section class="surface account-panel">
      <h2>Quản lý danh mục</h2>
      <form id="admin-category-form" class="form-grid">
        <label class="form-field"><span class="form-label">Tên danh mục</span><input class="form-control" name="name" required></label>
        <label class="form-field"><span class="form-label">Mô tả</span><input class="form-control" name="description"></label>
        <button class="button button--primary" type="submit">Thêm danh mục</button>
      </form>
    </section>
    <section class="section section--compact">
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Tên</th><th>Mô tả</th><th>Số SP</th><th>Trạng thái</th><th>Chi tiết sản phẩm</th><th>Thao tác</th></tr></thead><tbody>
        ${data.categories.filter((item) => item.id !== "all").map((category) => `<tr><td><strong>${escapeHtml(category.name)}</strong></td><td>${escapeHtml(category.description)}</td><td>${data.products.filter((product) => product.category === category.id).length}</td><td>${category.hidden ? "Đang ẩn" : "Đang hiển thị"}</td><td><a class="button button--secondary button--small" href="${adminUrl("products", { category: category.id })}">Xem sản phẩm</a></td><td><button class="button button--ghost button--small" type="button" data-admin-action="toggle-category" data-category-id="${category.id}">${category.hidden ? "Hiện" : "Ẩn"}</button></td></tr>`).join("")}
      </tbody></table></div>
    </section>
  `;
}

function inventoryPanel(data) {
  return `
    <div class="table-wrap"><table class="data-table"><thead><tr><th>Sản phẩm</th><th>Tồn kho</th><th>Ngưỡng cảnh báo</th><th>Trạng thái</th><th>Điều chỉnh</th></tr></thead><tbody>
      ${data.products.map((product) => `<tr>
        <td><span class="table-product"><img src="${escapeHtml(product.images[0])}" alt=""><strong>${escapeHtml(product.name)}</strong></span></td>
        <td class="${product.stock <= 5 ? "low-stock" : ""}">${product.stock}</td><td>5</td><td>${product.stock <= 5 ? "Sắp hết hàng" : "Ổn định"}</td>
        <td><div class="button-row"><button class="button button--primary button--small" type="button" data-admin-action="adjust-stock" data-product-id="${product.id}" data-change="5">+5</button><button class="button button--ghost button--small" type="button" data-admin-action="adjust-stock" data-product-id="${product.id}" data-change="-1" ${product.stock <= 0 ? "disabled" : ""}>-1</button></div></td>
      </tr>`).join("")}
    </tbody></table></div>
    <section class="section section--compact"><h2>Giao dịch tồn kho gần nhất</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Sản phẩm</th><th>Loại</th><th>Thay đổi</th><th>Trước → Sau</th><th>Lý do</th></tr></thead><tbody>
      ${data.transactions.slice(0, 12).map((transaction) => `<tr><td>${escapeHtml(getProduct(transaction.productId)?.name || "Sản phẩm")}</td><td>${escapeHtml(transaction.type)}</td><td>${transaction.change > 0 ? "+" : ""}${transaction.change}</td><td>${transaction.before} → ${transaction.after}</td><td>${escapeHtml(transaction.reason)}</td></tr>`).join("")}
    </tbody></table></div></section>
  `;
}

function orderTable(orders, editable = true) {
  return `<div class="table-wrap"><table class="data-table admin-orders-table"><thead><tr><th>Mã đơn</th><th>Ngày</th><th>Tổng</th><th>Thanh toán</th><th>Trạng thái</th>${editable ? "<th>Cập nhật</th>" : ""}</tr></thead><tbody>
    ${orders.map((order) => {
      const allowedStatuses = order.status === "SHIPPING" ? ["SHIPPING", "DELIVERED"] : ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];
      return `<tr><td><a class="admin-order-code" href="${adminUrl("orders", { orderId: order.id })}">${escapeHtml(order.code)}</a>${order.cancellationRequest?.status === "PENDING" ? `<small class="admin-request-note">Yêu cầu hủy: ${escapeHtml(order.cancellationRequest.reason)}</small>` : ""}</td><td>${escapeHtml(formatAdminDate(order.createdAt))}</td><td>${formatCurrency(order.total)}</td><td>${escapeHtml(adminPaymentLabel(order))}</td><td>${StatusBadge(order.status)}</td>${editable ? `<td><div class="button-row admin-order-actions"><select class="form-control" data-order-select="${order.id}">${allowedStatuses.map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${statusLabel(status)}</option>`).join("")}</select><button class="button button--primary button--small" type="button" data-admin-action="update-order" data-order-id="${order.id}">Lưu</button>${order.status === "PENDING" ? `<button class="button button--secondary button--small" type="button" data-admin-action="confirm-order" data-order-id="${order.id}">Xác nhận ĐH</button>` : ""}${order.cancellationRequest?.status === "PENDING" ? `<button class="button button--danger button--small" type="button" data-admin-action="resolve-cancellation" data-decision="APPROVED" data-order-id="${order.id}">Duyệt hủy</button><button class="button button--ghost button--small" type="button" data-admin-action="resolve-cancellation" data-decision="REJECTED" data-order-id="${order.id}">Từ chối</button>` : ""}</div></td>` : ""}</tr>`;
    }).join("")}
  </tbody></table></div>`;
}

function adminOrderDetailPanel(order) {
  if (!order) return EmptyState({ title: "Không tìm thấy đơn hàng", description: "Mã đơn không còn tồn tại trong dữ liệu demo." });
  return `
    <section class="surface account-panel admin-order-detail">
      <div class="admin-detail-header"><div><p class="eyebrow">Chi tiết đơn hàng</p><h2>${escapeHtml(order.code)}</h2></div>${StatusBadge(order.status)}</div>
      <div class="admin-detail-grid">
        <div><strong>Ngày tạo</strong><p>${escapeHtml(formatAdminDate(order.createdAt))}</p></div>
        <div><strong>Thanh toán</strong><p>${escapeHtml(adminPaymentLabel(order))}</p></div>
        <div><strong>Người nhận</strong><p>${escapeHtml(order.address.receiverName)} · ${escapeHtml(order.address.receiverPhone)}</p></div>
        <div><strong>Địa chỉ</strong><p>${escapeHtml(order.address.detail)}</p></div>
      </div>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead><tbody>${order.items.map((item) => { const product = getProduct(item.productId); return `<tr><td><span class="table-product"><img src="${escapeHtml(product?.images[0] || "")}" alt=""><strong>${escapeHtml(product?.name || "Sản phẩm")}</strong></span></td><td>${item.quantity}</td><td>${formatCurrency(item.unitPrice)}</td><td>${formatCurrency(item.unitPrice * item.quantity)}</td></tr>`; }).join("")}</tbody></table></div>
      <div class="summary-line summary-line--total"><span>Tổng đơn</span><strong>${formatCurrency(order.total)}</strong></div>
      <div class="button-row"><a class="button button--ghost" href="${adminUrl("orders")}">Quay lại danh sách</a>${order.status === "PENDING" ? `<button class="button button--primary" type="button" data-admin-action="confirm-order" data-order-id="${order.id}">Xác nhận đơn hàng</button>` : ""}${order.status === "DELIVERED" ? `<a class="button button--secondary" href="${adminUrl("returns")}">Xem yêu cầu đổi/trả</a>` : ""}</div>
    </section>
  `;
}
function ordersPanel(data) {
  const orderId = adminQuery().get("orderId");
  if (orderId) return adminOrderDetailPanel(data.orders.find((order) => order.id === Number(orderId)));
  return orderTable(data.orders);
}

function vouchersPanel(data) {
  const activeCount = data.vouchers.filter((voucher) => voucher.status === "ACTIVE").length;
  const usedTotal = data.vouchers.reduce((sum, voucher) => sum + Number(voucher.usedCount || 0), 0);
  return `
    <section class="admin-promotion-summary">
      <article class="surface metric-card"><span class="muted">Promotion đang chạy</span><strong>${activeCount}</strong><span>Voucher còn hiệu lực</span></article>
      <article class="surface metric-card"><span class="muted">Lượt đã dùng</span><strong>${usedTotal}</strong><span>Tổng lượt trong dữ liệu demo</span></article>
      <article class="surface metric-card"><span class="muted">Gợi ý</span><strong>Voucher rõ điều kiện</strong><span>Hiển thị điều kiện, hạn dùng và lượt dùng rõ ràng</span></article>
    </section>
    <section class="surface account-panel">
      <h2>Tạo promotion / voucher</h2>
      <form id="admin-voucher-form" class="form-grid">
        <label class="form-field"><span class="form-label">Mã voucher</span><input class="form-control" name="code" required></label>
        <label class="form-field"><span class="form-label">Tên chương trình</span><input class="form-control" name="name"></label>
        <label class="form-field"><span class="form-label">Loại giảm</span><select class="form-control" name="type"><option value="percentage">Phần trăm</option><option value="fixed">Số tiền</option><option value="shipping">Miễn phí vận chuyển</option></select></label>
        <label class="form-field"><span class="form-label">Giá trị</span><input class="form-control" type="number" name="value" min="1" required></label>
        <label class="form-field"><span class="form-label">Giảm tối đa</span><input class="form-control" type="number" name="maxDiscount"></label>
        <label class="form-field"><span class="form-label">Đơn tối thiểu</span><input class="form-control" type="number" name="minOrder" value="0"></label>
        <label class="form-field"><span class="form-label">Bắt đầu</span><input class="form-control" type="datetime-local" name="startAt"></label>
        <label class="form-field"><span class="form-label">Kết thúc</span><input class="form-control" type="datetime-local" name="endAt"></label>
        <label class="form-field"><span class="form-label">Giới hạn lượt</span><input class="form-control" type="number" name="usageLimit" value="100"></label>
        <button class="button button--primary" type="submit">Lưu promotion</button>
      </form>
    </section>
    <section class="section section--compact"><div class="admin-voucher-grid">${data.vouchers.map((voucher) => `<article class="surface admin-voucher-card"><p class="eyebrow">${escapeHtml(voucher.status)}</p><h3>${escapeHtml(voucher.code)}</h3><p>${escapeHtml(voucher.name || "Voucher")}</p><div class="summary-line"><span>Đơn tối thiểu</span><strong>${formatCurrency(voucher.minOrder)}</strong></div><div class="summary-line"><span>Hết hạn</span><strong>${formatAdminDate(voucher.endAt)}</strong></div><div class="summary-line"><span>Lượt dùng</span><strong>${voucher.usedCount}/${voucher.usageLimit}</strong></div><button class="button button--ghost button--small" type="button" data-admin-action="toggle-voucher" data-voucher-code="${escapeHtml(voucher.code)}">${voucher.status === "ACTIVE" ? "Tắt" : "Bật"}</button></article>`).join("")}</div></section>
  `;
}

function returnsPanel(data) {
  if (!data.returns.length) return EmptyState({ title: "Chưa có yêu cầu đổi/trả", description: "Yêu cầu của khách hàng sẽ xuất hiện tại đây." });
  return `<div class="table-wrap"><table class="data-table admin-review-table"><thead><tr><th>Mã</th><th>Sản phẩm</th><th>Lý do khách</th><th>Trạng thái</th><th>Ghi chú admin</th><th>Xử lý</th></tr></thead><tbody>
    ${data.returns.map((request) => `<tr>
      <td>${escapeHtml(request.code)}</td>
      <td>${escapeHtml(getProduct(request.productId)?.name || "Sản phẩm")}</td>
      <td>${escapeHtml(request.reason)}</td>
      <td>${StatusBadge(request.status)}</td>
      <td><textarea class="form-control admin-return-note" data-return-note="${request.id}" rows="3" placeholder="Nhập lý do nếu từ chối">${escapeHtml(request.adminNote || "")}</textarea></td>
      <td><div class="button-row admin-stacked-actions"><button class="button button--primary button--small" type="button" data-admin-action="resolve-return" data-return-id="${request.id}" data-status="APPROVED" ${request.status !== "PENDING" ? "disabled" : ""}>Duyệt & nhập kho</button><button class="button button--danger button--small" type="button" data-admin-action="resolve-return" data-return-id="${request.id}" data-status="REJECTED" ${request.status !== "PENDING" ? "disabled" : ""}>Từ chối</button></div></td>
    </tr>`).join("")}
  </tbody></table></div>`;
}

function reviewSentiment(comment) {
  const text = String(comment || "").toLowerCase();
  const goodWords = ["tốt", "xịn", "đáng tiền", "đúng mô tả", "hài lòng", "tuyệt vời", "giao nhanh", "đóng gói", "nhiệt tình", "sẽ mua lại", "recommend", "good", "nice", "perfect"];
  return goodWords.filter((word) => text.includes(word));
}

function reviewAnalytics(data) {
  const total = data.reviews.length;
  const average = total ? (data.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total).toFixed(1) : "0.0";
  const byStar = [5, 4, 3, 2, 1].map((star) => ({ star, count: data.reviews.filter((review) => Number(review.rating) === star).length }));
  const productRows = data.products.map((product) => {
    const reviews = data.reviews.filter((review) => review.productId === product.id);
    const sold = data.orders.flatMap((order) => order.items).filter((item) => item.productId === product.id).reduce((sum, item) => sum + item.quantity, 0);
    const revenue = data.orders.flatMap((order) => order.items).filter((item) => item.productId === product.id).reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const avg = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : "-";
    return { product, reviews, sold, revenue, avg };
  }).filter((row) => row.reviews.length || row.sold).sort((a, b) => b.sold - a.sold).slice(0, 6);
  return `
    <section class="admin-promotion-summary review-analytics">
      <article class="surface metric-card"><span class="muted">Tổng review</span><strong>${total}</strong><span>Đánh giá hiển thị và ẩn</span></article>
      <article class="surface metric-card"><span class="muted">Rating trung bình</span><strong>${average}★</strong><span>Theo dữ liệu demo</span></article>
      <article class="surface metric-card"><span class="muted">Từ khóa tốt</span><strong>${data.reviews.flatMap((review) => reviewSentiment(review.comment)).length}</strong><span>Gợi ý sentiment tích cực</span></article>
    </section>
    <section class="surface account-panel"><h2>Phân bố sao</h2><div class="admin-status-bars">${byStar.map((item) => `<div><span>${item.star} sao</span><strong>${item.count}</strong><i style="width:${Math.max(8, item.count * 22)}%"></i></div>`).join("")}</div></section>
    <section class="section section--compact"><h2>Rating - bán ra - doanh thu</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Sản phẩm</th><th>Rating TB</th><th>Review</th><th>Đã bán</th><th>Doanh thu</th></tr></thead><tbody>${productRows.map((row) => `<tr><td>${escapeHtml(row.product.name)}</td><td>${row.avg}</td><td>${row.reviews.length}</td><td>${row.sold}</td><td>${formatCurrency(row.revenue)}</td></tr>`).join("")}</tbody></table></div></section>
  `;
}
function reviewsPanel(data) {
  const starFilter = adminQuery().get("rating") || "all";
  const filteredReviews = starFilter === "all" ? data.reviews : data.reviews.filter((review) => String(review.rating) === starFilter);
  return `${reviewAnalytics(data)}
    <section class="surface admin-toolbar"><label class="form-field"><span class="form-label">Lọc theo số sao</span><select class="form-control" id="admin-review-rating-filter"><option value="all">Tất cả</option>${[5,4,3,2,1].map((star) => `<option value="${star}" ${starFilter === String(star) ? "selected" : ""}>${star} sao</option>`).join("")}</select></label></section>
    <div class="table-wrap"><table class="data-table"><thead><tr><th>Sản phẩm</th><th>Điểm</th><th>Nhận xét</th><th>Từ khóa tốt</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>
      ${filteredReviews.map((review) => `<tr><td>${escapeHtml(getProduct(review.productId)?.name || "Sản phẩm")}</td><td><span class="stars">${"★".repeat(review.rating)}</span></td><td>${escapeHtml(review.comment)}</td><td>${reviewSentiment(review.comment).map(escapeHtml).join(", ") || "-"}</td><td>${escapeHtml(review.status)}</td><td><button class="button button--ghost button--small" type="button" data-admin-action="toggle-review" data-review-id="${review.id}">${review.status === "VISIBLE" ? "Ẩn" : "Hiện"}</button></td></tr>`).join("")}
    </tbody></table></div>`;
}

function blogsPanel(data) {
  const userPosts = data.userBlogSubmissions || [];
  return `
    <section class="surface account-panel"><h2>Tạo bài viết</h2><form id="admin-blog-form" class="form-grid"><label class="form-field form-field--full"><span class="form-label">Tiêu đề</span><input class="form-control" name="title" required></label><label class="form-field form-field--full"><span class="form-label">Tóm tắt</span><textarea class="form-control" name="excerpt"></textarea></label><div class="button-row"><button class="button button--ghost" type="submit" data-blog-submit="draft">Lưu bản nháp</button><button class="button button--primary" type="submit" data-blog-submit="published">Đăng ngay</button></div></form></section>
    <section class="surface account-panel admin-user-blog-review"><h2>Duyệt blog từ người dùng</h2>${userPosts.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Bài viết</th><th>Tác giả</th><th>Ngày gửi</th><th>Trạng thái</th><th>Ghi chú duyệt</th><th>Thao tác</th></tr></thead><tbody>${userPosts.map((post) => `<tr>
      <td><strong>${escapeHtml(post.title)}</strong><small>${escapeHtml(post.excerpt || post.content.slice(0, 120))}</small>${post.image ? `<small>Ảnh: ${escapeHtml(post.image)}</small>` : ""}</td>
      <td>${escapeHtml(post.authorName || "Khách hàng")}</td>
      <td>${formatAdminDate(post.createdAt)}</td>
      <td>${StatusBadge(post.status)}</td>
      <td><textarea class="form-control admin-blog-note" data-user-blog-note="${post.id}" rows="3" placeholder="Nhập lý do nếu từ chối">${escapeHtml(post.adminNote || "")}</textarea></td>
      <td><div class="button-row admin-stacked-actions"><button class="button button--primary button--small" type="button" data-admin-action="resolve-user-blog" data-blog-submission-id="${post.id}" data-status="APPROVED" ${post.status !== "PENDING" ? "disabled" : ""}>Duyệt đăng</button><button class="button button--danger button--small" type="button" data-admin-action="resolve-user-blog" data-blog-submission-id="${post.id}" data-status="REJECTED" ${post.status !== "PENDING" ? "disabled" : ""}>Từ chối</button></div></td>
    </tr>`).join("")}</tbody></table></div>` : EmptyState({ title: "Chưa có blog user gửi", description: "Bài chia sẻ trải nghiệm của khách hàng sẽ chờ duyệt tại đây." })}</section>
    <section class="section section--compact"><h2>Bài viết của shop</h2><div class="table-wrap"><table class="data-table"><thead><tr><th>Tiêu đề</th><th>Ngày</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${data.blogs.map((post) => `<tr><td><strong>${escapeHtml(post.title)}</strong></td><td>${formatAdminDate(post.date)}</td><td>${escapeHtml(post.status)}</td><td>${post.status === "PUBLISHED" ? `<span class="muted">Đã đăng</span>` : `<button class="button button--primary button--small" type="button" data-admin-action="toggle-blog" data-blog-id="${post.id}">Đăng ngay</button>`}</td></tr>`).join("")}</tbody></table></div></section>
  `;
}


function adminMessage(message, success = false) {
  const target = document.querySelector("#admin-message");
  if (!target) return;
  target.textContent = message;
  target.classList.toggle("form-message--success", success);
}

function clearAdminFieldError(control) {
  control.classList.remove("has-error");
  control.removeAttribute("aria-invalid");
  control.removeAttribute("aria-describedby");
  control.closest(".form-field")?.querySelector(".field-error")?.remove();
}

function showAdminFieldError(control, message) {
  clearAdminFieldError(control);
  control.classList.add("has-error");
  control.setAttribute("aria-invalid", "true");
  const error = document.createElement("small");
  error.className = "field-error";
  error.id = `${control.form?.id || "admin-form"}-${control.name || "field"}-error`;
  error.setAttribute("role", "alert");
  error.textContent = message;
  control.setAttribute("aria-describedby", error.id);
  control.closest(".form-field")?.append(error);
}

function bindAdminEmailValidation(form) {
  const control = form?.elements.email;
  if (!control) return;
  const validate = (showWhenEmpty = false) => {
    const value = control.value || "";
    if (!value && !showWhenEmpty) {
      clearAdminFieldError(control);
      return true;
    }
    if (!isValidEmail(value)) {
      showAdminFieldError(control, "Email không đúng định dạng. Vui lòng nhập lại.");
      return false;
    }
    clearAdminFieldError(control);
    return true;
  };
  control.addEventListener("input", () => validate(false));
  control.addEventListener("blur", () => validate(true));
}

export function mountAdminPage(render) {
  const adminLoginForm = document.querySelector("#admin-login-form");
  bindAdminEmailValidation(adminLoginForm);
  adminLoginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!isValidEmail(form.elements.email.value)) {
      showAdminFieldError(form.elements.email, "Email không đúng định dạng. Vui lòng nhập lại.");
      return;
    }
    const data = new FormData(form);
    try {
      loginAdmin(data.get("email"), data.get("password"));
      redirectTo(ROUTES.admin);
    } catch (error) {
      adminMessage(error.message);
    }
  });

  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => redirectTo(withQuery(ROUTES.admin, { tab: button.dataset.adminTab })));
  });

  document.querySelectorAll('[data-action="toggle-password"]').forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.closest(".password-input-wrap")?.querySelector("input");
      if (!input) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      button.setAttribute("aria-pressed", String(!visible));
      button.setAttribute("aria-label", visible ? "Hiện mật khẩu" : "Ẩn mật khẩu");
      button.querySelector("[data-password-eye]")?.classList.toggle("is-hidden", !visible);
      button.querySelector("[data-password-eye-off]")?.classList.toggle("is-hidden", visible);
    });
  });
  document.querySelector("#admin-product-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    try { saveAdminProduct(Object.fromEntries(new FormData(event.currentTarget))); render(); }
    catch (error) { adminMessage(error.message); }
  });
  document.querySelector("#admin-category-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    try { saveCategory(Object.fromEntries(new FormData(event.currentTarget))); render(); }
    catch (error) { adminMessage(error.message); }
  });
  document.querySelector("#admin-voucher-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    try { saveVoucher(Object.fromEntries(new FormData(event.currentTarget))); render(); }
    catch (error) { adminMessage(error.message); }
  });
  document.querySelector("#admin-blog-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const submitter = event.submitter?.dataset.blogSubmit;
      addBlog(Object.fromEntries(new FormData(event.currentTarget)), submitter === "published" ? "PUBLISHED" : "DRAFT");
      render();
    }
    catch (error) { adminMessage(error.message); }
  });

  document.querySelector("#admin-product-category-filter")?.addEventListener("change", (event) => {
    redirectTo(adminUrl("products", { category: event.currentTarget.value }));
  });
  document.querySelector("#admin-review-rating-filter")?.addEventListener("change", (event) => {
    redirectTo(adminUrl("reviews", { rating: event.currentTarget.value }));
  });
  document.querySelector('[name="imageFile"]')?.addEventListener("change", (event) => {
    const file = event.currentTarget.files?.[0];
    const form = document.querySelector("#admin-product-form");
    if (file && form?.elements.image) {
      form.elements.image.value = "/img/products/" + file.name;
      adminMessage("Đã nhận file " + file.name + ". Khi nộp thật, hãy đặt file vào thư mục img/products.", true);
    }
  });
  const updateBulkDeleteState = () => {
    const checked = [...document.querySelectorAll("[data-admin-product-check]:checked")];
    document.querySelector(".admin-bulk-delete")?.classList.toggle("is-hidden", checked.length === 0);
  };
  document.querySelector("#admin-select-all-products")?.addEventListener("change", (event) => {
    document.querySelectorAll("[data-admin-product-check]").forEach((input) => { input.checked = event.currentTarget.checked; });
    updateBulkDeleteState();
  });
  document.querySelectorAll("[data-admin-product-check]").forEach((input) => input.addEventListener("change", updateBulkDeleteState));
  document.querySelectorAll("[data-admin-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.adminAction;
      try {
        if (action === "logout") { logoutAdmin(); redirectTo(ROUTES.adminLogin); return; }        if (action === "delete-selected-products") {
          const ids = [...document.querySelectorAll("[data-admin-product-check]:checked")].map((input) => input.dataset.adminProductCheck);
          if (!ids.length) throw new Error("Vui lòng chọn ít nhất một sản phẩm để xóa.");
          if (!window.confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?")) return;
          deleteProducts(ids);
        }        if (action === "toggle-product") toggleProductVisibility(button.dataset.productId);
        if (action === "toggle-category") toggleCategory(button.dataset.categoryId);
        if (action === "adjust-stock") adjustInventory(Number(button.dataset.productId), Number(button.dataset.change), "ADJUSTMENT", "Admin điều chỉnh tồn kho");
        if (action === "confirm-order") {
          updateOrderStatus(button.dataset.orderId, "CONFIRMED");
        }        if (action === "update-order") {
          const select = document.querySelector('[data-order-select="' + button.dataset.orderId + '"]');
          updateOrderStatus(button.dataset.orderId, select.value);
        }
        if (action === "resolve-cancellation") {
          resolveCancellationRequest(button.dataset.orderId, button.dataset.decision);
        }
        if (action === "toggle-voucher") toggleVoucher(button.dataset.voucherCode);
        if (action === "resolve-return") {
          const noteInput = document.querySelector(`[data-return-note="${button.dataset.returnId}"]`);
          const note = button.dataset.status === "APPROVED" ? (noteInput?.value || "Đã duyệt và nhập lại kho.") : (noteInput?.value || "");
          resolveReturn(button.dataset.returnId, button.dataset.status, note);
        }
        if (action === "toggle-review") toggleReview(button.dataset.reviewId);
        if (action === "toggle-blog") toggleBlog(button.dataset.blogId);
        if (action === "resolve-user-blog") {
          const noteInput = document.querySelector(`[data-user-blog-note="${button.dataset.blogSubmissionId}"]`);
          resolveUserBlog(button.dataset.blogSubmissionId, button.dataset.status, noteInput?.value || "");
        }
        if (action === "edit-product") {
          fillProductForm(button.dataset.productId);
          return;
        }
        render();
      } catch (error) {
        adminMessage(error.message);
      }
    });
  });
}

function fillProductForm(productId) {
  const product = getProduct(productId);
  const form = document.querySelector("#admin-product-form");
  if (!product || !form) return;
  const values = {
    id: product.id,
    name: product.name,
    category: product.category,
    image: product.images[0],
    price: product.price,
    discountPrice: product.discountPrice || "",
    stock: product.stock,
    historicalPeriod: product.historicalPeriod,
    description: product.description
  };
  Object.entries(values).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}







































