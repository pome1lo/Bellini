import './assets/styles/App.css'
import { Route, Routes } from 'react-router-dom';
import {BasicLayout} from "@/utils/layouts/BasicLayout.tsx";
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
import {useEffect, useState} from "react";
import AOS from 'aos';
import {Toaster} from "@/components/ui/toaster.tsx";
import {AuthProvider} from "@/utils/context/authContext.tsx";
import {GameRoomPage} from "@/views/pages/GameRoomPage.tsx";
import {GameStartedPage} from "@/views/pages/GameStartedPage.tsx";
import {StartedGame} from "@/utils/interfaces/StartedGame.ts";
import {GameLayout} from "@/utils/layouts/GameLayout.tsx";
import {FinishedGame} from "@/utils/interfaces/FinishedGame.ts";
import {GameFinishedPage} from "@/views/pages/GameFinishedPage.tsx";
import {QuizzesListPage} from "@/views/pages/QuizzesListPage.tsx";
import {QuizRoomPage} from "@/views/pages/QuizRoomPage.tsx";

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [currentStartedGame, setCurrentStartedGame] = useState<StartedGame>();
    const [currentFinishedGame, setCurrentFinishedGame] = useState<FinishedGame>();

    useEffect(() => AOS.init , []);

    const handleStart = (game: StartedGame) => {
        setCurrentStartedGame(game);
        setGameStarted(true);
    };

    const handleFinish = (game: FinishedGame) => {
        setCurrentFinishedGame(game);
        setGameFinished(true);
        setGameStarted(false);
    };



    return (
        <>
            <AuthProvider>
                <Toaster />
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <Routes>
                        <Route path='/' element={<BasicLayout/>}>
                            <Route path='settings' element={<SettingsPage/>}/>
                            <Route path='contacts' element={<ContactsPage/>}/>
                            <Route path='about' element={<AboutPage/>}/>
                            <Route path='support' element={<SupportPage/>}/>
                            <Route path='profile/:id' element={<ProfilePage/>}/>

                            <Route path='games' element={<GameListPage/>}/>
                            <Route path='games/:tabName' element={<GameListPage/>}/>

                            <Route path='quizzes' element={<QuizzesListPage/>}/>

                            <Route element={<PrivateRoute/>}>

                            </Route>
                        </Route>
                        <Route path='/' element={<GameLayout/>}>
                            <Route index element={<MainPage/>}/>
                            <Route path='login' element={<LoginPage/>}/>
                            <Route path='register' element={<RegisterPage/>}/>

                            <Route path='quizzes/:id' element={<QuizRoomPage/>}/>


                            <Route path='games/:id' element={
                                gameFinished ? (
                                    currentFinishedGame ? (
                                        <GameFinishedPage currentGame={currentFinishedGame} />
                                    ) : (
                                        <div> Loading... GameFinishedPage</div>  //todo add Skeleton
                                    )
                                ) : gameStarted ? (
                                    currentStartedGame ? (
                                        <GameStartedPage currentGame={currentStartedGame} onFinish={handleFinish} />
                                    ) : (
                                        <div>Loading... GameStartedPage</div>  //todo add Skeleton
                                    )
                                ) : (
                                    <GameRoomPage onStart={handleStart} isFinished={setGameFinished} onFinish={handleFinish} />
                                )
                            }
                            />
                        </Route>
                        <Route path="500" element={<InternalServerErrorPage/>}/>
                        <Route path="404" element={<NotFoundPage/>}/>
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </ThemeProvider>
            </AuthProvider>
        </>
    )
}

export default App
