import { initializePage } from "../../src/app.js";
import { mountOrdersPage, OrderDetailPage } from "../../src/modules/orders/OrdersPage.js";

const orderId = new URLSearchParams(window.location.search).get("id");
initializePage({ render: () => OrderDetailPage(orderId), mount: mountOrdersPage, activePath: "orders" });
