import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { UserContextWrapper } from './context'
import { Layout } from './page/Layout'
import { MainPage } from './page/MainPage'
import { VaultPage } from './page/VaultPage'
import { MyVaultsPage } from './page/MyVaultsPage'
import { NotFoundPage } from './page/NotFoundPage'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <UserContextWrapper>
                    <Routes>
                        <Route element={<Layout/>}>
                            <Route index element={<MainPage/>}/>
                            <Route path="voultes" element={<MyVaultsPage/>}/>
                            <Route path="vault/:vaultId" element={<VaultPage/>}/>

                            <Route path="*" element={<NotFoundPage/>}/>
                        </Route>
                    </Routes>
                </UserContextWrapper>
            </BrowserRouter>
        </QueryClientProvider>
    )
}
