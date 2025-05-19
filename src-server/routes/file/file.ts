import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'

import z from 'zod'
import { Router } from 'express'
import multer from 'multer'
import fse from 'fs-extra'

import { FILESTORE_DIRPATH, TEMP_FILESTORE_DIRPATH } from '@/config'
import { isFileExist, getImageThumbnail, isFileImage, moveImageAndCleanExif } from '@/utils'
import { vaultListSchema, vaultIdSchema, fileIdSchema, VaultList } from '@/routes/schemas'

const uploadTempFileMiddleware = multer({ dest: TEMP_FILESTORE_DIRPATH })

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

export const apiUploadFileTempRequestSchema = z.object({
    originalname: z.string(),
})

export function fileUploadRoute(router: Router) {
    router.post('/:vaultId', uploadTempFileMiddleware.single('file'), (req, res, next) => {
        (async () => {
            const fileId = randomUUID()
            const vaultId = vaultIdSchema.parse(req.params.vaultId)
            const vaultPath = join(FILESTORE_DIRPATH, vaultId)
            const dataFilePath = join(vaultPath, 'data.json')
            const parseResult = apiUploadFileTempRequestSchema.safeParse(req.body)

            if (parseResult.error) {
                throw new Error('Ошибка загрузки')
            }

            const isImage = await isFileImage(req.file!.path)

            if (isImage) {
                await moveImageAndCleanExif(req.file!.path, join(vaultPath, fileId))
            } else {
                await fse.move(req.file!.path, join(vaultPath, fileId))
            }

            const data = JSON.parse(await readFile(dataFilePath, 'utf8')) as VaultList

            data.push({
                id: fileId,
                isImage,
                title: req.file!.originalname,
            })

            await writeFile(dataFilePath, JSON.stringify(data))

            res.send()
        })().catch((e) => next(e))
    })
}
