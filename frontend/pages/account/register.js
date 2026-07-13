import { initializePage } from "../../src/app.js";
import { mountAccountPage, RegisterPage } from "../../src/modules/account/AccountPage.js";

initializePage({ render: RegisterPage, mount: mountAccountPage, activePath: "account" });
