import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { dirname } from "node:path";
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const UnoCss = await import('unocss/vite').then(i => i.default)
  return {
    plugins: [uni(), UnoCss()],
    resolve: {
      alias: {
        '/@/': `$${__dirname}/src`
      }
    },
    // 解决跨域
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          // target: 'http://120.26.146.156:9898',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
});
