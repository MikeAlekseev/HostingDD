import fs from 'node:fs/promises'

export async function isFileExist(filePath: string) {
    try {
        const stat = await fs.stat(filePath)

        return stat.isFile()
    } catch {
        return false
    }
}
