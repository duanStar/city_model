import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/city_model/',
  assetsDir: '/city_model/',
  plugins: [vue()],
})
