import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlus, PlusCircle, Trash, X } from "lucide-react";
import { useForm, useFieldArray, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const quizSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    questions: z.array(
        z.object({
            text: z.string().min(5, "Question text must be at least 5 characters"),
            image: z.string().optional(),
            answers: z.array(
                z.object({
                    text: z.string().min(1, "Answer cannot be empty"),
                    isCorrect: z.boolean().default(false),
                })
            )
                .min(2, "At least two answers required")
                .max(5, "Maximum of five answers allowed")
        })
    )
});

type QuizFormData = z.infer<typeof quizSchema>;

export const DialogCreateQuiz____OLD: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { register, handleSubmit, control, reset, formState: { errors }, setError } = useForm<QuizFormData>({
        resolver: zodResolver(quizSchema),
        defaultValues: { title: "", questions: [{ text: "", answers: [{ text: "" }, { text: "" }] }] },
    });

    const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: "questions",
    });

    const onSubmit = async (data: QuizFormData) => {
        let hasErrors = false;

        // Проверка на отсутствие правильных ответов на уровне формы
        data.questions.forEach((question, qIndex) => {
            const correctAnswers = question.answers.filter((answer) => answer.isCorrect);
            // Если нет правильных ответов, ставим ошибку
            if (correctAnswers.length === 0) {
                setError(`questions.${qIndex}.answers`, { message: "At least one correct answer must be selected." });
                hasErrors = true;
            }
        });

        if (hasErrors) {
            toast({ title: "Error", description: "Please select at least one correct answer for each question.", variant: "destructive" });
        } else {
            try {
                console.log("Submitting Quiz:", data);
                toast({ title: "Quiz Created", description: "The quiz was successfully created." });
                setIsDialogOpen(false);
                reset();
            } catch {
                toast({ title: "Error", description: "An error occurred while creating the quiz.", variant: "destructive" });
            }
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create quiz</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1440px]">
                <DialogHeader>
                    <DialogTitle>Create Quiz</DialogTitle>
                    <DialogDescription>Fill in the details below to create a new quiz.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Quiz Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>
                    <ScrollArea className="h-[500px] p-4 border rounded-md">
                        <div className="flex flex-wrap gap-3.5">
                            {questionFields.map((question, qIndex) => (
                                <QuestionItem
                                    key={question.id}
                                    qIndex={qIndex}
                                    removeQuestion={removeQuestion}
                                    control={control}
                                    register={register}
                                    errors={errors}
                                    setError={setError}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                    <Button type="button" onClick={() => appendQuestion({ text: "", answers: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] })}>Add Question</Button>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create Quiz</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

interface QuestionItemProps {
    qIndex: number;
    removeQuestion: (index: number) => void;
    control: Control<QuizFormData>;
    register: UseFormRegister<QuizFormData>;
    errors: FieldErrors<QuizFormData>;
    setError: (name: string, error: { message: string }) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ qIndex, removeQuestion, control, register, errors, setError }) => {
    const { fields: answerFields, append: appendAnswer, remove: removeAnswer, update } = useFieldArray({
        control,
        name: `questions.${qIndex}.answers`,
    });

    const handleCorrectAnswerChange = (selectedIndex: number) => {
        const correctCount = answerFields.filter((a) => a.isCorrect).length;
        if (correctCount >= 1) {
            answerFields.forEach((answer, aIndex) => {
                update(aIndex, { ...answer, isCorrect: aIndex === selectedIndex });
            });
        }
    };

    return (
        <div className="border p-4 max-w-[328px] w-full rounded-lg space-y-2">
            <div className="flex items-center justify-between">
                <Label>Question {qIndex + 1}</Label>
                <Button className={qIndex === 0 ? "hidden" : "block"} type="button" variant="destructive" size="nano" onClick={() => removeQuestion(qIndex)}>
                    <X className="w-5 h-5 p-1" />
                </Button>
            </div>
            <Textarea {...register(`questions.${qIndex}.text`)} placeholder="Enter question text" />
            {errors.questions?.[qIndex]?.text && <p className="text-red-500">{errors.questions[qIndex].text?.message}</p>}
            <Label>Answers</Label>
            <div className="space-y-2">
                {answerFields.map((answer, aIndex) => (
                    <div className="flex flex-col" key={aIndex}>
                        <div key={answer.id} className="flex items-center gap-2">
                            <Input {...register(`questions.${qIndex}.answers.${aIndex}.text`)} placeholder={`Answer ${aIndex + 1}`} />
                            <input
                                type="radio"
                                name={`questions.${qIndex}.correctAnswer`}
                                checked={answer.isCorrect}
                                onChange={() => handleCorrectAnswerChange(aIndex)}
                                className="w-4 h-4"
                            />
                            {answerFields.length > 2 && (
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeAnswer(aIndex)}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                {errors.questions?.[qIndex]?.answers && <p className="text-red-500">{errors.questions[qIndex].answers?.message}</p>}
                {answerFields.length < 5 && (
                    <Button type="button" size="sm" onClick={() => appendAnswer({ text: "", isCorrect: false })}>
                        <CirclePlus className="size-6 p-1" /> Add answer
                    </Button>
                )}
            </div>
        </div>
    );
};
