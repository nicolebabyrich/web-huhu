import { initializePage } from "../../src/app.js";
import { AdminLoginPage, mountAdminPage } from "../../src/modules/admin/AdminPage.js?v=20260713-password-icon";

initializePage({ render: AdminLoginPage, mount: mountAdminPage, activePath: "admin-login", standalone: true });

