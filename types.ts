// types.ts  — tek tip kaynağı

export type Role = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  ts: number; // timestamp (ms)
  sources?: { label: string }[];
};

// Uygulamada PDF/doküman için temel tip.
// İhtiyaca göre alan ekleyebilirsin; en yaygın alanlar aşağıda:
export type Document = {
  id: string;            // benzersiz id (uuid)
  name: string;          // dosya adı
  size?: number;         // byte
  pages?: number;        // sayfa sayısı
  uploadedAt?: number;   // timestamp (ms)
  // metadata?: Record<string, any>; // istersen aç
};
