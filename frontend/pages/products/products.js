import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { mountProductPage, ProductListPage } from "../../src/modules/products/ProductsPage.js";

initializePage({ render: ProductListPage, mount: mountProductPage, activePath: "products" });
