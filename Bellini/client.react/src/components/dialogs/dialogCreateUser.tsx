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
import {PlusCircle} from "lucide-react";
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
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters"),
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
    password: z.string().min(8, {
        message: "Password must be at least 8 characters."
    }).max(60)
});


type CreateUserFormData = z.infer<typeof createGameSchema>;

interface DialogCreateUserProps {
    isCreated: boolean;
    setIsCreated: (isCreated: boolean) => void;
}

export const DialogCreateUser: React.FC<DialogCreateUserProps> = ({setIsCreated, isCreated}) => {
    const {user, isAuthenticated, getAccessToken, logout} = useAuth();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const {register, handleSubmit, setValue, watch, reset, formState: {errors}} = useForm<CreateUserFormData>({
        resolver: zodResolver(createGameSchema),
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

    const onSubmit = async (data: CreateUserFormData) => {
        try {
            if (!isAuthenticated || !user) {
                navigate('/login');
                return;
            }
            const response = await authFetch("/admin/user", getAccessToken, logout, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    isAdmin: data.isAdmin
                }),
            });

            if (response.status == 201 || response.status == 204) {
                toast({title: "User Created", description: "The user was successfully created."});
                setIsCreated(!isCreated);
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
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5"/>
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create user</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[410px]">
                <DialogHeader>
                    <DialogTitle>Create user</DialogTitle>
                    <DialogDescription>
                        Enter the data to create a new user here. Click create a user when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gameName" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                {...register("username")}
                                className="col-span-3"
                            />
                            {errors.username &&
                                <p className="col-span-4 text-right text-red-500">{String(errors.username.message)}</p>}
                        </div>
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
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create user</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};