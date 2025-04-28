import { join } from 'node:path'
import { writeFile, readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

import { Router } from 'express'

import { FILESTORE_DIRPATH } from '@/config'
import { isFileExist, checkFileDirectory } from '@/utils'
import { vaultListSchema, vaultIdSchema, VaultList } from '@/routes/schemas'

export function vaultRoute(router: Router) {
    router.get('/vault/:vaultId', (req, res, next) => {
        (async () => {
            const vaultId = vaultIdSchema.parse(req.params.vaultId)
            const dataFilePath = join(FILESTORE_DIRPATH, vaultId, 'data.json')

            if (!await isFileExist(dataFilePath)) {
                next()

                return
            }

            // import { stat } from 'node:fs/promises'
            // const DAY = 24 * 60 * 60 * 1000
            // const dirStat = await stat(join(FILESTORE_DIRPATH, vaultId, 'data.json'))
            //
            // console.log('Date', Math.floor((Date.now() - dirStat.birthtimeMs) / DAY))
            // ToDo: Создать ежедневную задачу в CRON на удаление папок старше config.fileTtlDays

            const data = JSON.parse(await readFile(dataFilePath, 'utf8'))

            res.json(vaultListSchema.parse(data))
        })().catch(next)
    })

    router.post('/vault', (req, res, next) => {
        (async () => {
            const vaultId = randomUUID()
            const dataFilePath = join(FILESTORE_DIRPATH, vaultId, 'data.json')
            const defaultData: VaultList = []

            await checkFileDirectory(dataFilePath)

            await writeFile(dataFilePath, JSON.stringify(defaultData))

            res.json({ vaultId })
        })().catch(next)
    })
}
