import {Button} from "@/components/ui/button.tsx";
import bg from "@/assets/images/bg.png";
import card1 from "@/assets/images/card1.png";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const MainPage = () => {
    return (
        <>
            <div className="flex flex-col items-center p-7 max-w-[1440px] w-full mx-auto">
                <div className="text-center max-w-[600px] sm:mt-32">
                    <h1 className="text-3xl sm:text-6xl font-bold">The designer<br/>of marketing quizzes</h1>
                    <p className="mt-3 mb-4 sm:text-xl">Quizzes create a Business-Client dialogue and help visitors and
                        companies better understand each other. Hence the sales growth. More than 200 million
                        applications have been received by our clients</p>
                    <Button className="min-w-32">Try it - it's free</Button>
                </div>
                <img src={bg} className="w-full" alt=""/>
                <div className="text-start items-start w-full max-w-[1090px] mt-10 mb-10">
                    <h1 className="text-2xl sm:text-5xl font-bold">Not only a tool, but also a method</h1>
                    <h3 className="sm:text-2xl">Let's tell you how to make a quiz the most effective tool in marketing</h3>
                </div>
                <div className="flex gap-5 flex-wrap justify-evenly max-w-[1100px]">
                    <Card className="w-[350px]" data-aos="flip-left" data-aos-duration="1000">
                        <CardHeader>
                            <CardTitle>Basic statistics on the quiz</CardTitle>
                            <CardDescription>You can quickly view the conversion rate of the quiz, the number of
                                openings and applications at any time.</CardDescription>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <img src={card1} alt=""/>
                        </CardFooter>
                    </Card>

                    <Card className="w-[350px]" data-aos="flip-left" data-aos-duration="2000">
                        <CardHeader>
                            <CardTitle>Points for answers</CardTitle>
                            <CardDescription>Just show the result depending on the points scored. It can be used not
                                only for educational tests, but also for other niches</CardDescription>
                        </CardHeader>
                        <CardContent>
                            CHANGE PIC
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <img src={card1} alt=""/>
                        </CardFooter>
                    </Card>
                    <Card className="w-[350px]" data-aos="flip-left" data-aos-duration="3000">
                        <CardHeader>
                            <CardTitle>Points for answers</CardTitle>
                            <CardDescription>Just show the result depending on the points scored. It can be used not
                                only for educational tests, but also for other niches</CardDescription>
                        </CardHeader>
                        <CardContent>
                            CHANGE FULL CARD
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <img src={card1} alt=""/>
                        </CardFooter>
                    </Card>
                </div>
                <div className="mt-10 mb-10 max-w-[1100px]">
                    <h1 data-aos="fade-up" data-aos-duration="1000" className="text-2xl font-bold mb-4">Intellectual Games
                        Platform with Social Network Features</h1>
                    <p data-aos="fade-up" data-aos-duration="1000" className="mb-6">
                        Welcome to <strong>Bellini</strong> — a web application designed to organize and manage intellectual
                        games with integrated social network elements, offering players engaging experiences, rich
                        statistics, and dynamic interactions. This platform provides users with the ability to create,
                        participate in, and manage games while fostering a vibrant community through player profiles,
                        real-time interactions, and game analytics.
                    </p>
                </div>
            </div>
        </>
    );
}