import { defineConfig } from 'tsup'

// eslint-disable-next-line import/no-default-export,no-restricted-exports
export default defineConfig({
    entry: {
        'index': 'src-server/index.ts',
    },
    outDir: 'dist/server',
    tsconfig: 'tsconfig.node.json',
    format: 'esm',
    external: ['vite'],
})
