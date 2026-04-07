import { Plus } from "lucide-react";

export function FloatingButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-6 right-6 z-[1000] flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/30 transition hover:scale-105 hover:bg-emerald-400 active:scale-95"
      aria-label="Cadastrar animal"
    >
      <Plus className="h-5 w-5" />
    </button>
  );
}
