// components/ChatView.tsx
import React from "react";
import type { ChatMessage } from "../types"; // konumuna göre ayarla: "@/types" da olabilir

type Props = {
  messages: ChatMessage[];
  isLoading?: boolean;
};

export default function ChatView({ messages, isLoading }: Props) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {messages.map((m) => (
        <div key={m.id} style={{ opacity: 1 }}>
          <strong style={{ textTransform: "capitalize" }}>{m.role}</strong>: {m.content}
        </div>
      ))}
      {isLoading && <div>Yazıyor…</div>}
    </div>
  );
}
