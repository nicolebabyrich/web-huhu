import { initializePage } from "../../src/app.js";
import { AccountPage, mountAccountPage } from "../../src/modules/account/AccountPage.js";

initializePage({ render: AccountPage, mount: mountAccountPage, activePath: "account" });
