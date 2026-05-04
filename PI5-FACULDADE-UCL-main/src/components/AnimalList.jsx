const urgencyText = {
  low: "Saudável / Observação",
  medium: "Atenção",
  high: "Urgente",
};

const urgencyColor = {
  low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  medium: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  high: "bg-red-500/20 text-red-300 border-red-500/40",
};

const routeButtonColor = {
  low: "border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10",
  medium: "border-amber-500/40 text-amber-300 hover:bg-amber-500/10",
  high: "border-red-500/40 text-red-300 hover:bg-red-500/10",
};

function isCollectedAnimal(animal) {
  return Boolean(
    animal?.coletado ||
      animal?.status === "coletado" ||
      animal?.coletado_em ||
      animal?.coleta_foto_url ||
      animal?.foto_coleta_url
  );
}

export function AnimalList({
  animals,
  onSelectAnimal,
  onRouteToAnimal,
  onOpenExternalNavigation,
  onCollectAnimal,
}) {
  if (!animals?.length) {
    return (
      <div className="px-4 py-3 text-sm text-slate-400">
        Nenhum animal cadastrado por perto ainda.
      </div>
    );
  }

  return (
    <div className="space-y-3 px-4 py-3">
      {animals.map((animal) => (
        (() => {
          const collected = isCollectedAnimal(animal);
          return (
        <article
          key={animal.id}
          className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3 shadow-sm"
        >
          {animal.foto_url ? (
            <img
              src={animal.foto_url}
              alt={animal.nome || "Animal encontrado"}
              className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-400">
              Sem foto
            </div>
          )}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">
                {animal.nome || "Animal sem nome"}
              </h3>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${urgencyColor[animal.urgencia]}`}
              >
                {urgencyText[animal.urgencia] || "Indefinido"}
              </span>
            </div>
            {collected && (
              <span className="inline-flex w-fit rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Coletado
              </span>
            )}

            <p className="line-clamp-2 text-xs text-slate-300">
              {animal.descricao}
            </p>

            <p className="text-[10px] text-slate-500 pt-1">
              {animal.criado_em
                ? new Date(animal.criado_em).toLocaleString("pt-BR")
                : ""}
            </p>

            <div className="mt-1 flex flex-wrap gap-2">
              {onSelectAnimal && (
                <>
                  <button
                    type="button"
                    onClick={() => onSelectAnimal(animal)}
                    className="inline-flex rounded-md border border-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-200 hover:border-emerald-500 hover:text-emerald-300"
                  >
                    Ver no mapa
                  </button>
                  <button
                    type="button"
                    onClick={() => onRouteToAnimal?.(animal)}
                    disabled={collected}
                    className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold ${routeButtonColor[animal.urgencia] || "border-blue-500/40 text-blue-300 hover:bg-blue-500/10"}`}
                  >
                    Iniciar
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenExternalNavigation?.(animal)}
                    className="inline-flex rounded-md border border-cyan-500/40 px-2 py-1 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Navegar no Waze
                  </button>
                  <button
                    type="button"
                    onClick={() => onCollectAnimal?.(animal)}
                    disabled={collected}
                    className="inline-flex rounded-md border border-emerald-500/40 px-2 py-1 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {collected ? "Coletado" : "Marcar coletado"}
                  </button>
                </>
              )}
            </div>
          </div>
        </article>
          );
        })()
      ))}
    </div>
  );
}
