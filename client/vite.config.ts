import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/sitemap.xml": {
        target: "http://127.0.0.1:10000",
        changeOrigin: true,
      },
    },
  },
});
