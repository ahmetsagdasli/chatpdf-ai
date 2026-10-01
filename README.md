# ChatPDF AI

Upload a PDF and ask questions about it in a chat interface. The app extracts the
document's text in the browser, retrieves the passages most relevant to your
question, and sends only that context to Google Gemini to generate an answer
grounded in the document.

## How it works

1. **Upload** - `services/pdfParser.ts` reads the PDF client-side with `pdfjs-dist`
   and extracts its full text.
2. **Chunk + retrieve** - `services/retrievalService.ts` splits the document into
   overlapping ~512-word chunks and scores each chunk against the user's question
   using whole-word term-frequency matching with a keyword-coverage bonus. The
   top-scoring chunks are concatenated into a compact context (not the whole
   document, which keeps prompts small and the answer grounded).
3. **Ask** - `services/geminiService.ts` POSTs `{ pdfText, question, docName }` to
   the app's own backend at `/api/ask`. The API key never reaches the browser.
4. **Answer** - `api/ask.ts`, a Vercel serverless function, calls the Gemini API
   (`gemini-2.5-flash`) with a prompt that constrains the model to answer only
   from the supplied document text, and returns the answer as JSON.

```
PDF file -> pdfParser.ts -> retrievalService.ts -> geminiService.ts -> /api/ask -> Gemini
                                                                    (server-side key)
```

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, MUI (`@mui/material`), Tailwind CSS
- **PDF parsing:** `pdfjs-dist`
- **Backend:** Vercel serverless function (`api/ask.ts`) calling `@google/genai`
- **Tests:** Vitest

## Project structure

```
components/        UI components (chat view, sidebar, message bubbles, icons, ...)
services/
  pdfParser.ts        Extracts text from an uploaded PDF
  retrievalService.ts  Chunks text and ranks chunks by relevance to a query
  geminiService.ts    Calls the backend /api/ask endpoint
api/
  ask.ts              Serverless function that calls the Gemini API
types.ts            Shared TypeScript types (ChatMessage, Document, Role)
```

## Running locally

**Prerequisites:** Node.js 20.x, a [Gemini API key](https://aistudio.google.com/app/apikey)

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set your real key:
   ```
   cp .env.example .env.local
   ```
   `GEMINI_API_KEY` is read by the serverless function in `api/ask.ts` and is
   never exposed to the browser. **Never commit `.env`, `.env.local`, or any
   file with a real key** - `.gitignore` already excludes them.
3. Run the frontend:
   ```
   npm run dev
   ```
4. The `/api/ask` route is a Vercel serverless function, so to exercise the full
   chat flow locally you also need the Vercel dev server running (it serves
   `api/` on `localhost:3000`, which `vite.config.ts` proxies to):
   ```
   npx vercel dev
   ```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server (port 4000) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run type-check` | Run the TypeScript compiler with no emit |
| `npm test` | Run the test suite once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Security note

API keys belong only in `api/ask.ts` (server-side, via `process.env`), read from
an untracked `.env.local`. Do not reintroduce a client-side config file with a
hardcoded key - the frontend talks to `/api/ask`, which is the only place that
needs the key.
