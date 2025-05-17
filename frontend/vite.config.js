import { defineConfig } from 'vite'
import react        from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // все запросы на /api/* будут перенаправляться на http://localhost:4000
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      // если вы отдаёте статические картинки через /static/…
      '/static': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
