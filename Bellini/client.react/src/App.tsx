import './assets/styles/App.css'
import { Route, Routes } from 'react-router-dom';
import {BasicLayout} from "./layouts/BasicLayout.tsx";
import {MainPage} from "./views/pages/MainPage.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {LoginPage} from "@/views/pages/LoginPage.tsx";
import {RegisterPage} from "@/views/pages/RegisterPage.tsx";
import {NotFoundPage} from "@/views/pages/NotFoundPage.tsx";
import {InternalServerErrorPage} from "@/views/pages/InternalServerErrorPage.tsx";
import {SettingsPage} from "@/views/pages/SettingsPage.tsx";
import {PrivateRoute} from "@/utils/routers/PrivateRoute.tsx";
import {ContactsPage} from "@/views/pages/ContactsPage.tsx";
import {AboutPage} from "@/views/pages/AboutPage.tsx";
import {ProfilePage} from "@/views/pages/ProfilePage.tsx";
import {SupportPage} from "@/views/pages/SupportPage.tsx";
import {GameListPage} from "@/views/pages/GameListPage.tsx";
import {useEffect} from "react";
import AOS from 'aos';
import {Toaster} from "@/components/ui/toaster.tsx";

function App() {
    useEffect(() => AOS.init , []);

    return (
        <>
            <Toaster />
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Routes>
                    <Route path='/' element={<BasicLayout/>}>
                        <Route index element={<MainPage/>}/>
                        <Route path='login' element={<LoginPage/>}/>
                        <Route path='register' element={<RegisterPage/>}/>

                        <Route path='settings' element={<SettingsPage/>}/>
                        <Route path='profile' element={<ProfilePage/>}/>
                        <Route path='contacts' element={<ContactsPage/>}/>
                        <Route path='about' element={<AboutPage/>}/>
                        <Route path='support' element={<SupportPage/>}/>
                        <Route path='games' element={<GameListPage/>}/>

                        <Route element={<PrivateRoute/>}>

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
