import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 новый пакет
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    css: {
        postcss: {
            plugins: [autoprefixer()],
        },
    },
})
