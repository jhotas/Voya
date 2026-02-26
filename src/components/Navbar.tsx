import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-5xl mx-auto h-16 flex items-center justify-between px-4">
        <Link href={'/'} className="flex items-center">
          <Image
            src="/logo-voya.svg"
            alt="Voya"
            width={64}
            height={64}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {!session?.user ? (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button variant="ghost" className="text-zinc-300 hover:text-lime-300 hover:bg-lime-300/10 h-9 px-3">
                Entrar
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 bg-zinc-900 px-2 sm:px-3 py-1 rounded-full border border-zinc-800">
                {session.user.image ? (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || "User"} 
                    width={24} 
                    height={24} 
                    className="rounded-full border border-zinc-700"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User size={12} className="text-zinc-400" />
                  </div>
                )}
                <span className="text-xs sm:text-sm font-medium text-zinc-300 hidden xs:inline-block max-w-[80px] sm:max-w-none truncate">
                  {session.user.name?.split(' ')[0]}
                </span>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="ghost" size="icon" className="size-8 sm:size-9 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-full">
                  <LogOut size={16} />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}