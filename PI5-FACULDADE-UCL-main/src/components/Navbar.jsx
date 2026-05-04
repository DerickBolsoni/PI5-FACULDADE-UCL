import { Flame, List, Moon, Sun } from "lucide-react";

export function Navbar({ onOpenAllAnimals, heatmapEnabled, onToggleHeatmap, darkMap, onToggleDarkMap }) {
  return (
    <nav className="shrink-0 flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2 sm:px-4">
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-100">
        <span className="hidden sm:inline">Waze Animais</span>
        <span className="sm:hidden">Waze</span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onToggleHeatmap}
          className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition hover:bg-slate-800 ${
            heatmapEnabled ? "bg-orange-500/20 text-orange-300" : "text-slate-300"
          }`}
          title="Heatmap"
        >
          <Flame className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onOpenAllAnimals}
          className="flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1.5 text-[11px] font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
          title="Todos os animais"
        >
          <List className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onToggleDarkMap}
          className={`flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition hover:bg-slate-800 ${
            darkMap ? "bg-blue-500/15 text-blue-300" : "text-slate-300"
          }`}
        >
          {darkMap ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{darkMap ? "Claro" : "Noturno"}</span>
        </button>
      </div>
    </nav>
  );
}
