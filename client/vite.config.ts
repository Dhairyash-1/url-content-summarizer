import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/url-summarizer": "https://web-scrape-url-summarizer-server.vercel.app",
  //   },
  // },
})
