import { MainLayout } from "./layouts/MainLayout.js";
import { handleAccountGlobalAction } from "./modules/account/AccountPage.js";
import { addToCart } from "./services/store.js";
import { escapeHtml, isValidEmail, normalizeEmail } from "./utils/format.js";
import { ROUTES } from "./utils/routes.js";

function ensureModelViewerLoaded() {
  if (customElements.get("model-viewer")) return Promise.resolve(true);
  const existing = document.querySelector('script[data-model-viewer-loader]');
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
    });
  }
  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
  script.dataset.modelViewerLoader = "true";
  document.head.append(script);
  return new Promise((resolve) => {
    script.addEventListener("load", () => resolve(true), { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
  });
}

function showToast(message, error = false, action = null) {
  const region = document.querySelector("#toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = "toast show" + (error ? " toast--error" : "");
  const text = document.createElement("span");
  text.textContent = message;
  toast.append(text);
  if (action) {
    const link = document.createElement("a");
    link.className = "toast__action";
    link.href = action.href;
    link.textContent = action.label;
    toast.append(link);
  }
  region.append(toast);
  window.setTimeout(() => toast.remove(), 5200);
}

function openInfoModal({ title, titleHtml = "", eyebrow = "ThÃ´ng tin", content, modifier = "" }) {
  document.querySelector("[data-info-modal]")?.remove();
  const backdrop = document.createElement("div");
  backdrop.className = ["modal-backdrop", modifier ? `modal-backdrop--${modifier}` : ""].filter(Boolean).join(" ");
  backdrop.dataset.infoModal = "true";
  const modalClass = ["modal", "info-modal", modifier ? `info-modal--${modifier}` : ""].filter(Boolean).join(" ");
  backdrop.innerHTML = `<article class="${modalClass}" role="dialog" aria-modal="true" aria-labelledby="info-modal-title"><button class="modal-close" type="button" data-action="close-info-modal" aria-label="ÄÃ³ng">Ã—</button><p class="eyebrow">${escapeHtml(eyebrow)}</p><h2 id="info-modal-title">${titleHtml || escapeHtml(title)}</h2><div class="info-modal__content">${content}</div></article>`;
  document.body.append(backdrop);
}

function privacyPolicyContent() {
  return `<p>ChÃºng tÃ´i cam káº¿t báº£o vá»‡ quyá»n riÃªng tÆ° cá»§a báº¡n khi sá»­ dá»¥ng website áº¨N Store.</p><ol class="policy-list"><li><strong>ThÃ´ng tin thu tháº­p:</strong> há» tÃªn, email, sá»‘ Ä‘iá»‡n thoáº¡i, Ä‘á»‹a chá»‰ giao hÃ ng vÃ  dá»¯ liá»‡u liÃªn há»‡ khi báº¡n Ä‘Äƒng kÃ½ tÃ i khoáº£n, nháº­n báº£n tin hoáº·c gá»­i biá»ƒu máº«u.</li><li><strong>Sá»­ dá»¥ng thÃ´ng tin:</strong> phá»¥c vá»¥ Ä‘áº·t hÃ ng, giao nháº­n, chÄƒm sÃ³c khÃ¡ch hÃ ng vÃ  cáº£i thiá»‡n tráº£i nghiá»‡m website.</li><li><strong>Báº£o máº­t:</strong> Ã¡p dá»¥ng biá»‡n phÃ¡p ká»¹ thuáº­t vÃ  tá»• chá»©c há»£p lÃ½ Ä‘á»ƒ háº¡n cháº¿ truy cáº­p trÃ¡i phÃ©p, máº¥t mÃ¡t hoáº·c tiáº¿t lá»™ dá»¯ liá»‡u.</li><li><strong>Cookies:</strong> Ä‘Æ°á»£c dÃ¹ng Ä‘á»ƒ ghi nhá»› tráº¡ng thÃ¡i sá»­ dá»¥ng vÃ  tá»‘i Æ°u tráº£i nghiá»‡m.</li><li><strong>Quyá»n ngÆ°á»i dÃ¹ng:</strong> báº¡n cÃ³ thá»ƒ yÃªu cáº§u truy cáº­p, chá»‰nh sá»­a hoáº·c xÃ³a thÃ´ng tin cÃ¡ nhÃ¢n Ä‘Æ°á»£c lÆ°u trá»¯.</li><li><strong>LiÃªn há»‡:</strong> matan@anstore.vn.</li></ol>`;
}


function shippingPolicyContent() {
  return `<ol class="policy-list policy-list--long"><li><strong>Äá»‘i tÆ°á»£ng Ã¡p dá»¥ng chÃ­nh sÃ¡ch:</strong> Ã¡p dá»¥ng cho táº¥t cáº£ khÃ¡ch hÃ ng mua sáº£n pháº©m qua website thÆ°Æ¡ng máº¡i Ä‘iá»‡n tá»­ anstore.vn.</li><li><strong>Pháº¡m vi váº­n chuyá»ƒn:</strong> ANstore thá»±c hiá»‡n yÃªu cáº§u váº­n chuyá»ƒn trÃªn pháº¡m vi toÃ n quá»‘c.</li><li><strong>HÃ¬nh thá»©c váº­n chuyá»ƒn:</strong> ANstore giao hÃ ng táº­n nÆ¡i vÃ  há»£p tÃ¡c vá»›i cÃ¡c cÃ´ng ty váº­n chuyá»ƒn uy tÃ­n Ä‘á»ƒ Ä‘Æ°a hÃ ng hÃ³a Ä‘áº¿n tay khÃ¡ch hÃ ng.</li><li><strong>Thá»i gian giao hÃ ng:</strong> Ä‘Æ°á»£c tÃ­nh tá»« lÃºc Ä‘Æ¡n hÃ ng Ä‘áº·t thÃ nh cÃ´ng. Náº¿u Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng ngoÃ i giá» lÃ m viá»‡c, thá»i gian Ä‘Æ°á»£c tÃ­nh tá»« giá» lÃ m viá»‡c Ä‘áº§u tiÃªn cá»§a ngÃ y lÃ m viá»‡c tiáº¿p theo.</li><li><strong>Quy trÃ¬nh xá»­ lÃ½ Ä‘Æ¡n hÃ ng:</strong> sau khi Ä‘áº·t hÃ ng thÃ nh cÃ´ng, ANstore gá»­i xÃ¡c nháº­n Ä‘Æ¡n hÃ ng qua email.</li><li><strong>Thá»i gian vÃ  phÃ­ váº­n chuyá»ƒn:</strong> Há»“ ChÃ­ Minh miá»…n phÃ­ váº­n chuyá»ƒn, giao trong 1-3 ngÃ y lÃ m viá»‡c. LiÃªn tá»‰nh phÃ­ váº­n chuyá»ƒn 30.000 VNÄ, giao trong 3-4 ngÃ y lÃ m viá»‡c. ÄÆ¡n hÃ ng trÃªn 500.000 VNÄ Ä‘Æ°á»£c miá»…n phÃ­ váº­n chuyá»ƒn. Giao hÃ ng cáº¥p tá»‘c chá»‰ Ã¡p dá»¥ng TP. HCM vá»›i cÆ°á»›c phÃ­ 50.000 VNÄ.</li><li><strong>LÆ°u Ã½ váº­n chuyá»ƒn:</strong> thá»i gian nháº­n hÃ ng cÃ³ thá»ƒ kÃ©o dÃ i hÆ¡n dá»± kiáº¿n do lÅ© lá»¥t, há»a hoáº¡n, tai náº¡n, thá»i tiáº¿t, giao thÃ´ng hoáº·c Ä‘iá»u kiá»‡n khÃ¡ch quan ngoÃ i kiá»ƒm soÃ¡t. Trong cÃ¡c trÆ°á»ng há»£p nÃ y, ANstore sáº½ ná»— lá»±c kháº¯c phá»¥c vÃ  Æ°u tiÃªn quyá»n lá»£i khÃ¡ch hÃ ng.</li><li><strong>Nháº­n hÃ ng - kiá»ƒm hÃ ng:</strong> quÃ½ khÃ¡ch cáº§n Ä‘á»‘i soÃ¡t sáº£n pháº©m cÃ²n nguyÃªn Ä‘ai, nguyÃªn kiá»‡n, cÃ²n niÃªm phong, chÆ°a cÃ³ dáº¥u hiá»‡u bÃ³c má»Ÿ vÃ  Ä‘áº§y Ä‘á»§ chá»©ng tá»« cá»§a anstore.vn. Náº¿u phÃ¡t hiá»‡n báº¥t thÆ°á»ng, liÃªn há»‡ Hot Line 090-XXX-XXXX hoáº·c email matan@anstore.vn Ä‘á»ƒ Ä‘Æ°á»£c hÆ°á»›ng dáº«n.</li></ol>`;
}

function returnPolicyContent() {
  return `<ol class="policy-list policy-list--long"><li><strong>ChÃ­nh sÃ¡ch báº£o hÃ nh:</strong> sáº£n pháº©m cÃ²n thá»i gian báº£o hÃ nh theo phiáº¿u báº£o hÃ nh hoáº·c hÃ³a Ä‘Æ¡n mua hÃ ng cá»§a ANstore vÃ  Ä‘Æ°á»£c xÃ¡c Ä‘á»‹nh lÃ  lá»—i nhÃ  sáº£n xuáº¥t. Viá»‡c xÃ¡c Ä‘á»‹nh lá»—i Ä‘Æ°á»£c thá»±c hiá»‡n bá»Ÿi website anstore.vn.</li><li><strong>Gá»­i sáº£n pháº©m báº£o hÃ nh:</strong> khÃ¡ch hÃ ng cÃ³ thá»ƒ Ä‘em hoáº·c gá»­i sáº£n pháº©m Ä‘áº¿n kho hÃ ng ANstore theo Ä‘á»‹a chá»‰ trÃªn phiáº¿u báº£o hÃ nh hoáº·c hÃ³a Ä‘Æ¡n. Chi phÃ­ váº­n chuyá»ƒn do khÃ¡ch hÃ ng chi tráº£.</li><li><strong>Kiá»ƒm tra báº£o hÃ nh:</strong> ANstore kiá»ƒm tra tá»•ng quan sáº£n pháº©m. Náº¿u lá»—i do khÃ¡ch hÃ ng nhÆ° bá»ƒ, nÆ°á»›c vÃ o sáº£n pháº©m hoáº·c khÃ´ng pháº£i lá»—i ká»¹ thuáº­t tá»« nhÃ  sáº£n xuáº¥t, ANstore sáº½ tÆ° váº¥n vÃ  cÃ³ quyá»n tá»« chá»‘i tiáº¿p nháº­n báº£o hÃ nh. Náº¿u khÃ¡ch váº«n cáº§n há»— trá»£ sá»­a chá»¯a, ANstore tÆ° váº¥n theo quy trÃ¬nh sá»­a chá»¯a tÃ­nh phÃ­.</li><li><strong>Thá»i gian báº£o hÃ nh:</strong> khu vá»±c HN/HCM: 7 ngÃ y lÃ m viá»‡c ká»ƒ cáº£ thá»i gian váº­n chuyá»ƒn. Khu vá»±c tá»‰nh: 17 ngÃ y lÃ m viá»‡c ká»ƒ cáº£ thá»i gian váº­n chuyá»ƒn.</li><li><strong>Äiá»u kiá»‡n Ä‘á»•i/tráº£:</strong> sáº£n pháº©m lá»—i ká»¹ thuáº­t do nhÃ  sáº£n xuáº¥t hoáº·c thiáº¿u chi tiáº¿t nhÆ°ng bÃªn ngoÃ i khÃ´ng tráº§y xÆ°á»›c, bá»ƒ, vá»¡, mÃ³p mÃ©o; hoáº·c khÃ¡ch nháº­n khÃ´ng Ä‘Ãºng sáº£n pháº©m Ä‘Ã£ Ä‘áº·t vÃ  bao bÃ¬ cÃ²n nguyÃªn váº¹n.</li><li><strong>Thá»i háº¡n Ä‘á»•i/tráº£:</strong> trong vÃ²ng 03 ngÃ y ká»ƒ tá»« ngÃ y khÃ¡ch hÃ ng nháº­n hÃ ng, cÄƒn cá»© thá»i gian kÃ½ nháº­n trÃªn váº­n Ä‘Æ¡n. Sáº£n pháº©m Ä‘á»•i tráº£ pháº£i cÃ²n hÃ³a Ä‘Æ¡n bÃ¡n hÃ ng do ANstore gá»­i kÃ¨m.</li><li><strong>ChÃ­nh sÃ¡ch Ä‘á»•i hÃ ng:</strong> khÃ¡ch hÃ ng Ä‘em sáº£n pháº©m Ä‘áº¿n Ä‘á»•i trá»±c tiáº¿p táº¡i kho hÃ ng ANstore vÃ  chá»‰ Ä‘Æ°á»£c Ä‘á»•i Ä‘Ãºng mÃ£ sáº£n pháº©m Ä‘Ã£ mua.</li><li><strong>HoÃ n tiá»n:</strong> vá»›i Ä‘Æ¡n COD/Tháº», ANstore hoÃ n tiá»n báº±ng chuyá»ƒn khoáº£n trong vÃ²ng 7 ngÃ y lÃ m viá»‡c ká»ƒ tá»« ngÃ y nháº­n Ä‘Æ°á»£c hÃ ng hÃ³a khÃ¡ch gá»­i láº¡i.</li><li><strong>CÃ¡ch gá»­i tráº£ hÃ ng:</strong> bÆ°á»›c 1, khÃ¡ch hÃ ng chá»¥p hÃ¬nh hoáº·c quay clip sáº£n pháº©m lá»—i/hÆ° há»ng vÃ  gá»­i yÃªu cáº§u qua kÃªnh liÃªn há»‡. BÆ°á»›c 2, khÃ¡ch ná»™i thÃ nh HN/HCM mang hÃ ng trá»±c tiáº¿p Ä‘áº¿n kho ANstore; khÃ¡ch ngoáº¡i thÃ nh HN/HCM gá»­i tráº£ hÃ ng vá» Ä‘á»‹a chá»‰ kho ANstore.</li><li><strong>ThÃ´ng tin liÃªn há»‡:</strong> Ä‘á»‹a chá»‰ Lá»‡ Chi ViÃªn, Äáº¡i Viá»‡t thá»i LÃª. Hotline 090-XXX-XXXX tá»« thá»© Hai Ä‘áº¿n thá»© Báº£y (08:00 - 17:00), Chá»§ nháº­t (08:00 - 12:00). Email matan@anstore.vn.</li></ol>`;
}
function threeDModelContent({ title, source, poster = "", note = "" }) {
  const safeTitle = escapeHtml(title || "MÃ´ hÃ¬nh 3D");
  const safeSource = escapeHtml(source || "");
  const safePoster = poster ? ` poster="${escapeHtml(poster)}"` : "";
  return `
    <div class="model-viewer-shell">
      <model-viewer src="${safeSource}"${safePoster} camera-controls auto-rotate ar shadow-intensity="0.85" exposure="1" alt="${safeTitle}">
        <div class="model-viewer-fallback" slot="poster">
          <p>Äang má»Ÿ mÃ´ hÃ¬nh 3D...</p>
        </div>
      </model-viewer>
      <p class="muted">${escapeHtml(note || "KÃ©o Ä‘á»ƒ xoay mÃ´ hÃ¬nh, cuá»™n Ä‘á»ƒ phÃ³ng to/thu nhá». Náº¿u mÃ´ hÃ¬nh chÆ°a hiá»‡n, hÃ£y kiá»ƒm tra káº¿t ná»‘i Internet Ä‘á»ƒ táº£i trÃ¬nh xem 3D.")}</p>
    </div>
  `;
}

function clearSharedFieldError(control) {
  control.classList.remove("has-error");
  control.removeAttribute("aria-invalid");
  control.removeAttribute("aria-describedby");
  control.closest(".form-field")?.querySelector(".field-error")?.remove();
}

function showSharedFieldError(control, message) {
  clearSharedFieldError(control);
  control.classList.add("has-error");
  control.setAttribute("aria-invalid", "true");
  const error = document.createElement("small");
  error.className = "field-error";
  error.id = `${control.form?.id || "shared-form"}-${control.name || "field"}-error`;
  error.setAttribute("role", "alert");
  error.textContent = message;
  control.setAttribute("aria-describedby", error.id);
  control.closest(".form-field")?.append(error);
}

function bindNewsletterEmailValidation(form) {
  const control = form?.elements.email;
  if (!control) return;
  const validate = (showWhenEmpty = false) => {
    const value = control.value || "";
    if (!value && !showWhenEmpty) {
      clearSharedFieldError(control);
      return true;
    }
    if (!isValidEmail(value)) {
      showSharedFieldError(control, "Email khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng. Vui lÃ²ng nháº­p láº¡i.");
      return false;
    }
    clearSharedFieldError(control);
    return true;
  };
  control.addEventListener("input", () => validate(false));
  control.addEventListener("blur", () => validate(true));
}

function mountSharedForms() {
  const newsletterForm = document.querySelector("#newsletter-form");
  bindNewsletterEmailValidation(newsletterForm);
  newsletterForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = normalizeEmail(new FormData(form).get("email"));
    const message = form.querySelector("#newsletter-message");
    const button = form.querySelector('button[type="submit"]');
    if (!isValidEmail(email)) {
      showSharedFieldError(form.elements.email, "Email khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng. Vui lÃ²ng nháº­p láº¡i.");
      message.textContent = "Email khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng. Vui lÃ²ng nháº­p láº¡i.";
      message.classList.remove("form-message--success");
      return;
    }
    clearSharedFieldError(form.elements.email);
    button.disabled = true;
    button.textContent = "Äang ghi nháº­n...";
    const resultMessage = "ÄÃ£ ghi nháº­n email nháº­n máº­t thÆ°. Báº£n demo chÆ°a tÃ­ch há»£p API gá»­i email tá»± Ä‘á»™ng, nÃªn há»‡ thá»‘ng chá»‰ hiá»ƒn thá»‹ thÃ´ng bÃ¡o xÃ¡c nháº­n.";
    window.setTimeout(() => {
      form.reset();
      message.textContent = resultMessage;
      message.classList.add("form-message--success");
      showToast(resultMessage);
      button.disabled = false;
      button.textContent = "ÄÄƒng kÃ½";
    }, 250);
  });
}

