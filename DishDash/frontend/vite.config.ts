import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: "/DishDash/",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: mode === "development" ? {
        "/api": {
          target: "http://localhost:8080",
          rewrite: (path) => path.replace(/^\/api/, ""),
          changeOrigin: true,
          secure: false,
        },
      } : undefined,
    },
    define: {
      // fallback in case env is missing
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ""),
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
  };
});
