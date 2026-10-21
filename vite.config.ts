import { fileURLToPath, URL } from 'node:url'

import Uni from '@uni-helper/plugin-uni'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // https://uni-helper.js.org/plugin-uni
    Uni(),
  ],
  server: {
    port: 5173,
    // 后端就绪后：把 .env 的 VITE_APP_BASE_URL 留空并开启下面的代理
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //   },
    // },
  },
})
