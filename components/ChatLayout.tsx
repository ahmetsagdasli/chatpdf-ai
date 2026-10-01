// components/ChatLayout.tsx
import React from "react";
import ChatView from "./ChatView";
import type { ChatMessage } from "../types"; // konumuna göre ayarla

type Props = {
  messages: ChatMessage[];
  isLoading?: boolean;
};

export default function ChatLayout({ messages, isLoading }: Props) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* diğer sol bloklar vb. */}
      <ChatView messages={messages} isLoading={isLoading} />
    </div>
  );
}
