"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

import { Plus, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter, DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog"
import { Input } from "./ui/input"

export function CreateTripDialog() {
    const { userId } = useAuth()
    const router = useRouter()

    const [name, setName] = useState("")
    const [destination, setDestination] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleCreateTrip() {
        if (!name || !destination || !userId) return

        setLoading(true)

        const { error } = await supabase.from('trips').insert({
            name,
            destination,
            user_id: userId
        })

        setLoading(false)

        if (error) {
            console.error("Erro ao criar viagem: ", error.message) 
        } else {
            setName("")
            setDestination("")
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-lime-300 hover:bg-zinc-500 text-lime-950">
                    <Plus size={18} /> Nova Viagem
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-700 sm-w-max[425px]">
                <DialogHeader>
                    <DialogTitle >Planejar nova viagem</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Insira os detalhes do <span className="text-zinc-200">destino</span> para começar a planejar com seus amigos.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Input
                            id="name"
                            placeholder="Nome da viagem"
                            className="bg-zinc-800 border-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="destination"
                            placeholder="Para onde vamos?"
                            className="bg-zinc-800 border-none"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleCreateTrip}
                        disabled={loading || !name || !destination}
                        className="w-full disabled:bg-lime-950 bg-lime-300 enabled:text-lime-950 enabled:cursor-pointer"
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