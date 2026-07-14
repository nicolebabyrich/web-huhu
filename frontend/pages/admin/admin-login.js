import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { AdminLoginPage, mountAdminPage } from "../../src/modules/admin/AdminPage.js?v=20260713-password-icon";

initializePage({ render: AdminLoginPage, mount: mountAdminPage, activePath: "admin-login", standalone: true });

