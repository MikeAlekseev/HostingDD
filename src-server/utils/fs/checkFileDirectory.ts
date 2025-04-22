import path from 'node:path'

import { checkDirectory } from './checkDirectory'

export async function checkFileDirectory(filePath: string) {
    const parsedPath = path.parse(filePath)

    await checkDirectory(parsedPath.dir)
}
