declare global {
    interface Window {
        dropHandler?: (data: {
            files?: File[] | undefined,
            text?: string | undefined,
            html?: string | undefined,
        }) => void

        filesToAttach?: File[] | undefined | null,
    }
}

export {}
