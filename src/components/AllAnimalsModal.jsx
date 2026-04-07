import { X } from "lucide-react";
import { AnimalList } from "./AnimalList.jsx";

export function AllAnimalsModal({ isOpen, onClose, animals, onSelectAnimal }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
      <div className="flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Todos os animais cadastrados</h2>
            <p className="text-[11px] text-slate-400">
              Clique em "Ver no mapa" para focar o ponto
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

        <div className="min-h-0 flex-1 overflow-y-auto pb-3">
          <AnimalList
            animals={animals}
            onSelectAnimal={(animal) => {
              onSelectAnimal(animal);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
