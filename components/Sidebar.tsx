// components/Sidebar.tsx
import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import type { Document } from "../types";
import { FileIcon } from "./icons/FileIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { FolderIcon } from "./icons/FolderIcon";

interface SidebarProps {
  documents: Document[];
  activeDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onNewDocument: (file: File) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  documents,
  activeDocumentId,
  onSelectDocument,
  onNewDocument,
  isLoading,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onNewDocument(e.target.files[0]);
      e.target.value = "";
    }
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: "#0B1120",
          borderRight: "1px solid rgba(148,163,184,0.2)",
          display: "flex",
          flexDirection: "column",
          p: 2,
        },
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(to right, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          My Documents
        </Typography>
        <Button
          size="small"
          disabled
          title="New Folder (coming soon)"
          sx={{ minWidth: 0, color: "rgba(148,163,184,0.5)" }}
        >
          <FolderIcon width={20} height={20} />
        </Button>
      </Box>

      {/* Documents List */}
      <List sx={{ flex: 1, overflowY: "auto" }}>
        {documents.map((doc) => {
          const isActive = doc.id === activeDocumentId;
          return (
            <ListItemButton
              key={doc.id}
              selected={isActive}
              onClick={() => onSelectDocument(doc.id)}
              sx={{
                mb: 0.5,
                borderRadius: 1,
                "&.Mui-selected": {
                  bgcolor: "rgba(148,163,184,0.1)",
                  boxShadow: "0 0 10px rgba(0,0,0,0.4)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: isActive ? "#60a5fa" : "grey.500" }}>
                <FileIcon width={20} height={20} />
              </ListItemIcon>
              <ListItemText
                primary={doc.name}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "white" : "grey.400",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Upload Button */}
      <Box mt={2}>
        <input
          type="file"
          id="pdf-upload-sidebar"
          style={{ display: "none" }}
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <label htmlFor="pdf-upload-sidebar">
          <Button
            component="span"
            fullWidth
            variant="outlined"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} sx={{ color: "grey.400" }} />
              ) : (
                <PlusIcon width={20} height={20} />
              )
            }
            sx={{
              borderColor: "rgba(148,163,184,0.3)",
              bgcolor: "rgba(30,41,59,0.5)",
              color: isLoading ? "grey.400" : "grey.200",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "rgba(148,163,184,0.5)",
                bgcolor: "rgba(30,41,59,0.8)",
              },
            }}
          >
            {isLoading ? "Processing..." : "Upload Document"}
          </Button>
        </label>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
