import { join } from 'node:path'
import fsp from 'node:fs/promises'

import imageThumbnail from 'image-thumbnail'

import { FILESTORE_DIRPATH } from '@/config'

import { isFileExist } from './isFileExist'

export async function getImageThumbnail(vaultId: string, systemName: string) {
    const thumbnailSystemName = getThumbnailName(systemName)
    const path = join(FILESTORE_DIRPATH, vaultId, systemName)
    const thumbnailPath = join(FILESTORE_DIRPATH, vaultId, thumbnailSystemName)

    if (!await isFileExist(thumbnailPath)) {
        const thumbnail = await imageThumbnail(
            path,
            {
                width: 100,
                height: 100,
                fit: 'cover',
                jpegOptions: {
                    force: true,
                    quality: 30,
                },
            } as unknown as undefined,
        )

        await fsp.writeFile(thumbnailPath, thumbnail)
    }

    return { thumbnailPath }
}

export function getThumbnailName(filename: string) {
    return `${filename}.jpg`
}
