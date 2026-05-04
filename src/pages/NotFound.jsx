import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl">
        <p className="text-5xl font-bold text-violet-400">404</p>
        <h1 className="mt-3 text-xl font-semibold">Pagina nao encontrada</h1>
        <p className="mt-2 text-sm text-slate-400">
          O endereco digitado nao existe. Confira a URL e tente novamente.
        </p>

        <div className="mt-6 flex items-center justify-center">
          <Link
            to="/"
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
          >
            Ir para o mapa
          </Link>
        </div>
      </div>
    </main>
  );
}
