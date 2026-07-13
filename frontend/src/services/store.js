import { blogPosts, categories, products, vouchers } from "../data/catalog.js";
import {
  isValidDateOfBirth,
  isValidEmail,
  isValidName,
  isValidPhone,
  normalizeEmail,
  normalizeName,
  normalizePhone,
  orderCode
} from "../utils/format.js";

const STORAGE_KEY = "an-store-demo-state-v4";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function initialState() {
  return {
    version: 4,
    currentUserId: null,
    adminLoggedIn: false,
    users: [
      { id: 1, fullName: "Nguyễn Thị Kim Kiều Oanh", email: "oanhntkk24411@st.uel.edu.vn", phone: "0704477397", password: "0704477397", dateOfBirth: "2003-03-15", status: "ACTIVE" },
      { id: 2, fullName: "Lê Ngọc Mai", email: "mai.le@example.com", phone: "0901000002", password: "password", dateOfBirth: "2002-08-21", status: "ACTIVE" },
      { id: 3, fullName: "Phạm Gia Huy", email: "huy.pham@example.com", phone: "0901000003", password: "password", dateOfBirth: "2001-11-09", status: "ACTIVE" },
      { id: 4, fullName: "Võ Thanh Hà", email: "ha.vo@example.com", phone: "0901000004", password: "password", dateOfBirth: "2003-05-30", status: "ACTIVE" },
      { id: 5, fullName: "Đặng Quốc Bảo", email: "bao.dang@example.com", phone: "0901000005", password: "password", dateOfBirth: "2000-12-12", status: "ACTIVE" }
    ],
    addresses: [
      { id: 1, userId: 1, receiverName: "Nguyễn Thị Kim Kiều Oanh", receiverPhone: "0704477397", province: "Thành phố Hồ Chí Minh", district: "Quận 3", ward: "Phường Võ Thị Sáu", detailAddress: "18 đường Trần Quốc Thảo", label: "Nhà riêng", isDefault: true },
      { id: 2, userId: 1, receiverName: "Nguyễn Thị Kim Kiều Oanh", receiverPhone: "0704477397", province: "Thành phố Hồ Chí Minh", district: "Quận 1", ward: "Phường Bến Nghé", detailAddress: "88 đường Nguyễn Huệ", label: "Công ty", isDefault: false }
    ],
    cartItems: [],
    selectedCartProductIds: [],
    productOverrides: {},
    addedProducts: [],
    vouchers: clone(vouchers),
    orders: [
      sampleOrder(1, "AN202606280001", "PENDING", "PENDING", "28.06.2026", 329000),
      sampleOrder(2, "AN202606270002", "CONFIRMED", "SUCCESS", "27.06.2026", 389000),
      sampleOrder(3, "AN202606260003", "SHIPPING", "SUCCESS", "26.06.2026", 699000),
      sampleOrder(4, "AN202606200004", "DELIVERED", "SUCCESS", "20.06.2026", 329000),
      sampleOrder(5, "AN202606180005", "CANCELLED", "REFUNDED", "18.06.2026", 199000)
    ],
    returnRequests: [],
    reviews: [
      { id: 1, userId: 1, productId: 1, orderId: 4, rating: 5, comment: "Cốt truyện cuốn hút, chất lượng thẻ và hộp rất đẹp.", status: "VISIBLE", createdAt: "24.06.2026" }
    ],
    inventoryTransactions: products.map((product, index) => ({
      id: index + 1,
      productId: product.id,
      type: "IMPORT",
      change: product.stock,
      before: 0,
      after: product.stock,
      reason: "Khởi tạo tồn kho mẫu",
      createdAt: "01.06.2026"
    })),
    customCategories: clone(categories),
    blogs: clone(blogPosts),
    userBlogSubmissions: [],
    invoices: [],
    passwordResets: []
  };
}

function sampleOrder(id, code, status, paymentStatus, createdAt, total) {
  const productId = id === 2 ? 2 : id === 3 ? 3 : id === 5 ? 5 : 1;
  return {
    id,
    code,
    userId: 1,
    status,
    paymentStatus,
    createdAt,
    subtotal: total,
    discount: 0,
    shippingFee: 0,
    total,
    voucherCode: null,
    stockDeducted: paymentStatus === "SUCCESS" || paymentStatus === "REFUNDED",
    address: {
      receiverName: "Nguyễn Thị Kim Kiều Oanh",
      receiverPhone: "0704477397",
      detail: "18 đường Trần Quốc Thảo, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh"
    },
    items: [{ productId, quantity: 1, unitPrice: total }],
    timeline: [{ status, at: createdAt }]
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && parsed.version === 4) {
      const savedVouchers = new Map((parsed.vouchers || []).map((voucher) => [voucher.code, voucher]));
      parsed.vouchers = vouchers.map((voucher) => ({ ...voucher, ...(savedVouchers.get(voucher.code) || {}) }));
      if (!Array.isArray(parsed.selectedCartProductIds)) {
        parsed.selectedCartProductIds = (parsed.cartItems || []).map((item) => item.productId);
      }
      if (!Array.isArray(parsed.userBlogSubmissions)) parsed.userBlogSubmissions = [];
      if (!Array.isArray(parsed.invoices)) parsed.invoices = [];
      if (!Array.isArray(parsed.passwordResets)) parsed.passwordResets = [];
      return parsed;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return initialState();
}

let state = loadState();
const listeners = new Set();

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener(getState()));
}

