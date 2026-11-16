import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      three: path.resolve(root, "node_modules/three/build/three.module.js"),
    },
  },
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "framer-motion"],
  },
});
