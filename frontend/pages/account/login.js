import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { LoginPage, mountAccountPage } from "../../src/modules/account/AccountPage.js?v=20260713-password-icon";

initializePage({ render: LoginPage, mount: mountAccountPage, activePath: "account" });