function nextId(list) {
  return Math.max(0, ...list.map((item) => Number(item.id))) + 1;
}


function hashDemoPassword(password) {
  return "demo-hash:" + btoa(unescape(encodeURIComponent(String(password || ""))));
}

function passwordMatches(savedPassword, inputPassword) {
  if (String(savedPassword || "").startsWith("demo-hash:")) {
    return savedPassword === hashDemoPassword(inputPassword);
  }
  return savedPassword === inputPassword;
}

function findUserByIdentifier(identifier) {
  const value = String(identifier || "").trim();
  const isEmail = value.includes("@");
  return state.users.find((user) => isEmail
    ? normalizeEmail(user.email) === normalizeEmail(value)
    : normalizePhone(user.phone) === normalizePhone(value));
}
function requireUser() {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("Bạn cần đăng nhập để tiếp tục.");
  }
  return user;
}

function requireAdmin() {
  if (!state.adminLoggedIn) {
    throw new Error("Phiên quản trị không hợp lệ.");
  }
}

function productWithState(product) {
  const override = state.productOverrides[product.id] || {};
  return { ...product, ...override };
}

export function getState() {
  return clone(state);
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetDemo() {
  state = initialState();
  persist();
}

export function getProducts(options = {}) {
  const all = [...products.map(productWithState), ...state.addedProducts.map(productWithState)];
  return options.includeHidden ? all : all.filter((product) => product.status !== "HIDDEN");
}

export function getProduct(productId) {
  return getProducts({ includeHidden: true }).find((product) => product.id === Number(productId)) || null;
}

export function getCurrentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

export function loginCustomer(identifier, password) {
  const value = String(identifier || "").trim();
  if (!value) throw new Error("Email hoặc số điện thoại không được để trống.");
  const isEmailLogin = value.includes("@");
  if (isEmailLogin && !isValidEmail(value)) throw new Error("Email không đúng định dạng.");
  if (!isEmailLogin && !isValidPhone(value)) throw new Error("Số điện thoại không đúng định dạng.");
  if (!password) throw new Error("Mật khẩu không được để trống.");
  const user = state.users.find((item) => isEmailLogin
    ? item.email.toLowerCase() === normalizeEmail(value)
    : normalizePhone(item.phone) === normalizePhone(value));
  if (!user || !passwordMatches(user.password, password)) throw new Error("Email/SĐT hoặc mật khẩu không chính xác.");
  if (user.status !== "ACTIVE") throw new Error("Tài khoản hiện không thể đăng nhập.");
  state.currentUserId = user.id;
  persist();
  return clone(user);
}

export function registerCustomer(input) {
  if (!isValidName(input.fullName)) throw new Error("Họ tên phải từ 2 đến 100 ký tự và không chứa số.");
  if (!isValidEmail(input.email)) throw new Error("Email không hợp lệ.");
  if (!input.password) throw new Error("Mật khẩu không được để trống.");
  if (input.password.length < 8) throw new Error("Mật khẩu phải có ít nhất 8 ký tự.");
  if (!isValidPhone(input.phone)) throw new Error("Số điện thoại không hợp lệ.");
  if (!isValidDateOfBirth(input.dateOfBirth)) throw new Error("Ngày sinh không hợp lệ. Khách hàng cần từ 13 tuổi trở lên.");
  if (state.users.some((user) => user.email.toLowerCase() === normalizeEmail(input.email))) {
    throw new Error("Email đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.");
  }
  if (state.users.some((user) => normalizePhone(user.phone) === normalizePhone(input.phone))) {
    throw new Error("Số điện thoại đã được sử dụng.");
  }
  const user = {
    id: nextId(state.users),
    fullName: normalizeName(input.fullName),
    email: normalizeEmail(input.email),
    phone: normalizePhone(input.phone),
    password: input.password,
    dateOfBirth: input.dateOfBirth || null,
    status: "ACTIVE"
  };
  state.users.push(user);
  state.currentUserId = user.id;
  persist();
  return clone(user);
}

export function logoutCustomer() {
  state.currentUserId = null;
  persist();
}

export function requestPasswordReset(identifier) {
  const value = String(identifier || "").trim();
  const isEmail = value.includes("@");
  if (isEmail && !isValidEmail(value)) throw new Error("Email chưa đúng định dạng.");
  if (!isEmail && !isValidPhone(value)) throw new Error("Số điện thoại chưa đúng định dạng.");
  const user = findUserByIdentifier(value);
  if (!user) throw new Error("Không tìm thấy tài khoản phù hợp. Vui lòng kiểm tra lại email hoặc số điện thoại.");
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const token = `AN-RESET-${Date.now()}-${user.id}`;
  const expiresAt = Date.now() + 15 * 60 * 1000;
  state.passwordResets = (state.passwordResets || []).filter((item) => item.userId !== user.id || item.used);
  state.passwordResets.push({ token, code, userId: user.id, expiresAt, used: false, createdAt: new Date().toISOString() });
  persist();
  return {
    token,
    code,
    expiresAt,
    message: "Đã tạo mã đặt lại mật khẩu demo. Email thực tế không được gửi trong phạm vi đồ án."
  };
}

export function verifyPasswordReset(token, code) {
  const reset = (state.passwordResets || []).find((item) => item.token === token && !item.used);
  if (!reset) throw new Error("Mã đặt lại không tồn tại hoặc đã được sử dụng.");
  if (Date.now() > reset.expiresAt) throw new Error("Mã đặt lại đã hết hạn. Vui lòng yêu cầu mã mới.");
  if (String(reset.code) !== String(code || "").trim()) throw new Error("Mã xác thực không chính xác.");
  return true;
}

export function completePasswordReset({ token, code, password, confirmPassword }) {
  verifyPasswordReset(token, code);
  if (!password || password.length < 8) throw new Error("Mật khẩu mới phải có ít nhất 8 ký tự.");
  if (password !== confirmPassword) throw new Error("Hai trường mật khẩu mới chưa trùng khớp.");
  const reset = state.passwordResets.find((item) => item.token === token && !item.used);
  const user = state.users.find((item) => item.id === reset.userId);
  if (!user) throw new Error("Tài khoản đặt lại không còn tồn tại.");
  if (passwordMatches(user.password, password)) throw new Error("Mật khẩu mới phải khác mật khẩu cũ.");
  user.password = hashDemoPassword(password);
  reset.used = true;
  reset.usedAt = new Date().toISOString();
  persist();
  return "Đã cập nhật mật khẩu mới. Bạn có thể quay lại đăng nhập bằng mật khẩu vừa tạo.";
}
export function updateProfile(input) {
  const user = requireUser();
  if (!isValidName(input.fullName)) throw new Error("Họ tên phải từ 2 đến 100 ký tự và không chứa số.");
  if (!isValidEmail(input.email)) throw new Error("Email không hợp lệ.");
  if (!isValidPhone(input.phone)) throw new Error("Số điện thoại không hợp lệ.");
  if (!isValidDateOfBirth(input.dateOfBirth)) throw new Error("Ngày sinh không hợp lệ. Khách hàng cần từ 13 tuổi trở lên.");
  if (state.users.some((item) => item.id !== user.id && normalizeEmail(item.email) === normalizeEmail(input.email))) {
    throw new Error("Email đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.");
  }
  if (state.users.some((item) => item.id !== user.id && normalizePhone(item.phone) === normalizePhone(input.phone))) {
    throw new Error("Số điện thoại đã được sử dụng bởi tài khoản khác.");
  }
  user.fullName = normalizeName(input.fullName);
  user.email = normalizeEmail(input.email);
  user.phone = normalizePhone(input.phone);
  user.dateOfBirth = input.dateOfBirth || null;
  persist();
}

export function getUserAddresses() {
  const user = requireUser();
  return clone(state.addresses.filter((address) => address.userId === user.id));
}

function validateAddress(input) {
  const required = ["receiverName", "receiverPhone", "province", "ward", "detailAddress"];
  if (required.some((key) => !String(input[key] || "").trim())) {
    throw new Error("Vui lòng điền đầy đủ thông tin địa chỉ giao hàng.");
  }
  if (!isValidName(input.receiverName)) throw new Error("Tên người nhận không đúng định dạng.");
  if (!isValidPhone(input.receiverPhone)) throw new Error("Số điện thoại người nhận không hợp lệ.");
  if (String(input.detailAddress).trim().length < 5) throw new Error("Địa chỉ chi tiết phải có ít nhất 5 ký tự.");
}

export function saveAddress(input) {
  const user = requireUser();
  validateAddress(input);
  let address = state.addresses.find((item) => item.id === Number(input.id) && item.userId === user.id);
  if (!address) {
    address = { id: nextId(state.addresses), userId: user.id };
    state.addresses.push(address);
  }
  Object.assign(address, {
    receiverName: normalizeName(input.receiverName),
    receiverPhone: normalizePhone(input.receiverPhone),
    province: input.province.trim(),
    district: String(input.district || "").trim(),
    ward: input.ward.trim(),
    detailAddress: input.detailAddress.trim(),
    label: input.label?.trim() || "Địa chỉ",
    isDefault: Boolean(input.isDefault)
  });
  const userAddresses = state.addresses.filter((item) => item.userId === user.id);
  if (address.isDefault || userAddresses.length === 1) {
    userAddresses.forEach((item) => { item.isDefault = item.id === address.id; });
  }
  persist();
  return clone(address);
}

export function deleteAddress(addressId) {
  const user = requireUser();
  const address = state.addresses.find((item) => item.id === Number(addressId) && item.userId === user.id);
  if (!address) throw new Error("Không tìm thấy địa chỉ.");
  state.addresses = state.addresses.filter((item) => item.id !== address.id);
  const remaining = state.addresses.filter((item) => item.userId === user.id);
  if (address.isDefault && remaining[0]) remaining[0].isDefault = true;
  persist();
}

export function setDefaultAddress(addressId) {
  const user = requireUser();
  const addresses = state.addresses.filter((item) => item.userId === user.id);
  if (!addresses.some((item) => item.id === Number(addressId))) throw new Error("Không tìm thấy địa chỉ.");
  addresses.forEach((item) => { item.isDefault = item.id === Number(addressId); });
  persist();
}

export function getCartItems() {
  return state.cartItems
    .map((item) => ({
      ...item,
      selected: state.selectedCartProductIds.includes(item.productId),
      product: getProduct(item.productId)
    }))
    .filter((item) => item.product);
}

export function getCartCount() {
  return state.cartItems.reduce((total, item) => total + item.quantity, 0);
}

export function addToCart(productId, quantity = 1) {
  const product = getProduct(productId);
  const amount = Number(quantity);
  if (!product || product.status === "HIDDEN") throw new Error("Sản phẩm không tồn tại.");
  if (product.status === "OUT_OF_STOCK" || product.stock <= 0) throw new Error("Sản phẩm hiện đã hết hàng.");
  if (!Number.isInteger(amount) || amount < 1) throw new Error("Số lượng không hợp lệ.");
  const existing = state.cartItems.find((item) => item.productId === product.id);
  const nextQuantity = (existing?.quantity || 0) + amount;
  if (nextQuantity > product.stock) {
    throw new Error("Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này.");
  }
  if (existing) existing.quantity = nextQuantity;
  else state.cartItems.push({ productId: product.id, quantity: amount });
  if (!state.selectedCartProductIds.includes(product.id)) state.selectedCartProductIds.push(product.id);
  persist();
}

export function setCartItemSelected(productId, selected) {
  const id = Number(productId);
  if (!state.cartItems.some((item) => item.productId === id)) throw new Error("Sản phẩm không có trong giỏ.");
  state.selectedCartProductIds = selected
    ? [...new Set([...state.selectedCartProductIds, id])]
    : state.selectedCartProductIds.filter((item) => item !== id);
  persist();
}

export function setAllCartItemsSelected(selected) {
  state.selectedCartProductIds = selected ? state.cartItems.map((item) => item.productId) : [];
  persist();
}

export function updateCartQuantity(productId, quantity) {
  const product = getProduct(productId);
  const amount = Number(quantity);
  if (!product) throw new Error("Sản phẩm không tồn tại.");
  if (amount < 1) {
    removeFromCart(productId);
    return;
  }
  if (amount > product.stock) throw new Error("Số lượng bạn chọn đã đạt mức tối đa của sản phẩm này.");
  const item = state.cartItems.find((entry) => entry.productId === product.id);
  if (!item) throw new Error("Sản phẩm không có trong giỏ.");
  item.quantity = amount;
  persist();
}

export function removeFromCart(productId) {
  const id = Number(productId);
  state.cartItems = state.cartItems.filter((item) => item.productId !== id);
  state.selectedCartProductIds = state.selectedCartProductIds.filter((item) => item !== id);
  persist();
}

export function cartSummary(voucherCode = "") {
  const items = getCartItems().filter((item) => item.selected);
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);
  const voucherResult = voucherCode ? validateVoucher(voucherCode, subtotal) : null;
  const discount = voucherResult?.discount || 0;
  const baseShippingFee = subtotal >= 700000 || subtotal === 0 ? 0 : 30000;
  const shippingFee = voucherResult?.freeShipping ? 0 : baseShippingFee;
  return { items, subtotal, discount, shippingFee, total: subtotal - discount + shippingFee, voucher: voucherResult?.voucher || null };
}

