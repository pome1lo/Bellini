import React, {useEffect, useState} from "react";
import {StartedGameDto} from "@/utils/interfaces/StartedGame.ts";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";

interface GameStartedPageProps {
    currentGame?: StartedGameDto;
}

export const GameStartedPage: React.FC<GameStartedPageProps> = ({currentGame}) => {
    const [countdown, setCountdown] = useState(3);
    const [showQuestion, setShowQuestion] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
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

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer === null) {
            setSelectedAnswer(index);
        }
    };

    return (
        <>
            {currentGame ? (
                <>
                    {!showQuestion ? (
                        <div className="flex justify-center items-center h-screen">
                            <h1 className="animate-pulse text-[35rem] text-roboto">{countdown}</h1>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-screen space-y-6">
                            <Card
                                className={`w-full max-w-2xl border-0 bg-transparent transition-opacity duration-1000 ${
                                    fadeIn ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <CardHeader>
                                    <CardTitle>
                                        <h1 className="text-center mb-10">{currentGame.questions[0].text}</h1>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap  sm:flex-row flex-col">
                                    {currentGame.questions[0].answerOptions.map((option, index) => (
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
                                                className="m-2 sm:m-3 w-full text-md"
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
            ) : (
                <></>
            )}
        </>
    );
};
