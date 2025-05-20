// import cors from 'cors'
import express, { Express } from 'express'
// import helmet from 'helmet'
import session from 'express-session'

import { config } from '@/config'

import { initFrontend } from './middleware/frontend'
import { errorHandler } from './middleware/errorHandler'
// import { getCorsOrigin } from '@common/utils/envConfig'
// import { healthCheckRouter } from '@modules/healthCheck/healthCheckRoutes'
import { router, fileRouter } from './router'

const app: Express = express()

app.disable('x-powered-by')
if (config.app.trustProxyCount > 0) {
    app.set('trust proxy', config.app.trustProxyCount)
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// const corsOrigin = getCorsOrigin()

// Middlewares
// app.use(cors({
//     origin: [corsOrigin],
//     credentials: true,
// }))
// app.use(helmet())
// ToDo: compress response
// Add header (in Helmet) Content-Security-Policy: default-src 'self'; frame-ancestors 'none'; form-action 'none'; block-all-mixed-content; sandbox allow-scripts

await initFrontend(app)

// Routes
// app.use('/health-check', healthCheckRouter)

app.use(session({
    secret: config.app.secret,
    rolling: true,
}))

app.use('/api', router)
app.use('/upload', fileRouter)

// Error handlers
app.use(errorHandler())

export { app }
