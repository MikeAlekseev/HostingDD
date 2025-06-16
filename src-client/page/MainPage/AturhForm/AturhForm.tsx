import { FormEventHandler, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { login as doLogin, register as doRegister } from '@/api/auth'
import { UserContext } from '@/context'

import './AturhForm.scss'

export const AturhForm = () => {
    const mountedRef = useRef(true)
    const [isLogin, setIsLogin] = useState(true)
    const auth = useContext(UserContext)
    const [authError, setAuthError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        return () => {
            mountedRef.current = false
        }
    }, [])

    const submitHandler: FormEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault()

        const formEl = e.target as HTMLFormElement
        const formData = new FormData(formEl)
        const formRawValues = Object.fromEntries(formData)

        setIsSubmitting(true)
        setAuthError('')

        if (isLogin) {
            const login = (formRawValues.login || '') as string
            const pass = (formRawValues.pass || '') as string

            doLogin(login, pass).then((data) => {
                if (data.user) {
                    auth.setUser(data.user)
                } else {
                    setAuthError(data.error ?? 'Looser! xD')
                }
            }).finally(() => {
                setIsSubmitting(false)
            })
        } else {
            const login = (formRawValues.login || '') as string
            const pass = (formRawValues.pass || '') as string
            const pass2 = (formRawValues.pass2 || '') as string

            if (pass === pass2) {
                doRegister(login, pass).then((data) => {
                    if (data.user) {
                        auth.setUser(data.user)
                    } else {
                        setAuthError(data.error ?? 'User exists')
                    }
                }).finally(() => {
                    setIsSubmitting(false)
                })
            } else {
                setIsSubmitting(false)
                setAuthError('Passwords is not equal')
            }
        }
    }, [isLogin, auth])

    return (
        <form className="login-form" onSubmit={submitHandler}>
            <div className="auth">
                <input id="login" name="login" type="text" placeholder="Login"/>
            </div>
            <div className="auth">
                <input id="pass" name="pass" type="password" placeholder="Password"/>
            </div>
            {
                isLogin
                    ? null
                    : (
                        <div>
                            <input id="pass2" name="pass2" type="password" placeholder="Retype password"/>
                        </div>
                    )
            }
            {
                authError
                    ? (
                        <div style={{ color: 'red' }}>
                            {authError}
                        </div>
                    )
                    : null
            }
            {
                isLogin
                    ? (
                        <div>
                            <button
                                type='button'
                                className="toggleAuthModeButton"
                                onClick={() => {
                                    setIsLogin(false)
                                    setAuthError('')
                                }}
                            >
                                Register
                            </button>
                            <button
                                type='submit'
                                disabled={isSubmitting}
                            >
                                Login
                            </button>
                        </div>
                    )
                    : (
                        <div>
                            <button
                                type='button'
                                className="toggleAuthModeButton"
                                onClick={() => {
                                    setIsLogin(true)
                                    setAuthError('')
                                }}
                            >
                                Login
                            </button>
                            <button
                                type='submit'
                                disabled={isSubmitting}>
                                Register
                            </button>
                        </div>
                    )
            }

        </form>
    )
}
