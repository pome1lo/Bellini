import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

export const ProfileSkeleton = () => {
    return (
        <>

            <div className="flex lg:flex-row lg:space-x-4 flex-col  max-w-[1440px] w-full mx-auto">
                <div className="mt-5 lg:max-w-[286px] w-full">
                    <Card className="w-full mt-5">
                        <CardHeader>
                            <div className="flex items-center mb-5">
                                <div>
                                    <Skeleton className="h-20 w-20"/>
                                </div>
                                <div className="ms-4">
                                    <Skeleton className="w-20 h-5"/>
                                    <Skeleton className="w-28 h-5 mt-2"/>
                                </div>
                            </div>
                            <Separator/>
                            <div className="mb-5">
                                <Skeleton className="w-18"/>
                                <Skeleton className="w-18"/>
                            </div>
                            <Separator/>
                        </CardHeader>
                    </Card>
                    <Card className="mt-4 mb-5">
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-7 w-14 mb-5"/>
                            </CardTitle>
                            <CardDescription>
                                <Skeleton className="h-5 w-18"/>
                                <Skeleton className="h-5 mt-1 w-10"/>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="w-16 h-12"/>
                        </CardContent>
                    </Card>
                </div>
                <Skeleton className="h-4"/>


                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="w-52 h-5"/>
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className="w-80 h-5"/>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Skeleton className="w-20 h-5"/></TableHead>
                                    <TableHead><Skeleton className="w-20 h-5"/></TableHead>
                                    <TableHead><Skeleton className="w-20 h-5"/></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Skeleton className="w-24 h-5"/></TableCell>
                                    <TableCell><Skeleton className="w-36 h-5"/></TableCell>
                                    <TableCell className="font-bold"><Skeleton className="w-20 h-5"/></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton className="w-28 h-5"/></TableCell>
                                    <TableCell><Skeleton className="w-32 h-5"/></TableCell>
                                    <TableCell className="font-bold"><Skeleton className="w-20 h-5"/></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton className="w-24 h-5"/></TableCell>
                                    <TableCell><Skeleton className="w-32 h-5"/></TableCell>
                                    <TableCell className="font-bold"><Skeleton className="w-20 h-5"/></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton className="w-36 h-5"/></TableCell>
                                    <TableCell><Skeleton className="w-36 h-5"/></TableCell>
                                    <TableCell className="font-bold"><Skeleton className="w-20 h-5"/></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton className="w-28 h-5"/></TableCell>
                                    <TableCell><Skeleton className="w-36 h-5"/></TableCell>
                                    <TableCell className="font-bold"><Skeleton className="w-20 h-5"/></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton className="w-24 h-5"/></TableCell>
                                    <TableCell><Skeleton className="w-36 h-5"/></TableCell>
                                    <TableCell className="font-bold"><Skeleton className="w-20 h-5"/></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton className="w-28 h-5"/></TableCell>
                                    <TableCell><Skeleton className="w-32 h-5"/></TableCell>
                                    <TableCell className="font-bold"><Skeleton className="w-20 h-5"/></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton className="w-36 h-5"/></TableCell>
                                    <TableCell><Skeleton className="w-24 h-5"/></TableCell>
                                    <TableCell className="font-bold"><Skeleton className="w-20 h-5"/></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="text-center">
                        <Skeleton className="w-28 h-5"/>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}