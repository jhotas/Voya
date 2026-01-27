'use client'
import { Link2 } from "lucide-react"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface LinkItemProps {
    link: {
        title: string,
        url: string
    }
}

export function LinkItem({ link }: LinkItemProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <span className="block font-medium text-zinc-100 text-sm">{link.title}</span>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-zinc-400 truncate hover:text-zinc-300 transition-colors"
                        >
                            {link.url}
                        </a>
                    </div>
                    <Link2 className="text-zinc-400 shrink-0" size={20} />
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuGroup>
                    <ContextMenuItem>
                        Edit
                    </ContextMenuItem>
                    <ContextMenuItem>
                        Delete
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    )
}