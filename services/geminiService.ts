// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

if (!apiKey || apiKey.trim().length === 0) {
  // Vite ile çalışırken yalnızca uyarı veriyoruz; UI tarafı ayrıca kontrol ediyor.
  console.warn(
    "[Gemini] VITE_GEMINI_API_KEY eksik. .env dosyasına ekleyin ve `npm run dev` ile çalıştırın."
  );
}

// Client
const ai = new GoogleGenAI({ apiKey: apiKey ?? "" });

/**
 * Belgeden Soru-Cevap üretir.
 * Not: Cevabı sadece verilen bağlamdan üretir; bulunamazsa sabit mesaj döner.
 */
export async function generateChatResponse(
  context: string,
  question: string,
  documentName: string
): Promise<string> {
  // Hız/kalite dengesi için flash modeli; istersen 2.0-pro da kullanabilirsin.
  const model = "gemini-2.5-flash";

  const prompt = `
You are an intelligent assistant designed to help users understand a document.
Answer ONLY using the text from the document below. If the answer cannot be found or inferred, reply exactly:
"I could not find the answer in the provided document."
Document name: "${documentName}"

DOCUMENT CONTEXT:
---
${context}
---

USER'S QUESTION:
${question}

ASSISTANT'S ANSWER:
`.trim();

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text ?? "";
    return text.trim().length > 0
      ? text
      : "I could not find the answer in the provided document.";
  } catch (err) {
    console.error("[Gemini] generateChatResponse error:", err);
    return "Sorry, I encountered an error while processing your request.";
  }
}
