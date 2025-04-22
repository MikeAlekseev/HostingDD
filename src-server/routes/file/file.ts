import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

import { Router } from 'express'

import { FILESTORE_DIRPATH } from '@/config'
import { isFileExist, getImageThumbnail } from '@/utils'
import { vaultListSchema, vaultIdSchema, fileIdSchema } from '@/routes/schemas'

export function fileRoute(router: Router) {
    router.get('/:vaultId/:fileId/:fileName', (req, res, next) => {
        (async () => {
            const vaultId = vaultIdSchema.parse(req.params.vaultId)
            const fileId = fileIdSchema.parse(req.params.fileId)
            const dataFilePath = join(FILESTORE_DIRPATH, vaultId, 'data.json')

            if (!await isFileExist(dataFilePath)) {
                next()

                return
            }

            const data = JSON.parse(await readFile(dataFilePath, 'utf8'))
            const fileInfo = vaultListSchema.parse(data).find((file) => file.id === fileId)

            if (!fileInfo) {
                next()

                return
            }

            const filePath = join(FILESTORE_DIRPATH, vaultId, fileInfo.id)

            if (!await isFileExist(filePath)) {
                next()

                return
            }

            res.sendFile(filePath, { maxAge: 31 * 24 * 60 * 60 * 1000, immutable: true })
        })().catch(next)
    })
}

export function filePreviewRoute(router: Router) {
    router.get('/:vaultId/:fileId/preview/:fileName', (req, res, next) => {
        (async () => {
            const vaultId = vaultIdSchema.parse(req.params.vaultId)
            const fileId = fileIdSchema.parse(req.params.fileId)
            const dataFilePath = join(FILESTORE_DIRPATH, vaultId, 'data.json')

            if (!await isFileExist(dataFilePath)) {
                next()

                return
            }

            const data = JSON.parse(await readFile(dataFilePath, 'utf8'))
            const fileInfo = vaultListSchema.parse(data).find((file) => file.id === fileId)

            if (!fileInfo) {
                next()

                return
            }

            const filePath = join(FILESTORE_DIRPATH, vaultId, fileInfo.id)

            if (!await isFileExist(filePath)) {
                next()

                return
            }

            const { thumbnailPath } = await getImageThumbnail(vaultId, fileInfo.id)

            res.sendFile(thumbnailPath, { maxAge: 31 * 24 * 60 * 60 * 1000, immutable: true })
        })().catch(next)
    })
}
