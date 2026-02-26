"use client"

import { Calendar, MapPin, Trash2, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface TripCardProps {
    id: string
    name: string
    destination: string
    starts_at?: string
}

export function TripCard({ id, name, destination, starts_at }: TripCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    async function handleDelete(e: React.MouseEvent) {
        e.preventDefault()
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
        <Link
            href={`/trips/${id}`}
            className="relative border border-zinc-500 rounded-xl p-5 shadow-sm bg-zinc-700 hover:shadow-md transition-all"
        >
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

            <h3 className="font-bold text-lg text-white pr-8">{name}</h3>

            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <MapPin size={16} className="text-lime-300" />
                    <span>{destination}</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <Calendar size={16} className="text-lime-300" />
                    <span>
                        {starts_at
                            ? new Date(starts_at).toLocaleDateString('pt-BR')
                            : "Data a definir"}
                    </span>
                </div>
            </div>
        </Link>
    )
}