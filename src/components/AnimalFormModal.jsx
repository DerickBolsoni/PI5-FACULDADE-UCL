import { X, Upload } from "lucide-react";
import { useState, useEffect } from "react";

export function AnimalFormModal({ isOpen, onClose, onSubmit, defaultLocation, loading }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState("low");
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const lat = defaultLocation?.lat ?? null;
  const lng = defaultLocation?.lng ?? null;

  useEffect(() => {
    if (!isOpen) {
      setNome("");
      setDescricao("");
      setUrgencia("low");
      setFotoFile(null);
      setFotoPreview(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const payload = {
      nome: nome.trim(),
      descricao: descricao.trim(),
      urgencia,
      lat,
      lng,
    };

    if (fotoFile) {
      payload.fotoFile = fotoFile;
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Cadastrar animal</h2>
            <p className="text-[11px] text-slate-400">
              Preencha as informacoes do animal encontrado
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
          {fotoPreview ? (
            <div className="relative">
              <img
                src={fotoPreview}
                alt="Preview"
                className="h-40 w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setFotoFile(null);
                  setFotoPreview(null);
                }}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 py-6 text-slate-400 transition hover:border-slate-500 hover:text-slate-300">
              <Upload className="mb-2 h-6 w-6" />
              <span className="text-xs">Adicionar foto do animal</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Nome *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Cachorro caramelo"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Descricao
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes sobre o animal, localizacao aproximada, etc."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">
              Urgencia
            </label>
            <select
              value={urgencia}
              onChange={(e) => setUrgencia(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="low">Baixa</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          {lat !== null && lng !== null && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Localizacao
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lat.toFixed(6)}
                  readOnly
                  className="w-1/2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-400"
                />
                <input
                  type="text"
                  value={lng.toFixed(6)}
                  readOnly
                  className="w-1/2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-400"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !nome.trim()}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Cadastrar animal"}
          </button>
        </form>
      </div>
    </div>
  );
}
