import { join } from 'node:path'
import { writeFile, readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

import { Router } from 'express'

import { FILESTORE_DIRPATH } from '@/config'
import { isFileExist, checkFileDirectory } from '@/utils'
import { vaultListSchema, vaultIdSchema, VaultList, vaultNameSchema } from '@/routes/schemas'
import { bindVaultToUser, getUsersVaults } from '@/services/userVaults'

export function vaultRoute(router: Router) {
    router.get('/vault/:vaultId', (req, res, next) => {
        (async () => {
            const vaultId = vaultIdSchema.parse(req.params.vaultId)
            const dataFilePath = join(FILESTORE_DIRPATH, vaultId, 'data.json')

            if (!await isFileExist(dataFilePath)) {
                next()

                return
            }

            const data = JSON.parse(await readFile(dataFilePath, 'utf8'))

            res.json(vaultListSchema.parse(data))
        })().catch(next)
    })

    router.post('/vault', (req, res, next) => {
        (async () => {
            const { user } = req.session
            const vaultName = vaultNameSchema.parse((req.body as { name: string }).name || '')
            const vaultId = randomUUID()
            const dataFilePath = join(FILESTORE_DIRPATH, vaultId, 'data.json')
            const defaultData: VaultList = []

            await checkFileDirectory(dataFilePath)

            await writeFile(dataFilePath, JSON.stringify(defaultData))

            if (user) {
                await bindVaultToUser(user.id, vaultId, vaultName)
            }

            res.json({ vaultId })
        })().catch(next)
    })

    router.get('/vaults', (req, res, next) => {
        (async () => {
            const { user } = req.session

            if (!user) {
                res.status(401).send()

                return
            }

            res.json(await getUsersVaults(user.id))
        })().catch(next)
    })
}
