import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

import { getVaults } from '@/api/vault'
import { UserContext } from '@/context'

import './MyVaultsPage.scss'

export const MyVaultsPage = () => {
    const auth = useContext(UserContext)
    const query = useQuery({
        queryKey: ['user', auth.user?.id, 'vault', 'list'],
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
        <div className="myVaultsWrapper">
            <h2 className="myVaultsHeader">Мои загрузки</h2>
            <ol className="myVaultsList">
                {
                    query.data.map(({ vaultId, name }, pos) => (
                        <li>
                            <Link id={vaultId} to={`/vault/${vaultId}`}> {pos + 1}. Загрузка от: {format(name, 'dd.MM.yyyy mm:hh')}</Link>
                        </li>
                    ))
                }
            </ol>
        </div>
    )
}
