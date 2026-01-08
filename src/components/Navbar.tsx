"use client"
import { PlaneTakeoff } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
    return (
        <nav className="border-b bg-white">
            <div className="max-w-5xl mx-auto h-16 flex items-center justify-between px-8">
                <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
                    <PlaneTakeoff />
                    <span>Voya</span>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost">Entrar</Button>
                    <Button>Começar Agora</Button>
                </div>
            </div>
        </nav>
    )
}