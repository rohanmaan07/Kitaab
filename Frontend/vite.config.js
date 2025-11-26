import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Rule 1: Sirf bot ke liye, local server par bhejo
      // Yeh rule upar hona zaroori hai
      '/api/v1/bot': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1\/bot/, '/api/v1/bot'),
      },
      
      // Rule 2: Baaki sabhi '/api' requests ke liye, hosted server par bhejo
      '/api': {
        // ▼▼▼ YAHAN APNA LIVE BACKEND URL DAALEIN ▼▼▼
        target: 'https://your-hosted-backend-url.com', 
        changeOrigin: true,
      },
    }
  }
})

