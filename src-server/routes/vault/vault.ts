import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

import { Router } from 'express'

import { FILESTORE_DIRPATH } from '@/config'
import { isFileExist } from '@/utils'
import { vaultListSchema, vaultIdSchema } from '@/routes/schemas'

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
}
