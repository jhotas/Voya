"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"

interface UpdateActivityDialogProps {
    activity: {
        id: string,
        title: string,
        occurs_at: string
    }
}

export function UpdateActivityDialog({ activity }: UpdateActivityDialogProps) {
    const router = useRouter()
    const [title, setTitle] = useState(activity.title)
    const [occursAt, setOccursAt] = useState(activity.occurs_at)
    const [loading, setLoading] = useState(false)

    async function handleUpdate() {
        setLoading(true)

        const { error } = await supabase
        .from('activities')
        .update({
            title: title,
            occursAt: occursAt
        })
        .eq('id', activity.id)

        setLoading(false)

        if (error) {
            alert("Erro ao atualizar")
        } else {
            router.refresh()
        }
    }    

    return (
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
                <DialogTitle>Editar atividade</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
                <Input
                    className="bg-zinc-800 border-none pl-10 focus-visible:ring-lime-300"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    className="bg-zinc-800 border-none pl-10 focus-visible:ring-lime-300"
                    value={occursAt.substring(0, 16)}
                    onChange={(e) => setOccursAt(e.target.value)}
                />
            </div>

            <DialogFooter>
                <Button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-lime-300 text-lime-950"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Salvar alterações"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}