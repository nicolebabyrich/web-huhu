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

function openInfoModal({ title, titleHtml = "", eyebrow = "Thông tin", content, modifier = "" }) {
  document.querySelector("[data-info-modal]")?.remove();
  const backdrop = document.createElement("div");
  backdrop.className = ["modal-backdrop", modifier ? `modal-backdrop--${modifier}` : ""].filter(Boolean).join(" ");
  backdrop.dataset.infoModal = "true";
  const modalClass = ["modal", "info-modal", modifier ? `info-modal--${modifier}` : ""].filter(Boolean).join(" ");
  backdrop.innerHTML = `<article class="${modalClass}" role="dialog" aria-modal="true" aria-labelledby="info-modal-title"><button class="modal-close" type="button" data-action="close-info-modal" aria-label="Đóng">×</button><p class="eyebrow">${escapeHtml(eyebrow)}</p><h2 id="info-modal-title">${titleHtml || escapeHtml(title)}</h2><div class="info-modal__content">${content}</div></article>`;
  document.body.append(backdrop);
}

function privacyPolicyContent() {
  return `<p>Chúng tôi cam kết bảo vệ quyền riêng tư của bạn khi sử dụng website ẨN Store.</p><ol class="policy-list"><li><strong>Thông tin thu thập:</strong> họ tên, email, số điện thoại, địa chỉ giao hàng và dữ liệu liên hệ khi bạn đăng ký tài khoản, nhận bản tin hoặc gửi biểu mẫu.</li><li><strong>Sử dụng thông tin:</strong> phục vụ đặt hàng, giao nhận, chăm sóc khách hàng và cải thiện trải nghiệm website.</li><li><strong>Bảo mật:</strong> áp dụng biện pháp kỹ thuật và tổ chức hợp lý để hạn chế truy cập trái phép, mất mát hoặc tiết lộ dữ liệu.</li><li><strong>Cookies:</strong> được dùng để ghi nhớ trạng thái sử dụng và tối ưu trải nghiệm.</li><li><strong>Quyền người dùng:</strong> bạn có thể yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân được lưu trữ.</li><li><strong>Liên hệ:</strong> matan@anstore.vn.</li></ol>`;
}


function shippingPolicyContent() {
  return `<ol class="policy-list policy-list--long"><li><strong>Đối tượng áp dụng chính sách:</strong> áp dụng cho tất cả khách hàng mua sản phẩm qua website thương mại điện tử anstore.vn.</li><li><strong>Phạm vi vận chuyển:</strong> ANstore thực hiện yêu cầu vận chuyển trên phạm vi toàn quốc.</li><li><strong>Hình thức vận chuyển:</strong> ANstore giao hàng tận nơi và hợp tác với các công ty vận chuyển uy tín để đưa hàng hóa đến tay khách hàng.</li><li><strong>Thời gian giao hàng:</strong> được tính từ lúc đơn hàng đặt thành công. Nếu đơn hàng thành công ngoài giờ làm việc, thời gian được tính từ giờ làm việc đầu tiên của ngày làm việc tiếp theo.</li><li><strong>Quy trình xử lý đơn hàng:</strong> sau khi đặt hàng thành công, ANstore gửi xác nhận đơn hàng qua email.</li><li><strong>Thời gian và phí vận chuyển:</strong> Hồ Chí Minh miễn phí vận chuyển, giao trong 1-3 ngày làm việc. Liên tỉnh phí vận chuyển 30.000 VNĐ, giao trong 3-4 ngày làm việc. Đơn hàng trên 500.000 VNĐ được miễn phí vận chuyển. Giao hàng cấp tốc chỉ áp dụng TP. HCM với cước phí 50.000 VNĐ.</li><li><strong>Lưu ý vận chuyển:</strong> thời gian nhận hàng có thể kéo dài hơn dự kiến do lũ lụt, hỏa hoạn, tai nạn, thời tiết, giao thông hoặc điều kiện khách quan ngoài kiểm soát. Trong các trường hợp này, ANstore sẽ nỗ lực khắc phục và ưu tiên quyền lợi khách hàng.</li><li><strong>Nhận hàng - kiểm hàng:</strong> quý khách cần đối soát sản phẩm còn nguyên đai, nguyên kiện, còn niêm phong, chưa có dấu hiệu bóc mở và đầy đủ chứng từ của anstore.vn. Nếu phát hiện bất thường, liên hệ Hot Line 090-XXX-XXXX hoặc email matan@anstore.vn để được hướng dẫn.</li></ol>`;
}

