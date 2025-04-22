import fs from 'node:fs/promises'

import { isDirectoryExist } from './isDirectoryExist'

export async function checkDirectory(dirPath: string) {
    if (!await isDirectoryExist(dirPath)) {
        await fs.mkdir(dirPath, { recursive: true })
    }
}
