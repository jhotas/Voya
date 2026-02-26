import { TripCard } from "@/components/TripCard"
import { CreateTripDialog } from "@/components/CreateTripDialog"
import { supabase } from "@/lib/supabase"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function TripsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  const { data: trips, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Erro ao carregar viagens:", error.message)
  }

  return (
    <main className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-4xl font-bold text-lime-300 tracking-tight">Minhas Viagens</h1>
            <p className="text-zinc-400 mt-1">Organize seus próximos destinos com seus amigos.</p>
          </div>

          <CreateTripDialog userId={session.user.id} />
        </header>

        {trips && trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) =>(
                    <TripCard
                        key={trip.id}
                        id={trip.id}
                        name={trip.name}
                        destination={trip.destination}
                        starts_at={trip.starts_at}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-24 px-6 border border-zinc-800/60 bg-zinc-900/50 border-dashed rounded-2xl">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✈️</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhuma viagem planejada</h3>
                <p className="text-zinc-400 max-w-sm mx-auto mb-6">Você ainda não tem nenhuma viagem planejada. Que tal criar a sua primeira aventura?</p>
                <div className="flex justify-center">
                  <CreateTripDialog userId={session.user.id} />
                </div>
            </div>
        )}
      </div>
    </main>
  )
}
