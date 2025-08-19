// api/ask.ts  – Vercel Serverless Function (typesız, her yerde çalışır)

const MAX_CONTEXT_CHARS = 120_000;

// Basit CORS (farklı origin’de gerekebilir)
function setCors(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: any, res: any) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfig: GEMINI_API_KEY missing' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { pdfText, question, docName } = body;

    if (!pdfText || typeof pdfText !== 'string' || !question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Invalid payload: pdfText (string) and question (string) are required' });
    }

    const safeText = pdfText.length > MAX_CONTEXT_CHARS ? pdfText.slice(0, MAX_CONTEXT_CHARS) : pdfText;

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const userPrompt = [
      `You are an expert assistant for question-answering over PDF content (ChatPDF).`,
      `Answer ONLY using the provided document context. If not found, reply exactly:`,
      `"I could not find the answer in the provided document."`,
      ``,
      `Document: ${docName || '(unnamed)'}`,
      `--- DOCUMENT CONTEXT START ---`,
      safeText,
      `--- DOCUMENT CONTEXT END ---`,
      ``,
      `User's question: ${question}`,
      `Answer in Turkish. Be concise and accurate. Cite page numbers if present in the context.`,
    ].join('\n');

    const payload = {
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
    };

    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      return res.status(502).json({ error: 'Gemini upstream error', status: upstream.status, detail });
    }

    const data = await upstream.json();

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      (Array.isArray(data?.candidates?.[0]?.content?.parts)
        ? data.candidates[0].content.parts.map((p: any) => p?.text).filter(Boolean).join('\n')
        : '') ??
      '';

    const finalText = typeof answer === 'string' && answer.trim() ? answer.trim()
      : 'I could not find the answer in the provided document.';

    return res.status(200).json({ answer: finalText });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal error', detail: String(err?.message || err) });
  }
}
