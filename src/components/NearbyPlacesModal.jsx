import { useEffect, useState } from "react";
import { Building2, MapPinned, Route, Stethoscope, X } from "lucide-react";
import { getNearbySupportPlaces } from "../lib/nearbyPlaces.js";

function mapsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`;
}

function PlaceCard({ title, icon, place, emptyMessage }) {
  if (!place) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-300">
          {icon}
          {title}
        </div>
        <p className="text-xs text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-200">
        {icon}
        {title}
      </div>
      <p className="text-sm font-semibold">{place.name}</p>
      <p className="mt-0.5 text-xs text-slate-400">
        Distância aproximada: {place.distanceKm.toFixed(2)} km
      </p>
      <button
        type="button"
        onClick={() => window.open(mapsUrl(place.lat, place.lng), "_blank", "noopener,noreferrer")}
        className="mt-2 inline-flex items-center gap-1 rounded-md border border-blue-500/40 px-2 py-1 text-[11px] font-semibold text-blue-300 hover:bg-blue-500/10"
      >
        <Route className="h-3.5 w-3.5" />
        Me levar até lá
      </button>
    </div>
  );
}

export function NearbyPlacesModal({ isOpen, onClose, animal }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [places, setPlaces] = useState({ nearestVet: null, nearestNgo: null });

  useEffect(() => {
    if (!isOpen || !animal?.lat || !animal?.lng) return;

    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getNearbySupportPlaces(animal.lat, animal.lng);
        if (!cancelled) setPlaces(result);
      } catch (err) {
        if (!cancelled) {
          setError("Não foi possível buscar locais próximos agora.");
          setPlaces({ nearestVet: null, nearestNgo: null });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isOpen, animal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">ONGs e veterinários próximos</h2>
            <p className="text-[11px] text-slate-400">
              Ponto: {animal?.nome || "Animal sem nome"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 p-4">
          {loading && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300">
              Buscando locais próximos...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-3">
              <PlaceCard
                title="ONG / abrigo mais próximo"
                icon={<Building2 className="h-4 w-4 text-emerald-300" />}
                place={places.nearestNgo}
                emptyMessage="Nenhuma ONG/abrigo encontrado no raio da busca."
              />
              <PlaceCard
                title="Clínica veterinária mais próxima"
                icon={<Stethoscope className="h-4 w-4 text-amber-300" />}
                place={places.nearestVet}
                emptyMessage="Nenhuma clínica veterinária encontrada no raio da busca."
              />
            </div>
          )}

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <MapPinned className="h-3.5 w-3.5" />
            Resultado por OpenStreetMap (Overpass), raio de busca de até 10 km.
          </div>
        </div>
      </div>
    </div>
  );
}

