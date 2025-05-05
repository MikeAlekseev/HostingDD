import cron from 'node-cron'

import { cleanOldFiles } from './files'

export function startCron() {
    const cleanTask = cron.schedule('0 0 * * *', () => {
        cleanOldFiles().catch(console.error)
    })

    return () => {
        cleanTask.stop()
    }
}
