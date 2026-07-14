import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { ForgotPasswordPage, mountAccountPage } from "../../src/modules/account/AccountPage.js";

initializePage({ render: ForgotPasswordPage, mount: mountAccountPage, activePath: "account" });
