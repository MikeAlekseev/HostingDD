import { useContext, useEffect, useRef } from 'react'

import { Link, Outlet } from 'react-router-dom'
import { UserContext } from '@/context'
import { UserPanel } from '@/page/MainPage/UserPanel'
import { AturhForm } from '@/page/MainPage/AturhForm'

import './Layout.scss'

export const Layout = () => {
    const mountedRef = useRef(true)
    const auth = useContext(UserContext)

    useEffect(() => {
        return () => {
            mountedRef.current = false
        }
    }, [])

    return (
        <div className="top">
            <Link to="/">
                <h1>Private file hosting</h1>
            </Link>
            <div className="header">
                <div className="logoLabel">
                    DEADLINE!!
                </div>
                {
                    auth.user
                        ? <UserPanel/>
                        : <AturhForm/>
                }
            </div>
            <Outlet/>
        </div>
    )
}
