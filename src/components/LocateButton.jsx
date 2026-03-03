import { Crosshair } from "lucide-react";

export function LocateButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-24 left-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/90 text-slate-100 shadow-md shadow-black/40 backdrop-blur transition hover:border-emerald-400 hover:text-emerald-300 sm:bottom-6"
      aria-label="Ir para minha localização"
    >
      <Crosshair className="h-5 w-5" />
    </button>
  );
}

