import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

type Props = {
  label?: string;
  compact?: boolean;
};

const Dot = ({ delay }: { delay: string }) => (
  <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #3b8bff 0%, #b36bff 100%)",
      animation: "pulse 1.2s infinite",
      animationDelay: delay,
      "@keyframes pulse": {
        "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.6 },
        "40%": { transform: "scale(1.0)", opacity: 1 },
      },
    }}
  />
);

export default function TypingIndicator({ label = "Assistant yazıyor…", compact }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: compact ? 1 : 1.5,
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(6px)",
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
      }}
    >
      <Stack direction="row" spacing={0.75}>
        <Dot delay="0s" />
        <Dot delay=".15s" />
        <Dot delay=".3s" />
      </Stack>
      {!compact && (
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
      )}
    </Paper>
  );
}
