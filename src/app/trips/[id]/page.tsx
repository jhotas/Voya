import { supabase } from "@/lib/supabase"
import { MapPin, Calendar, Settings2, Plus, CircleCheck, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateActivityDialog } from "@/components/CreateActivityDialog"
import { ActivityItem } from "@/components/ActivityItem"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { LinkItem } from "@/components/LinkItem"
import { CreateLinkDialog } from "@/components/CreateLinkDialog"
import { Guests } from "@/components/Guests"

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

    const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('trip_id', id)

    const { data: guests } = await supabase
        .from('participants')
        .select('*')
        .eq('trip_id', id)

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
            {/* Cabeçalho superior (Barra horizontal) */}
            <header className="px-4 sm:px-8 py-4 sm:h-16 rounded-xl bg-zinc-800/50 border border-zinc-700/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <MapPin className="text-lime-300" size={20} />
                    <span className="text-white font-medium">{trip.destination}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-lime-300" size={20} />
                        <span className="text-zinc-200">
                            {trip.starts_at ? new Date(trip.starts_at).toLocaleDateString() : "Data a definir"}
                        </span>
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-zinc-700" />
                    <Button variant="secondary" className="w-full sm:w-auto gap-2 bg-zinc-700 hover:bg-zinc-600 cursor-pointer border border-zinc-600">
                        Alterar local/data
                        <Settings2 size={18} />
                    </Button>
                </div>
            </header>

            <main className="flex flex-col lg:flex-row gap-12 lg:gap-16">
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
                <aside className="w-full lg:w-80 space-y-6">
                    {/* Links Importantes */}
                    <div className="space-y-6">
                        <h2 className="font-semibold text-xl text-white">Links importantes</h2>

                        <div className="space-y-2">
                            {links && links.length > 0 ? (
                                links.map((link: any) => (
                                    <LinkItem key={link.id} link={link} />
                                ))
                            ) : (
                                <p className="text-zinc-500 text-sm">Nenhum link cadastrado.</p>
                            )}
                        </div>
                        <CreateLinkDialog tripId={id} />
                    </div>

                    <div className="w-full h-px bg-zinc-800" />

                    {/* Convidados Component */}
                    <Guests tripId={id} tripDestination={trip.destination} guests={guests || []} />
                </aside>
            </main>
        </div>
    )
}