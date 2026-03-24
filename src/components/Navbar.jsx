import { Flame, List, PawPrint } from "lucide-react";

export function Navbar({ onOpenAllAnimals, heatmapEnabled, onToggleHeatmap }) {
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleHeatmap}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
              heatmapEnabled
                ? "border-orange-500/60 bg-orange-500/10 text-orange-300"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:border-orange-500/60 hover:text-orange-300"
            }`}
          >
            <Flame className="h-4 w-4" />
            Heatmap
          </button>
          <button
            type="button"
            onClick={onOpenAllAnimals}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-500 hover:text-emerald-300"
          >
            <List className="h-4 w-4" />
            Ver todos
          </button>
        </div>
      </div>
    </header>
  );
}

