import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// Optional: proxy OpenAQ to avoid CORS locally
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/openaq": {
//         target: "https://api.openaq.org",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/openaq/, ""),
//       },
//     },
//   },
// })
