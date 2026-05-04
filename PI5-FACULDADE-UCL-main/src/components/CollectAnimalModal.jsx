import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

export function CollectAnimalModal({ isOpen, animal, loading, onClose, onConfirm }) {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  }, [isOpen]);

  if (!isOpen || !animal) return null;

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!photoFile) return;
    onConfirm(photoFile);
  };

  return (
    <div className="fixed inset-0 z-[3200] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Confirmar coleta</h2>
            <p className="text-[11px] text-slate-400">
              Envie uma foto para confirmar que {animal.nome || "este animal"} foi coletado.
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

        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {photoPreview ? (
            <div className="relative">
              <img src={photoPreview} alt="Comprovante de coleta" className="h-52 w-full rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 py-8 text-slate-400 transition hover:border-slate-500 hover:text-slate-300">
              <Upload className="mb-2 h-6 w-6" />
              <span className="text-xs">Selecionar foto de confirmação</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}

          <button
            type="submit"
            disabled={loading || !photoFile}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Confirmar coleta"}
          </button>
        </form>
      </div>
    </div>
  );
}
