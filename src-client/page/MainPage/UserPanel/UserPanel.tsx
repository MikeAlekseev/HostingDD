import { useCallback, useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '@/context'
import { logout } from '@/api/auth'

export const UserPanel = () => {
    const mountedRef = useRef(true)
    const auth = useContext(UserContext)

    useEffect(() => {
        return () => {
            mountedRef.current = false
        }
    }, [])

    const logoutHandler = useCallback(() => {
        logout().then(() => {
            auth.setUser(null)
        })
    }, [auth])

    if (!auth.user) {
        return null
    }

    return (
        <div className="login">
            <Link to="/voultes">{auth.user.login}</Link>
            <button
                type="button"
                onClick={logoutHandler}
            >
                Logout
            </button>
        </div>
    )
}
