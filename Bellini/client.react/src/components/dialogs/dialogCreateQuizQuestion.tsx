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
    currentQuizId: string;
    isQuestionCreated: boolean;
    setIsQuestionCreated: (arg: boolean) => void;
}

export const DialogCreateQuizQuestion: React.FC<DialogCreateQuestionProps> = ({currentQuizId, setIsQuestionCreated, isQuestionCreated}) => {
    const {user, getAccessToken, logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const createQuestionSchema = z.object({
        quizId: z.number(),
        text: z.string().min(5, "Question must be at least 5 characters long."),
        questionImage: z.any().optional(),
        answers: z.array(
            z.object({
                text: z.string().min(1, "Answer text is required."),
                isCorrect: z.boolean(),
            })
        ).length(4, "You must provide exactly 4 answer options.")
            .refine(answers => answers.some(answer => answer.isCorrect), {
                message: "You must select one correct answer.",
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
            quizId: parseInt(currentQuizId),
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
        formData.append("QuizId", data.quizId.toString() || "");
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
            const response = await authFetch("/questions/quiz", getAccessToken, logout, {
                method: "POST",
                body: formData,
            });

            const responseData = await response.json();

            if (response.ok) {
                toast({title: "Question Created", description: "The question was successfully created."});
                setIsDialogOpen(false);
                setIsQuestionCreated(!isQuestionCreated);
                reset();
            } else {
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive",
                });
            }
        } catch (ex) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast({title: "Error", description: ex.message || "An unexpected error occurred.", variant: "destructive"});
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
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create question</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create question</DialogTitle>
                    <DialogDescription>
                        Enter the data to create a new question with 4 answer options. One answer must be correct.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="questionText" className="text-right">Question</Label>
                            <Input
                                id="questionText"
                                {...register("text")}
                                className="col-span-3"
                            />
                            {errors.text && <p className="col-span-4 text-red-500">{errors.text.message}</p>}
                        </div>

                        {answers.map((_, index) => (
                            <div key={index} className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`answerText${index}`} className="text-right">{index + 1}. Answer</Label>
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
                            <Label htmlFor="profileImage">Image</Label>
                            <Input id="profileImage" type="file" {...register("questionImage")} />
                        </div>
                    </div>

                    {errors.answers && (
                        <p className="text-red-500">{errors.answers[0]?.isCorrect ? errors.answers[0].isCorrect.message : "You must select one correct answer."}</p>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create question</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
