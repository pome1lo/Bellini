import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp.tsx";
import { serverFetch } from "@/utils/fetchs/serverFetch.ts";
import {useNavigate} from "react-router-dom";

export const ForgotPasswordPage = () => {
    const [emailFormValues, setEmailFormValues] = useState<z.infer<typeof emailFormSchema>>();
    const [showCodeForm, setShowCodeForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [userId, setUserId] = useState(0);
    const [verificationCode, setVerificationCode] = useState("");
    const navigate = useNavigate();

    const emailFormSchema = z.object({
        email: z.string().email(),
    });

    const codeFormSchema = z.object({
        code: z.string().length(6),
    });

    const resetPasswordFormSchema = z.object({
        newPassword: z.string().min(8),
    });

    const emailForm = useForm({
        resolver: zodResolver(emailFormSchema),
        defaultValues: { email: "" },
    });

    const codeForm = useForm({
        resolver: zodResolver(codeFormSchema),
        defaultValues: { code: "" },
    });

    const resetPasswordForm = useForm({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: { newPassword: "" },
    });

    async function onSubmitEmailForm(values: z.infer<typeof emailFormSchema>) {
        try {
            setErrorMessage(null);
            const response = await serverFetch('/auth/password/forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email }),
            });
            const data = await response.json();
            if (response.ok) {
                setUserId(data);
                setShowCodeForm(true);
                setEmailFormValues(values);
            } else {
                setErrorMessage(data.message || 'An error occurred');
            }
        } catch (ex) {
            setErrorMessage('An unexpected error occurred');
        }
    }

    async function onSubmitCodeForm(values: z.infer<typeof codeFormSchema>) {
        try {
            const response = await serverFetch('/auth/password/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailFormValues?.email, verificationCode: values.code }),
            });
            const data = await response.json();
            if (response.ok) {
                setVerificationCode(data);
                setShowPasswordForm(true);
            }
            else setErrorMessage('Invalid or expired verification code');
        } catch {
            setErrorMessage('An unexpected error occurred');
        }
    }

    async function onSubmitResetPasswordForm(values: z.infer<typeof resetPasswordFormSchema>) {
        try {
            const response = await serverFetch('/auth/password/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: emailFormValues?.email.toString(),
                    NewPassword: values.newPassword.toString(),
                    UserId: userId,
                    VerificationCode: verificationCode.toString(),
                }),
            });
            if (response.ok) {
                navigate("/login");
            } else {
                setErrorMessage('An error occurred');
            }
        } catch {
            setErrorMessage('An unexpected error occurred');
        }
    }

    return (
        <div className="flex align-middle h-[78dvh] rounded-md">
            <div className="w-96 m-auto">
                {!showCodeForm ? (
                    <Form {...emailForm}>
                        <p className="font-bold text-2xl text-center">Reset Password</p>
                        <form onSubmit={emailForm.handleSubmit(onSubmitEmailForm)}>
                            <FormField
                                control={emailForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="name@example.com" type="email" {...field} required />
                                        </FormControl>
                                        <FormMessage>{errorMessage}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Send Code</Button>
                        </form>
                    </Form>
                ) : showPasswordForm ? (
                    <Form {...resetPasswordForm}>
                        <p className="font-bold text-2xl text-center">Enter New Password</p>
                        <form onSubmit={resetPasswordForm.handleSubmit(onSubmitResetPasswordForm)}>
                            <FormField
                                control={resetPasswordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="password" placeholder="New Password" {...field} required />
                                        </FormControl>
                                        <FormMessage>{errorMessage}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Reset Password</Button>
                        </form>
                    </Form>
                ) : (
                    <Form {...codeForm}>
                        <p className="font-bold text-2xl text-center">Verify Code</p>
                        <form onSubmit={codeForm.handleSubmit(onSubmitCodeForm)}>
                            <Controller
                                name="code"
                                control={codeForm.control}
                                render={({ field }) => (
                                    <InputOTP value={field.value} onChange={field.onChange} maxLength={6} required>
                                        <InputOTPGroup className="p-2">
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                )}
                            />
                            <Button type="submit">Verify Code</Button>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    );
};