function returnPolicyContent() {
  return `<ol class="policy-list policy-list--long"><li><strong>Chính sách bảo hành:</strong> sản phẩm còn thời gian bảo hành theo phiếu bảo hành hoặc hóa đơn mua hàng của ANstore và được xác định là lỗi nhà sản xuất. Việc xác định lỗi được thực hiện bởi website anstore.vn.</li><li><strong>Gửi sản phẩm bảo hành:</strong> khách hàng có thể đem hoặc gửi sản phẩm đến kho hàng ANstore theo địa chỉ trên phiếu bảo hành hoặc hóa đơn. Chi phí vận chuyển do khách hàng chi trả.</li><li><strong>Kiểm tra bảo hành:</strong> ANstore kiểm tra tổng quan sản phẩm. Nếu lỗi do khách hàng như bể, nước vào sản phẩm hoặc không phải lỗi kỹ thuật từ nhà sản xuất, ANstore sẽ tư vấn và có quyền từ chối tiếp nhận bảo hành. Nếu khách vẫn cần hỗ trợ sửa chữa, ANstore tư vấn theo quy trình sửa chữa tính phí.</li><li><strong>Thời gian bảo hành:</strong> khu vực HN/HCM: 7 ngày làm việc kể cả thời gian vận chuyển. Khu vực tỉnh: 17 ngày làm việc kể cả thời gian vận chuyển.</li><li><strong>Điều kiện đổi/trả:</strong> sản phẩm lỗi kỹ thuật do nhà sản xuất hoặc thiếu chi tiết nhưng bên ngoài không trầy xước, bể, vỡ, móp méo; hoặc khách nhận không đúng sản phẩm đã đặt và bao bì còn nguyên vẹn.</li><li><strong>Thời hạn đổi/trả:</strong> trong vòng 03 ngày kể từ ngày khách hàng nhận hàng, căn cứ thời gian ký nhận trên vận đơn. Sản phẩm đổi trả phải còn hóa đơn bán hàng do ANstore gửi kèm.</li><li><strong>Chính sách đổi hàng:</strong> khách hàng đem sản phẩm đến đổi trực tiếp tại kho hàng ANstore và chỉ được đổi đúng mã sản phẩm đã mua.</li><li><strong>Hoàn tiền:</strong> với đơn COD/Thẻ, ANstore hoàn tiền bằng chuyển khoản trong vòng 7 ngày làm việc kể từ ngày nhận được hàng hóa khách gửi lại.</li><li><strong>Cách gửi trả hàng:</strong> bước 1, khách hàng chụp hình hoặc quay clip sản phẩm lỗi/hư hỏng và gửi yêu cầu qua kênh liên hệ. Bước 2, khách nội thành HN/HCM mang hàng trực tiếp đến kho ANstore; khách ngoại thành HN/HCM gửi trả hàng về địa chỉ kho ANstore.</li><li><strong>Thông tin liên hệ:</strong> địa chỉ Lệ Chi Viên, Đại Việt thời Lê. Hotline 090-XXX-XXXX từ thứ Hai đến thứ Bảy (08:00 - 17:00), Chủ nhật (08:00 - 12:00). Email matan@anstore.vn.</li></ol>`;
}
function threeDModelContent({ title, source, poster = "", note = "" }) {
  const safeTitle = escapeHtml(title || "Mô hình 3D");
  const safeSource = escapeHtml(source || "");
  const safePoster = poster ? ` poster="${escapeHtml(poster)}"` : "";
  return `
    <div class="model-viewer-shell">
      <model-viewer src="${safeSource}"${safePoster} camera-controls auto-rotate ar shadow-intensity="0.85" exposure="1" alt="${safeTitle}">
        <div class="model-viewer-fallback" slot="poster">
          <p>Đang mở mô hình 3D...</p>
        </div>
      </model-viewer>
      <p class="muted">${escapeHtml(note || "Kéo để xoay mô hình, cuộn để phóng to/thu nhỏ. Nếu mô hình chưa hiện, hãy kiểm tra kết nối Internet để tải trình xem 3D.")}</p>
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
      showSharedFieldError(control, "Email không đúng định dạng. Vui lòng nhập lại.");
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
      showSharedFieldError(form.elements.email, "Email không đúng định dạng. Vui lòng nhập lại.");
      message.textContent = "Email không đúng định dạng. Vui lòng nhập lại.";
      message.classList.remove("form-message--success");
      return;
    }
    clearSharedFieldError(form.elements.email);
    button.disabled = true;
    button.textContent = "Đang ghi nhận...";
    const resultMessage = "Đã ghi nhận email nhận mật thư. Bản demo chưa tích hợp API gửi email tự động, nên hệ thống chỉ hiển thị thông báo xác nhận.";
    window.setTimeout(() => {
      form.reset();
      message.textContent = resultMessage;
      message.classList.add("form-message--success");
      showToast(resultMessage);
      button.disabled = false;
      button.textContent = "Đăng ký";
    }, 250);
  });
}

const CHATBOT_STORAGE_KEY = "anstore.chatbot.state.v3";
const CHATBOT_GREETING = "Chào bạn, mình là Thư Đồng. Bạn có thể hỏi mình về sản phẩm, giỏ hàng, đơn hàng hoặc cách mua tại ẨN Store.";

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
  const withBold = escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>");
  const normalized = withBold
    .replace(/\s+(\d+\.\s+)/g, "\n$1")
    .replace(/\s+(\*\s+)/g, "\n$1")
    .replace(/\s+(Tất nhiên là được rồi)/g, "\n\n$1")
    .replace(/\s+(Để mua hàng,?)/g, "\n\n$1")
    .replace(/\s+(Với các đơn hàng)/g, "\n\n$1")
    .replace(/\s+(Ngoài ra,)/g, "\n\n$1")
    .replace(/\s+(Đặc biệt,)/g, "\n\n$1")
    .replace(/\s+(Lưu ý:)/g, "\n\n$1")
    .replace(/\s+(Bạn có thể)/g, "\n\n$1")
    .replace(/\s+(Bạn đang quan tâm)/g, "\n\n$1")
    .replace(/\s+(Nếu cần hỗ trợ)/g, "\n\n$1");

  const emphasizeKeywords = (line) => line.replace(/(^|[\s.,:;!?()])((?:Sản phẩm)|(?:Giỏ hàng)|(?:Thanh toán)|(?:Đơn hàng)|(?:Tài khoản))(?=($|[\s.,:;!?()]))/g, (match, prefix, keyword) => {
    const before = line.slice(0, Math.max(0, line.indexOf(match)));
    return before.endsWith("<strong>") ? match : `${prefix}<strong>${keyword}</strong>`;
  });

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
      html.push(`<li>${emphasizeKeywords(numbered ? numbered[2] : bullet[1])}</li>`);
      return;
    }
    if (listOpen) {
      html.push("</ol>");
      listOpen = false;
    }
    html.push(`<p>${emphasizeKeywords(line)}</p>`);
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
    if (!result.ok) throw new Error(payload.message || "Mình chưa có phản hồi phù hợp lúc này.");
    const fresh = readChatbotState();
    writeChatbotState({
      ...fresh,
      open: true,
      interactionId: payload.interactionId || fresh.interactionId,
      messages: [...fresh.messages, { role: "bot", text: payload.message || "Mình chưa có phản hồi phù hợp lúc này." }]
    });
  } catch (error) {
    const fresh = readChatbotState();
    writeChatbotState({
      ...fresh,
      open: true,
      messages: [...fresh.messages, { role: "bot", text: error.message || "Gemini đang quá tải. Bạn thử lại sau ít phút nhé." }]
    });
  } finally {
    renderChatbotMessages(readChatbotState());
  }
}
export function initializePage({ render, mount = () => {}, activePath = "/", standalone = false }) {
  const app = document.querySelector("#app");
  if (!app) throw new Error("Không tìm thấy vùng hiển thị #app.");

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
      openInfoModal({ title: "Chính sách bảo mật", titleHtml: `<span class="policy-title-line">Chính sách</span><span class="policy-title-line">bảo mật</span>`, eyebrow: "Cam kết bảo mật", content: privacyPolicyContent(), modifier: "policy" });
      return;
    }

    if (action === "open-shipping-policy") {
      openInfoModal({ title: "Chính sách giao nhận", titleHtml: `<span class="policy-title-line">Chính sách</span><span class="policy-title-line">giao nhận</span>`, eyebrow: "Giao nhận", content: shippingPolicyContent(), modifier: "policy" });
      return;
    }

    if (action === "open-return-policy") {
      openInfoModal({ title: "Chính sách đổi trả", titleHtml: `<span class="policy-title-line">Chính sách</span><span class="policy-title-line policy-title-line--pair">đổi trả</span>`, eyebrow: "Bảo hành và đổi trả", content: returnPolicyContent(), modifier: "policy" });
      return;
    }

    if (action === "open-character-profile") {
      const title = target.dataset.characterTitle || "Hồ sơ nhân vật";
      const story = target.dataset.characterStory || "Thông tin nhân vật đang được cập nhật.";
      const image = target.dataset.characterImage || "";
      const model = target.dataset.characterModel || "";
      openInfoModal({
        title,
        eyebrow: "Hồ sơ nhân vật",
        modifier: "character",
        content: `<div class="character-profile-modal"><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}"><div><p>${escapeHtml(story)}</p><div class="button-row character-profile-actions"><a class="button button--secondary button--small" href="${ROUTES.products}">Xem sản phẩm liên quan</a>${model ? `<button class="button button--primary button--small" type="button" data-action="open-3d-model" data-model-title="${escapeHtml(title)}" data-model-src="${escapeHtml(model)}" data-model-poster="${escapeHtml(image)}">Xem mô hình 3D</button>` : ""}</div></div></div>`
      });
      return;
    }

    if (action === "open-3d-model") {
      ensureModelViewerLoaded();
      const title = target.dataset.modelTitle || "Mô hình 3D";
      const source = target.dataset.modelSrc || "";
      const poster = target.dataset.modelPoster || "";
      openInfoModal({
        title,
        eyebrow: "Trải nghiệm 360°",
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
        showToast("Đã thêm sản phẩm vào giỏ hàng.", false, { label: "Xem giỏ hàng", href: ROUTES.cart });
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








