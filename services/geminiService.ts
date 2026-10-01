// services/geminiService.ts
// Frontend yalnızca kendi backend'ine istek atar. API anahtarı tarayıcıya sızmaz.

export async function generateChatResponse(
  context: string,
  question: string,
  documentName: string
): Promise<string> {
  try {
    const resp = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pdfText: context,
        question,
        docName: documentName,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      throw new Error(`Backend error (${resp.status}): ${detail}`);
    }

    const data = await resp.json();
    const txt =
      (data?.answer ?? "").toString().trim() ||
      "I could not find the answer in the provided document.";
    return txt;
  } catch (err) {
    console.error("[Gemini] generateChatResponse error:", err);
    return "Sorry, I encountered an error while processing your request.";
  }
}
