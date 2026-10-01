// components/ChatInput.tsx
import React, { useState } from "react";
import { Box, TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = text.trim();
    if (!value || isLoading) return;
    onSendMessage(value);
    setText("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Ask a question about the document..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
        autoComplete="off"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Send">
                <span>
                  <IconButton
                    color="primary"
                    type="submit"
                    aria-label="send"
                    disabled={isLoading || text.trim().length === 0}
                    onClick={() => handleSubmit()}
                  >
                    <SendIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ChatInput;
