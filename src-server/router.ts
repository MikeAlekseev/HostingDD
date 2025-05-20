import express from 'express'

import { vaultRoute } from '@/routes/vault'
import { fileRoute, filePreviewRoute, fileUploadRoute } from '@/routes/file'
import { authRoute } from '@/routes/auth'

export const router = express.Router()
export const fileRouter = express.Router()

vaultRoute(router)
authRoute(router)
fileRoute(fileRouter)
filePreviewRoute(fileRouter)
fileUploadRoute(fileRouter)
