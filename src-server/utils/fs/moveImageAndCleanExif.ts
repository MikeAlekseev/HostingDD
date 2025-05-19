import { createReadStream, createWriteStream } from 'node:fs'

import ExifTransformer from 'exif-be-gone'
import fse from 'fs-extra'

export async function moveImageAndCleanExif(pathFrom: string, pathTo: string) {
    const reader = createReadStream(pathFrom)
    const writer = createWriteStream(pathTo)

    const stream = reader.pipe(new ExifTransformer()).pipe(writer)

    await new Promise((resolve) => {
        stream.on('finish', () => resolve(true))
    })

    await fse.remove(pathFrom)
}