export function validateVoucher(code, subtotal) {
  const voucher = state.vouchers.find((item) => item.code.toUpperCase() === String(code).trim().toUpperCase());
  if (!voucher) throw new Error("Mã voucher không tồn tại.");
  const now = Date.now();
  if (voucher.status !== "ACTIVE") throw new Error("Voucher hiện không còn hiệu lực.");
  if (now < new Date(voucher.startAt).getTime()) throw new Error("Voucher chưa đến thời gian áp dụng.");
  if (now > new Date(voucher.endAt).getTime()) throw new Error("Voucher đã hết hạn.");
  if (subtotal < voucher.minOrder) throw new Error("Đơn hàng chưa đạt giá trị tối thiểu của voucher.");
  if (voucher.usedCount >= voucher.usageLimit) throw new Error("Voucher đã hết lượt sử dụng.");
  const freeShipping = voucher.type === "shipping";
  let discount = freeShipping ? 0 : voucher.type === "percentage" ? subtotal * voucher.value / 100 : voucher.value;
  if (voucher.maxDiscount) discount = Math.min(discount, voucher.maxDiscount);
  discount = Math.min(Math.round(discount), subtotal);
  return { voucher: clone(voucher), discount, freeShipping };
}

export function checkoutOrder(input) {
  const user = requireUser();
  const address = state.addresses.find((item) => item.id === Number(input.addressId) && item.userId === user.id);
  if (!address) throw new Error("Vui lòng chọn địa chỉ giao hàng.");
  const summary = cartSummary(input.voucherCode || "");
  if (!summary.items.length) throw new Error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
  summary.items.forEach((item) => {
    const latest = getProduct(item.productId);
    if (!latest || latest.stock < item.quantity) {
      throw new Error("Tồn kho của " + item.product.name + " vừa thay đổi. Vui lòng kiểm tra lại giỏ hàng.");
    }
  });
  const code = orderCode();
  const isCod = input.paymentMethod === "COD";
  const paymentFailed = input.paymentMethod === "MOCK_FAILED";
  if (paymentFailed) {
    return { success: false, code, message: "Thanh toán không thành công. Giỏ hàng và tồn kho được giữ nguyên." };
  }
  const order = {
    id: nextId(state.orders),
    code,
    userId: user.id,
    status: "PENDING",
    paymentStatus: isCod ? "PENDING" : "SUCCESS",
    paymentMethod: isCod ? "COD" : "MOCK_CARD",
    createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date()),
    subtotal: summary.subtotal,
    discount: summary.discount,
    shippingFee: summary.shippingFee,
    total: summary.total,
    voucherCode: summary.voucher?.code || null,
    stockDeducted: !isCod,
    address: {
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
      detail: [address.detailAddress, address.ward, address.district, address.province].filter(Boolean).join(", ")
    },
    items: summary.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.product.discountPrice ?? item.product.price
    })),
    timeline: [{ status: "PENDING", at: new Intl.DateTimeFormat("vi-VN").format(new Date()) }]
  };
  if (!isCod) order.items.forEach((item) => adjustInventory(item.productId, -item.quantity, "SALE", "Xuất kho cho đơn " + code, order.id));
  if (summary.voucher && !isCod) {
    const voucher = state.vouchers.find((item) => item.code === summary.voucher.code);
    voucher.usedCount += 1;
  }
  state.invoices.unshift({
    id: nextId(state.invoices || []),
    orderId: order.id,
    invoiceDate: new Date().toISOString(),
    subtotal: order.subtotal,
    discountAmount: order.discount,
    shippingFee: order.shippingFee,
    totalAmount: order.total,
    status: order.paymentStatus === "SUCCESS" ? "ISSUED" : "PENDING",
    note: isCod ? "Hóa đơn chờ thu tiền COD." : "Hóa đơn thanh toán online mock.",
    createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date())
  });
  state.orders.unshift(order);
  const orderedProductIds = new Set(order.items.map((item) => item.productId));
  state.cartItems = state.cartItems.filter((item) => !orderedProductIds.has(item.productId));
  state.selectedCartProductIds = state.selectedCartProductIds.filter((id) => !orderedProductIds.has(id));
  persist();
  return { success: true, code, paymentMethod: order.paymentMethod, order: clone(order) };
}