const CHATBOT_STORAGE_KEY = "anstore.chatbot.state";
const CHATBOT_GREETING = "ChÃ o báº¡n, mÃ¬nh lÃ  ThÆ° Äá»“ng. Báº¡n cÃ³ thá»ƒ há»i mÃ¬nh vá» sáº£n pháº©m, giá» hÃ ng, Ä‘Æ¡n hÃ ng hoáº·c cÃ¡ch mua táº¡i áº¨N Store.";

function readChatbotState() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(CHATBOT_STORAGE_KEY) || "{}");
    return {
      messages: Array.isArray(parsed.messages) && parsed.messages.length
        ? parsed.messages
        : [{ role: "bot", text: CHATBOT_GREETING }],
      interactionId: typeof parsed.interactionId === "string" ? parsed.interactionId : "",
      loading: false,
      open: Boolean(parsed.open)
    };
  } catch {
    return { messages: [{ role: "bot", text: CHATBOT_GREETING }], interactionId: "", loading: false, open: false };
  }
}

function writeChatbotState(nextState) {
  const safeState = {
    messages: nextState.messages.slice(-12),
    interactionId: nextState.interactionId || "",
    open: Boolean(nextState.open)
  };
  sessionStorage.setItem(CHATBOT_STORAGE_KEY, JSON.stringify(safeState));
  return { ...safeState, loading: Boolean(nextState.loading) };
}

