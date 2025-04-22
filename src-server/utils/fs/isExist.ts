import fs from 'node:fs/promises'

export async function isExist(filePath: string) {
    try {
        await fs.stat(filePath)

        return true
    } catch {
        return false
    }
}