export function getMyOrders() {
  const user = requireUser();
  return clone(state.orders.filter((order) => order.userId === user.id));
}

export function getOrder(orderId) {
  return clone(state.orders.find((order) => order.id === Number(orderId)) || null);
}

function finalizeOrderCancellation(order, reason, source = "Khách hàng") {
  if (order.stockDeducted) {
    order.items.forEach((item) => adjustInventory(item.productId, item.quantity, "ORDER_CANCEL", "Hoàn kho do hủy đơn " + order.code, order.id));
    order.stockDeducted = false;
  }
  order.status = "CANCELLED";
  order.cancelReason = reason;
  order.cancelledAt = new Date().toISOString();
  order.cancellationRequest = order.cancellationRequest
    ? { ...order.cancellationRequest, status: "APPROVED", reviewedAt: order.cancelledAt, reviewedBy: source }
    : null;
  order.timeline.push({ status: "CANCELLED", at: new Intl.DateTimeFormat("vi-VN").format(new Date()) });
}

export function cancelOrder(orderId, reason) {
  const user = requireUser();
  const order = state.orders.find((item) => item.id === Number(orderId) && item.userId === user.id);
  if (!order) throw new Error("Không tìm thấy đơn hàng.");
  if (!["PENDING", "CONFIRMED", "SHIPPING"].includes(order.status)) {
    throw new Error("Đơn hàng ở trạng thái hiện tại không thể gửi yêu cầu hủy.");
  }
  const cancelReason = String(reason || "").trim();
  if (cancelReason.length < 5) throw new Error("Vui lòng nhập lý do hủy có ít nhất 5 ký tự.");
  if (order.status === "PENDING") {
    finalizeOrderCancellation(order, cancelReason);
    persist();
    return { immediate: true, message: "Đơn hàng đã được hủy." };
  }
  if (order.cancellationRequest?.status === "PENDING") throw new Error("Yêu cầu hủy đơn đang chờ quản trị viên xử lý.");
  order.cancellationRequest = {
    status: "PENDING",
    reason: cancelReason,
    requestedAt: new Date().toISOString()
  };
  persist();
  return { immediate: false, message: "Yêu cầu hủy đã được gửi và đang chờ quản trị viên duyệt." };
}

