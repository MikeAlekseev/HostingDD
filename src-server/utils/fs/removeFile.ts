import fs from 'node:fs/promises'

import { isFileExist } from './isFileExist'

export async function removeFile(filePath: string) {
    if (await isFileExist(filePath)) {
        await fs.rm(filePath)
    }
}
