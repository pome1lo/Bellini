import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {PlusCircle} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

const createGameSchema = z.object({
    gameName: z.string().min(1, "Game name is required"),
    maxPlayers: z
        .number()
        .min(1, "At least 1 player required")
        .max(10, "Maximum 10 players allowed"),
});

type CreateGameFormData = z.infer<typeof createGameSchema>;


export const DialogCreateGame = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateGameFormData>({
        resolver: zodResolver(createGameSchema),
    });

    const onSubmit = (data: CreateGameFormData) => {
        alert("Form Data:", data);
        
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create game</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
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
                            {errors.gameName && <p className="col-span-4 text-red-500">{errors.gameName.message}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="maxPlayers" className="text-right">
                                Max Players
                            </Label>
                            <Input
                                id="maxPlayers"
                                type="number"
                                {...register("maxPlayers", { valueAsNumber: true })}
                                className="col-span-3"
                            />
                            {errors.maxPlayers && <p className="col-span-4 text-red-500">{errors.maxPlayers.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create game</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}