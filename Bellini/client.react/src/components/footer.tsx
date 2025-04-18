import {Button} from "@/components/ui/button.tsx";
import {Instagram, Linkedin, Twitter} from "lucide-react";

export const Footer = () => {
    return (
        <>
            <footer className="bg-black text-white py-8">
                <div className="mx-auto px-4  max-w-[1440px] w-full">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex justify-between order-2 md:mb-0 md:order-1">
                            <div>
                                <h2 className="text-3xl text-shrikhand">Bellini</h2>
                                <p className="text-gray-400 text-sm">© 202 Bellini. Все права защищены.</p>
                            </div>
                            <div className="md:hidden block">
                                <Button variant="link">
                                    <Instagram className="w-5 h-5 hover:scale-125 transition duration-500"/>
                                </Button>
                                <Button variant="link">
                                    <Twitter className="w-5 h-5 hover:scale-125 transition duration-500"/>
                                </Button> 
                                <Button variant="link">
                                    <Linkedin className="w-5 h-5 hover:scale-125 transition duration-500"/>
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-end sm:flex-wrap md:order-2 order-1 sm:space-x-4 flex-col sm:flex-row">
                            <div className="md:block hidden w-full text-right">
                                <Button variant="link">
                                    <Instagram className="hover:scale-125 transition duration-500 text-white"/>
                                </Button>
                                <Button variant="link">
                                    <Twitter className="hover:scale-125 transition duration-500 text-white"/>
                                </Button>
                                <Button variant="link">
                                    <Linkedin className="hover:scale-125 transition duration-500 text-white"/>
                                </Button>
                            </div>
                            <div>
                                <Button variant="link" className="text-start text-white">Контакты</Button>
                                <Button variant="link" className="text-white">О нас</Button>
                                <Button variant="link" className="text-white">Главная</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}