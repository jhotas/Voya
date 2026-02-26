"use client"
import { useState } from "react";
import { CircleCheck, CircleDashed, TrashIcon, UserMinus } from "lucide-react";
import { InviteGuestDialog } from "./InviteGuestDialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { supabase } from "@/lib/supabase";
import { sendRemovalEmail } from "@/app/actions/send-invite";
import { useRouter } from "next/navigation";

interface Guest {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
}

interface GuestsProps {
  tripId: string;
  tripDestination: string;
  guests: Guest[];
}

export function Guests({ tripId, tripDestination, guests }: GuestsProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  async function handleDeleteGuest(guest: Guest) {
    if (isRemoving) return;

    setIsRemoving(guest.id);

    try {
      const { error } = await supabase
        .from("participants")
        .delete()
        .eq("id", guest.id);

      if (error) {
        alert("Não foi possível remover o convidado.");
        return;
      }

      // Send removal notification email
      await sendRemovalEmail({
        email: guest.email,
        name: guest.name || undefined,
        tripDestination: tripDestination,
      });

      router.refresh();
    } catch (err) {
      console.error("Error removing guest:", err);
    } finally {
      setIsRemoving(null);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl text-white">Convidados</h2>

      <div className="space-y-5">
        {guests.length > 0 ? (
          guests.map((guest) => (
            <ContextMenu key={guest.id}>
              <ContextMenuTrigger>
                <div className={`flex items-center justify-between gap-4 p-2 rounded-lg transition-colors hover:bg-zinc-800/50 ${isRemoving === guest.id ? 'opacity-50 cursor-not-allowed' : 'cursor-default'}`}>
                  <div className="space-y-1.5 min-w-0">
                    <span className="block font-medium text-white text-sm truncate">
                      {guest.name || "Convidado Pendente"}
                    </span>
                    <span className="block text-xs text-zinc-400 truncate font-mono">
                      {guest.email}
                    </span>
                  </div>
                  {guest.is_confirmed ? (
                    <CircleCheck className="text-lime-300 shrink-0" size={20} />
                  ) : (
                    <CircleDashed className="text-zinc-500 shrink-0" size={20} />
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-zinc-200">
                <ContextMenuItem
                  className="gap-2 cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                  onSelect={() => handleDeleteGuest(guest)}
                  disabled={isRemoving !== null}
                >
                  <UserMinus size={16} />
                  Remover convidado
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))
        ) : (
          <p className="text-zinc-500 text-sm">Nenhum convidado adicionado.</p>
        )}
      </div>

      <InviteGuestDialog tripId={tripId} tripDestination={tripDestination} />
    </div>
  );
}
