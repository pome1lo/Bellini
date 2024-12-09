import React, { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {GameListPage} from "@/views/pages/GameListPage.tsx";

interface DialogGamePasswordProps {
    correctPassword: string;
    isPasswordCorrect: boolean;
    setIsPasswordCorrect(isPasswordCorrect: boolean): void;
}

const passwordSchema = z.object({
    password: z
        .string()
        .min(4, "Minimum of 4 characters")
        .max(20, "Maximum of 20 characters"),
});

type DialogGamePasswordFormData = z.infer<typeof passwordSchema>;

export const DialogGamePassword: React.FC<DialogGamePasswordProps> = ({
                                                                          correctPassword,
                                                                          isPasswordCorrect,
                                                                          setIsPasswordCorrect,
                                                                      }) => {
    const [isOpen, setIsOpen] = useState(!isPasswordCorrect);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<DialogGamePasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: "" },
    });

    const closeDialog = () => {
        navigate("/games");
        setIsOpen(false);
    };

    async function onSubmit(data: DialogGamePasswordFormData) {
        if (data.password === correctPassword) {
            setIsPasswordCorrect(!isPasswordCorrect);
            setIsOpen(false);
        } else {
            setError("password", { type: "manual", message: "Incorrect password" });
        }
    }

    return (
        <div>
            <Dialog open={isOpen}>
                <DialogTrigger asChild>
                    {/*<Button variant="outline" onClick={openDialog}>*/}
                    {/*    Button*/}
                    {/*</Button>*/}
                    <GameListPage/>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Log in to the game</DialogTitle>
                            <DialogDescription>
                                Enter the password to enter the game room.
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="text"
                                {...register("password")}
                                className="col-span-3"
                            />
                            {errors.password && (
                                <p className="col-span-4 text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <DialogFooter className="flex justify-items-end sm:justify-start mt-5">
                            <div className="flex justify-end w-full space-x-4">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={closeDialog}
                                    >
                                        Close
                                    </Button>
                                </DialogClose>
                                <Button type="submit">Login</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
