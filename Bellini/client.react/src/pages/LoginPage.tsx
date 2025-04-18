import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button.tsx"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Link, useNavigate} from "react-router-dom"
import {useState} from "react";
import {useAuth} from "@/utils/context/authContext.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";

export const LoginPage = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {login} = useAuth();

    const formSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8, {
            message: "Пароль должен содержать не менее 8 символов."
        }).max(60)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setErrorMessage(null);
            const response = await serverFetch('/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    Email: values.email,
                    Password: values.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                login(
                    {
                        id: data.userId,
                        username: data.username,
                        email: values.email,
                        profileImageUrl: "",
                        isAdmin: data.isAdmin
                    },
                    data.accessToken,
                    data.refreshToken
                );

                navigate('/');
            } else {
                setErrorMessage(data.Message || 'Произошла ошибка.');
            }
        } catch (ex: unknown) {
            setErrorMessage((ex as Error).message || 'Произошла ошибка.');
        }
    }

    return (
        <>
            <div className="flex align-middle h-[80dvh] rounded-md">
                <div className="w-96 m-auto">
                    <Form {...form}>
                        <p className="font-bold text-2xl text-center">Войти в аккаунт</p>
                        <p className="text-center ">Введите свои регистрационные данные в нашей системе</p>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field, fieldState}) => (
                                    <FormItem>
                                        <FormLabel>Почта</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} required/>
                                        </FormControl>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field, fieldState}) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>Пароль</FormLabel>
                                            <Link className="text-sm" to='/forgot-password'>Забыли пароль?</Link>
                                        </div>
                                        <FormControl>
                                            <Input type="password" {...field} required/>
                                        </FormControl>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Авторизоваться</Button>
                            <div className="relative">
                                <FormMessage className="mb-5">{errorMessage}</FormMessage>
                                <div className="absolute inset-0 flex items-center"><span
                                    className="w-full border-t"></span></div>
                                <div className="relative flex justify-center text-xs uppercase"><span
                                    className="bg-background px-2 text-muted-foreground">Или продолжить с</span></div>
                            </div>
                            <Button onClick={() => navigate('/register')} variant="outline"
                                    className="w-full">Зарегистрироваться</Button>
                            <p className="px-8 text-center text-sm text-muted-foreground">
                                By clicking continue, you agree to our
                                <a className="underline hover:text-primary" href=""> условия обслуживания </a>
                                и
                                <a className="underline hover:text-primary" href=""> политика конфиденциальности</a>.
                            </p>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}