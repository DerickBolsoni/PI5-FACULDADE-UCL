import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  // Raiz "/" para Netlify (e desenvolvimento). GitHub Pages usa subpasta via flag no CI.
  base: "/",
});
