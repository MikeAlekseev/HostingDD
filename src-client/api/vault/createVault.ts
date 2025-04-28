export async function createVault() {
    const res = await fetch('/api/vault', { method: 'post' })

    if (!res.ok || res.status !== 200) {
        throw new Error('Bad response')
    }

    return await res.json() as { vaultId: string }
}
