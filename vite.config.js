import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/community-exchange-admin/',
  plugins: [vue()],
  server: { port: 5181, host: true }
})