export function resolveCancellationRequest(orderId, decision, note = "") {
  requireAdmin();
  const order = state.orders.find((item) => item.id === Number(orderId));
  if (!order || order.cancellationRequest?.status !== "PENDING") throw new Error("Không tìm thấy yêu cầu hủy đang chờ duyệt.");
  if (!["APPROVED", "REJECTED"].includes(decision)) throw new Error("Quyết định xử lý không hợp lệ.");
  if (decision === "APPROVED") {
    finalizeOrderCancellation(order, order.cancellationRequest.reason, "Admin");
  } else {
    order.cancellationRequest = {
      ...order.cancellationRequest,
      status: "REJECTED",
      adminNote: String(note || "Yêu cầu không đáp ứng điều kiện hủy đơn."),
      reviewedAt: new Date().toISOString(),
      reviewedBy: "Admin"
    };
  }
  persist();
}

export function reorder(orderId) {
  const user = requireUser();
  const order = state.orders.find((item) => item.id === Number(orderId) && item.userId === user.id);
  if (!order) throw new Error("Không tìm thấy đơn hàng.");
  order.items.forEach((item) => addToCart(item.productId, Math.min(item.quantity, getProduct(item.productId)?.stock || 0)));
}

export function submitReturnRequest(input) {
  const user = requireUser();
  const order = state.orders.find((item) => item.id === Number(input.orderId) && item.userId === user.id);
  if (!order || order.status !== "DELIVERED") throw new Error("Chỉ đơn đã giao mới có thể đổi hoặc trả.");
  if (!input.reason.trim()) throw new Error("Vui lòng nhập lý do đổi/trả.");
  const item = order.items.find((entry) => entry.productId === Number(input.productId));
  if (!item) throw new Error("Sản phẩm không thuộc đơn hàng.");
  state.returnRequests.unshift({
    id: nextId(state.returnRequests),
    code: "RT" + String(Date.now()).slice(-8),
    orderId: order.id,
    userId: user.id,
    productId: item.productId,
    type: input.type || "RETURN",
    quantity: 1,
    reason: input.reason.trim(),
    evidenceName: input.evidenceName || null,
    status: "PENDING",
    adminNote: "",
    createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date())
  });
  persist();
}

