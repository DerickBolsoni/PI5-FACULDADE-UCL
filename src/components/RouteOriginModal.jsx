import { useEffect, useState } from "react";
import { Search, MapPin, X } from "lucide-react";

export function RouteOriginModal({ isOpen, destinationName, onClose, onConfirmLocation }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSuggestions([]);
      setSelected(null);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const encodedQuery = encodeURIComponent(`${trimmedQuery}, Brasil`);
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&q=${encodedQuery}`;
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Falha ao buscar localizacao");
        const data = await response.json();
        setSuggestions(
          (data || []).map((item) => ({
            id: item.place_id,
            name: item.display_name,
            lat: Number(item.lat),
            lng: Number(item.lon),
          }))
        );
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Erro ao buscar sugestoes de endereco:", error);
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selected) return;
    onConfirmLocation(selected);
  };

  return (
    <div className="fixed inset-0 z-[3100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Definir localizacao atual</h2>
            <p className="text-[11px] text-slate-400">
              Nao foi possivel obter seu GPS. Digite sua localizacao para navegar ate {destinationName || "o destino"}.
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

        <div className="space-y-3 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
              placeholder="Ex: Avenida Paulista, Sao Paulo"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/60">
            {query.trim().length < 3 && (
              <p className="px-3 py-2 text-xs text-slate-400">
                Digite pelo menos 3 caracteres para ver recomendacoes.
              </p>
            )}
            {loading && (
              <p className="px-3 py-2 text-xs text-slate-400">Buscando sugestoes...</p>
            )}
            {!loading && query.trim().length >= 3 && suggestions.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-400">
                Nenhuma sugestao encontrada. Tente um endereco mais completo.
              </p>
            )}

            {!loading &&
              suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item)}
                  className={`flex w-full items-start gap-2 border-b border-slate-800 px-3 py-2 text-left last:border-b-0 hover:bg-slate-800/60 ${
                    selected?.id === item.id ? "bg-blue-500/10" : ""
                  }`}
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="text-xs text-slate-200">{item.name}</span>
                </button>
              ))}
          </div>

          <button
            type="button"
            disabled={!selected}
            onClick={handleConfirm}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Usar este local como origem
          </button>
        </div>
      </div>
    </div>
  );
}
