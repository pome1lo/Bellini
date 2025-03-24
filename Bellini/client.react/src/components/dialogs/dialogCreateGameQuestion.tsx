import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PlusCircle} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import React, {useState} from "react";
import {toast} from "@/components/ui/use-toast.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {authFetch} from "@/utils/fetchs/authFetch.ts";

interface DialogCreateQuestionProps {
    currentGameId: string;
    isQuestionCreated: boolean;
    setIsQuestionCreated: (arg: boolean) => void;
}

export const DialogCreateGameQuestion: React.FC<DialogCreateQuestionProps> = ({currentGameId, setIsQuestionCreated, isQuestionCreated}) => {
    const {user, getAccessToken, logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const createQuestionSchema = z.object({
        gameId: z.number(),
        text: z.string().min(5, "Длина вопроса должна составлять не менее 5 символов."),
        questionImage: z.any().optional(),
        answers: z.array(
            z.object({
                text: z.string().min(1, "Требуется текст ответа."),
                isCorrect: z.boolean(),
            })
        ).length(4, "Вы должны предоставить ровно 4 варианта ответа.")
            .refine(answers => answers.some(answer => answer.isCorrect), {
                message: "Вы должны выбрать один правильный ответ.",
                path: ["answers"],
            }),
    });

    type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
        watch,
        setValue,
    } = useForm<CreateQuestionFormData>({
        resolver: zodResolver(createQuestionSchema),
        defaultValues: {
            gameId: parseInt(currentGameId),
            text: "",
            answers: [
                {text: "", isCorrect: false},
                {text: "", isCorrect: false},
                {text: "", isCorrect: false},
                {text: "", isCorrect: false},
            ],
        },
    });

    const answers = watch("answers") || [];

    const onSubmit = async (data: CreateQuestionFormData) => {

        const formData = new FormData();

        formData.append("Text", data.text || "");
        formData.append("GameId", data.gameId.toString() || "");
        data.answers.forEach((answer, index) => {
            formData.append(`Answers[${index}].Text`, answer.text);
            formData.append(`Answers[${index}].IsCorrect`, answer.isCorrect.toString());
        });
        if (data.questionImage && data.questionImage[0]) {
            formData.append("image", data.questionImage[0]);
        }

        try {
            if (!isAuthenticated || !user) {
                navigate("/login");
                return;
            }
            const response = await authFetch("/questions/game", getAccessToken, logout, {
                method: "POST",
                body: formData,
            });

            const responseData = await response.json();

            if (response.ok) {
                toast({title: "Вопрос создан", description: "Вопрос успешно создан."});
                setIsDialogOpen(false);
                setIsQuestionCreated(!isQuestionCreated);
                reset();
            } else {
                toast({
                    title: "Ошибка",
                    description: responseData.message || "Возникла ошибка.",
                    variant: "destructive",
                });
            }
        } catch (ex) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast({title: "Ошибка", description: ex.message || "Возникла ошибка.", variant: "destructive"});
        }
    };

    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (open) {
            reset();
        }
    };

    const handleCorrectAnswerChange = (index: number) => {
        answers.forEach((_, i) => {
            setValue(`answers.${i}.isCorrect`, i === index);
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5"/>
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Создать вопрос</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Создать вопрос</DialogTitle>
                    <DialogDescription>
                        Введите данные, чтобы создать новый вопрос с 4 вариантами ответов. Один ответ должен быть правильным.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="questionText" className="text-right">Вопрос</Label>
                            <Input
                                id="questionText"
                                {...register("text")}
                                className="col-span-3"
                            />
                            {errors.text && <p className="col-span-4 text-red-500">{errors.text.message}</p>}
                        </div>

                        {answers.map((_, index) => (
                            <div key={index} className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`answerText${index}`} className="text-right">{index + 1}. Ответ</Label>
                                <Input
                                    id={`answerText${index}`}
                                    {...register(`answers.${index}.text`)}
                                    className="col-span-2"
                                />
                                <RadioGroup
                                    value={answers[index].isCorrect ? "true" : "false"}
                                    onValueChange={() => handleCorrectAnswerChange(index)}
                                    className="flex items-center space-x-2"
                                >
                                    <Label htmlFor={`correctAnswer${index}`}>Correct: </Label>
                                    <RadioGroupItem value="true" id={`correctAnswer${index}`}/>
                                </RadioGroup>
                                {errors.answers?.[index]?.text && (
                                    <p className="col-span-4 text-red-500">{errors.answers[index]?.text?.message}</p>
                                )}
                            </div>
                        ))}

                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="profileImage">Картинка</Label>
                            <Input id="profileImage" type="file" {...register("questionImage")} />
                        </div>
                    </div>

                    {errors.answers && (
                        <p className="text-red-500">{errors.answers[0]?.isCorrect ? errors.answers[0].isCorrect.message : "You must select one correct answer."}</p>
                    )}

                    <DialogFooter>
                    <DialogClose asChild>
                            <Button variant="ghost">Отмена</Button>
                        </DialogClose>
                        <Button type="submit">Создать вопрос</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
