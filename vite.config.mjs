import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.webp", "apple-touch-icon.png"],
      manifest: {
        name: "MR Rokesh - BUB Expo Lead Form",
        short_name: "Expo Leads",
        description: "Lead forms for the MR Rokesh Softwares stall at BUB Expo 2026, Salem.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        background_color: "#ffffff",
        theme_color: "#071a66",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,webp,svg}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  server: { proxy: { "/api": "http://localhost:3000" } },
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.js"]
  }
});
