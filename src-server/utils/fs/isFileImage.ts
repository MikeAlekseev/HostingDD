import fsc from 'node:fs'

import imageType, { minimumBytes } from 'image-type'

export async function isFileImage(filePath: string) {
    const chunks = []

    for await (const chunk of fsc.createReadStream(filePath, { start: 0, end: minimumBytes-1 })) {
        chunks.push(chunk)
    }

    const startOfFile = Buffer.concat(chunks)
    const imageMetadata = await imageType(startOfFile)

    return !!imageMetadata
}