const REVIEW_BLOCKED_PATTERNS = [
  /cam kết 100%|trị dứt điểm|khỏi ngay|vĩnh viễn|tuyệt đối|số 1|tốt nhất thị trường/i,
  /rẻ hơn|tốt hơn hãng|ngon hơn quán|nike|adidas|chanel|dior/i,
  /mây mưa|hở hang|quan hệ|gái gọi|khoe hàng/i,
  /đánh|giết|tự tử|máu me|tai nạn|hành hạ|dao|súng|ma túy|chất kích thích/i,
  /(đm|dm|vcl|vl|cc|loz|đjt|dit|djt|óc chó|não tàn|thiểu năng|rác rưởi|cặn bã|súc vật|mất dạy|vô học)/i,
  /shop lừa đảo|tao xử|biết nhà mày|tao phá shop|report chết shop/i
];

function validateReviewContent(comment) {
  const value = String(comment || "").trim();
  if (value.length < 5) throw new Error("Vui lòng nhập nhận xét có ít nhất 5 ký tự.");
  if (REVIEW_BLOCKED_PATTERNS.some((pattern) => pattern.test(value))) {
    throw new Error("Nội dung đánh giá chứa từ khóa không phù hợp. Vui lòng điều chỉnh lời nhận xét trước khi gửi.");
  }
}
export function submitReview(input) {
  const user = requireUser();
  const order = state.orders.find((item) => item.id === Number(input.orderId) && item.userId === user.id && item.status === "DELIVERED");
  if (!order || !order.items.some((item) => item.productId === Number(input.productId))) {
    throw new Error("Bạn chỉ có thể đánh giá sản phẩm thuộc đơn đã giao.");
  }
  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error("Điểm đánh giá phải từ 1 đến 5.");
  validateReviewContent(input.comment);
  const existing = state.reviews.find((review) => review.userId === user.id && review.productId === Number(input.productId) && review.orderId === order.id);
  const review = existing || { id: nextId(state.reviews), userId: user.id, productId: Number(input.productId), orderId: order.id };
  Object.assign(review, {
    rating,
    comment: input.comment.trim(),
    imageName: input.imageName || null,
    status: "VISIBLE",
    createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date())
  });
  if (!existing) state.reviews.unshift(review);
  persist();
}

function maskCustomerName(name) {
  const compact = String(name || "Khách hàng").normalize("NFC").replace(/\s+/g, "").toLowerCase();
  if (compact.length <= 4) return compact[0] + "***";
  const head = compact.slice(0, Math.min(4, compact.length));
  const tail = compact.slice(-2);
  return head + "****" + tail + "***";
}
export function getProductReviews(productId) {
  return clone(state.reviews
    .filter((review) => review.productId === Number(productId) && review.status === "VISIBLE")
    .map((review) => {
      const user = state.users.find((item) => item.id === review.userId);
      return { ...review, customerName: maskCustomerName(user?.fullName) };
    }));
}

export function loginAdmin(email, password) {
  if (email.trim().toLowerCase() !== "admin@anstore.vn" || password !== "password") {
    throw new Error("Thông tin đăng nhập quản trị không chính xác.");
  }
  state.adminLoggedIn = true;
  persist();
}

export function logoutAdmin() {
  state.adminLoggedIn = false;
  persist();
}

export function isAdminLoggedIn() {
  return state.adminLoggedIn;
}

export function getAdminData() {
  requireAdmin();
  return {
    products: getProducts({ includeHidden: true }),
    categories: clone(state.customCategories),
    orders: clone(state.orders),
    vouchers: clone(state.vouchers),
    returns: clone(state.returnRequests),
    reviews: clone(state.reviews),
    blogs: clone(state.blogs),
    transactions: clone(state.inventoryTransactions),
    userBlogSubmissions: clone(state.userBlogSubmissions || []),
    invoices: clone(state.invoices || [])
  };
}

