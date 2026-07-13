import { initializePage } from "../../src/app.js";
import { mountOrdersPage, OrdersPage } from "../../src/modules/orders/OrdersPage.js";

initializePage({ render: OrdersPage, mount: mountOrdersPage, activePath: "orders" });
