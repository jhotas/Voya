"use client"

import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

export function CreateTripDialog() {
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