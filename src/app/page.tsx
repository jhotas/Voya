import { TripCard } from "@/components/TripCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-900">Minhas viagens</h1>
          <p className="text-zinc-500">Organize seus próximos destinos com seus amigos.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TripCard />
          <TripCard />
          <TripCard />
        </div>
      </div>
    </main>
  )
}