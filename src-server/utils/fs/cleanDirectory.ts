import fs from 'node:fs/promises'

import { isDirectoryExist } from './isDirectoryExist'
import { checkDirectory } from './checkDirectory'

export async function cleanDirectory(dirPath: string) {
    if (await isDirectoryExist(dirPath)) {
        await fs.rm(dirPath, { recursive: true })
    }
    await checkDirectory(dirPath)
}
