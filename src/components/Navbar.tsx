import { PlaneTakeoff, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-5xl mx-auto h-16 flex items-center justify-between px-4">
        <Link href={'/'}>
          <div className="flex items-center gap-2 font-bold text-xl text-lime-300">
            <PlaneTakeoff />
            <span>Voya</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {!session?.user ? (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button variant="ghost" className="text-zinc-300 hover:text-white">
                Entrar
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || "User"} 
                    width={32} 
                    height={32} 
                    className="rounded-full border border-zinc-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User size={16} className="text-zinc-400" />
                  </div>
                )}
                <span className="text-sm text-zinc-300 hidden sm:inline">
                  {session.user.name}
                </span>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-400">
                  <LogOut size={18} />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}