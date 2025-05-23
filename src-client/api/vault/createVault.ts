export async function createVault() {
    const data = { name: new Date().toString() }
    const res = await fetch(
        '/api/vault',
        {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

    if (!res.ok || res.status !== 200) {
        throw new Error('Bad response')
    }

    return await res.json() as { vaultId: string }
}
