import z from 'zod'

export const vaultIdSchema = z.string().uuid()
export const fileIdSchema = z.string().uuid()
export const vaultListSchema = z.array(
    z.object({
        title: z.string(),
        isImage: z.boolean(),
        id: z.string().uuid(),
    })
)
