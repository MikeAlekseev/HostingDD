import { MyUser } from '@/types'

export type AuthResponse = {
    user: MyUser
} | {
    user: null
    error?: string
}

export async function userInfo() {
    const res = await fetch(
        '/api/auth/userinfo', { credentials: 'include' })

    if (!res.ok || res.status !== 200) {
        throw new Error('Bad response')
    }

    return await res.json() as AuthResponse
}

export async function login(login: string, password: string) {
    const res = await fetch(
        '/api/auth/login',
        {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password }),
        },
    )

    if (!res.ok || res.status !== 200) {
        throw new Error('Bad response')
    }

    return await res.json() as AuthResponse
}

export async function logout() {
    const res = await fetch(
        '/api/auth/logout',
        {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
        },
    )

    if (!res.ok || res.status !== 200) {
        throw new Error('Bad response')
    }

    return await res.json() as AuthResponse
}

export async function register(login: string, password: string) {
    const res = await fetch(
        '/api/auth/register',
        {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password }),
        },
    )

    if (!res.ok || res.status !== 200) {
        throw new Error('Bad response')
    }

    return await res.json() as AuthResponse
}

// window.userInfo = userInfo
// window.login = login
// window.logout = logout
// window.register = register
