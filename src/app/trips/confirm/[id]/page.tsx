import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ConfirmParticipant({ params }: { params: { id: string } }) {
    const { id } = await params

    // Update the participant status
    const { data: participant, error } = await supabase
        .from('participants')
        .update({ is_confirmed: true })
        .eq('id', id)
        .select('*, trips(id, destination)')
        .single()

    if (error || !participant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <XCircle className="text-red-500" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Ops! Ocorreu um erro</h1>
                <p className="text-zinc-400 max-w-md mb-8">
                    Não conseguimos confirmar sua presença. O link pode ter expirado ou o convite foi removido.
                </p>
                <Link href="/">
                    <Button variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                        Voltar para a home
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-lime-500/10 flex items-center justify-center mb-8 animate-pulse">
                <CheckCircle2 className="text-lime-300" size={48} />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Presença Confirmada!</h1>
            
            <p className="text-zinc-400 max-w-md mb-10 text-lg">
                Sua presença para a viagem para <span className="text-lime-300 font-semibold">{participant.trips.destination}</span> foi confirmada com sucesso.
            </p>

            <Link href={`/trips/${participant.trips.id}`}>
                <Button className="bg-lime-300 text-lime-950 hover:bg-lime-400 h-14 px-8 rounded-2xl font-bold text-lg group shadow-lg shadow-lime-300/10 transition-all hover:scale-105">
                    Ver detalhes da viagem
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
        </div>
    )
}
