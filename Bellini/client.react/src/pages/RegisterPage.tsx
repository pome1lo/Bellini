import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button.tsx"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form.tsx"
import { Input } from "@/components/ui/input.tsx"
import { useNavigate } from "react-router-dom";
import { serverFetch } from "@/utils/fetchs/serverFetch.ts";
import { DiGithubBadge } from "react-icons/di";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp.tsx";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [emailFormSchemaValues, setEmailFormSchemaValues] = useState<z.infer<typeof emailFormSchema>>();
    const [codeFormSchemaValues, setCodeFormSchemaValues] = useState<z.infer<typeof codeFormSchema>>();
    const [showCodeForm, setShowCodeForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});


    const emailFormSchema = z.object({
        email: z.string().email()
    });

    const codeFormSchema = z.object({
        code: z.string().length(6)
    });

    const registerFormSchema = z.object({
        username: z.string().min(4).max(20),
        password: z.string().min(8, {
            message: "Пароль должен содержать не менее 8 символов."
        }).max(60)
    });

    const emailForm = useForm<z.infer<typeof emailFormSchema>>({
        resolver: zodResolver(emailFormSchema),
        defaultValues: {
            email: ""
        },
    });

    const codeForm = useForm<z.infer<typeof codeFormSchema>>({
        resolver: zodResolver(codeFormSchema),
        defaultValues: {
            code: ""
        },
    });

    const registerForm = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    });

    async function onSubmitEmailForm(values: z.infer<typeof emailFormSchema>) {
        try {
            setErrorMessage(null);

            const response = await serverFetch('/auth/register/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email }),
            });

            if (response.ok) {
                setShowCodeForm(true);
                setErrorMessage(null);
                setEmailFormSchemaValues(values);
            } else {
                const data = await response.json();
                setErrorMessage(data.Message || 'Произошла ошибка');
            }
        } catch (ex: unknown) {
            setErrorMessage((ex as Error).message || 'Произошла ошибка');
        }
    }

    async function onSubmitCodeForm(values: z.infer<typeof codeFormSchema>) {
        try {
            setErrorMessage(null);
            const response = await serverFetch('/auth/register/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: emailFormSchemaValues?.email,
                    VerificationCode: values.code
                }),
            });

            if (response.ok) {
                setShowPasswordForm(true);
                setErrorMessage(null);
                setCodeFormSchemaValues(values);
            } else {
                const data = await response.json();
                setErrorMessage(data.Message || 'Произошла ошибка');
            }
        } catch (ex: unknown) {
            setErrorMessage((ex as Error).message || 'Произошла ошибка');
        }
    }

    async function onSubmitRegisterForm(values: z.infer<typeof registerFormSchema>) {
        try {
            setErrorMessage(null);
            setFieldErrors({});
            const response = await serverFetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: emailFormSchemaValues?.email,
                    RegistrationCode: codeFormSchemaValues?.code,
                    Username: values.username,
                    Password: values.password,
                }),
            });

            if (response.ok) {
                navigate('/login')
                ///todo add toast notification
            } else {
                const data = await response.json();
                if (data.errors) {
                    setFieldErrors(data.errors);
                    console.log(data.errors);
                } else {
                    setErrorMessage(data.Message || 'Произошла ошибка');
                }
            }
        } catch (ex: unknown) {
            setErrorMessage((ex as Error).message || 'Произошла ошибка');
        }
    }

    return (
        <>
            <div className="flex align-middle h-[78dvh] rounded-md">
                <div className="w-96 m-auto">
                    {!showCodeForm ?
                        <>
                            <Form {...emailForm}>
                                <p className="font-bold text-2xl text-center">Создать учетную запись</p>
                                <p className="text-center ">Введите свой адрес электронной почты ниже, чтобы создать свою учетную запись</p>
                                <form onSubmit={emailForm.handleSubmit(onSubmitEmailForm)} className="space-y-4 mt-2">
                                    <FormField
                                        control={emailForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="name@example.com" type="email" {...field}
                                                        required />
                                                </FormControl>
                                                <FormMessage>{errorMessage}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">Войти с помощью почты</Button>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><span
                                            className="w-full border-t"></span></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span
                                            className="bg-background px-2 text-muted-foreground">Или продолжить с</span>
                                        </div>
                                    </div>
                                    <Button onClick={() => navigate('/login')} variant="outline"
                                        className="w-full">
                                        Авторизоваться
                                    </Button>
                                    <p className="px-8 text-center text-sm text-muted-foreground">
                                        Нажав продолжить, вы соглашаетесь с нашими условиями.
                                        <a className="underline hover:text-primary" href=""> условия обслуживания </a>
                                        и
                                        <a className="underline hover:text-primary" href=""> политика конфиденциальности</a>.
                                    </p>
                                </form>
                            </Form>
                        </>
                        :
                        <>
                            {!showPasswordForm ?
                                <>
                                    <Form {...codeForm}>
                                        <p className="font-bold text-2xl text-center">Подтвердите свой адрес электронной почты</p>
                                        <p className="text-center">Мы хотим убедиться, что это действительно вы.</p>
                                        <form onSubmit={codeForm.handleSubmit(onSubmitCodeForm)}
                                            className="space-y-4 mt-2 text-center">
                                            <div className="flex items-center flex-col">
                                                <Controller
                                                    name="code"
                                                    control={codeForm.control}
                                                    render={({ field, fieldState }) => (
                                                        <>
                                                            <InputOTP maxLength={6} required value={field.value}
                                                                onChange={field.onChange}>
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
                                                            <FormMessage>{errorMessage}</FormMessage>
                                                            {fieldState.error && (
                                                                <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                                            )}
                                                        </>
                                                    )}
                                                />
                                            </div>
                                            <Button type="submit" className="w-60">Подтвердите адрес почты</Button>
                                            <p className="px-8 text-center text-sm text-muted-foreground">
                                                Нажав продолжить, вы соглашаетесь с нашими условиями.
                                                <a className="underline hover:text-primary" href=""> условия обслуживания </a>
                                                и
                                                <a className="underline hover:text-primary" href=""> политика конфиденциальности</a>.
                                            </p>
                                        </form>
                                    </Form>
                                </>
                                :
                                <>
                                    <Form {...registerForm}>
                                        <p className="font-bold text-2xl text-center">Создать учетную запись</p>
                                        <p className="text-center ">Введите свое имя пользователя и пароль ниже, чтобы создать
                                            вашу личную учетную запись</p>
                                        <form onSubmit={registerForm.handleSubmit(onSubmitRegisterForm)}
                                            className="space-y-4 mt-2">
                                            <FormField
                                                control={registerForm.control}
                                                name="username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Имя</FormLabel>
                                                        <FormControl>
                                                            <Input type="text" {...field} required />
                                                        </FormControl>
                                                        <FormMessage>{fieldErrors.Username && fieldErrors.Username[0]}</FormMessage>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={registerForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Пароль</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" {...field} required />
                                                        </FormControl>
                                                        <FormMessage>{fieldErrors.Password && fieldErrors.Password[0]}</FormMessage>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormMessage>{errorMessage}</FormMessage>
                                            <Button type="submit" className="w-full">Зарегистрировать</Button>
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center"><span
                                                    className="w-full border-t"></span></div>
                                                <div className="relative flex justify-center text-xs uppercase"><span
                                                    className="bg-background px-2 text-muted-foreground">Или продолжить с</span>
                                                </div>
                                            </div>
                                            <Button onClick={() => navigate('/register')} variant="outline"
                                                className="w-full">
                                                <DiGithubBadge className="text-2xl me-1" />
                                                GitHub
                                            </Button>
                                            <p className="px-8 text-center text-sm text-muted-foreground">
                                                Нажав продолжить, вы соглашаетесь с нашими условиями.
                                                <a className="underline hover:text-primary" href=""> условия обслуживания </a>
                                                и
                                                <a className="underline hover:text-primary" href=""> политика конфиденциальности</a>.
                                            </p>
                                        </form>
                                    </Form>
                                </>
                            }
                        </>
                    }
                </div>
            </div>
        </>
    );
};