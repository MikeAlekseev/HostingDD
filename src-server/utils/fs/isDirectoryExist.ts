import fs from 'node:fs/promises'

export async function isDirectoryExist(filePath: string) {
    try {
        const stat = await fs.stat(filePath)

        return stat.isDirectory()
    } catch {
        return false
    }
}
