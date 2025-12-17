import { defineConfig, loadEnv, Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import fs from 'fs'
import path from 'path'

// Plugin to process manifest.json and replace app name with environment variable
function manifestPlugin(appName: string): Plugin {
  return {
    name: 'manifest-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/manifest.json') {
          const manifestPath = path.resolve(__dirname, 'public/manifest.json')
          const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
          const manifest = JSON.parse(manifestContent)

          // Replace app name with environment variable value
          manifest.name = appName
          manifest.short_name = appName

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(manifest, null, 2))
          return
        }
        next()
      })
    },
    transformIndexHtml: {
      handler() {
        // During build, copy and modify manifest.json to dist
        return []
      },
    },
    closeBundle() {
      // After build, update the manifest.json in the dist folder
      const distManifestPath = path.resolve(__dirname, 'dist/manifest.json')
      if (fs.existsSync(distManifestPath)) {
        const manifestContent = fs.readFileSync(distManifestPath, 'utf-8')
        const manifest = JSON.parse(manifestContent)
        manifest.name = appName
        manifest.short_name = appName
        fs.writeFileSync(distManifestPath, JSON.stringify(manifest, null, 2))
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appName = env.VITE_APP_NAME || 'Web Messages'

  return {
    plugins: [react(), svgr(), manifestPlugin(appName)],
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
