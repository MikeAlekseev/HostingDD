import { createContext, PropsWithChildren, useState, useEffect, useMemo } from 'react'

import { MyUser } from '@/types'
import { userInfo } from '@/api/auth'

export interface UserContextInterface {
    user: MyUser | null
    setUser: (user: MyUser | null) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextInterface>({
    user: null,
    setUser: () => {},
})

export function UserContextWrapper({ children }: PropsWithChildren) {
    const [ready, setReady] = useState(false)
    const [user, setUser] = useState<MyUser | null>(null)

    const userContextValue = useMemo<UserContextInterface>(() => ({
        user,
        setUser,
    }), [user, setUser])

    useEffect(() => {
        userInfo().then(({ user }) => {
            if (user) {
                setUser(user)
            }

            setReady(true)
        })
    }, [])

    if (!ready) {
        return null
    }

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    )
}
