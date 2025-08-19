// api/ask.ts — Vercel Serverless Function (Node.js 20)
// Düzeltmeler:
// 1) Gemini generateContent çağrısı doğru "contents" yapısıyla gönderiliyor
// 2) Hem GEMINI_API_KEY hem VITE_GEMINI_API_KEY destekleniyor
// 3) Daha temiz CORS ve hata mesajları

import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const MODEL = "gemini-2.5-flash";

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { pdfText, question, docName } = (req.body ?? {}) as {
      pdfText?: string;
      question?: string;
      docName?: string;
    };

    if (!pdfText || !question) {
      return res
        .status(400)
        .json({ error: "pdfText and question are required" });
    }

    // Hem server hem client isimlerini kontrol et (yerelde kurtarıcı olur)
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("[ask] Missing GEMINI_API_KEY");
      return res
        .status(500)
        .json({ error: "Server configuration error - API key missing" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an intelligent assistant designed to help users understand a document.
Answer ONLY using the text from the document below. If the answer cannot be found or inferred, reply exactly:
"I could not find the answer in the provided document."
Document name: "${docName || "(unknown)"}"

DOCUMENT CONTEXT:
---
${pdfText}
---

USER'S QUESTION:
${question}

ASSISTANT'S ANSWER:
`.trim();

    // ÖNEMLİ: contents yapısı
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    // Kütüphane sürümlerine göre text getter/değer farklı olabilir, ikisini de dene
    const text =
      (typeof (response as any).text === "function"
        ? (response as any).text()
        : (response as any).text) ||
      (response as any).output_text ||
      "";

    const answer =
      (typeof text === "string" ? text : String(text)).trim() ||
      "I could not find the answer in the provided document.";

    return res.status(200).json({ answer });
  } catch (err: any) {
    console.error("[api/ask] error:", err);
    return res.status(500).json({
      error: "Upstream error",
      message: err?.message ?? "Unknown error",
      ...(process.env.NODE_ENV === "development" && { stack: err?.stack }),
    });
  }
}
