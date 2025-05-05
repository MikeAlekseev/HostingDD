import express from 'express'

import { vaultRoute } from '@/routes/vault'
import { fileRoute, filePreviewRoute, fileUploadRoute } from '@/routes/file'

export const router = express.Router()
export const fileRouter = express.Router()

vaultRoute(router)
fileRoute(fileRouter)
filePreviewRoute(fileRouter)
fileUploadRoute(fileRouter)
