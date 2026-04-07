import { X, MapPin, Navigation, Building2, Home, Store } from "lucide-react";

const iconByCategory = {
  veterinary: Building2,
  shelter: Home,
  pet_store: Store,
  default: MapPin,
};

const labelByCategory = {
  veterinary: "Veterinaria",
  shelter: "Abrigo",
  pet_store: "Pet Shop",
  default: "Local",
};

export function NearbyPlacesModal({ isOpen, onClose, places, onSelectPlace }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
      <div className="flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Locais proximos</h2>
            <p className="text-[11px] text-slate-400">
              Veterinarias, abrigos e pet shops na regiao
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

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {!places || places.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <MapPin className="mb-2 h-8 w-8" />
              <p className="text-sm">Nenhum local encontrado nesta regiao.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {places.map((place, index) => {
                const Icon = iconByCategory[place.category] ?? iconByCategory.default;
                const label = labelByCategory[place.category] ?? labelByCategory.default;

                return (
                  <button
                    key={place.id ?? index}
                    type="button"
                    onClick={() => onSelectPlace?.(place)}
                    className="flex w-full items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 text-left transition hover:border-slate-700 hover:bg-slate-800"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-slate-100">
                          {place.name}
                        </span>
                        <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                          {label}
                        </span>
                      </div>
                      {place.address && (
                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          {place.address}
                        </p>
                      )}
                      {place.distance != null && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-blue-400">
                          <Navigation className="h-3 w-3" />
                          {place.distance}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
