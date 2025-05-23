import { Router } from 'express'

import { getUser, addUser } from '@/services/user'

export function authRoute(router: Router) {
    router.get('/auth/userinfo', (req, res, next) => {
        (async () => {
            const { user } = req.session

            res.json({ user: user || null })
        })().catch(next)
    })

    router.post('/auth/login', (req, res, next) => {
        (async () => {
            const login = (req.body as { login: string }).login || ''
            const password = (req.body as { password: string }).password || ''

            const user = await getUser(login, password)

            if (user) {
                req.session.user = user
            }

            res.json({ user })
        })().catch(next)
    })

    router.post('/auth/register', (req, res, next) => {
        (async () => {
            const login = (req.body as { login: string }).login || ''
            const password = (req.body as { password: string }).password || ''

            const user = await addUser(login, password)

            if (user) {
                req.session.user = user

                res.json({ user })
            } else {
                res.json({ user: null, error: 'User exists' })
            }
        })().catch(next)
    })

    router.post('/auth/logout', (req, res, next) => {
        (async () => {
            req.session.destroy(function() {
                res.json({ user: null })
            })
        })().catch(next)
    })
}
