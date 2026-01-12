import { Calendar, MapPin } from "lucide-react";

export function TripCard() {
    return (
        <div className="border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor pointer bg-white">
            <h3 className="font-bold text-lg text-zinc-900">Viagem de Formatura</h3>

            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-zinc-600 text-sm">
                    <MapPin size={16} className="text-lime-950" />
                    <span>Porto Seguro, Brasil</span>
                </div>

                <div className="flex items-center gap-2 text-zinc-600 text-sm">
                    <Calendar size={16} className="text-lime-950" />
                    <span>15 - 22 de Dezembro</span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    3 amigos editando
                </span>
            </div>
        </div>
    )
}