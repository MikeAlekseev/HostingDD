import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line import/no-default-export,no-restricted-exports
export default defineConfig({
    build: {
        outDir: 'dist/static',
    },
    plugins: [
        react(),
        {
            name: 'html-transform',
            transformIndexHtml(html) {
                return html.replace('$app-version', process.env.npm_package_version || 'n/a')
            }
        }
    ],
    resolve: {
        alias: {
            '@': path.resolve(dirname, 'src-client'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    }
})
