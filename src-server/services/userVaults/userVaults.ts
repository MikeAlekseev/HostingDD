import { join } from 'node:path'

import z from 'zod'

import { MyUser } from '@/type'
import { FILESTORE_DIRPATH } from '@/config'
import { readJsonFile, writeJsonFile } from '@/utils'
import { usersVaultSchema } from '@/routes/schemas'

const userVaultsFileSchema = z.array(usersVaultSchema)

const USER_DATA_PATH = join(FILESTORE_DIRPATH, 'users')

export async function bindVaultToUser(userId: MyUser['id'], vaultId: string, name: string) {
    const userFilePath = join(USER_DATA_PATH, `${userId}.json`)
    const userVaults = await readJsonFile(userFilePath, userVaultsFileSchema, [])

    userVaults.push({
        name,
        vaultId,
    })

    await writeJsonFile(userFilePath, userVaults, userVaultsFileSchema)
}

export async function getUsersVaults(userId: MyUser['id']) {
    const userFilePath = join(USER_DATA_PATH, `${userId}.json`)

    return readJsonFile(userFilePath, userVaultsFileSchema, [])
}
