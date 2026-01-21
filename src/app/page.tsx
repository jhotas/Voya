import { TripCard } from "@/components/TripCard"
import { CreateTripDialog } from "@/components/CreateTripDialog"
import { supabase } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"

export default async function Home() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-zinc-500">Faça login para gerenciar suas viagens.</p>
      </main>
    )
  }

  const { data: trips, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Erro ao carregar viagens:", error.message)
  }

  return (
    <main className="min-h-screen bg-zinc-800 p-8">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-lime-300 tracking-tight">Minhas Viagens</h1>
            <p className="text-zinc-400">Organize seus próximos destinos com seus amigos.</p>
          </div>

          <CreateTripDialog />
        </header>

        {trips && trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="text-center py-20 border-2 border-dashed rounded-xl">
                <p className="text-zinc-500">Nenhuma viagem encontrada. Que tal planejar a primeira?</p>
            </div>
        )}
      </div>
    </main>
  )
}