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
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {PlusCircle} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {toast} from "@/components/ui/use-toast.tsx";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {authFetch} from "@/utils/fetchs/authFetch.ts";

const createGameSchema = z.object({
    gameName: z.string().min(1, "Требуется указать название игры"),
    maxPlayers: z.number().min(1, "Требуется как минимум 1 игрок").max(10, "Допускается не более 10 игроков"),
    isPrivate: z.boolean().optional(),
    password: z.string().optional()
}).refine((data) => {
    return !data.isPrivate || (data.password && data.password.length > 0);
}, {
    message: "Для приватных игр требуется пароль",
    path: ["password"]
});

type CreateGameFormData = z.infer<typeof createGameSchema>;

interface DialogCreateGameProps {
    isCreated: boolean;
    setIsCreated: (isCreated: boolean) => void;
    isAdminPage?: boolean;
}

export const DialogCreateGame: React.FC<DialogCreateGameProps> = ({setIsCreated, isCreated, isAdminPage = false}) => {
    const {user, getAccessToken, logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isDialogOpen && (!isAuthenticated || !user)) {
            navigate('/login');
        }
    }, [isDialogOpen, isAuthenticated, user, navigate]);

    const {register, handleSubmit, setValue, watch, reset, formState: {errors}} = useForm<CreateGameFormData>({
        resolver: zodResolver(createGameSchema),
        defaultValues: {isPrivate: false}
    });

    const isPrivate = watch("isPrivate");

    const onSubmit = async (data: CreateGameFormData) => {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }
            const response = await authFetch("/game/create", getAccessToken, logout, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    GameName: data.gameName,
                    HostId: user.id,
                    MaxPlayers: data.maxPlayers,
                    DifficultyLevel: '',
                    IsPrivate: data.isPrivate,
                    RoomPassword: data.password,
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                toast({title: "Игра создана", description: "Игра была успешно создана."});
                setIsCreated(!isCreated);
                setIsDialogOpen(false);

                if(isAdminPage) {
                    navigate("/games/room/" + responseData.gameId)
                }
            } else {
                toast({
                    title: "Ошибка",
                    description: responseData.message || "Произошла ошибка.",
                    variant: "destructive"
                });
            }
        } catch (ex: unknown) {
            const errorMessage = (ex as Error).message || "Произошла ошибка.";
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
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5"/>
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Создать игру</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[410px]">
                <DialogHeader>
                    <DialogTitle>Создание игры</DialogTitle>
                    <DialogDescription>
                        Введите данные для создания новой игры здесь. Когда закончите, нажмите "Создать игру".
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gameName" className="text-right">
                                Имя игры
                            </Label>
                            <Input
                                id="gameName"
                                {...register("gameName")}
                                className="col-span-3"
                            />
                            {errors.gameName &&
                                <p className="col-span-4 text-red-500">{String(errors.gameName.message)}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="maxPlayers" className="text-right">
                                Кол/во игроков
                            </Label>
                            <Input
                                id="maxPlayers"
                                type="number"
                                {...register("maxPlayers", {valueAsNumber: true})}
                                className="col-span-3"
                            />
                            {errors.maxPlayers &&
                                <p className="col-span-4 text-red-500">{String(errors.maxPlayers.message)}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isPrivate" className="text-right">
                                Приват
                            </Label>
                            <Checkbox
                                id="isPrivate"
                                checked={isPrivate}
                                onClick={() => setValue("isPrivate", !isPrivate)}
                                {...register("isPrivate")}
                            />
                        </div>
                        <div
                            className={`grid grid-cols-4 items-center gap-4 transition-opacity duration-300 ${isPrivate ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
                        >
                            <Label htmlFor="password" className="text-right">
                                Пароль
                            </Label>
                            <Input
                                id="password"
                                type="text"
                                {...register("password")}
                                className="col-span-3"
                            />
                            {errors.password &&
                                <p className="col-span-4 text-red-500">{String(errors.password.message)}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Отмена</Button>
                        </DialogClose>
                        <Button type="submit">Создать игру</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};