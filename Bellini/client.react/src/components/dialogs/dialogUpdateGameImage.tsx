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

const editGameSchema = z.object({
    gameName: z.string()
        .min(2, "Название игры должно содержать не менее 2 символов")
        .max(30, "Название игры должно содержать не более 30 символов")
        .regex(/^[A-Za-z\s]+$/, "Название игры может содержать только буквы и пробелы")
        .optional(),
    gameCoverImageUrl: z.any().optional(),
});

type EditGameFormData = z.infer<typeof editGameSchema>;

interface DialogUpdateGameImageProps {
    currentGameId: string;
    gameName: string;
    gameCoverImageUrl: string;
}

export const DialogUpdateGameImage: React.FC<DialogUpdateGameImageProps> = ({currentGameId, gameName, gameCoverImageUrl}) => {
    const {user, isAuthenticated, getAccessToken, logout} = useAuth();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const {register, handleSubmit, reset, formState: {errors}} = useForm<EditGameFormData>({
        resolver: zodResolver(editGameSchema),
        defaultValues: {
            gameName: gameName,
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

    const onSubmit = async (data: EditGameFormData) => {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }

            const formData = new FormData();

            formData.append("GameName", data.gameName || "");
            if (data.gameCoverImageUrl && data.gameCoverImageUrl[0]) {
                formData.append("image", data.gameCoverImageUrl[0]);
            }

            const response = await authFetch(`/game/${currentGameId}`, getAccessToken, logout, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                toast({title: "Игра обновлена", description: "Игра была успешно обновлена."});
                setIsDialogOpen(false);
            } else {
                const responseData = await response.json();
                toast({
                    title: "Ошибка",
                    description: responseData.message || "Возникла ошибка.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            const errorMessage = (ex as Error).message || "Возникла ошибка.";
            toast({
                title: "Ошибка",
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
                <div className="grid gap-2">
                    <Button variant="outline" size="sm" className="gap-1 p-0 h-full aspect-square w-full">
                        <img
                            alt="Product image"
                            className="aspect-square w-full rounded-md object-cover hover:scale-[105%] border-0 duration-500 hover:opacity-50"
                            height="300" width="300" src={gameCoverImageUrl}
                        />
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[410px]">
                <DialogHeader>
                    <DialogTitle>Обновить игру</DialogTitle>
                    <DialogDescription>
                        Введите данные для обновления теста здесь. Когда закончите, нажмите "Создать игру".
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gameName" className="text-right">
                                Имя
                            </Label>
                            <Input
                                id="firstName"
                                {...register("gameName")}
                                className="col-span-3"
                            />
                            {errors.gameName && <p className="col-span-4 text-right text-red-500">{String(errors.gameName.message)}</p>}
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="gameCoverImageUrl">Картинка</Label>
                            <Input id="profileImage" type="file" {...register("gameCoverImageUrl")} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Отмена</Button>
                        </DialogClose>
                        <Button type="submit">Изменить игру</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};