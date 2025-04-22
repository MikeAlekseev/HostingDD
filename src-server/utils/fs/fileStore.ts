import { promises as fs } from 'node:fs'

import { type TypeOf, type ZodType } from 'zod'

import { isFileExist } from './isFileExist'
import { checkFileDirectory } from './checkFileDirectory'

export async function readJsonFile<DataSchema extends ZodType>(
    filepath: string,
    dataSchema: DataSchema,
    defaultValue: TypeOf<DataSchema>,
) {
    if (!await isFileExist(filepath)) {
        const newValue = dataSchema.parse(defaultValue)

        await checkFileDirectory(filepath)
        await fs.writeFile(filepath, JSON.stringify(newValue, null, 4))
    }

    const rawData = await fs.readFile(filepath, 'utf8')

    return dataSchema.parse(JSON.parse(rawData)) as TypeOf<typeof dataSchema>
}

export async function writeJsonFile<DataSchema extends ZodType>(
    filepath: string,
    data: TypeOf<DataSchema>,
    dataSchema: DataSchema,
) {
    const validData = dataSchema.parse(data) as TypeOf<typeof dataSchema>

    await checkFileDirectory(filepath)
    await fs.writeFile(filepath, JSON.stringify(validData, null, 4))

    return validData
}
