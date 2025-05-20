import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'

import { fromZodError } from 'zod-validation-error'
import { z } from 'zod'
import dotenv from 'dotenv'

import { getNearestPackage, checkDirectory } from '@/utils'

export const PROJECT_ROOT_PATH = getNearestPackage(dirname(fileURLToPath(import.meta.url)))

if (!PROJECT_ROOT_PATH || PROJECT_ROOT_PATH === '/' || PROJECT_ROOT_PATH === '.') {
    throw new Error('Server package.json not found')
}

export const DIST_STATIC_ROOT_PATH = resolve(PROJECT_ROOT_PATH, 'dist/static')

export const FILESTORE_DIRNAME = 'data'
export const FILESTORE_DIRPATH = resolve(PROJECT_ROOT_PATH, FILESTORE_DIRNAME)

checkDirectory(FILESTORE_DIRPATH).catch((err) => {
    console.error(err)
})

export const TEMP_FILESTORE_DIRNAME = 'temp'
export const TEMP_FILESTORE_DIRPATH = resolve(PROJECT_ROOT_PATH, TEMP_FILESTORE_DIRNAME)

checkDirectory(TEMP_FILESTORE_DIRPATH).catch((err) => {
    console.error(err)
})

export const isProd = process.env.NODE_ENV === 'production'
export const isDev = !isProd

dotenv.config({ path: join(PROJECT_ROOT_PATH, '.env') })

const numberSchema = z.coerce.number().int().finite().safe()

const configValidationResult = z.object({
    // Server
    HOST: z.string().default('0.0.0.0'),
    PORT: numberSchema.positive().default(8080),
    SITE_URL: z.string().optional(),
    TRUST_PROXY_COUNT: numberSchema.nonnegative().default(0),
    FILE_TTL_DAYS: numberSchema.nonnegative().default(180),
    SESSION_SECRET: z.string().min(10),
}).transform((o) => {
    return ({
        siteUrl: o.SITE_URL || `http://localhost:${o.PORT}`,
        fileTtlDays: o.FILE_TTL_DAYS,
        app: {
            host: o.HOST,
            port: o.PORT,
            trustProxyCount: o.TRUST_PROXY_COUNT,
            secret: o.SESSION_SECRET,
        },
    })
}).safeParse(process.env)

if (!configValidationResult.success) {
    console.error(fromZodError(configValidationResult.error, { prefix: 'ENV config is failed' }).stack)

    process.exit(1)
}

export const config = configValidationResult.data
