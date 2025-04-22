import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()],

  server:{
    proxy:{ //To prevent any cors errors
      "/api":{
        target:"http://localhost:8000",
      },
    },
  },
})


