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
import {Link, useNavigate} from "react-router-dom";
import {serverFetch} from "@/utilds/fetch's/fetchServer.ts";

export const LoginPage = () => {
    const navigate = useNavigate();

    const formSchema = z.object({
        email: z.string().email(),
        password: z.string().min(5, {
            message: "Password must be at least 5 characters."
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const data = await serverFetch('/auth/login', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            }),
        }).then(r => r.json())
        console.log(data);
        sessionStorage.setItem('__access-token', data.accessToken);
        sessionStorage.setItem('__refresh-token', data.refreshToken);
        navigate('/profile');
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
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} required/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} required/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="text-end" style={{marginTop: '0.25rem'}}>
                                <Link to='/forgot-password'>Forgot password?</Link>
                            </div>
                            <Button type="submit" className="w-full">Login</Button>
                            <div className="relative">
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