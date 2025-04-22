import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { getVault } from '@/api/vault'

export function VaultPage(){
    const { vaultId } = useParams()
    const query = useQuery({
        queryKey: ['vault'],
        queryFn: async () => {
            if (!vaultId) {
                throw new Error('Vault not set')
            }

            return getVault(vaultId)
        },
        enabled: !!vaultId,
    })

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

    return (
        <div>
            <h1>VaultPage</h1>
            <ul>
                {
                    query.data.filter(({ isImage }) => isImage).map(({ id, title }) => (
                        <li key={id}><a href={`/upload/${vaultId}/${id}/${title}`}>
                            <img src={`/upload/${vaultId}/${id}/preview/${title}`} alt={title} />
                        </a></li>
                    ))
                }
            </ul>
            <hr/>
            <ul>
                {
                    query.data.filter(({ isImage }) => !isImage).map(({ id, title }) => (
                        <li key={id}><a href={`/upload/${vaultId}/${id}/${title}`}>
                            {title}
                        </a></li>
                    ))
                }
            </ul>
        </div>
    )
}
