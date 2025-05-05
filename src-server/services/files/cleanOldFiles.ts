import { join } from 'node:path'

import fse from 'fs-extra'

import { config, FILESTORE_DIRPATH, TEMP_FILESTORE_DIRPATH } from '@/config'

const DAY = 24 * 60 * 60 * 1000

export async function cleanSubDirectories(dir: string) {
    const content = await fse.readdir(dir)

    for (const name of content) {
        const removalPath = join(dir, name)
        const stat = await fse.lstat(removalPath)
        const lifetimeDays = (Date.now() - stat.mtimeMs) / DAY

        if (lifetimeDays >= config.fileTtlDays) {
            await fse.remove(removalPath)
        }
    }
}

export async function cleanOldFiles() {
    await cleanSubDirectories(FILESTORE_DIRPATH)
    await cleanSubDirectories(TEMP_FILESTORE_DIRPATH)
}
