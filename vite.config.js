import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/jpb/",

  server: {
    host: "localhost",
    port: 5173,
    https: {
      key: fs.readFileSync("../backend/server.pem"),
      cert: fs.readFileSync("../backend/server.crt"),
    },
    proxy: {
      "/api": {
        target: "http://vkmssit.vakrangee.in:8090",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

      "/vakrangee-connect": {
        target: "https://vkmssit.vakrangee.in",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});