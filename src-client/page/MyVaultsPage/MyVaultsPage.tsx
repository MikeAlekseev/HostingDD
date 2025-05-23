import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { getVaults } from '@/api/vault'

export const MyVaultsPage = () => {
    const query = useQuery({
        queryKey: ['vault'],
        queryFn: async () => {
            return getVaults()
        },
    })

    if (query.status === 'pending') {
        return (
            <i>Загрузка</i>
        )
    }

    if (query.status === 'error' || query.error) {
        return (
            <div>
                <p>Ошибка</p>
            </div>
        )
    }

    return (
        <div>
            My vaults

            <ul>
                {
                    query.data.map(({ vaultId, name }) => (
                        <li>
                            <Link id={vaultId} to={`/vault/${vaultId}`}>{name}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}