function formatChatbotReply(text = "") {
  const escaped = escapeHtml(String(text || "").trim());
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const normalized = withBold
    .replace(/\s+(\d+\.\s+)/g, "\n$1")
    .replace(/\s+(\*\s+)/g, "\n$1")
    .replace(/\s+(Lưu ý:)/g, "\n\n$1")
    .replace(/\s+(Bạn đang quan tâm)/g, "\n\n$1");

  const lines = normalized.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return "";

  const html = [];
  let listOpen = false;
  lines.forEach((line) => {
    const numbered = line.match(/^(\d+)\.\s+(.+)$/);
    const bullet = line.match(/^\*\s+(.+)$/);
    if (numbered || bullet) {
      if (!listOpen) {
        html.push("<ol class=\"chatbot-reply-list\">");
        listOpen = true;
      }
      html.push(`<li>${numbered ? numbered[2] : bullet[1]}</li>`);
      return;
    }
    if (listOpen) {
      html.push("</ol>");
      listOpen = false;
    }
    html.push(`<p>${line}</p>`);
  });
  if (listOpen) html.push("</ol>");
  return html.join("");
}
function renderChatbotMessages(state = readChatbotState()) {
  const widget = document.querySelector("[data-chatbot-widget]");
  const list = widget?.querySelector("[data-chatbot-messages]");
  if (!widget || !list) return;

  widget.classList.toggle("is-open", state.open);
  widget.querySelector(".chatbot-panel").hidden = !state.open;
  widget.querySelector(".chatbot-toggle")?.setAttribute("aria-expanded", String(state.open));

  list.innerHTML = state.messages.map((message) => `
    <div class="chatbot-message chatbot-message--${message.role === "user" ? "user" : "bot"}">
      <div class="chatbot-bubble">${message.role === "user" ? escapeHtml(message.text) : formatChatbotReply(message.text)}</div>
    </div>
  `).join("") + (state.loading ? `<div class="chatbot-message chatbot-message--bot"><div class="chatbot-bubble">Đang xử lý...</div></div>` : "");
  list.scrollTop = list.scrollHeight;

  const submitButton = widget.querySelector('[data-chatbot-form] button[type="submit"]');
  const input = widget.querySelector("#chatbot-message");
  if (submitButton) submitButton.disabled = state.loading;
  if (input) input.disabled = state.loading;
}

