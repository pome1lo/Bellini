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
            <div className="w-96 m-auto" >
                {!showCodeForm ? (
                    <Form {...emailForm}>
                        <p className="font-bold text-2xl text-center">Reset Password</p>
                        <p className="text-center mb-3">Enter your email address to recover your password</p>
                        <form onSubmit={emailForm.handleSubmit(onSubmitEmailForm)}>
                            <FormField
                                control={emailForm.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="name@example.com" type="email" {...field} required/>
                                        </FormControl>
                                        <FormMessage>{errorMessage}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full mt-3">Send Code</Button>
                        </form>
                    </Form>
                ) : showPasswordForm ? (
                    <Form {...resetPasswordForm}>
                        <p className="font-bold text-2xl text-center">Enter New Password</p>
                        <p className="text-center mb-3">Enter your new password to log in to your account</p>
                        <form onSubmit={resetPasswordForm.handleSubmit(onSubmitResetPasswordForm)}>
                            <FormField
                                control={resetPasswordForm.control}
                                name="newPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="password" placeholder="New Password" {...field} required/>
                                        </FormControl>
                                        <FormMessage>{errorMessage}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full mt-3">Reset Password</Button>
                        </form>
                    </Form>
                ) : (
                    <Form {...codeForm}>
                    <p className="font-bold text-2xl text-center">Verify Code</p>
                        <p className="text-center mb-3">
                            The password reset code will be sent to your email
                        </p>
                        <form onSubmit={codeForm.handleSubmit(onSubmitCodeForm)}className="space-y-4 mt-2 text-center">
                            <div className="flex items-center flex-col">
                            <Controller
                                name="code"
                                control={codeForm.control}
                                render={({field}) => (
                                    <InputOTP value={field.value} onChange={field.onChange} maxLength={6} required className="ms-4">
                                        <InputOTPGroup className="p-2">
                                            <InputOTPSlot index={0}/>
                                            <InputOTPSlot index={1}/>
                                            <InputOTPSlot index={2}/>
                                        </InputOTPGroup>
                                        <InputOTPSeparator/>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3}/>
                                            <InputOTPSlot index={4}/>
                                            <InputOTPSlot index={5}/>
                                        </InputOTPGroup>
                                    </InputOTP>
                                )}
                            />
                            </div>
                            <Button type="submit" className="w-full">Verify Code</Button>
                        </form>
                    </Form>
                )}
                <div className="flex flex-col gap-2 mt-3">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span
                            className="w-full border-t"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span
                            className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/register')} variant="outline"
                            className="w-full">Register</Button>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our
                        <a className="underline hover:text-primary" href=""> Terms of Service </a>
                        and
                        <a className="underline hover:text-primary" href=""> Privacy Policy</a>.
                    </p>
                </div>
            </div>

        </div>
    );
};
