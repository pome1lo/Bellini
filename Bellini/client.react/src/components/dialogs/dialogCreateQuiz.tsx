import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useState } from "react";
import {authFetch} from "@/utils/fetchs/authFetch.ts";
import {useAuth} from "@/utils/context/authContext.tsx";
import {useNavigate} from "react-router-dom";

const quizSchema = z.object({
    title: z.string().min(3, "Название должно содержать минимум 3 символа"),
});

type QuizFormData = z.infer<typeof quizSchema>;

export const DialogCreateQuizSimple: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();
    const {user, isAuthenticated, getAccessToken, logout} = useAuth();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<QuizFormData>({
        resolver: zodResolver(quizSchema),
        defaultValues: { title: "" },
    });

    const onSubmit = async (data: QuizFormData) => {
        try {
            if (!isAuthenticated || !user) {
                navigate("/login");
                return;
            }
            const response = await authFetch("/admin/quiz", getAccessToken, logout, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: data.title,
                }),
            });

            const responseData = await response.json();
            console.error(responseData);
            if (response.ok) {
                toast({title: "Викторина создана", description: "Викторина была успешно создана."});
                setIsDialogOpen(false);
                navigate("/admin/drafts/" + responseData);
                reset();
            } else {
                toast({
                    title: "Ошибка",
                    description: responseData.message || "Возникла ошибка",
                    variant: "destructive",
                });
            }
        } catch (ex: unknown) {
            toast({title: "Ошибка", description: (ex as Error).message || "Возникла ошибка.", variant: "destructive"});
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    Создать викторину
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[410px]">
                <DialogHeader>
                    <DialogTitle>Создать викторину</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Имя</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Отмена</Button>
                        </DialogClose>
                        <Button type="submit">Создать</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
