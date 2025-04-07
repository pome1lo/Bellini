import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
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
                setErrorMessage(data.message || 'Произошла ошибка');
            }
        } catch (ex: unknown) {
            console.log((ex as Error).message);
            setErrorMessage('Произошла ошибка');
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
                setErrorMessage(null);
            }
            else setErrorMessage('Неверный или просроченный проверочный код');
        } catch {
            setErrorMessage('Произошла ошибка');
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
                setErrorMessage('Произошла ошибка');
            }
        } catch {
            setErrorMessage('Произошла ошибка');
        }
    }

    return (
        <div className="flex align-middle h-[78dvh] rounded-md">
            <div className="w-96 m-auto" >
                {!showCodeForm ? (
                    <Form {...emailForm}>
                        <p className="font-bold text-2xl text-center">Сброс пароля</p>
                        <p className="text-center mb-3">Введите свой адрес электронной почты, чтобы восстановить пароль</p>
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
                            <Button type="submit" className="w-full mt-3">Отправить код</Button>
                        </form>
                    </Form>
                ) : showPasswordForm ? (
                    <Form {...resetPasswordForm}>
                        <p className="font-bold text-2xl text-center">Введите новый пароль</p>
                        <p className="text-center mb-3">Введите свой новый пароль для входа в свою учетную запись</p>
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
                            <Button type="submit" className="w-full mt-3">Сброс пароля</Button>
                        </form>
                    </Form>
                ) : (
                    <Form {...codeForm}>
                    <p className="font-bold text-2xl text-center">Подтверждающий код</p>
                        <p className="text-center mb-3">
                            Код для сброса пароля будет отправлен вам на электронную почту
                        </p>
                        <form onSubmit={codeForm.handleSubmit(onSubmitCodeForm)} className="space-y-4 mt-2 text-center">
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
                                <FormMessage>{errorMessage}</FormMessage>
                            </div>
                            <Button type="submit" className="w-full">Подтверждающий код</Button>
                        </form>
                    </Form>
                )}
                <div className="flex flex-col gap-2 mt-3">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span
                            className="w-full border-t"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span
                            className="bg-background px-2 text-muted-foreground">Или продолжить с</span>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/register')} variant="outline"
                            className="w-full">Зарегистрироваться</Button>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Нажав продолжить, вы соглашаетесь с нашими условиями.
                        <a className="underline hover:text-primary" href=""> условия обслуживания </a>
                        и
                        <a className="underline hover:text-primary" href=""> политика конфиденциальности</a>.
                    </p>
                </div>
            </div>

        </div>
    );
};
