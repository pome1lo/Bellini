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
import { DiGithubBadge } from "react-icons/di";

export const RegisterPage = () => {
    const navigate = useNavigate();

    const formSchema = z.object({
        username: z.string().min(4).max(20),
        email: z.string().email(),
        password: z.string().min(5, {
            message: "Password must be at least 5 characters."
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
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
                        <p className="font-bold text-2xl text-center">Create an account</p>
                        <p className="text-center ">Enter your email below to create your account</p>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="name@example.com" type="email" {...field} required/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Sign In with Email</Button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><span
                                    className="w-full border-t"></span></div>
                                <div className="relative flex justify-center text-xs uppercase"><span
                                    className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                            </div>
                            <Button onClick={() => navigate('/register')} variant="outline"
                                    className="w-full">
                                <DiGithubBadge className="text-2xl me-1" />
                                GitHub
                            </Button>
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