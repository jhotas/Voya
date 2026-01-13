import { PlaneTakeoff } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";


export function Navbar() {
    return (
        <nav className="bg-zinc-700">
            <div className="max-w-5xl mx-auto h-16 flex items-center justify-between px-2">
                <div className="flex items-center gap-2 font-bold text-xl text-lime-300">
                    <PlaneTakeoff />
                    <span>Voya</span>
                </div>

                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="ghost">Entrar</Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </nav>
    )
}