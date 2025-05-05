import { useCallback, useState, MutableRefObject } from 'react'

export function CopyButton({
    mountedRef,
    vaultIdRef,
}: {
    mountedRef: MutableRefObject<boolean>,
    vaultIdRef: MutableRefObject<string | undefined>,
}) {
    const [copyedTimer, setCopiedTimer] = useState<number | null>(null)

    const copyToClipboard = useCallback(() => {
        if (vaultIdRef.current) {
            navigator.clipboard.writeText(`${document.location.origin}/vault/${vaultIdRef.current}`)
                .then(() => {
                    const timer = setTimeout(() => {
                        if (mountedRef.current) {
                            setCopiedTimer(null)
                        }
                    }, 3000)

                    if (copyedTimer) {
                        clearTimeout(copyedTimer)
                    }

                    setCopiedTimer(timer)
                })
        }
    }, [copyedTimer, vaultIdRef, mountedRef])

    return (
        <div>
            {
                vaultIdRef.current
                    ? <button type="button" onClick={copyToClipboard}>Скопировать ссылку на файлы</button>
                    : null
            }
            {
                copyedTimer
                    ? (
                        <span><span style={{ color: 'green' }}>✔</span> Ссылка скопирована</span>
                    )
                    : null
            }
        </div>
    )
}
