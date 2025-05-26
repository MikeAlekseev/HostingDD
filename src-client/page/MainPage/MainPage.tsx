import { useCallback, useEffect, useRef, useState } from 'react'

import { plural } from '@/utils'
import { createVault } from '@/api/vault'
import { uploadFile } from '@/api/file'

import '../../MainPage.css'

import { CopyButton } from './CopyButton'

type FileList = {
    id: string
    name: string
    uploaded: boolean
    file: File
}

export function MainPage() {
    const mountedRef = useRef(true)
    const vaultIdRef = useRef<undefined | string>(undefined)
    const [fileList, setFileList] = useState<FileList[]>([])

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

        const fileListToUpload = files.map((file: File) => ({
            id: crypto.randomUUID(),
            name: file.name,
            uploaded: false,
            file,
        }) as FileList)

        setFileList((prev) => ([...prev, ...fileListToUpload]))

        for (const fileToUpload of fileListToUpload) {
            try {
                await uploadFile(vaultIdRef.current, fileToUpload.file)

                if (mountedRef.current) {
                    setFileList((prev) => prev.map((item) => {
                        if (item.id === fileToUpload.id) {
                            return ({ ...item, uploaded: true })
                        } else {
                            return item
                        }
                    }))
                }
            } catch (error) {
                console.error(error)
                alert(`Ошибка загрузки файла ${fileToUpload.name}`)
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

    const uploadingFilesCount = fileList.filter(({ uploaded }) => !uploaded).length

    return (
        <div className="main r">
            <div className="main_left"></div>
            <div className="main_right">
                <div className="main_button">
                    <label htmlFor="fileUpload" className="button">
                        СЮДА ТАЩИТЬ ФАЙЛЫ <br/>
                        <input
                            id="fileUpload"
                            type="file"
                            multiple
                            value=""
                            onChange={(e) => {
                                const files = e.target.files ? [...e.target.files] : null

                                addFiles(files)
                            }}
                        /> <br/>
                    </label>

                    {
                        uploadingFilesCount > 0
                            ? (
                                <span>Загружается {plural(uploadingFilesCount, 'файл', 'файла', 'файлов')}</span>
                            )
                            : null
                    } <br/>

                    {
                        fileList.length
                            ? (
                                <ul>
                                    {
                                        fileList.map(({ id, name, uploaded }) => (
                                            uploaded
                                                ? <li key={id}><span style={{ color: 'green' }}>✔</span>{name}</li>
                                                : <li key={id} style={{ color: 'grey', fontStyle: 'italic' }}>&nbsp;&nbsp;{name}</li>
                                        ))
                                    }
                                </ul>
                            )
                            : null
                    }
                </div>
                <div>
                    <CopyButton mountedRef={mountedRef} vaultIdRef={vaultIdRef}/>
                </div>
            </div>
        </div>
    )
}
