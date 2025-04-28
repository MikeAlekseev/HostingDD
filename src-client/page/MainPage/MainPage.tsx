import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { plural } from '@/utils'
import { createVault } from '@/api/vault'
import { uploadFile } from '@/api/file'

import '../../../MainPage.css'

export function MainPage() {
    const mountedRef = useRef(true)
    const vaultIdRef = useRef<undefined | string>(undefined)
    const [filesLoadingCount, setFilesLoadingCount] = useState(0)

    useEffect(() => {
        return () => {
            mountedRef.current = false
        }
    }, [])

    const addFiles = useCallback(async (files: File[] | undefined | null) => {
        if (!files || !files.length) {
            return
        }

        if (!vaultIdRef.current) {
            const { vaultId } = await createVault()

            vaultIdRef.current = vaultId
        }

        setFilesLoadingCount((prevState) => prevState + files.length)

        for (const file of files) {
            try {
                const uploadedFile = await uploadFile(vaultIdRef.current, file)

                console.log('Загружено что-то! ', uploadedFile)

                if (mountedRef.current) {
                    console.log('Загружено', file)

                    // runInAction(() => {
                    //     documentPageStore.document.files.push(uploadedFile)
                    // })
                }
            } catch (error) {
                console.error(error)
                alert(`Ошибка загрузки файла ${file.name}`)
            } finally {
                if (mountedRef.current) {
                    setFilesLoadingCount((prevState) => prevState - 1)
                }
            }
        }
    }, [mountedRef])

    useEffect(() => {
        window.dropHandler = ({ files }) => {
            addFiles(files)
        }

        return () => {
            window.dropHandler = undefined
        }
    }, [addFiles])

    return (
        <div className="top div-bottom-borde">
            <h1>MainPage</h1>
            <div className="header">
                <div>
                    ТУТ КАКАЯ ТА НАДПИСЬ
                    <Link to="/vault/3ca71b8c-1a94-4b57-9998-ffee986220ac">Test</Link>
                </div>
                <div className="login">
                    Login / Registration
                </div>
            </div>
            <div className="main r">
                <div className="main_left"></div>
                <div className="main_right">
                    <div className="main_button">
                        <label htmlFor="fileUpload" className="button">
                            СЮДА ТАЩИТЬ ФАЙЛЫ
                            <input
                                id="fileUpload"
                                type="file"
                                multiple
                                value=""
                                onChange={(e) => {
                                    const files = e.target.files ? [...e.target.files] : null

                                    addFiles(files)
                                }}
                            />
                        </label>

                        {
                            filesLoadingCount > 0
                                ? (
                                    <span>Загружается {plural(filesLoadingCount, 'файл', 'файла', 'файлов')}</span>
                                )
                                : null
                        }
                    </div>
                </div>
            </div>

        </div>

    )
}
