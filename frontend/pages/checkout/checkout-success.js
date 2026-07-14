import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { CheckoutSuccessPage } from "../../src/modules/checkout/CheckoutPage.js";

initializePage({ render: CheckoutSuccessPage, activePath: "checkout-success" });
