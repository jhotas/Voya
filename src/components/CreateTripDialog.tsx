"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

import { Plus, Loader2, Calendar, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog"
import { Input } from "./ui/input"

export function CreateTripDialog() {
    const { userId } = useAuth()
    const router = useRouter()

    const [name, setName] = useState("")
    const [destination, setDestination] = useState("")
    const [startsAt, setStartsAt] = useState("")
    const [endsAt, setEndsAt] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleCreateTrip() {
        if (!name || !destination || !startsAt || !endsAt || !userId) return

        setLoading(true)

        const { data, error } = await supabase
        .from('trips')
        .insert({
            name,
            destination,
            starts_at: startsAt,
            ends_at: endsAt,
            user_id: userId
        })
        .select('id')
        .single()

        setLoading(false)

        if (error) {
            setLoading(false)
            console.error("Erro ao criar viagem: ", error.message) 
            return
        }


        if (!data) {
            setLoading(false)
            console.error("Nenhum dado foi retornado do banco.")
            return
        }

        setName("")
        setDestination("")
        setStartsAt("")
        setEndsAt("")
        setOpen(false)
        router.push(`/trips/${data.id}`)
        router.refresh()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-lime-400 hover:bg-lime-400 text-lime-950 cursor-pointer transition-colors">
                    <Plus size={18} /> Nova Viagem
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-106.25 text-zinc-100">
                <DialogHeader>
                    <DialogTitle>Planejar nova viagem</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Insira os detalhes do <span className="text-zinc-200">destino</span> e as <span className="text-zinc-200">datas</span> para começar.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Input
                            id="name"
                            placeholder="Nome da viagem (ex: Férias de Verão)"
                            className="bg-zinc-800 border-none focus-visible:ring-lime-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid gap-2">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <Input
                                id="destination"
                                placeholder="Para onde vamos?"
                                className="bg-zinc-800 border-none pl-10 focus-visible:ring-lime-300"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="startsAt" className="text-xs text-zinc-400 ml-1">Início</label>
                            <Input
                                id="startsAt"
                                type="date"
                                className="bg-zinc-800 border-none scheme-dark focus-visible:ring-lime-300"
                                value={startsAt}
                                onChange={(e) => setStartsAt(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="endsAt" className="text-xs text-zinc-400 ml-1">Fim</label>
                            <Input
                                id="endsAt"
                                type="date"
                                className="bg-zinc-800 border-none scheme-dark focus-visible:ring-lime-300"
                                value={endsAt}
                                onChange={(e) => setEndsAt(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleCreateTrip}
                        disabled={loading || !name || !destination || !startsAt || !endsAt}
                        className="w-full disabled:bg-zinc-800 disabled:text-zinc-500 bg-lime-300 text-lime-950 hover:bg-lime-400 cursor-pointer font-bold transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Criando...
                            </>
                        ) : (
                            "Criar Roteiro"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}