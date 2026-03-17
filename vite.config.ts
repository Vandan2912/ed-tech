import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
 server: {
  proxy: {
    "/api": {
      target: "https://smartlearn-575p.onrender.com",
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ""),
      configure: (proxy) => {
        proxy.on("proxyReq", (proxyReq, req) => {
          console.log("Proxying:", req);
        });
      },
    },
  },
},
});
