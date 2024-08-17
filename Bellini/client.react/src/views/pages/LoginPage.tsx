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
import * as process from "process";
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
            <div className="flex align-middle h-96">
                <div className="md:w-64 m-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} required />
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
                                            <Input type="password" {...field} required />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="text-end" style={{marginTop: '0.25rem'}}>
                                <Link to='/register'>Forgot password?</Link>
                            </div>
                            <div className="flex justify-between">
                                <Button type="submit" variant="secondary">Register</Button>
                                <Button type="submit">Login</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}