import { initializePage } from "../../src/app.js";
import { mountProductPage, ProductListPage } from "../../src/modules/products/ProductsPage.js";

initializePage({ render: ProductListPage, mount: mountProductPage, activePath: "products" });
