import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { mountOrdersPage, OrdersPage } from "../../src/modules/orders/OrdersPage.js";

initializePage({ render: OrdersPage, mount: mountOrdersPage, activePath: "orders" });
