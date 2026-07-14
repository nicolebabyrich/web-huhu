import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { mountAccountPage, RegisterPage } from "../../src/modules/account/AccountPage.js";

initializePage({ render: RegisterPage, mount: mountAccountPage, activePath: "account" });
