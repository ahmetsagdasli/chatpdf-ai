import React from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

export type Role = "user" | "assistant" | "system";

export type SourceTag = {
  label: string;
  onClick?: () => void;
};

export type MessageProps = {
  role: Role;
  content: string;
  timestamp?: number | string;
  sources?: SourceTag[];
  maxWidth?: number | string;
};

const roleMeta: Record<
  Role,
  { bg: string; avatar: React.ReactNode; title: string; align: "left" | "right" }
> = {
  user: {
    title: "You",
    align: "right",
    bg: "linear-gradient(135deg, #00e091 0%, #3b8bff 100%)",
    avatar: (
      <Avatar sx={{ bgcolor: "rgba(0,224,145,.25)", color: "#00e091" }}>
        <PersonIcon />
      </Avatar>
    ),
  },
  assistant: {
    title: "Assistant",
    align: "left",
    bg: "linear-gradient(135deg, #3b8bff 0%, #b36bff 100%)",
    avatar: (
      <Avatar sx={{ bgcolor: "rgba(179,107,255,.25)", color: "#b36bff" }}>
        <SmartToyIcon />
      </Avatar>
    ),
  },
  system: {
    title: "System",
    align: "left",
    bg: "linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.08))",
    avatar: (
      <Avatar sx={{ bgcolor: "rgba(255,255,255,.18)", color: "#c7d2fe" }}>
        <SettingsSuggestIcon />
      </Avatar>
    ),
  },
};

export default function Message({
  role,
  content,
  timestamp,
  sources,
  maxWidth = 760,
}: MessageProps) {
  const meta = roleMeta[role];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {}
  };

  return (
    <Stack
      direction="row"
      spacing={1.5}
      justifyContent={meta.align === "right" ? "flex-end" : "flex-start"}
      sx={{ width: "100%" }}
    >
      {meta.align === "left" && meta.avatar}

      <Box sx={{ maxWidth, width: "fit-content" }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 0.5, mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            {meta.title}
          </Typography>
          {timestamp && (
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {typeof timestamp === "number"
                ? new Date(timestamp).toLocaleTimeString()
                : timestamp}
            </Typography>
          )}
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            pr: 5,
            borderRadius: 3,
            background: meta.bg,
            color: role === "system" ? "text.primary" : "#0b1220",
            position: "relative",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            whiteSpace: "pre-wrap",
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.5, letterSpacing: ".01em" }}>
            {content}
          </Typography>

          <Tooltip title="Kopyala">
            <IconButton
              size="small"
              onClick={copy}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: role === "system" ? "text.secondary" : "#0b1220",
                bgcolor:
                  role === "system"
                    ? "rgba(255,255,255,.10)"
                    : "rgba(255,255,255,.25)",
                "&:hover": {
                  bgcolor:
                    role === "system"
                      ? "rgba(255,255,255,.18)"
                      : "rgba(255,255,255,.35)",
                },
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Paper>

        {sources && sources.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 0.75, flexWrap: "wrap" }}>
            {sources.map((s, i) => (
              <Chip
                key={`${s.label}-${i}`}
                label={s.label}
                size="small"
                variant="outlined"
                onClick={s.onClick}
                sx={{
                  color: "text.secondary",
                  borderColor: "rgba(255,255,255,.25)",
                  bgcolor: "rgba(59,139,255,.12)",
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      {meta.align === "right" && meta.avatar}
    </Stack>
  );
}
