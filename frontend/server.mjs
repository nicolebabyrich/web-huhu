import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const frontendDir = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(frontendDir, "..");
function loadEnvFile(filePath, override = false) {
  if (!existsSync(filePath)) return;
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && (override || process.env[key] === undefined)) process.env[key] = value;
  }
}

loadEnvFile(join(rootDir, ".env"), true);
loadEnvFile(join(frontendDir, ".env"), false);

const port = Number(process.env.PORT || 4173);
const newsletterSubscribers = new Set();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".glb": "model/gltf-binary",
  ".mp4": "video/mp4",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf"
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function readJson(request, maxSize = 10_000) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxSize) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

async function sendWelcomeEmail(email) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM_EMAIL;
  if (!apiKey || !from) return { configured: false };

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Mật thư đầu tiên từ ẨN Store",
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#2a0f12"><h1>Hồ sơ đã được mở</h1><p>Bạn đã đăng ký nhận mật thư từ ẨN Store.</p><p>Những vụ án lịch sử, board game mới và ưu đãi dành cho điều tra viên sẽ được gửi đến địa chỉ này.</p></div>`
    })
  });
  if (!result.ok) throw new Error("EMAIL_PROVIDER_ERROR");
  return { configured: true };
}

async function handleNewsletter(request, response) {
  try {
    const body = await readJson(request);
    const email = String(body.email || "").trim().toLowerCase();
    const valid = /^[^\s@]+@[^\s@]+\.[a-z0-9-]{2,}$/i.test(email);
    if (!valid) return sendJson(response, 400, { message: "Email không đúng định dạng." });
    if (newsletterSubscribers.has(email)) return sendJson(response, 409, { message: "Email này đã đăng ký nhận mật thư." });

    const delivery = await sendWelcomeEmail(email);
    if (!delivery.configured) {
      return sendJson(response, 503, {
        message: "Hệ thống email chưa được cấu hình. Vui lòng liên hệ ẨN Store hoặc thử lại sau.",
        code: "EMAIL_NOT_CONFIGURED"
      });
    }
    newsletterSubscribers.add(email);
    return sendJson(response, 201, { message: "Mật thư xác nhận đã được gửi. Vui lòng kiểm tra hộp thư đến hoặc thư rác." });
  } catch (error) {
    const message = error.message === "PAYLOAD_TOO_LARGE"
      ? "Dữ liệu gửi lên quá lớn."
      : "Không thể gửi mật thư lúc này. Vui lòng thử lại sau.";
    return sendJson(response, error.message === "PAYLOAD_TOO_LARGE" ? 413 : 502, { message });
  }
}

const defaultGeminiModel = "gemini-3.1-flash-lite";

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
    if (!value) return;
    if (typeof value === "string") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (typeof value !== "object") return;
    if (typeof value.text === "string") textParts.push(value.text);
    if (typeof value.output_text === "string") textParts.push(value.output_text);
    for (const child of Object.values(value)) walk(child);
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
    error.providerMessage = payload?.error?.message || "";
    throw error;
  }
  return payload;
}

function geminiErrorMessage(error) {
  if (error.message === "GEMINI_NOT_CONFIGURED") {
    return "Chatbot chưa đọc được Gemini API key trong file deploy/.env.";
  }
  if (error.status === 429) return "Gemini đang quá tải hoặc hết quota. Bạn thử lại sau ít phút nhé.";
  return error.message && error.message !== "GEMINI_PROVIDER_ERROR"
    ? `Gemini chưa phản hồi được: ${error.message}`
    : "Không thể kết nối Gemini lúc này. Vui lòng thử lại sau.";
}

function handleChatbotSetup(response) {
  return sendJson(response, 200, {
    configured: Boolean(getGeminiApiKey()),
    api: "interactions",
    mode: "text-only",
    models: {
      chat: getGeminiModel(),
      fallback: getGeminiFallbackModel()
    }
  });
}

async function handleChatbot(request, response) {
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
        const payload = await callGeminiInteraction({
          model,
          systemInstruction: chatbotSystemInstruction,
          input
        });
        const reply = extractInteractionText(payload);
        return sendJson(response, 200, {
          message: reply || "Mình chưa có phản hồi phù hợp lúc này. Bạn thử hỏi ngắn hơn nhé.",
          interactionId: "",
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
}
createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", "http://localhost");
  const pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === "/api/newsletter/subscribe") {
    if (request.method !== "POST") return sendJson(response, 405, { message: "Phương thức không được hỗ trợ." });
    return handleNewsletter(request, response);
  }

  if (pathname === "/api/chatbot/setup") {
    if (request.method !== "GET") return sendJson(response, 405, { message: "Phương thức không được hỗ trợ." });
    return handleChatbotSetup(response);
  }

  if (pathname === "/api/chatbot") {
    if (request.method !== "POST") return sendJson(response, 405, { message: "Phương thức không được hỗ trợ." });
    return handleChatbot(request, response);
  }

  let relativePath = pathname === "/" || pathname === "/frontend/" || pathname === "/frontend"
    ? "index.html"
    : pathname.replace(/^\/+/, "");
  const safePath = normalize(relativePath);

  // 1. Try finding relative to frontendDir
  let filePath = join(frontendDir, safePath);

  // If path starts with "frontend/", strip it and try finding in frontendDir
  if (!existsSync(filePath)) {
    const cleanPrefix = safePath.replace(/^frontend[\\\/]/, "");
    const testPath = join(frontendDir, cleanPrefix);
    if (existsSync(testPath)) {
      filePath = testPath;
    }
  }

  // 2. If not found, try finding relative to rootDir
  if (!existsSync(filePath)) {
    filePath = join(rootDir, safePath);
  }

  const isSafe = filePath.startsWith(frontendDir) || filePath.startsWith(rootDir);
  if (!isSafe || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Không tìm thấy tài nguyên.");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache"
  });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log("ẨN Store đang chạy tại http://localhost:" + port + "/frontend/");
});




