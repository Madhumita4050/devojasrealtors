import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true // agar 5174 busy hai to error dega, kisi aur port pe chupke se nahi chalega — isse Admin Panel se conflict kabhi nahi hoga
  }
})
