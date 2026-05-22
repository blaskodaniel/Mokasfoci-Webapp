import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg?react",
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  assetsInclude: ["**/*.lottie"],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("recharts") || id.includes("d3-") || id.includes("victory-vendor")) return "vendor-charts";
          if (id.includes("@lottiefiles") || id.includes("dotlottie")) return "vendor-lottie";
          if (id.includes("socket.io")) return "vendor-socket";
          if (id.includes("framer-motion") || id.includes("/motion/")) return "vendor-animation";
          return "vendor";
        },
      },
    },
  },
});
