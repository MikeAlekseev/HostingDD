import { createRoot } from 'react-dom/client'

import { filterNonNullable } from '@/utils'
import { App } from '@/App'

import './index.scss'

createRoot(document.getElementById('root')!).render(<App/>)

window.onload = function () {
    const dropOverlay = document.getElementById('dropOverlay')

    if (!dropOverlay) {
        return
    }

    function allowDrag(e: DragEvent) {
        e.preventDefault()
    }

    // 1
    window.addEventListener('dragenter', function(e: DragEvent) {
        if (e.dataTransfer?.types?.includes('Files') && window.dropHandler) {
            dropOverlay.style.display = 'block'
        }
    })

    // 2
    dropOverlay.addEventListener('dragenter', allowDrag)
    dropOverlay.addEventListener('dragover', allowDrag)

    // 3
    dropOverlay.addEventListener('dragleave', function() {
        dropOverlay.style.display = 'none'
    })

    // 4
    dropOverlay.addEventListener('drop', function (e) {
        e.preventDefault()
        dropOverlay.style.display = 'none'
    })

    dropOverlay.ondrop = function (e) {
        const { dataTransfer } = e

        if (!dataTransfer) {
            throw new Error('Oh, no!')
        }

        let files: File[] | undefined
        let text: string | undefined
        let html: string | undefined
        const { types, items } = dataTransfer

        if (types.includes('Files')) {
            const [firstItem] = items

            // @ts-expect-error Проверка на стандарты
            if (firstItem && (firstItem.webkitGetAsEntry || firstItem.getAsEntry)) {
                files = [...items].map((item) => {
                    const entry = item.webkitGetAsEntry()

                    if (entry && entry.isFile) {
                        return item.getAsFile()
                    }

                    return null
                }).filter(filterNonNullable)
            } else {
                files = [...dataTransfer.files]
            }
        } else if (types.includes('text/html')) {
            text = dataTransfer.getData('text/plain')
            html = dataTransfer.getData('text/html')
        } else if (types.includes('text/plain')) {
            text = dataTransfer.getData('text/plain')
        } else {
            console.error(`Unknown types: "${types.join('", "')}"`)
        }

        if (window.dropHandler) {
            window.dropHandler({ files, text, html })
        }
    }
}
