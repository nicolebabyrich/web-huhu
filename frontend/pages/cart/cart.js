import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { CartPage, mountCartPage } from "../../src/modules/cart/CartPage.js";

initializePage({ render: CartPage, mount: mountCartPage, activePath: "cart" });
