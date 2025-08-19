// services/pdfParser.ts
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist";

// Vercel'de çalışacak şekilde worker'ı CDN'den yükle
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

export async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });

  let pdf: PDFDocumentProxy | null = null;
  try {
    pdf = await loadingTask.promise;

    let fullText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const text = content.items
        .map((it: any) => (typeof it?.str === "string" ? it.str : ""))
        .filter(Boolean)
        .join(" ");
      fullText += text + "\n\n";
    }
    return fullText.replace(/[ \t]+/g, " ").trim();
  } finally {
    try {
      await loadingTask?.destroy?.();
    } catch {}
    try {
      await pdf?.destroy?.();
    } catch {}
  }
}