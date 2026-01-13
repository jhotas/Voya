"use client"

import { Calendar, MapPin, Trash2, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface TripCardProps {
    id: string
    name: string
    destination: string
}

export function TripCard({ id, name, destination }: TripCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    async function handleDelete(e: React.MouseEvent) {
        e.stopPropagation()

        if (!confirm("Deseja excluir esta viagem?")) return

        setIsDeleting(true)

        try {
            const { error } = await supabase
                .from('trips')
                .delete()
                .eq('id', id)

            if (error) {
                alert(error.message)
            } else {
                router.refresh()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="relative border border-zinc-200 rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-all">

            <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
            >
                {isDeleting ? (
                    <Loader2 className="animate-spin" size={18} />
                ) : (
                    <Trash2 size={18} />
                )}
            </button>

            <h3 className="font-bold text-lg text-zinc-900 pr-8">{name}</h3>
            
            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-600 text-sm">
                    <MapPin size={16} className="text-blue-500" />
                    <span>{destination}</span>
                </div>
                
                <div className="flex items-center gap-2 text-zinc-600 text-sm">
                    <Calendar size={16} className="text-blue-500" />
                    <span>Data a definir</span>
                </div>
            </div>
        </div>
    )
}