const defaultGeminiModel = "gemini-3.1-flash";

const chatbotScenarios = `Ká»‹ch báº£n há»— trá»£ khÃ¡ch hÃ ng cÆ¡ báº£n:
1. TÆ° váº¥n sáº£n pháº©m: há»i nhu cáº§u ngÆ°á»i chÆ¡i, sá»‘ ngÆ°á»i, Ä‘á»™ tuá»•i, thá»i lÆ°á»£ng, rá»“i gá»£i Ã½ xem trang Sáº£n pháº©m hoáº·c chi tiáº¿t Máº­t Ãn Lá»‡ Chi ViÃªn.
2. HÆ°á»›ng dáº«n mua hÃ ng: xem sáº£n pháº©m -> thÃªm vÃ o giá» -> Ä‘Äƒng nháº­p -> chá»n Ä‘á»‹a chá»‰ -> Ã¡p voucher náº¿u cÃ³ -> xÃ¡c nháº­n thanh toÃ¡n demo.
3. Giá» hÃ ng vÃ  tá»“n kho: hÆ°á»›ng dáº«n tÄƒng/giáº£m sá»‘ lÆ°á»£ng, chá»n sáº£n pháº©m thanh toÃ¡n; khÃ´ng kháº³ng Ä‘á»‹nh tá»“n kho náº¿u chÆ°a cÃ³ dá»¯ liá»‡u hiá»ƒn thá»‹.
4. ÄÆ¡n hÃ ng: hÆ°á»›ng dáº«n khÃ¡ch vÃ o má»¥c ÄÆ¡n hÃ ng Ä‘á»ƒ xem tráº¡ng thÃ¡i, chi tiáº¿t vÃ  yÃªu cáº§u há»§y náº¿u cÃ²n Ä‘iá»u kiá»‡n.
5. Giao nháº­n: TP. HCM dá»± kiáº¿n 1-3 ngÃ y lÃ m viá»‡c; liÃªn tá»‰nh 3-4 ngÃ y lÃ m viá»‡c; Ä‘Æ¡n trÃªn 500.000 VNÄ miá»…n phÃ­ váº­n chuyá»ƒn; giao cáº¥p tá»‘c TP. HCM 50.000 VNÄ.
6. Äá»•i tráº£/báº£o hÃ nh: Ä‘á»•i tráº£ trong 03 ngÃ y khi sáº£n pháº©m lá»—i/nháº§m hÃ ng vÃ  cÃ²n hÃ³a Ä‘Æ¡n; hÆ°á»›ng dáº«n liÃªn há»‡ hotline 090-XXX-XXXX hoáº·c matan@anstore.vn.
7. TÃ i khoáº£n/quÃªn máº­t kháº©u: hÆ°á»›ng dáº«n Ä‘Äƒng nháº­p, Ä‘Äƒng kÃ½, hoáº·c dÃ¹ng luá»“ng quÃªn máº­t kháº©u demo; nháº¯c khÃ´ng gá»­i máº­t kháº©u/OTP cho chatbot.
8. Thanh toÃ¡n: giáº£i thÃ­ch Ä‘Ã¢y lÃ  thanh toÃ¡n giáº£ láº­p trong pháº¡m vi Ä‘á»“ Ã¡n, khÃ´ng yÃªu cáº§u thÃ´ng tin tháº» tháº­t.`;

const chatbotSystemInstruction = `Báº¡n lÃ  ThÆ° Äá»“ng, trá»£ lÃ½ chÄƒm sÃ³c khÃ¡ch hÃ ng cá»§a áº¨N Store - website bÃ¡n board game lá»‹ch sá»­ Viá»‡t Nam.
NguyÃªn táº¯c tráº£ lá»i:
- LuÃ´n tráº£ lá»i báº±ng tiáº¿ng Viá»‡t, thÃ¢n thiá»‡n, ngáº¯n gá»n vÃ  rÃµ Ã½.
- Há»— trá»£ khÃ¡ch há»i vá» sáº£n pháº©m, giá» hÃ ng, thanh toÃ¡n giáº£ láº­p, tÃ i khoáº£n, Ä‘Æ¡n hÃ ng, Ä‘á»•i tráº£ vÃ  thÃ´ng tin cá»­a hÃ ng.
- KhÃ´ng bá»‹a giÃ¡, tá»“n kho, tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng hoáº·c chÃ­nh sÃ¡ch chÆ°a Ä‘Æ°á»£c cung cáº¥p.
- Khi thiáº¿u dá»¯ liá»‡u cá»¥ thá»ƒ, hÆ°á»›ng khÃ¡ch xem trang sáº£n pháº©m, giá» hÃ ng, Ä‘Æ¡n hÃ ng, tÃ i khoáº£n hoáº·c liÃªn há»‡ cá»­a hÃ ng.
- KhÃ´ng yÃªu cáº§u khÃ¡ch gá»­i máº­t kháº©u, mÃ£ OTP, sá»‘ tháº» hoáº·c thÃ´ng tin thanh toÃ¡n nháº¡y cáº£m.
- Giá»¯ phong cÃ¡ch bÃ­ áº©n, lá»‹ch sá»±, phÃ¹ há»£p thÆ°Æ¡ng hiá»‡u áº¨N Store nhÆ°ng khÃ´ng dÃ i dÃ²ng.

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
    return "Chatbot chÆ°a Ä‘á»c Ä‘Æ°á»£c GEMINI_API_KEY trÃªn Vercel Environment Variables.";
  }
  if (error.status === 429) return "Gemini Ä‘ang quÃ¡ táº£i hoáº·c háº¿t quota. Báº¡n thá»­ láº¡i sau Ã­t phÃºt nhÃ©.";
  return error.message && error.message !== "GEMINI_PROVIDER_ERROR"
    ? `Gemini chÆ°a pháº£n há»“i Ä‘Æ°á»£c: ${error.message}`
    : "KhÃ´ng thá»ƒ káº¿t ná»‘i Gemini lÃºc nÃ y. Vui lÃ²ng thá»­ láº¡i sau.";
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { message: "PhÆ°Æ¡ng thá»©c khÃ´ng Ä‘Æ°á»£c há»— trá»£." });
  }

  try {
    const body = await readJson(request);
    const message = String(body.message || "").trim();
    if (!message) return sendJson(response, 400, { message: "Vui lÃ²ng nháº­p ná»™i dung cáº§n há»i." });
    if (message.length > 700) return sendJson(response, 413, { message: "CÃ¢u há»i quÃ¡ dÃ i. Vui lÃ²ng rÃºt gá»n láº¡i." });

    const pageHint = [body.page, body.path].filter(Boolean).join(" - ");
    const input = pageHint ? `KhÃ¡ch Ä‘ang á»Ÿ: ${pageHint}\nCÃ¢u há»i: ${message}` : message;
    let lastError = null;
    for (const model of getChatModels()) {
      try {
        const payload = await callGeminiInteraction({ model, systemInstruction: chatbotSystemInstruction, input });
        const reply = extractInteractionText(payload);
        return sendJson(response, 200, {
          message: reply || "MÃ¬nh chÆ°a cÃ³ pháº£n há»“i phÃ¹ há»£p lÃºc nÃ y. Báº¡n thá»­ há»i ngáº¯n hÆ¡n nhÃ©.",
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
    const message = status === 413 ? "Dá»¯ liá»‡u gá»­i lÃªn quÃ¡ lá»›n." : geminiErrorMessage(error);
    return sendJson(response, status, { message, code: error.providerCode || error.message || "CHATBOT_ERROR" });
  }
};


