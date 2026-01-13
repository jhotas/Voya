import { supabase } from "@/lib/supabase"
import { MapPin, Calendar, Settings2, Plus, CircleCheck, Link2, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function TripDetails({ params }: { params: { id: string } }) {
    const { id } = await params

    // 1. Buscar dados da viagem
    const { data: trip } = await supabase.from('trips').select('*').eq('id', id).single()

    // 2. Buscar atividades da viagem
    const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('trip_id', id)
        .order('occurs_at', { ascending: true })

    if (!trip) return <div className="p-8">Viagem não encontrada.</div>

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
                        <span className="text-white">17 a 23 de Agosto</span>
                    </div>
                    <div className="w-px h-6 bg-zinc-200" />
                    <Button variant="secondary" className="gap-2 bg-zinc-500 cursor-pointer">
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
                        <Button className="gap-2 bg-lime-300 hover:bg-lime-200 text-lime-950">
                            <Plus size={20} />
                            Cadastrar atividade
                        </Button>
                    </div>

                    <div className="space-y-8">
                        {/* Exemplo de agrupamento por dia conforme o Figma */}
                        <div className="space-y-3">
                            <div className="flex gap-2 items-baseline">
                                <span className="text-xl text-zinc-400 font-semibold">Dia 17</span>
                                <span className="text-xs text-zinc-400">Sábado</span>
                            </div>
                            
                            {/* Card de Atividade */}
                            <div className="px-4 py-3 bg-zinc-700 rounded-xl shadow-sm flex items-center gap-3">
                                <CircleCheck className="text-lime-300" size={20} />
                                <span className="text-white">Almoço no Centro</span>
                                <span className="ml-auto text-zinc-400 text-sm">12:00h</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna da Direita: Sidebar */}
                <aside className="w-80 space-y-6">
                    {/* Links Importantes */}
                    <div className="space-y-6">
                        <h2 className="font-semibold text-xl text-zinc-900">Links importantes</h2>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1.5">
                                    <span className="block font-medium text-zinc-800 text-sm">Reserva do AirBnB</span>
                                    <a href="#" className="block text-xs text-zinc-500 truncate hover:text-zinc-600">
                                        https://www.airbnb.com.br/rooms/104700011...
                                    </a>
                                </div>
                                <Link2 className="text-zinc-400 shrink-0" size={20} />
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full gap-2">
                            <Plus size={20} />
                            Cadastrar novo link
                        </Button>
                    </div>

                    <div className="w-full h-px bg-zinc-200" />

                    {/* Convidados */}
                    <div className="space-y-6">
                        <h2 className="font-semibold text-xl text-zinc-900">Convidados</h2>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1.5">
                                    <span className="block font-medium text-zinc-800 text-sm">Jessica White</span>
                                    <span className="block text-xs text-zinc-500 truncate">jessica.white44@yahoo.com</span>
                                </div>
                                <CircleCheck className="text-zinc-400 shrink-0" size={20} />
                            </div>
                        </div>
                        <Button variant="secondary" className="w-full gap-2">
                            <Settings2 size={20} />
                            Gerenciar convidados
                        </Button>
                    </div>
                </aside>
            </main>
        </div>
    )
}