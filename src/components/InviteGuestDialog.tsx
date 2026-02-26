"use client"
import { useState } from "react";
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation";
import { AtSign, Loader2, Plus, User } from "lucide-react";
import { sendInviteEmail } from "@/app/actions/send-invite"
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

interface InviteGuestDialogProps {
    tripId: string;
    tripDestination: string;
}

export function InviteGuestDialog({ tripId, tripDestination }: InviteGuestDialogProps) {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleInviteGuest() {
        if (!email) return

        setLoading(true)

        const { data, error } = await supabase.from('participants').insert({
            name,
            email,
            trip_id: tripId,
            is_confirmed: false
        }).select('id').single()

        setLoading(false)

        if (error || !data) {
            console.error("Erro ao convidar: ", error?.message || "Sem dados retornados")
            alert("Erro ao criar convite. Verifique sua conexão.")
        } else {
            // Generate confirmation link
            const confirmationLink = `${window.location.origin}/trips/confirm/${data.id}`

            // Send REAL email
            const emailResult = await sendInviteEmail({
              email,
              name,
              tripDestination,
              confirmationLink
            });

            if (emailResult.success) {
              alert(`Convite enviado com sucesso para ${email}!`);
            } else {
              console.error("Email error:", emailResult.error);
              alert("Usuário adicionado, mas falhou ao enviar o e-mail real. Verifique se a RESEND_API_KEY está configurada.");
            }

            setName("")
            setEmail("")
            setOpen(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"secondary"} className="w-full gap-2 bg-zinc-800 hover:bg-zinc-700 cursor-pointer border border-zinc-700">
                    <Plus size={18} />
                    Convidar novo participante
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 w-[95vw] sm:max-w-[480px] p-6 focus:outline-none">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">Convidar participante</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        O convidado receberá um e-mail para <span className="text-zinc-200 font-medium">confirmar a presença</span> na viagem.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-6">
                    <div className="grid gap-2">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <Input
                                placeholder="Nome do convidado (opcional)"
                                className="bg-zinc-800 border-none h-12 pl-10 focus-visible:ring-lime-300 transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <Input
                                type="email"
                                placeholder="E-mail do convidado"
                                className="bg-zinc-800 border-none h-12 pl-10 focus-visible:ring-lime-300 transition-all font-mono"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleInviteGuest}
                        disabled={loading || !email}
                        className="w-full h-12 disabled:bg-zinc-800 disabled:text-zinc-500 bg-lime-300 text-lime-950 hover:bg-lime-400 cursor-pointer font-bold text-lg transition-all shadow-lg shadow-lime-300/10"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            "Enviar convite"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