function mountChatbotWidget() {
  if (!document.querySelector("[data-chatbot-widget]")) return;
  renderChatbotMessages(readChatbotState());
}

function toggleChatbot(forceOpen = null) {
  const current = readChatbotState();
  const open = forceOpen === null ? !current.open : Boolean(forceOpen);
  const next = writeChatbotState({ ...current, open });
  renderChatbotMessages(next);
  if (open) window.setTimeout(() => document.querySelector("#chatbot-message")?.focus(), 0);
}

async function submitChatbotMessage(form) {
  const input = form.elements.message;
  const text = String(input?.value || "").trim();
  if (!text) return;

  const current = readChatbotState();
  const asking = writeChatbotState({
    ...current,
    open: true,
    loading: true,
    messages: [...current.messages, { role: "user", text }]
  });
  input.value = "";
  renderChatbotMessages(asking);

  try {
    const result = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        previousInteractionId: current.interactionId,
        page: document.title,
        path: window.location.pathname
      })
    });
    const payload = await result.json().catch(() => ({}));
    if (!result.ok) throw new Error(payload.message || "KhÃ´ng thá»ƒ káº¿t ná»‘i trá»£ lÃ½ lÃºc nÃ y.");
    const fresh = readChatbotState();
    writeChatbotState({
      ...fresh,
      open: true,
      interactionId: payload.interactionId || fresh.interactionId,
      messages: [...fresh.messages, { role: "bot", text: payload.message || "MÃ¬nh chÆ°a cÃ³ pháº£n há»“i phÃ¹ há»£p lÃºc nÃ y." }]
    });
  } catch (error) {
    const fresh = readChatbotState();
    writeChatbotState({
      ...fresh,
      open: true,
      messages: [...fresh.messages, { role: "bot", text: error.message || "Gemini Ä‘ang quÃ¡ táº£i. Báº¡n thá»­ láº¡i sau Ã­t phÃºt nhÃ©." }]
    });
  } finally {
    renderChatbotMessages(readChatbotState());
  }
}
export function initializePage({ render, mount = () => {}, activePath = "/", standalone = false }) {
  const app = document.querySelector("#app");
  if (!app) throw new Error("KhÃ´ng tÃ¬m tháº¥y vÃ¹ng hiá»ƒn thá»‹ #app.");

  const refresh = () => {
    const content = render();
    app.innerHTML = standalone ? content : MainLayout(content, activePath);
    document.body.dataset.page = activePath;
    mountSharedForms();
    mountChatbotWidget();
    if (document.querySelector("model-viewer")) ensureModelViewerLoaded();
    mount(refresh);
  };
  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-chatbot-form]");
    if (!form) return;
    event.preventDefault();
    submitChatbotMessage(form);
  });
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "toggle-chatbot") {
      toggleChatbot();
      return;
    }
    if (handleAccountGlobalAction(action)) return;

    if (action === "skip-content") {
      const main = document.querySelector("#main-content");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus();
      }
      return;
    }

    if (action === "toggle-menu") {
      const nav = document.querySelector("#site-navigation");
      const open = nav?.classList.toggle("is-open");
      target.setAttribute("aria-expanded", String(Boolean(open)));
      return;
    }

    if (action === "history-back") {
      window.history.back();
      return;
    }

    if (action === "history-forward") {
      window.history.forward();
      return;
    }

    if (action === "open-privacy-policy") {
      openInfoModal({ title: "ChÃ­nh sÃ¡ch báº£o máº­t", titleHtml: `<span class="policy-title-line">ChÃ­nh sÃ¡ch</span><span class="policy-title-line">báº£o máº­t</span>`, eyebrow: "Cam káº¿t báº£o máº­t", content: privacyPolicyContent(), modifier: "policy" });
      return;
    }

    if (action === "open-shipping-policy") {
      openInfoModal({ title: "ChÃ­nh sÃ¡ch giao nháº­n", titleHtml: `<span class="policy-title-line">ChÃ­nh sÃ¡ch</span><span class="policy-title-line">giao nháº­n</span>`, eyebrow: "Giao nháº­n", content: shippingPolicyContent(), modifier: "policy" });
      return;
    }

    if (action === "open-return-policy") {
      openInfoModal({ title: "ChÃ­nh sÃ¡ch Ä‘á»•i tráº£", titleHtml: `<span class="policy-title-line">ChÃ­nh sÃ¡ch</span><span class="policy-title-line policy-title-line--pair">Ä‘á»•i tráº£</span>`, eyebrow: "Báº£o hÃ nh vÃ  Ä‘á»•i tráº£", content: returnPolicyContent(), modifier: "policy" });
      return;
    }

    if (action === "open-character-profile") {
      const title = target.dataset.characterTitle || "Há»“ sÆ¡ nhÃ¢n váº­t";
      const story = target.dataset.characterStory || "ThÃ´ng tin nhÃ¢n váº­t Ä‘ang Ä‘Æ°á»£c cáº­p nháº­t.";
      const image = target.dataset.characterImage || "";
      const model = target.dataset.characterModel || "";
      openInfoModal({
        title,
        eyebrow: "Há»“ sÆ¡ nhÃ¢n váº­t",
        modifier: "character",
        content: `<div class="character-profile-modal"><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}"><div><p>${escapeHtml(story)}</p><div class="button-row character-profile-actions"><a class="button button--secondary button--small" href="${ROUTES.products}">Xem sáº£n pháº©m liÃªn quan</a>${model ? `<button class="button button--primary button--small" type="button" data-action="open-3d-model" data-model-title="${escapeHtml(title)}" data-model-src="${escapeHtml(model)}" data-model-poster="${escapeHtml(image)}">Xem mÃ´ hÃ¬nh 3D</button>` : ""}</div></div></div>`
      });
      return;
    }

    if (action === "open-3d-model") {
      ensureModelViewerLoaded();
      const title = target.dataset.modelTitle || "MÃ´ hÃ¬nh 3D";
      const source = target.dataset.modelSrc || "";
      const poster = target.dataset.modelPoster || "";
      openInfoModal({
        title,
        eyebrow: "Tráº£i nghiá»‡m 360Â°",
        modifier: "model3d",
        content: threeDModelContent({ title, source, poster })
      });
      return;
    }

    if (action === "close-info-modal") {
      document.querySelector("[data-info-modal]")?.remove();
      return;
    }

    if (action === "add-to-cart") {
      const productId = Number(target.dataset.productId);
      const quantityInput = document.querySelector("#product-quantity");
      const quantity = quantityInput && target.closest(".product-info") ? Number(quantityInput.value) : 1;
      try {
        addToCart(productId, quantity);
        showToast("ÄÃ£ thÃªm sáº£n pháº©m vÃ o giá» hÃ ng.", false, { label: "Xem giá» hÃ ng", href: ROUTES.cart });
        refresh();
      } catch (error) {
        showToast(error.message, true);
      }
      return;
    }

    if (action === "buy-now") {
      const productId = Number(target.dataset.productId);
      const quantityInput = document.querySelector("#product-quantity");
      const quantity = quantityInput && target.closest(".product-info") ? Number(quantityInput.value) : 1;
      try {
        addToCart(productId, quantity);
        window.location.assign(ROUTES.checkout);
      } catch (error) {
        showToast(error.message, true);
      }
      return;
    }

    if (action === "gallery-image") {
      const mainImage = document.querySelector("#product-main-image");
      const thumbs = [...document.querySelectorAll('[data-action="gallery-image"]')];
      if (mainImage) {
        mainImage.src = target.dataset.image;
        mainImage.dataset.galleryIndex = String(thumbs.indexOf(target));
      }
      thumbs.forEach((item) => item.classList.toggle("is-active", item === target));
      return;
    }

    if (action === "gallery-prev" || action === "gallery-next") {
      const mainImage = document.querySelector("#product-main-image");
      const thumbs = [...document.querySelectorAll('[data-action="gallery-image"]')];
      if (!mainImage || !thumbs.length) return;
      const current = Math.max(0, Number(mainImage.dataset.galleryIndex || 0));
      const nextIndex = action === "gallery-next"
        ? (current + 1) % thumbs.length
        : (current - 1 + thumbs.length) % thumbs.length;
      const nextThumb = thumbs[nextIndex];
      mainImage.src = nextThumb.dataset.image;
      mainImage.dataset.galleryIndex = String(nextIndex);
      thumbs.forEach((item, index) => item.classList.toggle("is-active", index === nextIndex));
      return;
    }

    if (action === "quantity-down" || action === "quantity-up") {
      const input = document.querySelector("#product-quantity");
      if (!input) return;
      const next = Number(input.value) + (action === "quantity-up" ? 1 : -1);
      input.value = Math.max(Number(input.min || 1), Math.min(Number(input.max || 99), next));
    }
  });

  refresh();
}







