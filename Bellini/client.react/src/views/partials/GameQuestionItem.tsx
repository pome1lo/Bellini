import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Trash2} from "lucide-react";
import {
    AlertDialog, AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {AlertDialogTrigger} from "@/components/ui/alert-dialog.tsx";

interface Answer {
    text: string;
    isCorrect: boolean;
}

interface GameQuestionItemProps {
    id: number;
    index: number;
    question: string;
    answers: Answer[];
    dropItem: (arg: number) => void;
}

export const GameQuestionItem: React.FC<GameQuestionItemProps> = ({id, index, question, answers, dropItem}) => {
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
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete the question? This question will disappear from the game.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => dropItem(id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <PopoverContent className="w-80 p-4">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{question}</h4>
                    </div>
                    <div className="grid gap-2">
                        {answers.map((answer, index) => (
                            <div key={index} className="grid grid-cols-3 items-center gap-4">
                                <Label>{index + 1}. {answer.text}</Label>
                                {answer.isCorrect ?
                                    <Badge variant="secondary" className="col-span-2 w-[62px] bg-green-700 hover:bg-green-900">Correct</Badge>
                                    :
                                    <Badge variant="destructive" className="col-span-2 w-[72px]">Incorrect</Badge>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
