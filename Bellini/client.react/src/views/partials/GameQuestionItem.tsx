import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";

interface Answer {
    text: string;
    isCorrect: boolean;
}

interface GameQuestionItemProps {
    question: string;
    answers: Answer[];
}

export const GameQuestionItem: React.FC<GameQuestionItemProps> = ({ question, answers }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">{question}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{question}</h4>
                    </div>
                    <div className="grid gap-2">
                        {answers.map((answer, index) => (
                            <div key={index} className="grid grid-cols-3 items-center gap-4">
                                <Label>{index + 1}. {answer.text}</Label>
                                <span className={`col-span-2 text-sm ${answer.isCorrect ? "text-green-600" : "text-red-600"}`}>
                                    {answer.isCorrect ? "Correct" : "Incorrect"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
