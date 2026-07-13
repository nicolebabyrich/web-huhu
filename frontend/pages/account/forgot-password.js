import { initializePage } from "../../src/app.js";
import { ForgotPasswordPage, mountAccountPage } from "../../src/modules/account/AccountPage.js";

initializePage({ render: ForgotPasswordPage, mount: mountAccountPage, activePath: "account" });
