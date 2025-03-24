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
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {authFetch} from "@/utils/fetchs/authFetch.ts";

const createGameSchema = z.object({
    email: z.string().email()
        .min(5, "Длина электронного письма должна составлять не менее 5 символов")
        .max(50, "Длина электронного письма должна составлять не более 50 символов"),
    firstName: z.string()
        .min(2, "Имя должно содержать не менее 2 символов")
        .max(30, "Длина имени должна составлять не более 30 символов")
        .regex(/^[A-Za-z\s]+$/, "Имя может содержать только буквы и пробелы")
        .optional(),
    lastName: z.string()
        .min(2, "Фамилия должна содержать не менее 2 символов")
        .max(30, "Длина фамилии должна составлять не более 30 символов")
        .regex(/^[A-Za-z\s]+$/, "Фамилия может содержать только буквы и пробелы")
        .optional(),
    isAdmin: z.boolean().default(false),
    profileImage: z.any().optional(),
    password: z.string().min(8, {
        message: "Пароль должен содержать не менее 8 символов."
    }).max(60).optional().or(z.literal(""))
});

interface UserProfile {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    isAdmin: boolean;
}

type EditUserFormData = z.infer<typeof createGameSchema>;

interface DialogCreateUserProps {
    currentUserEdit: UserProfile;
    isEdited: boolean;
    setIsEdited: (isCreated: boolean) => void;
}

export const DialogEditUser: React.FC<DialogCreateUserProps> = ({currentUserEdit, setIsEdited, isEdited}) => {
    const {user, isAuthenticated, getAccessToken, logout} = useAuth();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const {register, handleSubmit, setValue, watch, reset, formState: {errors}} = useForm<EditUserFormData>({
        resolver: zodResolver(createGameSchema),
        defaultValues: {
            email: currentUserEdit.email,
            firstName: currentUserEdit.firstName || "",
            lastName: currentUserEdit.lastName || "",
            isAdmin: currentUserEdit.isAdmin,
            password: ""
        }
    });

    const isAdmin = watch("isAdmin");

    useEffect(() => {
        if (isDialogOpen && (!isAuthenticated || !user)) {
            navigate('/login');
        }
    }, [isDialogOpen, isAuthenticated, user, navigate]);


    useEffect(() => {
        console.log(errors);
    }, [errors]);

    const onSubmit = async (data: EditUserFormData) => {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }


            const formData = new FormData();
            formData.append("id", currentUserEdit.id.toString());
            formData.append("FirstName", data.firstName || "");
            formData.append("LastName", data.lastName || "");
            formData.append("Email", data.email || "");
            formData.append("Password", data.password || "");
            formData.append("IsAdmin", data.isAdmin.toString() || "");
            if (data.profileImage && data.profileImage[0]) {
                formData.append("profileImage", data.profileImage[0]);
            }
            console.log("=================");

            const response = await authFetch(`/admin/user/${currentUserEdit.id}`, getAccessToken, logout, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                toast({title: "Пользователь создан", description: "Пользователь был успешно создан."});
                setIsEdited(!isEdited);
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
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Изменить пользователя</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[410px]">
                <DialogHeader>
                    <DialogTitle>Изменить пользователя</DialogTitle>
                    <DialogDescription>
                        Введите здесь данные для создания нового пользователя. Когда закончите, нажмите "Создать пользователя".
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Почта
                            </Label>
                            <Input
                                id="email"
                                {...register("email")}
                                className="col-span-3"
                            />
                            {errors.email && <p className="col-span-4 text-right text-red-500">{String(errors.email.message)}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                Имя
                            </Label>
                            <Input
                                id="firstName"
                                {...register("firstName")}
                                className="col-span-3"
                            />
                            {errors.firstName && <p className="col-span-4 text-right text-red-500">{String(errors.firstName.message)}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Фамилия
                            </Label>
                            <Input
                                id="lastName"
                                {...register("lastName")}
                                className="col-span-3"
                            />
                            {errors.lastName && <p className="col-span-4 text-right text-red-500">{String(errors.lastName.message)}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isAdmin" className="text-right">
                                явл. Админом
                            </Label>
                            <Checkbox
                                id="isAdmin"
                                checked={isAdmin}
                                onCheckedChange={(checked) => setValue("isAdmin", checked === true)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 transition-opacity duration-300">
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
                                <p className="col-span-4 text-right text-red-500">{String(errors.password.message)}</p>}
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="profileImage">Profile Image</Label>
                            <Input id="profileImage" type="file" {...register("profileImage")} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Отмена</Button>
                        </DialogClose>
                        <Button type="submit">Изменить пользователя</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};