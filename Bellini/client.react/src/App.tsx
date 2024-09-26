import './assets/styles/App.css'
import { Route, Routes } from 'react-router-dom';
import {BasicLayout} from "./layouts/BasicLayout.tsx";
import {MainPage} from "./views/pages/MainPage.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {LoginPage} from "@/views/pages/LoginPage.tsx";
import {RegisterPage} from "@/views/pages/RegisterPage.tsx";
import {NotFoundPage} from "@/views/pages/NotFoundPage.tsx";
import {InternalServerErrorPage} from "@/views/pages/InternalServerErrorPage.tsx";
import {ProfilePage} from "@/views/pages/ProfilePage.tsx";
import {PrivateRoute} from "@/utils/routers/PrivateRoute.tsx";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Routes>
                    <Route path='/' element={<BasicLayout/>}>
                        <Route index element={<MainPage/>}/>
                        <Route path='login' element={<LoginPage/>}/>
                        <Route path='register' element={<RegisterPage/>}/>
                        <Route path='profile' element={<ProfilePage/>}/>
                        <Route element={<PrivateRoute/>}>
                            {/*<Route path='profile/edit' element={</>}/>*/}
                            {/*<Route path='profile/settings' element={</>}/>*/}
                            {/*<Route path='about' element={</AboutPage>}/>*/}
                            {/*<Route path='contacts' element={</ContactsPage>}/>*/}
                        </Route>
                    </Route>
                    <Route path="500" element={<InternalServerErrorPage/>}/>
                    <Route path="404" element={<NotFoundPage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </ThemeProvider>
        </>
    )
}

export default App
