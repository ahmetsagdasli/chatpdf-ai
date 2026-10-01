// components/Header.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Box, Divider } from "@mui/material";
import { LogoIcon } from "./icons/LogoIcon";

interface HeaderProps {
  activeDocumentName?: string;
}

const Header: React.FC<HeaderProps> = ({ activeDocumentName }) => {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
        {/* Sol taraf: Logo + başlık */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <LogoIcon
            style={{ width: 28, height: 28, color: "#3b82f6" }} // Tailwind'deki text-blue-500
          />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            ChatPDF AI
          </Typography>
        </Box>

        
        {activeDocumentName && (
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            title={activeDocumentName}
            sx={{ maxWidth: { xs: "40%", md: "60%" }, textAlign: "right" }}
          >
            <Box component="span" sx={{ fontWeight: 500, color: "text.primary" }}>
              Active Document:
            </Box>{" "}
            {activeDocumentName}
          </Typography>
        )}
      </Toolbar>
     
     
      <Divider
        sx={{
          borderColor: "transparent",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(99,102,241,0.3), transparent)", // indigo-500/30
        }}
      />
    </AppBar>
  );
};

export default Header;
