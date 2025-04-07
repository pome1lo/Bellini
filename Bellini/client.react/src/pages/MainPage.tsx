import {Button} from "@/components/ui/button.tsx";
import bg from "@/assets/images/bg.png";
import card1 from "@/assets/images/card1.png";
import card2 from "@/assets/images/card2.png";
import card3 from "@/assets/images/card3.png";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx"

export const MainPage = () => {
    return (
        <>
            <div className="flex flex-col items-center p-7 max-w-[1440px] w-full mx-auto">
                <div className="text-center max-w-[600px] sm:mt-32">
                    <h1 className="text-3xl sm:text-6xl font-bold" >Интеллектуальные <br/>игры и интересные викторины </h1>{/*data-aos="fade-up" data-aos-duration="450"*/}
                    <p className="mt-3 mb-4 sm:text-xl" >Викторины создают диалог между бизнесом и клиентами и помогают посетителям и
                        компаниям лучше понимать друг друга. Отсюда и рост продаж. Более 200 миллионов
                        заявок поступило от наших клиентов</p>{/* data-aos="fade-up" data-aos-duration="750"*/}
                    <Button className="min-w-32" >Попробуйте - это бесплатно</Button> {/* data-aos="fade-up" data-aos-duration="1050"*/}
                </div>
                <img src={bg} className="w-full" alt=""/>{/* data-aos="fade-up" data-aos-duration="1550"*/}
                <div className="text-start items-start w-full max-w-[1090px] mt-10 mb-10">
                    <h1 className="text-2xl sm:text-5xl font-bold"  >Не только инструмент, но и метод</h1>{/* data-aos="fade-up" data-aos-duration="750"*/}
                    <h3 className="sm:text-2xl"   >Давайте расскажем вам, как сделать викторину самым эффективным инструментом в маркетинге</h3>{/*data-aos="fade-up" data-aos-duration="750"*/}
                </div>
                <div className="flex gap-5 flex-wrap justify-evenly max-w-[1100px]">
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Основные статистические данные по викторине</CardTitle>
                            <CardDescription>Вы можете быстро просмотреть коэффициент конверсии теста, количество
                                вакансий и заявок в любое время.</CardDescription>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <img src={card1} alt=""/>
                        </CardFooter>
                    </Card>

                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Баллы за ответы</CardTitle>
                            <CardDescription>Просто покажите результат в зависимости от набранных очков. Его можно использовать не
                                только для образовательных тестов, но и для других ниш</CardDescription>
                        </CardHeader>
                        <CardContent> 
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <img src={card2} alt=""/>
                        </CardFooter>
                    </Card>
                    <Card className="w-[350px]"  >
                        <CardHeader>
                            <CardTitle>Баллы за ответы</CardTitle>
                            <CardDescription>Просто покажите результат в зависимости от набранных очков. Его можно использовать не
                                только для образовательных тестов, но и для других ниш</CardDescription>
                        </CardHeader>
                        <CardContent> 
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <img src={card3} alt=""/>
                        </CardFooter>
                    </Card>
                </div>
                <div className="mt-10 mb-10 max-w-[1100px]">
                    <h1 className="text-2xl font-bold mb-4">Интеллектуальные игры
                        Платформа с функциями социальных сетей</h1>
                    <p className="mb-6">
                        Добро пожаловать в <strong>Bellini</strong> — веб-приложение, предназначенное для организации и управления интеллектуальными
                        играми с интегрированными элементами социальных сетей, предлагающее игрокам увлекательный опыт, богатую
                        статистику и динамичные взаимодействия. Эта платформа предоставляет пользователям возможность создавать,
                        участвуйте в играх и управляйте ими, создавая динамичное сообщество с помощью профилей игроков,
                        взаимодействий в режиме реального времени и игровой аналитики.
                    </p>
                </div>
            </div>
        </>
    );
}