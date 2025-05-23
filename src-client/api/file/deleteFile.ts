export async function deleteFile(vaultId: string, fileId: string) {
    await fetch(`/api/${vaultId}/${fileId}`, {
        method: 'delete',
        credentials: 'include',
    })

    return ({})
}
