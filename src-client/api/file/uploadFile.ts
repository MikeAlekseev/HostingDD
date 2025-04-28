export async function uploadFile(vaultId: string, file: File) {
    const formData = new FormData()

    formData.append('originalname', file.name)
    formData.append('file', file)

    return fetch(`/upload/${vaultId}`, {
        method: 'POST',
        body: formData
    })// as Promise<ApiUploadFileResponse>
}
