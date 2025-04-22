import path from 'node:path'
import fs from 'node:fs/promises'

import { createServer as createViteServer } from 'vite'
import type { Express, Request } from 'express'

import { PROJECT_ROOT_PATH } from '@/config'

export async function initFrontendDev(server: Express) {
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom',
        clearScreen: false,
    })

    server.use(vite.middlewares)

    async function render(req: Request) {
        const baseTemplate = await fs.readFile(path.resolve(PROJECT_ROOT_PATH, 'index.html'), 'utf-8')
        const url = req.originalUrl || req.url

        try {
            return await vite.transformIndexHtml(url, baseTemplate)
        } catch (error) {
            if (error instanceof Response) {
                throw error
            }

            const e = error as Error

            vite.ssrFixStacktrace(e)

            throw e
        }
    }

    return { render }
}
