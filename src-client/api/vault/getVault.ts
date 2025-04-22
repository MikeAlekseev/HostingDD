export async function getVault(vaultId: string) {
    const res = await fetch(`/api/vault/${vaultId}`)

    if (!res.ok || res.status !== 200) {
        throw new Error('Bad response')
    }

    return await res.json() as Array<{ title: string, id: string, isImage: boolean }>
}
