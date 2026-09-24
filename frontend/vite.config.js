import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true // Admin Panel hamesha 5173 pe hi chalega, kisi aur port pe shift nahi hoga
  }
})
