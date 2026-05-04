import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  LayoutDashboard,
  MapPin,
  PawPrint,
  RefreshCw,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient.js";

const urgencyMeta = {
  low: { label: "Saudável / Observação", bar: "bg-emerald-500", text: "text-emerald-300" },
  medium: { label: "Atenção", bar: "bg-amber-500", text: "text-amber-300" },
  high: { label: "Urgente", bar: "bg-red-500", text: "text-red-300" },
};

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return String(value);
  }
}

function StatCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-slate-100">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function AdminCenter() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase não configurado. Defina as variáveis no .env.local.");
      setAnimals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    const { data, error: fetchError } = await supabase
      .from("animais")
      .select("*")
      .order("criado_em", { ascending: false });

    if (fetchError) {
      setError(fetchError.message || "Erro ao carregar dados.");
      setAnimals([]);
    } else {
      setAnimals(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeAnimal = useCallback(async (row) => {
    if (!isSupabaseConfigured) {
      alert("Supabase não configurado.");
      return;
    }
    if (!confirm(`Remover "${row.nome || "sem nome"}"?`)) return;
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/animais?id=eq.${encodeURIComponent(row.id)}`;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: "return=minimal",
        },
      });
      const bodyText = await res.text();
      if (res.ok) {
        setAnimals((prev) => prev.filter((a) => a.id !== row.id));
      } else {
        alert(`Erro: ${bodyText}`);
      }
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  }, []);

  const stats = useMemo(() => {
    const total = animals.length;
    const byUrgency = { low: 0, medium: 0, high: 0, other: 0 };
    let withPhoto = 0;
    animals.forEach((a) => {
      if (a.foto_url) withPhoto += 1;
      if (byUrgency[a.urgencia] !== undefined) byUrgency[a.urgencia] += 1;
      else byUrgency.other += 1;
    });
    const withCoords = animals.filter((a) => a.lat != null && a.lng != null).length;
    return { total, byUrgency, withPhoto, withCoords, withoutPhoto: total - withPhoto };
  }, [animals]);

  const maxUrgencyBar = Math.max(
    stats.byUrgency.low,
    stats.byUrgency.medium,
    stats.byUrgency.high,
    1
  );

  const extraKeys = useMemo(() => {
    const skip = new Set([
      "id",
      "nome",
      "descricao",
      "urgencia",
      "foto_url",
      "lat",
      "lng",
      "criado_em",
    ]);
    const keys = new Set();
    animals.forEach((row) => {
      Object.keys(row || {}).forEach((k) => {
        if (!skip.has(k) && row[k] != null && row[k] !== "") keys.add(k);
      });
    });
    return [...keys];
  }, [animals]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-500/60 hover:text-emerald-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Mapa
            </Link>
            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-tight">Admin Center</h1>
                <p className="text-[11px] text-slate-500">
                  Visão geral dos registros no Supabase
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => load()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-violet-500/50 hover:text-violet-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Falha ao buscar animais</p>
              <p className="mt-1 text-xs text-red-200/80">{error}</p>
            </div>
          </div>
        )}

        {stats.total > 0 && (
          <section className="rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {stats.total} animais cadastrados
              </span>
              <button
                onClick={() => {
                  if (!confirm(`Excluir TODOS os animais (${stats.total})?`)) return;
                  setAnimals([]);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir tudo
              </button>
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <PawPrint className="h-4 w-4" />
            Indicadores
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total de registros"
              value={loading ? "…" : stats.total}
              subtitle="Todos os animais na base"
              icon={PawPrint}
              accent="bg-emerald-500/20 text-emerald-400"
            />
            <StatCard
              title="Com foto"
              value={loading ? "…" : stats.withPhoto}
              subtitle={`${stats.withoutPhoto} sem foto`}
              icon={Camera}
              accent="bg-blue-500/20 text-blue-400"
            />
            <StatCard
              title="Com coordenadas"
              value={loading ? "…" : stats.withCoords}
              subtitle="Prontos para o mapa"
              icon={MapPin}
              accent="bg-amber-500/20 text-amber-400"
            />
            <StatCard
              title="Urgentes"
              value={loading ? "…" : stats.byUrgency.high}
              subtitle="Nível high"
              icon={AlertTriangle}
              accent="bg-red-500/20 text-red-400"
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Distribuição por urgência
          </h2>
          <div className="space-y-4">
            {(["high", "medium", "low"]).map((key) => {
              const meta = urgencyMeta[key];
              const count = stats.byUrgency[key];
              const pct = Math.round((count / maxUrgencyBar) * 100);
              return (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className={meta.text}>{meta.label}</span>
                    <span className="font-mono text-slate-400">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${meta.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {stats.byUrgency.other > 0 && (
              <p className="text-[11px] text-slate-500">
                Outros valores de urgência: {stats.byUrgency.other}
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tabela completa
            </h2>
          </div>
          <div className="overflow-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead className="sticky top-0 z-[2] bg-slate-900 shadow-sm">
                <tr className="border-b border-slate-800">
                  <th className="whitespace-nowrap px-3 py-3 font-semibold text-slate-400">
                    Foto
                  </th>
                  <th className="whitespace-nowrap px-3 py-3 font-semibold text-slate-400">
                    Ações
                  </th>
                  <th className="whitespace-nowrap px-3 py-3 font-semibold text-slate-400">
                    Nome
                  </th>
                  <th className="min-w-[180px] px-3 py-3 font-semibold text-slate-400">
                    Descrição
                  </th>
                  <th className="whitespace-nowrap px-3 py-3 font-semibold text-slate-400">
                    Urgência
                  </th>
                  <th className="whitespace-nowrap px-3 py-3 font-semibold text-slate-400">
                    Foto URL
                  </th>
                  {extraKeys.map((k) => (
                    <th
                      key={k}
                      className="whitespace-nowrap px-3 py-3 font-semibold text-violet-300/80"
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && animals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6 + extraKeys.length}
                      className="px-4 py-12 text-center text-slate-500"
                    >
                      Carregando…
                    </td>
                  </tr>
                ) : animals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6 + extraKeys.length}
                      className="px-4 py-12 text-center text-slate-500"
                    >
                      Nenhum animal cadastrado.
                    </td>
                  </tr>
                ) : (
                  animals.map((row) => (
                    <tr
                      key={row.id ?? `${row.lat}-${row.lng}-${row.criado_em}`}
                      className="border-b border-slate-800/80 transition hover:bg-slate-800/40"
                    >
                      <td className="px-3 py-2 align-middle">
                        {row.foto_url ? (
                          <a
                            href={row.foto_url}
                            target="_blank"
                            rel="noreferrer"
                            className="block"
                          >
                            <img
                              src={row.foto_url}
                              alt=""
                              className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-700"
                            />
                          </a>
                        ) : (
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-[10px] text-slate-500">
                            —
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <button
                          onClick={() => removeAnimal(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3" />
                          Excluir
                        </button>
                      </td>
                      <td className="max-w-[140px] truncate px-3 py-2 text-slate-200 font-semibold">
                        {row.nome || "—"}
                      </td>
                      <td className="max-w-[200px] px-3 py-2 text-slate-400">
                        <span className="line-clamp-2">{row.descricao || "—"}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            row.urgencia === "high"
                              ? "border-red-500/40 bg-red-500/15 text-red-300"
                              : row.urgencia === "medium"
                                ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                                : "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                          }`}
                        >
                          {row.urgencia || "—"}
                        </span>
                      </td>
                      <td className="max-w-[180px] px-3 py-2">
                        {row.foto_url ? (
                          <a
                            href={row.foto_url}
                            target="_blank"
                            rel="noreferrer"
                            className="break-all text-[10px] text-violet-400 underline-offset-2 hover:underline"
                          >
                            {row.foto_url}
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-600">—</span>
                        )}
                      </td>
                      {extraKeys.map((k) => (
                        <td
                          key={k}
                          className="max-w-[160px] truncate px-3 py-2 font-mono text-[10px] text-slate-500"
                          title={row[k] != null ? String(row[k]) : ""}
                        >
                          {row[k] != null ? String(row[k]) : "—"}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="border-t border-slate-800 pt-6 text-center text-[11px] text-slate-600">
          Rota interna — sem autenticação. Proteja o deploy ou adicione login depois.
        </footer>
      </main>
    </div>
  );
}
