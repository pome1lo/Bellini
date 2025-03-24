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
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {authFetch} from "@/utils/fetchs/authFetch.ts";
import {toast} from "@/components/ui/use-toast.tsx";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/utils/context/authContext.tsx";
import {z} from "zod";

interface DialogEditProfileProps {
    contextId: number;
    isProfileUpdated: boolean;
    setIsProfileUpdated: (arg: boolean) => void;
    className: string;
}


const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    profileImage: z.any().optional(),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const DialogEditProfile: React.FC<DialogEditProfileProps> = ({
                                                                        contextId,
                                                                        isProfileUpdated,
                                                                        setIsProfileUpdated,
                                                                        className
                                                                    }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
    });
    const navigate = useNavigate();
    const {user, getAccessToken, logout, isAuthenticated} = useAuth();

    async function onSubmit(data: UpdateProfileFormData) {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("FirstName", data.firstName || "");
        formData.append("LastName", data.lastName || "");
        if (data.profileImage && data.profileImage[0]) {
            formData.append("profileImage", data.profileImage[0]);
        }
        try {
            const response = await authFetch(`/profile/${user.id}`, getAccessToken, logout, {
                method: "PUT",
                body: formData,
            });
            if (response.ok) {
                toast({title: "Обновлен профиль", description: "Ваш профиль был успешно обновлен."});
                setIsDialogOpen(false);
                setIsProfileUpdated(!isProfileUpdated);
            } else {
                const responseData = await response.json();
                toast({
                    title: "Ошибка",
                    description: responseData.message || "Произошла ошибка.",
                    variant: "destructive"
                });
            }
        } catch (ex) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast({title: "Ошибка", description: ex.message || "Произошла ошибка.", variant: "destructive"});
        }
    }

    if (!isAuthenticated || !user || !contextId || contextId === parseInt(user.id)) {
        return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className={className}>Обновить профиль</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Обновить профиль</DialogTitle>
                        <DialogDescription>Обновите данные своего профиля здесь.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="firstName">Имя</Label>
                                <Input id="firstName" {...register("firstName")} />
                                {errors.firstName && <p>{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="lastName">Фамилия</Label>
                                <Input id="lastName" {...register("lastName")} />
                                {errors.lastName && <p>{errors.lastName.message}</p>}
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="profileImage">Картинка</Label>
                                <Input id="profileImage" type="file" {...register("profileImage")} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost">Отмена</Button>
                            </DialogClose>
                            <Button type="submit">Сохранить</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }
}