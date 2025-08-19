import React, { useEffect, useRef } from "react";
import { Box, Stack } from "@mui/material";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

type Role = "user" | "assistant" | "system";
export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  ts?: number;
  // kaynak rozetleri istersen:
  sources?: { label: string; onClick?: () => void }[];
};

export default function ChatView({
  messages,
  isLoading,
}: {
  messages: ChatMessage[];
  isLoading?: boolean;
}) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <Box sx={{ maxHeight: 420, overflow: "auto" }}>
      <Stack spacing={1.25}>
        {messages.map((m) => (
          <Message
            key={m.id}
            role={m.role}
            content={m.content}
            timestamp={m.ts}
            sources={m.sources}
          />
        ))}
        {isLoading && (
          <Box sx={{ pl: 1 }}>
            <TypingIndicator />
          </Box>
        )}
        <div ref={endRef} />
      </Stack>
    </Box>
  );
}
