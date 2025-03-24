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
        .min(5, "Email must be at least 5 characters")
        .max(50, "Email must be at most 50 characters"),
    firstName: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(30, "First name must be at most 30 characters")
        .regex(/^[A-Za-z\s]+$/, "First name can only contain letters and spaces")
        .optional(),
    lastName: z.string()
        .min(2, "Last name must be at least 2 characters")
        .max(30, "Last name must be at most 30 characters")
        .regex(/^[A-Za-z\s]+$/, "Last name can only contain letters and spaces")
        .optional(),
    isAdmin: z.boolean().default(false),
    profileImage: z.any().optional(),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters."
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
                toast({title: "User Created", description: "The user was successfully created."});
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
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Edit user</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[410px]">
                <DialogHeader>
                    <DialogTitle>Edit user</DialogTitle>
                    <DialogDescription>
                        Enter the data to create a new user here. Click create a user when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
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
                                FirstName
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
                                LastName
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
                                Is Admin
                            </Label>
                            <Checkbox
                                id="isAdmin"
                                checked={isAdmin}
                                onCheckedChange={(checked) => setValue("isAdmin", checked === true)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 transition-opacity duration-300">
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
                                <p className="col-span-4 text-right text-red-500">{String(errors.password.message)}</p>}
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="profileImage">Profile Image</Label>
                            <Input id="profileImage" type="file" {...register("profileImage")} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Edit user</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};