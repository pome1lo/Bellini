import './assets/styles/App.css'
import {Route, Routes, useNavigate} from 'react-router-dom';
import {BasicLayout} from "@/utils/layouts/BasicLayout.tsx";
import {MainPage} from "@/pages/MainPage.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {LoginPage} from "@/pages/LoginPage.tsx";
import {RegisterPage} from "@/pages/RegisterPage.tsx";
import {NotFoundPage} from "@/pages/NotFoundPage.tsx";
import {InternalServerErrorPage} from "@/pages/InternalServerErrorPage.tsx";
import {SettingsPage} from "@/pages/SettingsPage.tsx";
import {PrivateRoute} from "@/utils/routers/PrivateRoute.tsx";
import {ContactsPage} from "@/pages/ContactsPage.tsx";
import {AboutPage} from "@/pages/AboutPage.tsx";
import {ProfilePage} from "@/pages/ProfilePage.tsx";
import {GameListPage} from "@/pages/GameListPage.tsx";
import {useEffect, useState} from "react";
import AOS from 'aos';
import {Toaster} from "@/components/ui/toaster.tsx";
import {AuthProvider} from "@/utils/context/authContext.tsx";
import {GameRoomPage} from "@/pages/GameRoomPage.tsx";
import {GameStartedPage} from "@/pages/GameStartedPage.tsx";
import {StartedGame} from "@/utils/interfaces/StartedGame.ts";
import {GameLayout} from "@/utils/layouts/GameLayout.tsx";
import {FinishedGame} from "@/utils/interfaces/FinishedGame.ts";
import {GameFinishedPage} from "@/pages/GameFinishedPage.tsx";
import {QuizzesListPage} from "@/pages/QuizzesListPage.tsx";
import {QuizRoomPage} from "@/pages/QuizRoomPage.tsx";
import {ForgotPasswordPage} from "@/pages/ForgotPasswordPage.tsx";
import {QuizFinishedPage} from "@/pages/QuizFinishedPage.tsx";
import {QuizStartedPage} from "@/pages/QuizStartedPage.tsx";
import {StartedQuiz} from "@/utils/interfaces/StartedQuiz.ts";
import {Quiz} from "@/utils/interfaces/Quiz.ts";
import {NotifiactionsPage} from '@/pages/NotifiactionsPage.tsx';
import { AdminPage } from '@/pages/AdminPage.tsx';
import {EditQuizPage} from "@/pages/EditQuizPage.tsx";

function App() {
    const [gameStarted, setGameStarted] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const [currentStartedGame, setCurrentStartedGame] = useState<StartedGame>();
    const [currentStartedQuiz, setCurrentStartedQuiz] = useState<StartedQuiz>();
    const [currentFinishedGame, setCurrentFinishedGame] = useState<FinishedGame>();
    const [currentFinishedQuiz, setCurrentFinishedQuiz] = useState<Quiz>();
    const navigate = useNavigate();

    useEffect(() => AOS.init, []);

    const handleStart = (game: StartedGame, id: string) => {
        if(game.players.some(player => player.userId.toString() == id || game.hostId.toString() == id)) {
            setCurrentStartedGame(game);
            setGameStarted(true);
        }
        else {
            navigate("/games");
        }
    };

    const handleFinish = (game: FinishedGame) => {
        setCurrentFinishedGame(game);
        setGameFinished(true);
        setGameStarted(false);
    };

    const handleQuizStart = (quiz: StartedQuiz) => {
        setCurrentStartedQuiz(quiz);
        setQuizStarted(true);
    };

    const handleQuizFinish = (quiz: Quiz) => {
        setCurrentFinishedQuiz(quiz);
        setQuizFinished(true);
        setQuizStarted(false);
    };


    return (
        <>
            <AuthProvider>
                <Toaster/>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <Routes>
                        <Route path='/' element={<BasicLayout/>}>
                            <Route path='admin' element={<AdminPage/>}/>
                            <Route path='admin/drafts' element={<AdminPage/>}/>
                            <Route path='admin/drafts/:draftId' element={<EditQuizPage/>}/>
                            <Route path='settings' element={<SettingsPage/>}/>
                            <Route path='contacts' element={<ContactsPage/>}/>
                            <Route path='about' element={<AboutPage/>}/>
                            <Route path='profile/:id' element={<ProfilePage/>}/>
                            <Route path='games' element={<GameListPage/>}/>
                            <Route path='games/:tabName' element={<GameListPage/>}/>
                            <Route path='quizzes' element={<QuizzesListPage/>}/>
                            <Route path='quizzes/:tabName' element={<QuizzesListPage/>}/>
                            <Route path='notifications' element={<NotifiactionsPage/>}/>

                            <Route element={<PrivateRoute/>}>

                            </Route>
                        </Route>
                        <Route path='/' element={<GameLayout/>}>
                            <Route index element={<MainPage/>}/>
                            <Route path='login' element={<LoginPage/>}/>
                            <Route path='register' element={<RegisterPage/>}/>
                            <Route path='forgot-password' element={<ForgotPasswordPage/>}/>

                            <Route path='games/room/:id' element={
                                gameFinished ? (
                                    currentFinishedGame ? (
                                        <GameFinishedPage currentGame={currentFinishedGame}/>
                                    ) : (
                                        <div> Loading... GameFinishedPage</div>  //todo add Skeleton
                                    )
                                ) : gameStarted ? (
                                    currentStartedGame ? (
                                        <GameStartedPage currentGame={currentStartedGame} onFinish={handleFinish}/>
                                    ) : (
                                        <div>Loading... GameStartedPage</div>  //todo add Skeleton
                                    )
                                ) : (
                                    <GameRoomPage onStart={handleStart} isFinished={setGameFinished}
                                                  onFinish={handleFinish}/>
                                )
                            }/>

                            <Route path='quizzes/room/:id' element={
                                quizFinished ? (
                                    currentFinishedQuiz ? (
                                        <QuizFinishedPage currentQuiz={currentFinishedQuiz}/>
                                    ) : (
                                        <div> Loading... QuizFinishedPage</div>  //todo add Skeleton
                                    )
                                ) : quizStarted ? (
                                    currentStartedQuiz ? (
                                        <QuizStartedPage currentQuiz={currentStartedQuiz}
                                                         onQuizFinish={handleQuizFinish}/>
                                    ) : (
                                        <div>Loading... QuizStartedPage</div>  //todo add Skeleton
                                    )
                                ) : (
                                    <QuizRoomPage onQuizStart={handleQuizStart} isQuizFinished={setQuizFinished}
                                                  onQuizFinish={handleQuizFinish}/>
                                )
                            }/>

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
