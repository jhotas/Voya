import { supabase } from "@/lib/supabase"
import { MapPin, Calendar, Settings2, Plus, CircleCheck, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateActivityDialog } from "@/components/CreateActivityDialog"
import { ActivityItem } from "@/components/ActivityItem"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function TripDetails({ params }: { params: { id: string } }) {
    const { id } = await params

    const { data: trip } = await supabase.from('trips').select('*').eq('id', id).single()

    const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('trip_id', id)
        .order('occurs_at', { ascending: true })

    if (!trip) return <div className="p-8">Viagem não encontrada.</div>

    const groupedActivities: Record<string, typeof activities> = {}

    activities?.forEach(activity => {
        const dateKey = format(parseISO(activity.occurs_at), 'yyyy-MM-dd')
        if (!groupedActivities[dateKey]) {
            groupedActivities[dateKey] = []
        }
        groupedActivities[dateKey]?.push(activity)
    })

    const sortedDates = Object.keys(groupedActivities).sort()

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
            {/* Cabeçalho superior (Barra horizontal) */}
            <header className="px-8 h-16 rounded-xl bg-zinc-700 border border-zinc-500 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin className="text-white" size={20} />
                    <span className="text-white">{trip.destination}</span>
                </div>

                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-white" size={20} />
                        <span className="text-white">
                            {trip.starts_at ? new Date(trip.starts_at).toLocaleDateString() : "Data a definir"}
                        </span>
                    </div>
                    <div className="w-px h-6 bg-zinc-200" />
                    <Button variant="secondary" className="gap-2 bg-zinc-500 hover:bg-zinc-600 cursor-pointer">
                        Alterar local/data
                        <Settings2 size={20} />
                    </Button>
                </div>
            </header>

            <main className="flex gap-16 px-4">
                {/* Coluna da Esquerda: Atividades/Timeline */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-semibold text-white">Atividades</h2>
                        <CreateActivityDialog tripId={id} />
                    </div>

                    <div className="space-y-8">
                        {sortedDates.length > 0 ? (
                            sortedDates.map((dateKey) => {
                                const date = parseISO(dateKey)
                                const dayActivities = groupedActivities[dateKey]

                                return (
                                    <div key={dateKey} className="space-y-3">
                                        <div className="flex gap-2 items-baseline">
                                            <span className="text-xl text-zinc-400 font-semibold">
                                                Dia {format(date, 'dd')}
                                            </span>
                                            <span className="text-xs text-zinc-500 capitalize">
                                                {format(date, 'EEEE', { locale: ptBR })}
                                            </span>
                                        </div>

                                        {dayActivities?.map(activity => (
                                            <ActivityItem 
                                                key={activity.id}
                                                activity={{
                                                    id: activity.id,
                                                    title: activity.title,
                                                    occurs_at: activity.occurs_at,
                                                    is_completed: activity.is_completed
                                                }}
                                            />
                                        ))}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed border-zinc-800 rounded-xl">
                                <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna da Direita: Sidebar */}
                <aside className="w-80 space-y-6">
                    {/* Links Importantes */}
                    <div className="space-y-6">
                        <h2 className="font-semibold text-xl text-white">Links importantes</h2>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1.5">
                                    <span className="block font-medium text-white text-sm">Reserva do AirBnB</span>
                                    <a href="#" className="block text-xs text-zinc-400 truncate hover:text-zinc-600">
                                        https://www.airbnb.com.br/rooms/104700011...
                                    </a>
                                </div>
                                <Link2 className="text-zinc-400 shrink-0" size={20} />
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full gap-2 bg-zinc-500 hover:bg-zinc-600 cursor-pointer">
                            <Plus size={20} />
                            Cadastrar novo link
                        </Button>
                    </div>

                    <div className="w-full h-px bg-zinc-200" />

                    {/* Convidados */}
                    <div className="space-y-6">
                        <h2 className="font-semibold text-xl text-white">Convidados</h2>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1.5">
                                    <span className="block font-medium text-white text-sm">Jessica White</span>
                                    <span className="block text-xs text-zinc-400 truncate">jessica.white44@yahoo.com</span>
                                </div>
                                <CircleCheck className="text-zinc-400 shrink-0" size={20} />
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full gap-2 bg-zinc-500 hover:bg-zinc-600 cursor-pointer">
                            <Settings2 size={20} />
                            Gerenciar convidados
                        </Button>
                    </div>
                </aside>
            </main>
        </div>
    )
}