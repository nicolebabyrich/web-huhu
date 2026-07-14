import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { mountProductPage, ProductDetailPage } from "../../src/modules/products/ProductsPage.js";

const productId = new URLSearchParams(window.location.search).get("id");
initializePage({
  render: () => ProductDetailPage(productId),
  mount: mountProductPage,
  activePath: "products"
});
