import { Footer, Navbar } from "../components/index.js";

function ChatbotWidget() {
  return `
    <section class="chatbot-widget" data-chatbot-widget aria-label="Trợ lý ẨN Store">
      <button class="chatbot-toggle" type="button" data-action="toggle-chatbot" aria-expanded="false" aria-controls="chatbot-panel">
        <span aria-hidden="true">?</span>
        <span class="visually-hidden">Mở Thư Đồng</span>
      </button>
      <div class="chatbot-panel" id="chatbot-panel" hidden>
        <div class="chatbot-panel__header">
          <div>
            <p class="eyebrow">Trợ lý cửa hàng</p>
            <h2>THƯ ĐỒNG</h2>
          </div>
          <button class="chatbot-panel__close" type="button" data-action="toggle-chatbot" aria-label="Đóng trợ lý">×</button>
        </div>
        <div class="chatbot-messages" data-chatbot-messages aria-live="polite"></div>
        <form class="chatbot-form" id="chatbot-form" data-chatbot-form>
          <label class="visually-hidden" for="chatbot-message">Nhập câu hỏi</label>
          <textarea id="chatbot-message" name="message" rows="1" maxlength="700" placeholder="Hỏi về sản phẩm, đơn hàng..." required></textarea>
          <button class="button button--primary button--small" type="submit">Gửi</button>
        </form>
        <p class="chatbot-note">Bot có thể quá tải khi Gemini hết quota. Không nhập thông tin thanh toán nhạy cảm.</p>
      </div>
    </section>
  `;
}

export function MainLayout(content, activePath = "/") {
  return `
    ${Navbar(activePath)}
    <main id="main-content">${content}</main>
    ${Footer()}
    ${ChatbotWidget()}
  `;
}

