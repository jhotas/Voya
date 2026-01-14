"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Plus, Loader2, Calendar, Tag } from "lucide-react"
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

interface CreateActivityDialogProps {
    tripId: string
}

export function CreateActivityDialog({ tripId }: CreateActivityDialogProps) {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [occursAt, setOccursAt] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleCreateActivity() {
        if (!title || !occursAt) return

        setLoading(true)

        const { error } = await supabase.from('activities').insert({
            title,
            occurs_at: occursAt,
            trip_id: tripId
        })

        setLoading(false)

        if (error) {
            console.error("Erro ao criar atividade:", error.message)
            alert("Erro ao salvar atividade.")
        } else {
            setTitle("")
            setOccursAt("")
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-lime-300 hover:bg-lime-400 text-lime-950 font-medium cursor-pointer transition-colors">
                    <Plus size={20} />
                    Cadastrar atividade
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Cadastrar atividade</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Todos os convidados podem visualizar as atividades.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <Input
                                placeholder="Qual a atividade?"
                                className="bg-zinc-800 border-none pl-10 focus-visible:ring-lime-300"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <Input
                                type="datetime-local"
                                className="bg-zinc-800 border-none pl-10 scheme-dark focus-visible:ring-lime-300"
                                value={occursAt}
                                onChange={(e) => setOccursAt(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleCreateActivity}
                        disabled={loading || !title || !occursAt}
                        className="w-full bg-lime-300 text-lime-950 hover:bg-lime-400 font-bold cursor-pointer transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            "Salvar atividade"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}