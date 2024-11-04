import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

export const GameRoomSkeleton = () => {
    return (
        <>
            <div className="bg-muted/40 p-4 h-[80vh]">
                <Skeleton className="w-40 h-8"/>

                <div className="flex flex-col xl:flex-row gap-4 mt-5">
                    <div className="flex flex-wrap gap-4 xl:order-2 order-1">
                        <div className="flex sm:flex-row flex-col w-full gap-4">
                            <Card className="w-full">
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="w-40 h-8"/>
                                    <Skeleton className="w-8 h-8"/>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="w-48 h-8"/>
                                </CardContent>
                            </Card>
                            <Card className="w-full">
                                <CardHeader
                                    className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="w-40 h-8"/>
                                    <Skeleton className="w-8 h-8"/>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="w-48 h-8"/>
                                </CardContent>
                            </Card><Card className="w-full">
                            <CardHeader
                                className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="w-40 h-8"/>
                                <Skeleton className="w-8 h-8"/>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="w-48 h-8"/>
                            </CardContent>
                        </Card>
                        </div>
                        <div className="flex lg:flex-row flex-col gap-4 w-full">
                            <Card className="lg:w-1/2 w-full">
                                <CardHeader>
                                    <CardTitle>
                                        <Skeleton className="w-40 h-8"/>
                                    </CardTitle>
                                    <CardDescription>
                                        <Skeleton className="w-60 h-6"/>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>

                                    <Table>
                                        <TableCaption><Skeleton className="w-60 h-6"/></TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">
                                                    <Skeleton className="w-40 h-8"/>
                                                </TableHead>
                                                <TableHead><Skeleton className="w-28 h-8"/></TableHead>
                                                <TableHead><Skeleton className="w-28 h-8"/></TableHead>
                                                <TableHead><Skeleton className="w-28 h-8"/></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>

                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={3}><Skeleton className="w-28 h-8"/></TableCell>
                                                <TableCell className="text-right"><Skeleton className="w-28 h-8"/></TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </CardContent>
                            </Card>
                            <Card className="w-full h-[55vh]">
                                <CardHeader>
                                    <CardTitle>
                                        <Skeleton className="w-40 h-8"/>
                                    </CardTitle>
                                    <CardDescription>
                                        <Skeleton className="w-60 h-6"/>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="max-h-[300px] w-full"/>
                                </CardContent>
                            </Card>
                            <Card className="xl:hidden block ">
                                <CardHeader>
                                    <Skeleton className="w-32 h-8"/>
                                    <Skeleton className="w-48 h-8"/>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="w-24 h-8"/>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Card className="xl:max-w-[340px] w-full">
                            <CardHeader>

                                <Skeleton className="w-48 h-8"/>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="w-48 h-48 xl:block hidden"/>
                            </CardContent>
                        </Card>
                        <Card className="xl:block hidden">
                            <CardHeader>
                                <Skeleton className="w-32 h-8"/>
                                <Skeleton className="w-48 h-8"/>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="w-24 h-8"/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}