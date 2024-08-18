import {Button} from "@/components/ui/button.tsx";

export const Footer = () => {
    return (
        <>
            <footer className="bg-black text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 order-2 md:mb-0 md:order-1">
                            <h2 className="text-2xl font-bold">My Website</h2>
                            <p className="text-gray-400 mt-2">© 2024 My Website. All rights reserved.</p>
                        </div>
                        <div
                            className="flex md:order-2 order-1 sm:space-x-4 flex-col sm:flex-row">
                            <Button variant="link" className="text-start text-white">Privacy Policy</Button>
                            <Button variant="link" className="text-white">Terms of Service</Button>
                            <Button variant="link" className="text-white">Contact Us</Button>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    )
}