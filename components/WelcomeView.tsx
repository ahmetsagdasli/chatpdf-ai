// components/WelcomeView.tsx
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { LogoIcon } from "./icons/LogoIcon";

const WelcomeView: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      textAlign="center"
      p={4}
      sx={{ backgroundColor: "#111827" }}
    >
      {/* Logo Container */}
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 96,
          height: 96,
          borderRadius: 4,
          mb: 4,
          background: "linear-gradient(to bottom right, #1e293b, #0f172a)",
          border: "1px solid #334155",
          boxShadow: "0 10px 40px rgba(79, 70, 229, 0.25)",
        }}
      >
        <LogoIcon width={48} height={48} style={{ color: "#3b82f6" }} />
      </Paper>

      {/* Başlık */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          background: "linear-gradient(to right, #e2e8f0, #94a3b8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Welcome to ChatPDF AI
      </Typography>

      {/* Açıklama */}
      <Typography
        variant="body1"
        sx={{ mt: 2, maxWidth: 500, color: "rgb(148 163 184)" }}
      >
        Unlock insights from your documents. Upload a PDF to start a conversation
        and get the answers you need, instantly.
      </Typography>
    </Box>
  );
};

export default WelcomeView;
