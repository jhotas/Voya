"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CircleCheck, Circle, Loader2, PencilIcon, ShareIcon, TrashIcon } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { UpdateActivityDialog } from "./UpdateActivityDialog"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { supabase } from "@/lib/supabase"

interface ActivityItemProps {
    activity: {
        id: string
        title: string
        occurs_at: string
        is_completed: boolean
    }
}

export function ActivityItem({ activity }: ActivityItemProps) {
    const router = useRouter()
    const [isDone, setIsDone] = useState(activity.is_completed)
    const [loading, setLoading] = useState(false)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    async function toggleComplete() {
        setLoading(true)
        
        const { error } = await supabase
            .from('activities')
            .update({ is_completed: !isDone })
            .eq('id', activity.id)

        if (error) {
            console.error("Erro ao atualizar:", error.message)
        } else {
            setIsDone(!isDone)
        }
        
        setLoading(false)
    }

    async function handleDelete() {
        setLoading(true)

        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('id', activity.id)

        if (error) {
            alert('Não foi possível eliminar a atividade.')
            setLoading(false)
            return
        }

        router.refresh()
    }

    return (
        <Dialog>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className={`cursor-pointer px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm flex items-center gap-3  transition-all hover:bg-zinc-800 ${isDone ? 'opacity-60' : 'opacity-100 hover:-translate-x-1'}`} onClick={() => !loading && toggleComplete}>
                        <button
                            disabled={loading}
                            className="hover:scale-110 transition-transform"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin text-zinc-500" size={20} />
                            ) : isDone ? (
                                <CircleCheck className="text-lime-300" size={20} />
                            ) : (
                                <Circle className="text-zinc-500" size={20} />
                            )}
                        </button>

                        <span className={`transition-all ${isDone ? "text-zinc-500 line-through" : "text-zinc-100"}`}>
                            {activity.title}
                        </span>

                        <span className="ml-auto text-zinc-400 text-sm" suppressHydrationWarning>
                            {format(parseISO(activity.occurs_at), 'HH:mm')}h
                        </span>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-zinc-200">
                    <ContextMenuGroup>
                        <DialogTrigger asChild>
                            <ContextMenuItem className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-zinc-100">
                                <PencilIcon size={16} />
                                Editar
                            </ContextMenuItem>
                        </DialogTrigger>
                        <ContextMenuItem className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-zinc-100">
                            <ShareIcon size={16} />
                            Partilhar
                        </ContextMenuItem>
                    </ContextMenuGroup>
                    <ContextMenuSeparator />
                    <ContextMenuGroup>
                        <ContextMenuItem 
                            className="gap-2 cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                            disabled={loading}
                            onSelect={handleDelete}
                        >
                            <TrashIcon size={16} />
                            Deletar
                        </ContextMenuItem>
                    </ContextMenuGroup>
                </ContextMenuContent>
            </ContextMenu>

            <UpdateActivityDialog activity={activity} />
        </Dialog>
    )
}