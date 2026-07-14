const defaultGeminiModel = "gemini-3.1-flash";

const chatbotScenarios = `Kịch bản hỗ trợ khách hàng cơ bản:
1. Tư vấn sản phẩm: hỏi nhu cầu người chơi, số người, độ tuổi, thời lượng, rồi gợi ý xem trang Sản phẩm hoặc chi tiết Mật Án Lệ Chi Viên.
2. Hướng dẫn mua hàng: xem sản phẩm -> thêm vào giỏ -> đăng nhập -> chọn địa chỉ -> áp voucher nếu có -> xác nhận thanh toán demo.
3. Giỏ hàng và tồn kho: hướng dẫn tăng/giảm số lượng, chọn sản phẩm thanh toán; không khẳng định tồn kho nếu chưa có dữ liệu hiển thị.
4. Đơn hàng: hướng dẫn khách vào mục Đơn hàng để xem trạng thái, chi tiết và yêu cầu hủy nếu còn điều kiện.
5. Giao nhận: TP. HCM dự kiến 1-3 ngày làm việc; liên tỉnh 3-4 ngày làm việc; đơn trên 500.000 VNĐ miễn phí vận chuyển; giao cấp tốc TP. HCM 50.000 VNĐ.
6. Đổi trả/bảo hành: đổi trả trong 03 ngày khi sản phẩm lỗi/nhầm hàng và còn hóa đơn; hướng dẫn liên hệ hotline 090-XXX-XXXX hoặc matan@anstore.vn.
7. Tài khoản/quên mật khẩu: hướng dẫn đăng nhập, đăng ký, hoặc dùng luồng quên mật khẩu demo; nhắc không gửi mật khẩu/OTP cho chatbot.
8. Thanh toán: giải thích đây là thanh toán giả lập trong phạm vi đồ án, không yêu cầu thông tin thẻ thật.`;

const chatbotSystemInstruction = `Bạn là Thư Đồng, trợ lý chăm sóc khách hàng của ẨN Store - website bán board game lịch sử Việt Nam.
Nguyên tắc trả lời:
- Luôn trả lời bằng tiếng Việt, thân thiện, ngắn gọn và rõ ý.
- Hỗ trợ khách hỏi về sản phẩm, giỏ hàng, thanh toán giả lập, tài khoản, đơn hàng, đổi trả và thông tin cửa hàng.
- Không bịa giá, tồn kho, trạng thái đơn hàng hoặc chính sách chưa được cung cấp.
- Khi thiếu dữ liệu cụ thể, hướng khách xem trang sản phẩm, giỏ hàng, đơn hàng, tài khoản hoặc liên hệ cửa hàng.
- Không yêu cầu khách gửi mật khẩu, mã OTP, số thẻ hoặc thông tin thanh toán nhạy cảm.
- Giữ phong cách bí ẩn, lịch sự, phù hợp thương hiệu ẨN Store nhưng không dài dòng.

${chatbotScenarios}`;

function sendJson(response, status, payload) {
  response.status(status).json(payload);
}

async function readJson(request, maxSize = 10_000) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");

  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxSize) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
}

function getGeminiModel() {
  return process.env.GEMINI_CHAT_MODEL || process.env.GEMINI_MODEL_CHAT || process.env.GEMINI_MODEL || defaultGeminiModel;
}

function getGeminiFallbackModel() {
  return process.env.GEMINI_FALLBACK_MODEL || "gemini-3.1-flash-lite";
}

function getChatModels() {
  return [...new Set([getGeminiModel(), getGeminiFallbackModel()].filter(Boolean))];
}

function extractInteractionText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text.trim();
  if (typeof payload?.outputText === "string") return payload.outputText.trim();

  const textParts = [];
  const walk = (value) => {
    if (!value || typeof value === "string") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (typeof value !== "object") return;
    if (typeof value.text === "string") textParts.push(value.text);
    if (typeof value.output_text === "string") textParts.push(value.output_text);
    Object.values(value).forEach(walk);
  };
  walk(payload?.steps);
  return textParts.join("\n").trim();
}

async function callGeminiInteraction({ model, systemInstruction, input, temperature = 0.55 }) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    const error = new Error("GEMINI_NOT_CONFIGURED");
    error.status = 503;
    throw error;
  }

  const result = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      model,
      system_instruction: systemInstruction,
      input,
      generation_config: {
        temperature,
        thinking_level: "low"
      }
    })
  });

  const payload = await result.json().catch(() => ({}));
  if (!result.ok) {
    const error = new Error(payload?.error?.message || "GEMINI_PROVIDER_ERROR");
    error.status = result.status === 429 ? 429 : 502;
    error.providerCode = payload?.error?.status || "GEMINI_ERROR";
    throw error;
  }
  return payload;
}

function geminiErrorMessage(error) {
  if (error.message === "GEMINI_NOT_CONFIGURED") {
    return "Chatbot chưa đọc được GEMINI_API_KEY trên Vercel Environment Variables.";
  }
  if (error.status === 429) return "Gemini đang quá tải hoặc hết quota. Bạn thử lại sau ít phút nhé.";
  return error.message && error.message !== "GEMINI_PROVIDER_ERROR"
    ? `Gemini chưa phản hồi được: ${error.message}`
    : "Không thể kết nối Gemini lúc này. Vui lòng thử lại sau.";
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { message: "Phương thức không được hỗ trợ." });
  }

  try {
    const body = await readJson(request);
    const message = String(body.message || "").trim();
    if (!message) return sendJson(response, 400, { message: "Vui lòng nhập nội dung cần hỏi." });
    if (message.length > 700) return sendJson(response, 413, { message: "Câu hỏi quá dài. Vui lòng rút gọn lại." });

    const pageHint = [body.page, body.path].filter(Boolean).join(" - ");
    const input = pageHint ? `Khách đang ở: ${pageHint}\nCâu hỏi: ${message}` : message;
    let lastError = null;
    for (const model of getChatModels()) {
      try {
        const payload = await callGeminiInteraction({ model, systemInstruction: chatbotSystemInstruction, input });
        const reply = extractInteractionText(payload);
        return sendJson(response, 200, {
          message: reply || "Mình chưa có phản hồi phù hợp lúc này. Bạn thử hỏi ngắn hơn nhé.",
          interactionId: payload.id || "",
          model
        });
      } catch (error) {
        lastError = error;
        const retryable = error.status === 429 || error.status === 502 || /high demand|overloaded|unavailable|quota/i.test(error.message || "");
        if (!retryable) throw error;
      }
    }
    throw lastError || new Error("GEMINI_PROVIDER_ERROR");
  } catch (error) {
    const status = error.message === "PAYLOAD_TOO_LARGE" ? 413 : (error.status || 502);
    const message = status === 413 ? "Dữ liệu gửi lên quá lớn." : geminiErrorMessage(error);
    return sendJson(response, status, { message, code: error.providerCode || error.message || "CHATBOT_ERROR" });
  }
};