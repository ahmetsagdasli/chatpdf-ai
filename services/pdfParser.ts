// services/pdfParser.ts
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from 'pdfjs-dist';

// Vite/ESM uyumlu: worker'ı paketten URL olarak al
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc = pdfWorker;

export async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({
    data: arrayBuffer,
    isEvalSupported: true,
    useWorkerFetch: false,
    disableFontFace: true,
  });

  let pdf: PDFDocumentProxy | null = null;
  try {
    pdf = await loadingTask.promise;
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const text = content.items
        .map((it: any) => (typeof it?.str === 'string' ? it.str : ''))
        .filter(Boolean)
        .join(' ');
      fullText += text + '\n\n';
    }
    return fullText.replace(/[ \t]+/g, ' ').trim();
  } catch (err) {
    console.error('[pdf] parse error:', err);
    throw new Error('PDF parse edilemedi (worker veya dosya problemi).');
  } finally {
    try { await loadingTask?.destroy?.(); } catch {}
    try { await pdf?.destroy?.(); } catch {}
  }
}
