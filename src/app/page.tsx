import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"
import { Globe2, Map, Users, ArrowRight, PlaneTakeoff } from "lucide-react"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    redirect("/trips")
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-lime-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-lime-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 text-center max-w-5xl mx-auto w-full">

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-950 border border-lime-800 text-lime-300 text-sm font-medium mb-8">
          <Globe2 size={16} />
          <span>Sua próxima aventura começa aqui</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white mb-6">
          Planeje suas viagens <br className="hidden sm:block" />
          <span className="text-lime-300">com quem você ama</span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Crie roteiros colaborativos, organize as atividades diárias, defina os destinos e
          compartilhe tudo em um só lugar. Viajar nunca foi tão fácil.
        </p>

        <form
          action={async () => {
            "use server"
            await signIn("google")
          }}
          className="w-full sm:w-auto"
        >
          <button className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 bg-lime-300 text-lime-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-lime-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(190,242,100,0.4)]">
            Começar a planejar agora
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-left border-t border-zinc-800/50 pt-16">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Map className="text-lime-300" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Roteiros Inteligentes</h3>
              <p className="text-zinc-400 text-sm">Monte o itinerário dia a dia e não perca nenhum ponto turístico importante.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Users className="text-lime-300" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Colaborativo</h3>
              <p className="text-zinc-400 text-sm">Convide seus amigos para planejarem juntos a viagem dos sonhos.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <PlaneTakeoff className="text-lime-300" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Qualquer Destino</h3>
              <p className="text-zinc-400 text-sm">Do litoral paulista até a Europa, seu planejamento vai ser impecável.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}