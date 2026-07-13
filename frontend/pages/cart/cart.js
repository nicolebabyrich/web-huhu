import { initializePage } from "../../src/app.js";
import { CartPage, mountCartPage } from "../../src/modules/cart/CartPage.js";

initializePage({ render: CartPage, mount: mountCartPage, activePath: "cart" });
