"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Plus, Loader2, Calendar, Tag, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { DatePicker } from "./ui/date-picker"
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
    const [date, setDate] = useState<Date | undefined>()
    const [time, setTime] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleCreateActivity() {
        if (!title || !date || !time) return

        setLoading(true)

        const [hours, minutes] = time.split(':')
        const combinedDate = new Date(date)
        combinedDate.setHours(Number(hours), Number(minutes))

        const { error } = await supabase.from('activities').insert({
            title,
            occurs_at: combinedDate.toISOString(),
            trip_id: tripId,
            is_completed: false
        })

        setLoading(false)

        if (error) {
            console.error("Erro ao criar atividade:", error.message)
            alert("Erro ao salvar atividade.")
        } else {
            setTitle("")
            setDate(undefined)
            setTime("")
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
                        Todos os convidados podem <span className="text-zinc-200">visualizar as atividades.</span>
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

                    <div className="grid grid-cols-2 gap-3">
                        <DatePicker
                            date={date}
                            setDate={setDate}
                            placeholder="Qual dia?"
                        />
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <Input
                                type="time"
                                className="bg-zinc-800 border-none pl-10 scheme-dark focus-visible:ring-lime-300"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleCreateActivity}
                        disabled={loading || !title || !date || !time}
                        className="w-full disabled:bg-zinc-800 disabled:text-zinc-500 bg-lime-300 text-lime-950 hover:bg-lime-400 cursor-pointer font-bold transition-all"
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