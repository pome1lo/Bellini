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
import {authFetch} from "@/utils/fetch's/authFetch.ts";
import {toast} from "@/components/ui/use-toast.ts";
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
}


const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    profileImage: z.any().optional(),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const DialogEditProfile: React.FC<DialogEditProfileProps> = ({
                                                                        contextId,
                                                                        isProfileUpdated,
                                                                        setIsProfileUpdated
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
        formData.append("DateOfBirth", data.dateOfBirth || "");
        if (data.profileImage && data.profileImage[0]) {
            formData.append("profileImage", data.profileImage[0]);
        }
        try {
            const response = await authFetch(`/profile/${user.id}`, getAccessToken, logout, {
                method: "PUT",
                body: formData,
            });
            if (response.ok) {
                toast({title: "Profile updated", description: "Your profile was successfully updated."});
                setIsDialogOpen(false);
                setIsProfileUpdated(!isProfileUpdated);
            } else {
                const responseData = await response.json();
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive"
                });
            }
        } catch (ex) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast({title: "Error", description: ex.message || "An unexpected error occurred.", variant: "destructive"});
        }
    }

    if (!isAuthenticated || !user || !contextId || contextId === parseInt(user.id)) {
        return (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>Update Profile</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                        <DialogDescription>Update your profile details here.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" {...register("firstName")} />
                                {errors.firstName && <p>{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" {...register("lastName")} />
                                {errors.lastName && <p>{errors.lastName.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                                {errors.dateOfBirth && <p>{errors.dateOfBirth.message}</p>}
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="profileImage">Profile Image</Label>
                                <Input id="profileImage" type="file" {...register("profileImage")} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }
}