'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Link2, PencilIcon, ShareIcon, TrashIcon } from "lucide-react"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { supabase } from "@/lib/supabase"

interface LinkItemProps {
    link: {
        id: string
        title: string,
        url: string
    }
}

export function LinkItem({ link }: LinkItemProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        setLoading(true)

        const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', link.id)

        if (error) {
            alert('Não foi possível eliminar o link.')
            setLoading(false)
            return
        }

        router.refresh()
    }

    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-zinc-600 hover:bg-zinc-700 transition-colors">
            <div className="space-y-1.5 flex-1 min-w-0">
                <ContextMenu>
                    <ContextMenuTrigger>
                        <span className="block font-medium text-zinc-100 text-sm">{link.title}</span>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-zinc-400 truncate hover:text-zinc-300 transition-colors"
                        >
                            {link.url}
                        </a>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-zinc-200">
                        <ContextMenuGroup>
                        <ContextMenuItem className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-zinc-100">
                            <PencilIcon size={16} />
                            Edit
                        </ContextMenuItem>
                        <ContextMenuItem className="gap-2 cursor-pointer focus:bg-zinc-800 focus:text-zinc-100">
                            <ShareIcon size={16} />
                            Share
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
                            Delete
                        </ContextMenuItem>
                        </ContextMenuGroup>
                    </ContextMenuContent>
                </ContextMenu>
            </div>
            <Link2 className="text-zinc-400 shrink-0" size={20} />
        </div>
    )
}