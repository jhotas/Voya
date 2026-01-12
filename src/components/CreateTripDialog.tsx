"use client"

import { useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase"

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
    const [name, setName] = useState("")
    const [destination, setDestination] = useState("")

    async function handleCreateTrip() {
        if (!name || !destination || !userId) return

        const { error } = await supabase.from('trips').insert({
            name,
            destination,
            user_id: userId
        })

        if (error) {
            console.error("Erro ao criar viagem: ", error.message) 
        } else {
            alert("Viagem criada com sucesso!")
            window.location.reload()
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
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
                        <Input id="name" placeholder="Ex: Eurotrip 2026"></Input>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="destination">Destino</Label>
                        <Input id="destination" placeholder="Ex: Paris, França"></Input>
                    </div>
                </div>

                <DialogFooter>
                    <Button className="w-full" type="submit">Criar Roteiro</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}