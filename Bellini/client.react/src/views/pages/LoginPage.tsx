import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
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
            message: "Password must be at least 8 characters."
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
                        profileImageUrl: ""
                    },
                    data.accessToken,
                    data.refreshToken
                );

                navigate('/');
            } else {
                setErrorMessage(data.Message || 'An error occurred');
            }
        } catch (ex) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setErrorMessage(ex.message || 'An unexpected error occurred');
        }
    }

    return (
        <>
            <div className="flex align-middle h-[78dvh] rounded-md">
                <div className="w-96 m-auto">
                    <Form {...form}>
                        <p className="font-bold text-2xl text-center">Login to your account</p>
                        <p className="text-center ">Enter your login details in the our system</p>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field, fieldState}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
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
                                            <FormLabel>Password</FormLabel>
                                            <Link className="text-sm" to='/forgot-password'>Forgot password?</Link>
                                        </div>
                                        <FormControl>
                                            <Input type="password" {...field} required/>
                                        </FormControl>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Login</Button>
                            <div className="relative">
                                <FormMessage>{errorMessage}</FormMessage>
                                <div className="absolute inset-0 flex items-center"><span
                                    className="w-full border-t"></span></div>
                                <div className="relative flex justify-center text-xs uppercase"><span
                                    className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                            </div>
                            <Button onClick={() => navigate('/register')} variant="outline"
                                    className="w-full">Register</Button>
                            <p className="px-8 text-center text-sm text-muted-foreground">
                                By clicking continue, you agree to our
                                <a className="underline hover:text-primary" href=""> Terms of Service </a>
                                and
                                <a className="underline hover:text-primary" href=""> Privacy Policy</a>.
                            </p>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}