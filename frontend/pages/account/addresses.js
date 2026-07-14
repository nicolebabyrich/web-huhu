import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { AccountPage, mountAccountPage } from "../../src/modules/account/AccountPage.js";

initializePage({
  render: AccountPage,
  mount: (refresh) => {
    mountAccountPage(refresh);
    document.querySelector("#addresses")?.scrollIntoView({ block: "start" });
  },
  activePath: "account"
});
