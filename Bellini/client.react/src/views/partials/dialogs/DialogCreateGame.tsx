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
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {toast} from "@/components/ui/use-toast.ts";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";

const createGameSchema = z.object({
    gameName: z.string().min(1, "Game name is required"),
    maxPlayers: z.number().min(1, "At least 1 player required").max(10, "Maximum 10 players allowed"),
    isPrivate: z.boolean().optional(),
    password: z.string().optional()
}).refine((data) => {
    return !data.isPrivate || (data.password && data.password.length > 0);
}, {
    message: "Password is required for private games",
    path: ["password"]
});

type CreateGameFormData = z.infer<typeof createGameSchema>;

interface DialogCreateGameProps {
    isCreated: boolean;
    setIsCreated: (isCreated: boolean) => void;
}

export const DialogCreateGame: React.FC<DialogCreateGameProps> = ({setIsCreated, isCreated}) => {
    const {isAuthenticated, user} = useAuth();
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
            alert("isPrivate " + data.isPrivate + "\nPassword" + data.password);
            const response = await serverFetch("/game/create", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    GameName: data.gameName,
                    HostId: user.id,
                    MaxPlayers: data.maxPlayers,
                    DifficultyLevel: '',
                    IsPrivate: data.isPrivate,
                    Password: data.password,
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                toast({title: "Game Created", description: "The game was successfully created."});
                setIsCreated(!isCreated);
                setIsDialogOpen(false);
            } else {
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
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5"/>
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create game</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[410px]">
                <DialogHeader>
                    <DialogTitle>Create game</DialogTitle>
                    <DialogDescription>
                        Enter the data to create a new game here. Click create a game when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gameName" className="text-right">
                                Game name
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
                                Max Players
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
                                Private
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
                                Password
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
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create game</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};