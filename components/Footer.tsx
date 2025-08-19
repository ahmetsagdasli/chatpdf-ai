import React from "react";
import { Box, Typography, Link, Stack } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 5,
        py: 3,
        textAlign: "center",
        bgcolor: "rgba(0,0,0,0.2)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 1 }}>
        <Link
          href="https://github.com/ahmetsagdasli"
          target="_blank"
          rel="noopener"
          color="inherit"
        >
          <GitHubIcon />
        </Link>
        <Link
          href="https://www.linkedin.com/in/ahmet-sagdasli/"
          target="_blank"
          rel="noopener"
          color="inherit"
        >
          <LinkedInIcon />
        </Link>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} ChatPDF AI – Developed by Ahmet Sağdaşlı
      </Typography>
    </Box>
  );
}
