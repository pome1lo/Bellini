import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useNavigate} from "react-router-dom";
import {serverFetch} from "@/utilds/fetch's/fetchServer.ts";
import {DiGithubBadge} from "react-icons/di";
import {useState} from "react";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp.tsx";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [emailFormSchemaValues, setEmailFormSchemaValues] = useState<z.infer<typeof emailFormSchema>>();
    const [showCodeForm, setShowCodeForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const emailFormSchema = z.object({
        email: z.string().email()
    });

    const codeFormSchema = z.object({
        code: z.string().length(6)
    });

    const registerFormSchema = z.object({
        username: z.string().min(4).max(20),
        password: z.string().min(5, {
            message: "Password must be at least 5 characters."
        })
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
        setEmailFormSchemaValues(values);
        setShowCodeForm(true);
    }

    async function onSubmitCodeForm(values: z.infer<typeof codeFormSchema>) {
        // serverFetch();
        console.log('Form submitted');
        console.log(values.code);
        setShowPasswordForm(true);
    }

    async function onSubmitRegisterForm(values: z.infer<typeof codeFormSchema>) {
        // serverFetch();
        console.log('Form submitted');
        console.log(values.code);
        setShowPasswordForm(true);
    }

    return (
        <>
            <div className="flex align-middle h-[78dvh] rounded-md">
                <div className="w-96 m-auto">
                    {!showCodeForm ?
                        <>
                            <Form {...emailForm}>
                                <p className="font-bold text-2xl text-center">Create an account</p>
                                <p className="text-center ">Enter your email below to create your account</p>
                                <form onSubmit={emailForm.handleSubmit(onSubmitEmailForm)} className="space-y-4 mt-2">
                                    <FormField
                                        control={emailForm.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="name@example.com" type="email" {...field}
                                                           required/>
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
                                            className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>
                                    <Button onClick={() => navigate('/register')} variant="outline"
                                            className="w-full">
                                        <DiGithubBadge className="text-2xl me-1"/>
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
                        </>
                        :
                        <>
                            {!showPasswordForm ?
                                <>
                                    <Form {...codeForm}>
                                        <p className="font-bold text-2xl text-center">Confirm your email</p>
                                        <p className="text-center">We want to make sure that it's really you.</p>
                                        <form onSubmit={codeForm.handleSubmit(onSubmitCodeForm)}
                                              className="space-y-4 mt-2 text-center">
                                            <div className="flex items-center flex-col">
                                                <Controller
                                                    name="code"
                                                    control={codeForm.control}
                                                    render={({field, fieldState}) => (
                                                        <>
                                                            <InputOTP maxLength={6} required value={field.value}
                                                                      onChange={field.onChange}>
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
                                                            {fieldState.error && (
                                                                <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                                            )}
                                                        </>
                                                    )}
                                                />
                                            </div>
                                            <Button type="submit" className="w-60">Confirm Email</Button>
                                            <p className="px-8 text-center text-sm text-muted-foreground">
                                                By clicking continue, you agree to our
                                                <a className="underline hover:text-primary" href=""> Terms of
                                                    Service </a>
                                                and
                                                <a className="underline hover:text-primary" href=""> Privacy Policy</a>.
                                            </p>
                                        </form>
                                    </Form>
                                </>
                                :
                                <>
                                    <Form {...registerForm}>
                                        <p className="font-bold text-2xl text-center">Create an account</p>
                                        <p className="text-center ">Enter your username and password below to create
                                            your personal account</p>
                                        <form onSubmit={registerForm.handleSubmit(onSubmitRegisterForm)}
                                              className="space-y-4 mt-2">
                                            <FormField
                                                control={registerForm.control}
                                                name="username"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Username</FormLabel>
                                                        <FormControl>
                                                            <Input type="text" {...field} required/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={registerForm.control}
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
                                            <Button type="submit" className="w-full">Register</Button>
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center"><span
                                                    className="w-full border-t"></span></div>
                                                <div className="relative flex justify-center text-xs uppercase"><span
                                                    className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                                </div>
                                            </div>
                                            <Button onClick={() => navigate('/register')} variant="outline"
                                                    className="w-full">
                                                <DiGithubBadge className="text-2xl me-1"/>
                                                GitHub
                                            </Button>
                                            <p className="px-8 text-center text-sm text-muted-foreground">
                                                By clicking continue, you agree to our
                                                <a className="underline hover:text-primary" href=""> Terms of
                                                    Service </a>
                                                and
                                                <a className="underline hover:text-primary" href=""> Privacy Policy</a>.
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