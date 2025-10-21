import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { getVault, getVaults } from '@/api/vault'
import { deleteFile } from '@/api/file'
import { UserContext } from '@/context'

import './VaultPage.scss'

export function VaultPage(){
    const auth = useContext(UserContext)
    const { vaultId } = useParams()
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: ['vault', vaultId],
        queryFn: async () => {
            if (!vaultId) {
                throw new Error('Vault not set')
            }

            return getVault(vaultId)
        },
        enabled: !!vaultId,
    })

    const myVaultsQuery = useQuery({
        queryKey: ['user', auth.user?.id, 'vault', 'list'],
        queryFn: async () => {
            return getVaults()
        },
        enabled: Boolean(auth.user),
    })

    const mutation = useMutation({
        mutationFn: async (fileId: string) => {
            if (!vaultId) {
                throw new Error('vaultId is not set')
            }

            await deleteFile(vaultId, fileId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vault'] })
        },
    })

    if (!vaultId) {
        return null
    }

    const isMyVault = (
        vaultId &&
        myVaultsQuery.status === 'success' &&
        myVaultsQuery.data.map(({ vaultId }) => vaultId).includes(vaultId)
    )

    if (query.status === 'pending') {
        return (
            <i>Загрузка</i>
        )
    }

    if (query.status === 'error' || query.error) {
        return (
            <div>
                <h1>Ошибка</h1>
                <p>Ничего не найдено</p>
            </div>
        )
    }

    const imageList = query.data.filter(({ isImage }) => isImage)

    return (
        <div className="vaultPage">
            <h1 className="vaultPageHeader">ЗАГРУЗКИ</h1>
            <ul className="uploadedImageList">
                {
                    imageList.map(({ id, title }) => (
                        <li className="uploadedImage" key={id}>
                            <a href={`/upload/${vaultId}/${id}/${title}`}>
                                <img src={`/upload/${vaultId}/${id}/preview/${title}`} alt={title} />
                            </a>
                            {
                                isMyVault
                                    ? (
                                        <button
                                            type="button"
                                            disabled={mutation.status === 'pending'}
                                            onClick={() => {
                                                mutation.mutate(id)
                                            }}
                                        >
                                            ✕
                                        </button>
                                    )
                                    : null
                            }
                        </li>
                    ))
                }
            </ul>
            {imageList.length < query.data.length && imageList.length > 0 ? <hr/> : null}
            <ul className="uploadedFileList">
                {
                    query.data.filter(({ isImage }) => !isImage).map(({ id, title }) => (
                        <li key={id} className="uploadedFile">
                            <a href={`/upload/${vaultId}/${id}/${title}`}>
                                {title}
                            </a>
                            {
                                isMyVault
                                    ? (
                                        <button
                                            type="button"
                                            disabled={mutation.status === 'pending'}
                                            onClick={() => {
                                                mutation.mutate(id)
                                            }}
                                        >
                                            ✕
                                        </button>
                                    )
                                    : null
                            }
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
