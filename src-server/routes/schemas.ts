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

export type VaultList = z.infer<typeof vaultListSchema>

export const vaultNameSchema = z.string().min(1)

export const usersVaultSchema = z.object({
    name: vaultNameSchema,
    vaultId: vaultIdSchema,
})

export type UsersVault = z.infer<typeof usersVaultSchema>
