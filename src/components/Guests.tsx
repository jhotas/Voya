"use client"
import { CircleCheck, CircleDashed } from "lucide-react";
import { InviteGuestDialog } from "./InviteGuestDialog";

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
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl text-white">Convidados</h2>

      <div className="space-y-5">
        {guests.length > 0 ? (
          guests.map((guest) => (
            <div key={guest.id} className="flex items-center justify-between gap-4">
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
          ))
        ) : (
          <p className="text-zinc-500 text-sm">Nenhum convidado adicionado.</p>
        )}
      </div>

      <InviteGuestDialog tripId={tripId} tripDestination={tripDestination} />
    </div>
  );
}
