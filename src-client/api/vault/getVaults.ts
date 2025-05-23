export async function getVaults() {
    const res = await fetch('/api/vaults', { credentials: 'include' })

    if (!res.ok || res.status !== 200) {
        throw new Error('Bad response')
    }

    return await res.json() as Array<{ name: string, vaultId: string }>
}
