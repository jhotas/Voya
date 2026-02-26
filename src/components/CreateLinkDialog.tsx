"use client"
import { useState } from "react";
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation";
import { Link2, Loader2, PencilLine, Plus } from "lucide-react";
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
import { Button } from "./ui/button";

interface CreateLinkDialogProps {
    tripId: string
}

export function CreateLinkDialog({ tripId }: CreateLinkDialogProps) {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [link, setLink] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleCreateLink() {
        if (!title || !link) return

        setLoading(true)

        const { error } = await supabase.from('links').insert({
            title,
            trip_id: tripId,
            url: link
        })

        setLoading(false)

        if (error) {
            console.log("Erro ao criar link: ", error.message)
            alert("Erro ao criar atividade.")
        } else {
            setTitle("")
            setLink("")
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"secondary"} className="w-full gap-2 bg-zinc-800 hover:bg-zinc-700 cursor-pointer border border-zinc-700">
                    <Plus size={20} />
                    Cadastrar novo link
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 w-[95vw] sm:max-w-[480px] p-6 focus:outline-none">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">Cadastrar link</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Todos os convidados podem <span className="text-zinc-200 font-medium">acessar os links.</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-6">
                    <div className="grid gap-2">
                        <div className="relative">
                            <PencilLine className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <Input
                                placeholder="Qual o nome do link?"
                                className="bg-zinc-800 border-none h-12 pl-10 focus-visible:ring-lime-300 transition-all"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <Input
                                placeholder="Link"
                                className="bg-zinc-800 border-none h-12 pl-10 focus-visible:ring-lime-300 transition-all font-mono"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleCreateLink}
                        disabled={loading || !title || !link}
                        className="w-full h-12 disabled:bg-zinc-800 disabled:text-zinc-500 bg-lime-300 text-lime-950 hover:bg-lime-400 cursor-pointer font-bold text-lg transition-all shadow-lg shadow-lime-300/10"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            "Salvar link"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}