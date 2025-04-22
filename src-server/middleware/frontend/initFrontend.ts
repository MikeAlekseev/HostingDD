import type { Express, Request } from 'express'

import { isDev } from '@/config'

export async function initFrontend(server: Express) {
    let render: (req: Request) => Promise<string>

    if (isDev) {
        const { initFrontendDev } = await import('./initFrontendDev');

        ({ render } = await initFrontendDev(server))
    } else {
        const { initFrontendProd } = await import('./initFrontendProd');

        ({ render } = await initFrontendProd(server))
    }

    server.get('*', async (req, res, next) => {
        if (
            req.url.startsWith('/api/') ||
            req.url.startsWith('/upload/')
        ) {
            return next()
        }

        try {
            if (req.headers.accept?.includes('text/html')) {
                const html = await render(req)

                res.status(200)
                    .set({ 'Content-Type': 'text/html' })
                    .end(html)
            } else {
                next()
            }
        } catch (e) {
            if (e instanceof Response && e.status >= 300 && e.status <= 399) {
                const redirectLocation = e.headers.get('Location')

                if (redirectLocation) {
                    res.redirect(e.status, redirectLocation)
                } else {
                    next(new Error('Not set redirect location'))
                }

                return
            }

            next(e)
        }
    })
}
