import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("Vite Mode:", mode);
  console.log("API Target:", env.VITE_API_TARGET);
  console.log("Connect Target:", env.VITE_CONNECT_TARGET);

  return {
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
          target: env.VITE_API_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },

        "/vakrangee-connect": {
          target: env.VITE_CONNECT_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
