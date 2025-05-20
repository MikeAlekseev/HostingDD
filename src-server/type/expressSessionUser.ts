import type { MyUser } from './MyUser'

declare module 'express-session' {
    interface SessionData {
        user?: MyUser
    }
}
