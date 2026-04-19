
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // 1. Add this import

// import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Add this plugin to the array
  ],
})

