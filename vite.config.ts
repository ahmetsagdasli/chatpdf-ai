import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Not: API key artık istemcide tanımlanmıyor (define kaldırıldı)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
