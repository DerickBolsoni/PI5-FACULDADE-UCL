import { PawPrint } from "lucide-react";

export function Navbar() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur z-20">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <PawPrint className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Waze dos Animais
            </span>
            <span className="text-xs text-slate-400">
              Mapeando animais abandonados perto de você
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

