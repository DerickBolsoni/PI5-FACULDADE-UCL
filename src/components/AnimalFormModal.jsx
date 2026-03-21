import { useEffect, useState } from "react";
import { X } from "lucide-react";

const urgencyOptions = [
  { value: "low", label: "Saudável / Observação" },
  { value: "medium", label: "Atenção" },
  { value: "high", label: "Urgente" },
];

export function AnimalFormModal({
  isOpen,
  onClose,
  onSubmit,
  onRequestLocation,
  defaultLocation,
  loading,
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState("medium");
  const [fotoFile, setFotoFile] = useState(null);
  const [location, setLocation] = useState(defaultLocation || null);

  useEffect(() => {
    setLocation(defaultLocation || null);
  }, [defaultLocation]);

  useEffect(() => {
    if (!isOpen) {
      setNome("");
      setDescricao("");
      setUrgencia("medium");
      setFotoFile(null);
      setLocation(defaultLocation || null);
    }
  }, [isOpen, defaultLocation]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert("Selecione a localização no mapa ou use sua localização atual.");
      return;
    }

    await onSubmit({
      nome: nome || null,
      descricao,
      urgencia,
      fotoFile,
      lat: location.lat,
      lng: location.lng,
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Registrar animal encontrado
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Nome (opcional)
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Ex: Cachorrinho caramelo"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Foto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="min-h-[72px] w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Ex: Está assustado, parece bem alimentado, com coleira vermelha..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Urgência
              </label>
              <select
                value={urgencia}
                onChange={(e) => setUrgencia(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {urgencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Localização
              </label>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={onRequestLocation}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-emerald-500 hover:text-emerald-300"
                >
                  Usar minha localização
                </button>
                <span className="text-[10px] text-slate-400">
                  Ou clique no mapa para marcar
                </span>
                {location && (
                  <span className="text-[10px] text-emerald-300">
                    Marcado: {location.lat.toFixed(4)},{" "}
                    {location.lng.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Salvando..." : "Registrar animal"}
          </button>
        </form>
      </div>
    </div>
  );
}

