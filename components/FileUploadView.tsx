// components/FileUploadView.tsx
import React, { useRef, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface FileUploadViewProps {
  onFileSelected: (file: File) => void;
  fileName?: string;
  isParsing?: boolean;
}

const FileUploadView: React.FC<FileUploadViewProps> = ({
  onFileSelected,
  fileName,
  isParsing = false,
}) => {
  const dropRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = useCallback(
    (file?: File) => {
      if (file && file.type === "application/pdf") {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
      dropRef.current?.classList.remove("dragging");
    },
    [handleFile]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropRef.current?.classList.add("dragging");
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dropRef.current?.classList.remove("dragging");
  };

  return (
    <Paper
      ref={dropRef}
      variant="outlined"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      sx={{
        p: 3,
        textAlign: "center",
        borderStyle: "dashed",
        "&.dragging": {
          borderColor: "primary.main",
          boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}`,
        },
      }}
    >
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Drag & drop a PDF here, or select from your computer
      </Typography>

      <Stack direction="row" spacing={1} justifyContent="center">
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          Select File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          hidden
          onChange={onFileInput}
        />
      </Stack>

      {fileName && (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 2 }}
          color="text.secondary"
        >
          Uploaded: <b>{fileName}</b>
        </Typography>
      )}

      {isParsing && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="caption" color="text.secondary">
            Reading PDF…
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FileUploadView;
