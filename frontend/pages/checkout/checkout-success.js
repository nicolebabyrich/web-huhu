import { initializePage } from "../../src/app.js";
import { CheckoutSuccessPage } from "../../src/modules/checkout/CheckoutPage.js";

initializePage({ render: CheckoutSuccessPage, activePath: "checkout-success" });
