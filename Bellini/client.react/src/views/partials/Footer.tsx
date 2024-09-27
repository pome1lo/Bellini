import {Button} from "@/components/ui/button.tsx";
import React from "react";
import {Link} from "react-router-dom";

export const Footer = () => {
    return (
        <>
            <footer className="bg-black text-white py-8">
                <div className="mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className=" order-2 md:mb-0 md:order-1">
                            <h2 className="text-3xl text-shrikhand">Bellini</h2>
                            <p className="text-gray-400 text-sm">© 2024 Bellini. All rights reserved.</p>
                        </div>
                        <div
                            className="flex md:order-2 order-1 sm:space-x-4 flex-col sm:flex-row">
                            <Button variant="link" className="text-start text-white">Contacts</Button>
                            <Button variant="link" className="text-white">About</Button>
                            <Button variant="link" className="text-white">Support</Button>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    )
}