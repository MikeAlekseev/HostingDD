import process from 'node:process'
import http from 'node:http'

import { config } from '@/config'
import { startCron } from '@/services/cron'
import { app } from '@/app'

const {
    siteUrl,
    app: { host, port },
} = config

const stopTasks = startCron()
const server = http.createServer(app)

server.listen(port, host, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on http://${host}:${port} (${siteUrl})`)
})

process.on('unhandledRejection', (reason, promise) => {
    // eslint-disable-next-line no-console
    console.log(`Unhandled Rejection at: ${promise}, reason: ${reason}`)
})

process.on('uncaughtException', (err, origin) => {
    console.error(`Uncaught exception: ${err}\n Exception origin: ${origin}`)

    const closingWebApp = new Promise((resolve, reject) => {
        server.close((e) => {
            if (e) {
                console.error(`Web-app cant close on uncaughtException ${(e as unknown as Error).toString()}`)
                reject()
            } else {
                // eslint-disable-next-line no-console
                console.log('Web-app closed on uncaughtException')
                resolve(null)
            }

        })
    })

    stopTasks()

    Promise.all([
        closingWebApp,
    ]).then(() => {
        process.exit()
    })

    setTimeout(() => {
        process.abort()
    }, 5000).unref()
})

const onCloseSignal = () => {
    // eslint-disable-next-line no-console
    console.log('sigint received, shutting down')

    stopTasks()

    const closingWebApp = new Promise((resolve, reject) => {
        server.close((e) => {
            if (e) {
                console.error(`Web-app cant close on uncaughtException ${(e as unknown as Error).toString()}`)
                reject()
            } else {
                // eslint-disable-next-line no-console
                console.log('Web-app closed on shutting down signal')
                resolve(null)
            }

        })
    })

    Promise.all([
        closingWebApp,
    ]).then(() => {
        process.exit()
    })

    setTimeout(() => process.exit(1), 10000)
        .unref() // Force shutdown after 10s
}

process.on('SIGINT', onCloseSignal)
process.on('SIGTERM', onCloseSignal)
