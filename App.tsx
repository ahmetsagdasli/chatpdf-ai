// App.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { parsePdf } from "./services/pdfParser";
import { generateChatResponse } from "./services/geminiService";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  LinearProgress,
  ThemeProvider,
  CssBaseline,
  GlobalStyles,
  createTheme,
} from "@mui/material";
import ChatView from "./components/ChatView";
import Footer from "./components/Footer";

export type Role = "user" | "assistant" | "system";
export type Message = {
  id: string;
  role: Role;
  content: string;
  ts: number;
};

const MAX_CONTEXT_CHARS = 120_000;

/** ---------- Tema ---------- **/
const palette = {
  green: "#00e091",
  blue: "#3b8bff",
  purple: "#b36bff",
  bg1: "#0b1220",
  bg2: "#0f1a2e",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: palette.green },
    secondary: { main: palette.purple },
    info: { main: palette.blue },
    background: { default: palette.bg1, paper: "rgba(255,255,255,0.08)" },
    text: { primary: "#e8f0ff", secondary: "#c7d2fe" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: `"Inter","Segoe UI","Roboto","Helvetica","Arial",sans-serif`,
    h6: { fontWeight: 800, letterSpacing: "-0.02em" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorTransparent: {
          background:
            "linear-gradient(90deg, rgba(0,224,145,0.18), rgba(59,139,255,0.18), rgba(179,107,255,0.18))",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 12 },
        containedPrimary: {
          color: "#0b1220",
          background:
            "linear-gradient(135deg, #00e091 0%, #3b8bff 50%, #b36bff 100%)",
        },
        outlinedPrimary: {
          borderColor: "rgba(255,255,255,0.35)",
          color: "#e8f0ff",
          background: "rgba(255,255,255,0.06)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { background: "rgba(255,255,255,0.06)", borderRadius: 10 },
      },
    },
  },
});

/** ---------- (Opsiyonel) Sadece uyarı için okuyoruz ---------- **/
function useGeminiKeyStatus() {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  return useMemo(
    () => ({ key, valid: Boolean(key && key.trim().length > 10) }),
    [key]
  );
}

