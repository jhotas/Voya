"use client"
import { CircleCheck, Circle, Loader2 } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { format, parseISO } from "date-fns"

interface ActivityItemProps {
    activity: {
        id: string
        title: string
        occurs_at: string
        is_completed: boolean
    }
}

export function ActivityItem({ activity }: ActivityItemProps) {
    const [isDone, setIsDone] = useState(activity.is_completed)
    const [loading, setLoading] = useState(false)

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

    return (
        <div className={`cursor-pointer px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm flex items-center gap-3  transition-all hover:bg-zinc-800 ${isDone ? 'opacity-60' : 'opacity-100 hover:-translate-x-1'}`} onClick={toggleComplete}>
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

            <span className="ml-auto text-zinc-400 text-sm">
                {format(parseISO(activity.occurs_at), 'HH:mm')}h
            </span>
        </div>
    )
}