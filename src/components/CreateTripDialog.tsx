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
import { Label } from "./ui/label"
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
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus size={18} /> Nova Viagem
                </Button>
            </DialogTrigger>

            <DialogContent className="sm-w-max[425px]">
                <DialogHeader>
                    <DialogTitle>Planejar nova viagem</DialogTitle>
                    <DialogDescription>
                        Insira os detalhes do destino para começar a planejar com seus amigos.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome da Viagem</Label>
                        <Input
                            id="name"
                            placeholder="Ex: Eurotrip 2026"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="destination">Destino</Label>
                        <Input
                            id="destination"
                            placeholder="Ex: Paris, França"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleCreateTrip}
                        disabled={loading || !name || !destination}
                        className="w-full"
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