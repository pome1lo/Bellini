import React, {useEffect, useState} from "react";
import {StartedGameDto} from "@/utils/interfaces/StartedGame.ts";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {useAuth} from "@/utils/context/authContext.tsx";
import {Progress} from "@/components/ui/progress";
import {HubConnectionBuilder} from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
import {Player} from "@/utils/interfaces/Player.ts";
import {Badge} from "@/components/ui/badge.tsx";

interface GameStartedPageProps {
    currentGame?: StartedGameDto;
}

export const GameStartedPage: React.FC<GameStartedPageProps> = ({currentGame}) => {
    const [connection, setConnection] = useState<any>(null);
    const [countdown, setCountdown] = useState(3);
    const [showQuestion, setShowQuestion] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [fadeIn, setFadeIn] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ questionId: number; answerId: number }[]>([]);
    const {user} = useAuth();

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7292/gameHub", {
                transport: signalR.HttpTransportType.ServerSentEvents,
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setShowQuestion(true);
            setTimeout(() => setFadeIn(true), 100);
        }
    }, [countdown]);

    useEffect(() => {
        if (connection) {
            connection.start().then(() => {
                console.log("Connected to SignalR hub");

                connection.invoke("JoinRunningGame", currentGame?.id.toString())
                    .then(() => {
                        console.log("Joined running game room");
                    })
                    .catch((error) => {
                        console.error("Error joining running game:", error);
                    });

                connection.on("NextQuestion", (nextQuestionIndex: number) => {
                    setCurrentQuestionIndex(nextQuestionIndex);
                    setSelectedAnswer(null);
                    setFadeIn(true);
                });

                connection.on("GameEnded", () => {
                    alert("The game has ended.");
                    // Логика завершения игры на клиенте
                });

                connection.on("PlayersList", (playerList: Player[]) => {
                    // Логика для отображения списка игроков
                    console.log("Players in the game:", playerList);
                });
            }).catch(error => {
                console.error("Connection failed:", error);
            });

            connection.onclose(async () => {
                console.warn("Connection closed, attempting to reconnect...");
                try {
                    await connection.start();
                    console.log("Reconnected to the SignalR hub");
                } catch (error) {
                    console.error("Reconnection failed:", error);
                }
            });
        }
    }, [connection]);

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer === null) {
            setSelectedAnswer(index);

            const updatedAnswers = [...userAnswers];
            updatedAnswers[currentQuestionIndex] = {
                questionId: currentGame!.questions[currentQuestionIndex].id,
                answerId: currentGame!.questions[currentQuestionIndex].answerOptions[index].id,
            };
            setUserAnswers(updatedAnswers);
        }
    };

    const handleNextQuestion = async () => {
        if (connection && connection.state === "Connected") {
            try {
                await connection.invoke("NextQuestion", currentGame?.id.toString(), currentQuestionIndex + 1);
            } catch (error) {
                console.error("Error invoking NextQuestion:", error);
            }
        } else {
            console.warn("Cannot send data, connection is not established");
            if (connection.state === "Disconnected") {
                try {
                    await connection.start();
                    console.log("Reconnected to the server");
                    await connection.invoke("NextQuestion", currentGame!.id, currentQuestionIndex + 1);
                } catch (error) {
                    console.error("Failed to reconnect and send NextQuestion:", error);
                }
            }
        }
    };

    const handleEndGame = () => {
        if (connection) {
            connection.invoke("EndGame", currentGame!.id);
        }
    };

    const totalQuestions = currentGame ? currentGame.questions.length : 1;
    const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <>
            {currentGame ? (
                <>
                    {!showQuestion ? (
                        <div className="flex justify-center items-center h-screen">
                            <h1 className="animate-pulse text-[35rem] text-roboto">{countdown}</h1>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
                            <div className="absolute flex flex-wrap justify-center items-center top-20 sm:w-1/2 w-[250px]">
                                <Progress value={progressValue} className="h-2 mb-5"/>
                                {currentQuestionIndex + 1} / {currentGame.questions.length}
                                {currentGame.hostId == user.id && currentQuestionIndex < currentGame.questions.length - 1 ? (
                                    <div className="flex">
                                        <Button variant="default" className="ms-5 me-5" size="sm" onClick={handleNextQuestion}>
                                            Next question
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={handleEndGame}>
                                            End Game
                                        </Button>
                                    </div>
                                ) : null}
                            </div>


                            <Card
                                className={`w-full max-w-2xl border-0 bg-transparent transition-opacity duration-1000 ${
                                    fadeIn ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <CardHeader>
                                    <CardTitle>
                                        <h1 className="text-center mb-10">
                                            {currentGame.questions[currentQuestionIndex].text}
                                        </h1>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap sm:flex-row flex-col">
                                    {currentGame.questions[currentQuestionIndex].answerOptions.map((option, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center w-full sm:w-1/2 transition-opacity duration-1000 ${
                                                fadeIn ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        >
                                            <Button
                                                variant={selectedAnswer === index ? "default" : "outline"}
                                                onClick={() => handleAnswerSelect(index)}
                                                disabled={selectedAnswer !== null}
                                                className={`m-2 sm:m-3 w-full text-md ${option.isCorrect && currentGame.hostId == user.id ? "border-green-900 animate-bounce" : ""}`}
                                            >
                                                {option.text}
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </>
            ) : null}
        </>
    );
};
