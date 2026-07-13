import { initializePage } from "../../src/app.js";
import { LoginPage, mountAccountPage } from "../../src/modules/account/AccountPage.js?v=20260713-password-icon";

initializePage({ render: LoginPage, mount: mountAccountPage, activePath: "account" });

