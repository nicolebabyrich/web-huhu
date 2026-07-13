const PAGE_ROOT = "/frontend/pages";

export const ROUTES = Object.freeze({
  home: `${PAGE_ROOT}/home/home.html`,
  products: `${PAGE_ROOT}/products/products.html`,
  blog: `${PAGE_ROOT}/blog/blog.html`,
  productDetail: `${PAGE_ROOT}/product-detail/product-detail.html`,
  cart: `${PAGE_ROOT}/cart/cart.html`,
  checkout: `${PAGE_ROOT}/checkout/checkout.html`,
  checkoutSuccess: `${PAGE_ROOT}/checkout/checkout-success.html`,
  login: `${PAGE_ROOT}/account/login.html`,
  register: `${PAGE_ROOT}/account/register.html`,
  forgotPassword: `${PAGE_ROOT}/account/forgot-password.html`,
  account: `${PAGE_ROOT}/account/account.html`,
  addresses: `${PAGE_ROOT}/account/addresses.html`,
  orders: `${PAGE_ROOT}/orders/orders.html`,
  orderDetail: `${PAGE_ROOT}/orders/order-detail.html`,
  adminLogin: `${PAGE_ROOT}/admin/admin-login.html`,
  admin: `${PAGE_ROOT}/admin/admin.html`
});

export function withQuery(url, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) query.set(key, String(value));
  });
  return query.size ? `${url}?${query.toString()}` : url;
}

export const productUrl = (productId) => withQuery(ROUTES.productDetail, { id: productId });
export const orderUrl = (orderId) => withQuery(ROUTES.orderDetail, { id: orderId });

export function redirectTo(url) {
  window.location.assign(url);
}