export function deleteProducts(productIds = []) {
  requireAdmin();
  const ids = productIds.map(Number).filter(Boolean);
  if (!ids.length) throw new Error("Vui lòng chọn ít nhất một sản phẩm để xóa.");
  ids.forEach((id) => {
    const product = getProduct(id);
    if (!product) return;
    state.productOverrides[id] = { ...(state.productOverrides[id] || {}), status: "HIDDEN", deleted: true };
  });
  persist();
}
export function toggleProductVisibility(productId) {
  requireAdmin();
  const product = getProduct(productId);
  if (!product) throw new Error("Không tìm thấy sản phẩm.");
  const nextStatus = product.status === "HIDDEN" ? (product.stock > 0 ? "ACTIVE" : "OUT_OF_STOCK") : "HIDDEN";
  state.productOverrides[product.id] = { ...(state.productOverrides[product.id] || {}), status: nextStatus };
  persist();
}

export function saveCategory(input) {
  requireAdmin();
  if (!input.name.trim()) throw new Error("Tên danh mục không được để trống.");
  const slug = (input.id || input.name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const existing = state.customCategories.find((item) => item.id === slug);
  if (existing) {
    existing.name = input.name.trim();
    existing.description = input.description?.trim() || existing.description;
    existing.hidden = false;
  } else {
    state.customCategories.push({ id: slug, name: input.name.trim(), description: input.description?.trim() || "Danh mục mới.", hidden: false });
  }
  persist();
}

export function toggleCategory(categoryId) {
  requireAdmin();
  const category = state.customCategories.find((item) => item.id === categoryId);
  if (!category || category.id === "all") throw new Error("Không thể thay đổi danh mục này.");
  category.hidden = !category.hidden;
  persist();
}

export function saveAdminProduct(input) {
  requireAdmin();
  const existing = input.id ? getProduct(input.id) : null;
  const product = {
    id: existing?.id || Math.max(0, ...getProducts({ includeHidden: true }).map((item) => item.id)) + 1,
    slug: (input.slug || input.name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name: input.name.trim(),
    category: input.category,
    price: Number(input.price),
    discountPrice: input.discountPrice ? Number(input.discountPrice) : null,
    stock: Number(input.stock),
    status: Number(input.stock) > 0 ? "ACTIVE" : "OUT_OF_STOCK",
    featured: false,
    createdAt: new Date().toISOString().slice(0, 10),
    images: [input.image || "/img/products/18.png"],
    description: input.description || "Sản phẩm mới của ẨN Store.",
    historicalPeriod: input.historicalPeriod || "Cảm hứng lịch sử Việt Nam",
    gameType: input.gameType || "Board game",
    playerCount: input.playerCount || "2-6 người",
    ageRating: input.ageRating || "12+",
    duration: input.duration || "60-90 phút",
    difficulty: input.difficulty || "Trung bình",
    components: input.components || "Thông tin đang cập nhật.",
    storySummary: input.storySummary || "Hồ sơ câu chuyện đang được hoàn thiện."
  };
  if (!product.name) throw new Error("Tên sản phẩm không được để trống.");
  if (product.price < 0 || product.stock < 0) throw new Error("Giá và tồn kho phải hợp lệ.");
  if (existing) state.productOverrides[product.id] = { ...(state.productOverrides[product.id] || {}), ...product };
  else state.addedProducts.push(product);
  persist();
}

export function adjustInventory(productId, change, type = "ADJUSTMENT", reason = "Admin điều chỉnh tồn kho", orderId = null) {
  const product = getProduct(productId);
  if (!product) throw new Error("Không tìm thấy sản phẩm.");
  const before = Number(product.stock);
  const after = before + Number(change);
  if (after < 0) throw new Error("Tồn kho không thể nhỏ hơn 0.");
  state.productOverrides[product.id] = {
    ...(state.productOverrides[product.id] || {}),
    stock: after,
    status: after === 0 ? "OUT_OF_STOCK" : product.status === "OUT_OF_STOCK" ? "ACTIVE" : product.status
  };
  state.inventoryTransactions.unshift({
    id: nextId(state.inventoryTransactions),
    productId: product.id,
    orderId,
    type,
    change: Number(change),
    before,
    after,
    reason,
    createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date())
  });
  persist();
  return after;
}

export function updateOrderStatus(orderId, status) {
  requireAdmin();
  const order = state.orders.find((item) => item.id === Number(orderId));
  if (!order) throw new Error("Không tìm thấy đơn hàng.");
  const allowed = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED"];
  if (!allowed.includes(status)) throw new Error("Trạng thái không hợp lệ.");
  if (status === "CANCELLED" && order.stockDeducted) {
    order.items.forEach((item) => adjustInventory(item.productId, item.quantity, "ORDER_CANCEL", "Admin hủy đơn " + order.code, order.id));
    order.stockDeducted = false;
  }
  if (status === "DELIVERED" && order.paymentMethod === "COD" && !order.stockDeducted) {
    order.items.forEach((item) => {
      const product = getProduct(item.productId);
      if (!product || product.stock < item.quantity) throw new Error("Không đủ tồn kho để hoàn tất đơn COD.");
    });
    order.items.forEach((item) => adjustInventory(item.productId, -item.quantity, "SALE", "Thu tiền COD cho đơn " + order.code, order.id));
    order.stockDeducted = true;
    order.paymentStatus = "SUCCESS";
    if (order.voucherCode) {
      const voucher = state.vouchers.find((item) => item.code === order.voucherCode);
      if (voucher) voucher.usedCount += 1;
    }
  }
  order.status = status;
  order.timeline.push({ status, at: new Intl.DateTimeFormat("vi-VN").format(new Date()) });
  persist();
}

export function toggleVoucher(code) {
  requireAdmin();
  const voucher = state.vouchers.find((item) => item.code === code);
  if (!voucher) throw new Error("Không tìm thấy voucher.");
  voucher.status = voucher.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  persist();
}

export function saveVoucher(input) {
  requireAdmin();
  const code = input.code.trim().toUpperCase();
  if (!code) throw new Error("Mã voucher không được để trống.");
  const existing = state.vouchers.find((item) => item.code === code);
  const voucher = existing || { code, usedCount: 0 };
  Object.assign(voucher, {
    name: input.name.trim() || code,
    type: input.type,
    value: input.type === "shipping" ? Number(input.value || 30000) : Number(input.value),
    maxDiscount: input.maxDiscount ? Number(input.maxDiscount) : null,
    minOrder: Number(input.minOrder || 0),
    startAt: input.startAt ? new Date(input.startAt).toISOString() : new Date().toISOString(),
    endAt: input.endAt ? new Date(input.endAt).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
    usageLimit: Number(input.usageLimit || 100),
    status: "ACTIVE"
  });
  if (voucher.value <= 0) throw new Error("Giá trị giảm phải lớn hơn 0.");
  if (!existing) state.vouchers.push(voucher);
  persist();
}

export function resolveReturn(returnId, status, note = "") {
  requireAdmin();
  const request = state.returnRequests.find((item) => item.id === Number(returnId));
  if (!request) throw new Error("Không tìm thấy yêu cầu.");
  const adminNote = String(note || "").trim();
  if (status === "REJECTED" && adminNote.length < 5) throw new Error("Vui lòng nhập lý do từ chối đổi/ trả tối thiểu 5 ký tự.");
  request.status = status;
  request.adminNote = adminNote || (status === "APPROVED" ? "Đã duyệt và nhập lại kho." : "Yêu cầu chưa đủ điều kiện.");
  if (status === "APPROVED") {
    adjustInventory(request.productId, request.quantity, "CUSTOMER_RETURN", "Nhập lại kho từ yêu cầu " + request.code);
  }
  persist();
}

export function toggleReview(reviewId) {
  requireAdmin();
  const review = state.reviews.find((item) => item.id === Number(reviewId));
  if (!review) throw new Error("Không tìm thấy đánh giá.");
  review.status = review.status === "VISIBLE" ? "HIDDEN" : "VISIBLE";
  persist();
}


export function getPublishedBlogs() {
  const adminPosts = (state.blogs || []).filter((post) => post.status === "PUBLISHED").map((post) => ({ ...post, source: "ADMIN" }));
  const userPosts = (state.userBlogSubmissions || []).filter((post) => post.status === "APPROVED").map((post) => ({
    id: "user-" + post.id,
    title: post.title,
    excerpt: post.excerpt || post.content.slice(0, 120) + "...",
    image: post.image || "/img/products/4.png",
    date: post.createdAt,
    status: "PUBLISHED",
    authorName: post.authorName,
    source: "USER"
  }));
  return clone([...userPosts, ...adminPosts]);
}

export function submitUserBlog(input) {
  const user = requireUser();
  const title = String(input.title || "").trim();
  const content = String(input.content || "").trim();
  const excerpt = String(input.excerpt || "").trim();
  if (title.length < 8) throw new Error("Tiêu đề bài chia sẻ cần tối thiểu 8 ký tự.");
  validateReviewContent(content);
  if (excerpt && excerpt.length < 10) throw new Error("Tóm tắt cần tối thiểu 10 ký tự hoặc để trống.");
  state.userBlogSubmissions.unshift({
    id: nextId(state.userBlogSubmissions || []),
    userId: user.id,
    authorName: user.fullName,
    title,
    excerpt: excerpt || content.slice(0, 150),
    content,
    image: input.imageName ? "/img/products/" + input.imageName : null,
    status: "PENDING",
    adminNote: "",
    createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date())
  });
  persist();
}

export function resolveUserBlog(submissionId, status, note = "") {
  requireAdmin();
  const post = state.userBlogSubmissions.find((item) => item.id === Number(submissionId));
  if (!post) throw new Error("Không tìm thấy bài viết user gửi.");
  const adminNote = String(note || "").trim();
  if (status === "REJECTED" && adminNote.length < 5) throw new Error("Vui lòng nhập lý do từ chối bài viết tối thiểu 5 ký tự.");
  post.status = status;
  post.adminNote = adminNote;
  post.reviewedAt = new Intl.DateTimeFormat("vi-VN").format(new Date());
  persist();
}
export function toggleBlog(postId) {
  requireAdmin();
  const post = state.blogs.find((item) => item.id === Number(postId));
  if (!post) throw new Error("Không tìm thấy bài viết.");
  post.status = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
  persist();
}

export function addBlog(input, status = "DRAFT") {
  requireAdmin();
  if (!input.title.trim()) throw new Error("Tiêu đề bài viết không được để trống.");
  state.blogs.unshift({
    id: nextId(state.blogs),
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    image: "/img/products/4.png",
    date: new Intl.DateTimeFormat("vi-VN").format(new Date()),
    status
  });
  persist();
}