export default function App() {
  useGeminiKeyStatus();

  const [docName, setDocName] = useState<string>("(no file)");
  const [pdfText, setPdfText] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState<boolean>(false);
  const [parseBusy, setParseBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const dropRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pushMessage = useCallback((m: Omit<Message, "id" | "ts">) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ts: Date.now(), ...m }]);
  }, []);

  const onFileSelected = useCallback(
    async (file: File) => {
      if (!file) return;
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Lütfen PDF dosyası seçin.");
        return;
      }
      setError("");
      setDocName(file.name);
      setParseBusy(true);
      try {
        const text = await parsePdf(file);
        const safeText = text.length > MAX_CONTEXT_CHARS ? text.slice(0, MAX_CONTEXT_CHARS) : text;
        setPdfText(safeText);
        pushMessage({
          role: "system",
          content: `PDF "${file.name}" yüklendi. Toplam metin uzunluğu: ${safeText.length.toLocaleString("tr-TR")} karakter.`,
        });
      } catch (e) {
        console.error(e);
        setError("PDF okunurken bir hata oluştu. Konsolu kontrol edin.");
      } finally {
        setParseBusy(false);
      }
    },
    [pushMessage]
  );

  const onFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) await onFileSelected(f);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [onFileSelected]
  );

  const onDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const f = e.dataTransfer.files?.[0];
      if (f) await onFileSelected(f);
      dropRef.current?.classList.remove("dragging");
    },
    [onFileSelected]
  );
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropRef.current?.classList.add("dragging");
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropRef.current?.classList.remove("dragging");
  }, []);

  const ask = useCallback(async () => {
    if (!pdfText.trim()) return setError("Önce bir PDF yükleyin.");
    if (!question.trim()) return setError("Bir soru yazın.");

    setError("");
    setBusy(true);
    pushMessage({ role: "user", content: question });

    try {
      const res = await generateChatResponse(pdfText, question, docName);
      pushMessage({ role: "assistant", content: res });
      setQuestion("");
    } catch (e) {
      console.error(e);
      setError("Cevap alınamadı. Konsolu kontrol edin.");
    } finally {
      setBusy(false);
    }
  }, [pdfText, question, docName, pushMessage]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            background:
              "radial-gradient(800px 400px at 10% 10%, rgba(0,224,145,0.22), transparent 60%)," +
              "radial-gradient(1000px 500px at 80% 20%, rgba(59,139,255,0.22), transparent 60%)," +
              "radial-gradient(700px 400px at 70% 80%, rgba(179,107,255,0.20), transparent 60%)," +
              `linear-gradient(180deg, ${palette.bg1}, ${palette.bg2} 60%, ${palette.bg1})`,
          },
          "*::-webkit-scrollbar": { width: 10, height: 10 },
          "*::-webkit-scrollbar-thumb": {
            borderRadius: 10,
            background: "linear-gradient(180deg, #3b8bff, #b36bff)",
          },
          "*::-webkit-scrollbar-track": { background: "rgba(255,255,255,0.06)" },
        }}
      />

      <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateRows: "auto 1fr auto" }}>
        <AppBar position="sticky" color="transparent" elevation={0}>
          <Toolbar variant="dense">
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ChatPDF AI
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ px: { xs: 2, md: 3 }, py: 2, width: "100%" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "360px 1fr" },
              gap: 1.5,
              alignItems: "start",
            }}
          >
            {/* SOL BLOK */}
            <Stack spacing={1.5}>
              <Paper
                ref={dropRef}
                variant="outlined"
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                sx={{
                  p: 1.5,
                  textAlign: "center",
                  borderStyle: "dashed",
                  "&.dragging": {
                    borderColor: "primary.main",
                    boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}`,
                  },
                }}
              >
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  PDF’yi sürükle-bırak veya dosya seç.
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button variant="contained" onClick={() => fileInputRef.current?.click()}>
                    Dosya Seç
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setDocName("(no file)");
                      setPdfText("");
                      setMessages([]);
                    }}
                  >
                    Temizle
                  </Button>
                </Stack>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  style={{ display: "none" }}
                  onChange={onFileInput}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                  Yüklenen: <b>{docName}</b>
                </Typography>

                {parseBusy && (
                  <Box sx={{ mt: 1.5 }}>
                    <LinearProgress />
                    <Typography variant="caption" color="text.secondary">
                      PDF okunuyor…
                    </Typography>
                  </Box>
                )}
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.25 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Çıkarılan Metin (ilk 1.000 karakter)
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    mt: 1,
                    whiteSpace: "pre-wrap",
                    maxHeight: 220,
                    overflow: "auto",
                    fontSize: 13,
                    color: "text.secondary",
                  }}
                >
                  {pdfText ? pdfText.slice(0, 1000) + (pdfText.length > 1000 ? "…" : "") : "—"}
                </Box>
              </Paper>
            </Stack>

            {/* SAĞ BLOK */}
            <Stack spacing={1.5}>
              {error && (
                <Alert severity="error" onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Sorun
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="PDF hakkında bir soru yazın…"
                />
                <Box sx={{ mt: 1.25, display: "flex", gap: 1.25 }}>
                  <Button variant="contained" onClick={ask} disabled={busy || !pdfText || !question}>
                    {busy ? <CircularProgress size={20} /> : "Sor"}
                  </Button>
                  <Button variant="outlined" onClick={() => setQuestion("")}>
                    Temizle
                  </Button>
                </Box>
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Sohbet
                </Typography>
                <ChatView messages={messages} isLoading={busy} />
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Oturum Özeti
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.25}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Belge:</strong> {docName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pdfText
                      ? `Kullanılan bağlam: ${Math.min(pdfText.length, MAX_CONTEXT_CHARS).toLocaleString(
                          "tr-TR"
                        )} karakter`
                      : "Henüz bağlam yok"}
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}
