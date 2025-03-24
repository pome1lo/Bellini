import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Trash2} from "lucide-react";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {AlertDialogTrigger} from "@/components/ui/alert-dialog.tsx";
import {Answer} from "@/utils/interfaces/QuizQuestion.ts";


interface GameQuestionItemProps {
    id: number;
    index: number;
    question: string;
    questionImageUrl: string;
    answers: Answer[];
    dropItem: (arg: number) => void;
}

export const GameQuestionItem: React.FC<GameQuestionItemProps> = ({id, index, question, answers, dropItem, questionImageUrl}) => {
    return (
        <Popover>
            <div className="flex">
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        {index}. {question}
                    </Button>
                </PopoverTrigger>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="ms-2 hover:text-red-500" >
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Вы уверены, что хотите удалить этот вопрос? Этот вопрос исчезнет из игры.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => dropItem(id)}>Продолжить</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <PopoverContent className="w-80 p-4">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none text-wrap">{question}</h4>
                    </div>
                    <div className="grid gap-2">
                        {answers.map((answer, index) => (
                            <div key={index} className="flex items-center gap-4">
                                {answer.isCorrect ?
                                    <Badge variant="secondary" className="w-[30px] bg-green-700 hover:bg-green-900">{index + 1}.</Badge>
                                    :
                                    <Badge variant="destructive" className="w-[30px]">{index + 1}.</Badge>
                                }
                                {answer.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex">
                        Картинка: {questionImageUrl ? <></> : <p className="ms-2"> ❌</p>}
                    </div>
                    <div>
                        {questionImageUrl ?
                            <>
                                <img className="aspect-square w-full rounded-md object-cover" alt=""
                                    height="300" width="300" src={questionImageUrl}
                                />
                            </> : <></>
                        }
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
