import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { AdminPage, mountAdminPage } from "../../src/modules/admin/AdminPage.js";
import { isAdminLoggedIn } from "../../src/services/store.js";
import { redirectTo, ROUTES } from "../../src/utils/routes.js";

if (!isAdminLoggedIn()) {
  redirectTo(ROUTES.adminLogin);
} else {
  initializePage({ render: AdminPage, mount: mountAdminPage, activePath: "admin", standalone: true });
}
