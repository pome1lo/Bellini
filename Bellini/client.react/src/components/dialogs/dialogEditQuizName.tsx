import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {toast} from "@/components/ui/use-toast.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {authFetch} from "@/utils/fetchs/authFetch.ts";
import {Quiz} from "@/utils/interfaces/Quiz.ts";
import {Pencil} from "lucide-react";

const editQuizSchema = z.object({
    gameName: z.string()
        .min(2, "Quiz name must be at least 2 characters")
        .max(30, "Quiz name must be at most 30 characters")
        .regex(/^[A-Za-z\s]+$/, "Quiz name can only contain letters and spaces")
        .optional(),
    gameCoverImageUrl: z.any().optional(),
});

type EditQuizFormData = z.infer<typeof editQuizSchema>;

interface DialogCreateUserProps {
    currentQuiz: Quiz;
    isEdited: boolean;
    setIsEdited: (isCreated: boolean) => void;
}

export const DialogEditQuizName: React.FC<DialogCreateUserProps> = ({currentQuiz, setIsEdited, isEdited}) => {
    const {user, isAuthenticated, getAccessToken, logout} = useAuth();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const {register, handleSubmit, reset, formState: {errors}} = useForm<EditQuizFormData>({
        resolver: zodResolver(editQuizSchema),
        defaultValues: {
            gameName: currentQuiz.gameName,
        }
    });


    useEffect(() => {
        if (isDialogOpen && (!isAuthenticated || !user)) {
            navigate('/login');
        }
    }, [isDialogOpen, isAuthenticated, user, navigate]);


    useEffect(() => {
        console.log(errors);
    }, [errors]);

    const onSubmit = async (data: EditQuizFormData) => {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }


            const formData = new FormData();

            formData.append("GameName", data.gameName || "");
            if (data.gameCoverImageUrl && data.gameCoverImageUrl[0]) {
                formData.append("GameCoverImageUrl", data.gameCoverImageUrl[0]);
            }

            const response = await authFetch(`/quizzes/${currentQuiz.id}`, getAccessToken, logout, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                toast({title: "Quiz updated", description: "The quiz was successfully updated."});
                setIsEdited(!isEdited);
                setIsDialogOpen(false);
            } else {
                const responseData = await response.json();
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            const errorMessage = (ex as Error).message || "An unexpected error occurred.";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    };


    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (open) {
            reset();
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Pencil className="h-3.5 w-3.5"/>
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Update quiz</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[410px]">
                <DialogHeader>
                    <DialogTitle>Update quiz</DialogTitle>
                    <DialogDescription>
                        Enter the data to update a quiz here. Click create a quiz when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gameName" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="firstName"
                                {...register("gameName")}
                                className="col-span-3"
                            />
                            {errors.gameName && <p className="col-span-4 text-right text-red-500">{String(errors.gameName.message)}</p>}
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="gameCoverImageUrl">Quiz Image</Label>
                            <Input id="profileImage" type="file" {...register("gameCoverImageUrl")} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Edit quiz</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};