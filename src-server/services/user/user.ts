import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

import z from 'zod'

import { generatePassHash, comparePassAndPassHash } from '@/utils'
import { MyUser } from '@/type/MyUser'
import { FILESTORE_DIRPATH } from '@/config'
import { readJsonFile, writeJsonFile } from '@/utils'

const userFilePath = join(FILESTORE_DIRPATH, 'users.json')

const dbUserSchema = z.object({
    id: z.string().uuid(),
    login: z.string().min(3),
    passhash: z.string().min(3),
})

type DbUserSchema = z.infer<typeof dbUserSchema>

const userFileSchema = z.array(dbUserSchema)

export async function getUser(login: string, password: string) {
    const users = await readJsonFile(userFilePath, userFileSchema, [])
    const loginFinal = login.trim().toLowerCase()

    for (const dbUser of users) {
        if (dbUser.login.toLowerCase() === loginFinal && await comparePassAndPassHash(password, dbUser.passhash)) {
            const user: MyUser = { id: dbUser.id, login: dbUser.login }

            return user
        }
    }

    return null
}

export async function addUser(login: string, password: string) {
    const loginFinal = login.trim().toLowerCase()

    const dbUser = dbUserSchema.parse({
        id: randomUUID(),
        login: login.trim(),
        passhash: await generatePassHash(password),
    } as DbUserSchema)
    const users = await readJsonFile(userFilePath, userFileSchema, [])

    const doubleUser = users.find(user => user.login.toLowerCase() === loginFinal)

    if (doubleUser) {
        return false
    }

    await writeJsonFile(userFilePath, [...users, dbUser], userFileSchema)

    const user: MyUser = { id: dbUser.id, login: dbUser.login }

    return user
}
