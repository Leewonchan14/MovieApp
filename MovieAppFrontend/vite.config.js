import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => {
  require("dotenv").config({ path: "../.env" });
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      strictPort: true,
    },
    preview: {
      host: true,
      port: 3000,
    },
  }
});
