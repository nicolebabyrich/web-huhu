import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { CheckoutPage, mountCheckoutPage } from "../../src/modules/checkout/CheckoutPage.js";
import { getCurrentUser } from "../../src/services/store.js";
import { redirectTo, ROUTES, withQuery } from "../../src/utils/routes.js";

if (!getCurrentUser()) {
  redirectTo(withQuery(ROUTES.login, { redirect: ROUTES.checkout }));
} else {
  initializePage({ render: CheckoutPage, mount: mountCheckoutPage, activePath: "checkout" });
}
