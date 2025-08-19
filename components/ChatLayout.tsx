// components/ChatLayout.tsx
import React from "react";
import ChatView from "./ChatView";
import type { Document } from "../types";
import { Box } from "@mui/material";

interface ChatLayoutProps {
  document: Document;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ document }) => {
  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatView document={document} key={document.id} />
      </Box>
    </Box>
  );
};

export default ChatLayout;
