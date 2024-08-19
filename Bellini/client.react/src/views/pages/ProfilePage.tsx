import {Menu, Package2, Search} from "lucide-react"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {Link} from "react-router-dom";
import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import React from 'react';
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {useForm, Controller} from 'react-hook-form';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {CalendarIcon} from "@radix-ui/react-icons";
import {Calendar} from "@/components/ui/calendar.tsx";

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/profile', name: 'Profile'},
];

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.date().refine(date => date <= new Date(), "Date of birth cannot be in the future")
});


export const ProfilePage = () => {

    const {control, handleSubmit, formState: {errors}} = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            dateOfBirth: new Date()
        }
    });

    const onSubmit = (data: z.infer<typeof profileSchema>) => {
        console.log('Form submitted:', data);
        // Handle form submission
    };
    return (
        <>
            <div className="flex min-h-screen w-full flex-col">
                <header
                    className="sticky top-[72px] flex h-16 items-center gap-4 border-b border-t shadow-md px-4 md:px-6 backdrop-blur">
                    <nav
                        className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                        <Link to="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                            <Package2 className="h-6 w-6"/>
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
                            Dashboard
                        </Link>
                        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
                            Orders
                        </Link>
                        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
                            Products
                        </Link>
                        <Link to="#" className="text-muted-foreground transition-colors hover:text-foreground">
                            Customers
                        </Link>
                        <Link to="#" className="text-foreground transition-colors hover:text-foreground">
                            Settings
                        </Link>
                    </nav>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5"/>
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
                                    <Package2 className="h-6 w-6"/>
                                    <span className="sr-only">Acme Inc</span>
                                </Link>
                                <Link to="#" className="text-muted-foreground hover:text-foreground">
                                    Dashboard
                                </Link>
                                <Link to="#" className="text-muted-foreground hover:text-foreground">
                                    Orders
                                </Link>
                                <Link to="#" className="text-muted-foreground hover:text-foreground">
                                    Products
                                </Link>
                                <Link to="#" className="text-muted-foreground hover:text-foreground">
                                    Customers
                                </Link>
                                <Link to="#" className="hover:text-foreground">
                                    Settings
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <form className="ml-auto flex-1 sm:flex-initial">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                                />
                            </div>
                        </form>

                    </div>
                </header>
                <main
                    className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                    <Breadcrumbs items={breadcrumbItems}/>
                    <div className="mx-auto grid w-full max-w-6xl gap-2">
                        <h1 className="text-3xl font-semibold">Settings</h1>
                    </div>
                    <div
                        className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                        <nav
                            className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
                        >
                            <Link to="#" className="font-semibold text-primary">General</Link>
                            <Link to="#">Security</Link>
                            <Link to="#">Integrations</Link>
                            <Link to="#">Support</Link>
                            <Link to="#">Organizations</Link>
                            <Link to="#">Advanced</Link>
                        </nav>
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>Update your personal information</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div>
                                            <label htmlFor="firstName">First Name</label>
                                            <Controller
                                                name="firstName"
                                                control={control}
                                                render={({field}) => <Input {...field} placeholder="First Name"/>}
                                            />
                                            {errors.firstName &&
                                                <p className="text-red-500">{errors.firstName.message}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="lastName">Last Name</label>
                                            <Controller
                                                name="lastName"
                                                control={control}
                                                render={({field}) => <Input {...field} placeholder="Last Name"/>}
                                            />
                                            {errors.lastName &&
                                                <p className="text-red-500">{errors.lastName.message}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="dateOfBirth">Date of Birth</label>
                                            <Controller
                                                name="dateOfBirth"
                                                control={control}
                                                render={({field}) => (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                                                {field.value ? format(field.value, "PPP") :
                                                                    <span>Pick a date</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            />
                                            {errors.dateOfBirth &&
                                                <p className="text-red-500">{errors.dateOfBirth.message}</p>}
                                        </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button type="submit">Save</Button>
                                </CardFooter>
                            </Card>


                            <Card x-chunk="dashboard-04-chunk-1">
                                <CardHeader>
                                    <CardTitle>Store Name</CardTitle>
                                    <CardDescription>
                                        Used to identify your store in the marketplace.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form>
                                        <Input placeholder="Store Name"/>
                                    </form>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button>Save</Button>
                                </CardFooter>
                            </Card>

                            <Card x-chunk="dashboard-04-chunk-1">
                                <CardHeader>
                                    <CardTitle>Delete an account</CardTitle>
                                    <CardDescription>
                                        If you delete your account, you will no longer be able to access it. If you do decide to delete your account, then we ask you to leave a reason.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form>
                                        <Input placeholder="Reason"/>
                                    </form>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button variant="destructive">Delete an account</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}