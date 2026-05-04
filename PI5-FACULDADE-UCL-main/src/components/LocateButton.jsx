import { Crosshair } from "lucide-react";

export function LocateButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-24 right-6 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-200 shadow-lg ring-1 ring-slate-700 transition hover:bg-slate-700 active:scale-95"
      aria-label="Usar minha localização"
    >
      <Crosshair className="h-4 w-4" />
    </button>
  );
}
