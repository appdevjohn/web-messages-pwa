import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), svgr()],
    server: {
      port: Number(env.PORT) || 5173,
      host: true,
    },
    preview: {
      port: Number(env.PORT) || 3000,
      host: true,
    },
  }
})
