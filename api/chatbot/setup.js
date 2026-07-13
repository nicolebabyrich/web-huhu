function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
}

function getGeminiModel() {
  return process.env.GEMINI_CHAT_MODEL || process.env.GEMINI_MODEL_CHAT || process.env.GEMINI_MODEL || "gemini-3.5-flash";
}

module.exports = function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ message: "PhÆ°Æ¡ng thá»©c khÃ´ng Ä‘Æ°á»£c há»— trá»£." });
  }

  return response.status(200).json({
    configured: Boolean(getGeminiApiKey()),
    api: "interactions",
    mode: "text-only",
    models: {
      chat: getGeminiModel(),
      fallback: process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite"
    }
  });
};

