import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Wallet } from "lucide-react";

export default function Header({ query, onQuery, filter, onFilter, sort, onSort, wallet, onConnect }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sorts = useMemo(() => ([
    { value: "listed_at_desc", label: "Newest" },
    { value: "listed_at_asc", label: "Oldest" },
    { value: "price_desc", label: "Price: High → Low" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "difference_desc", label: "Difference: High → Low" },
    { value: "difference_asc", label: "Difference: Low → High" },
  ]), []);

  const tiers = ["All", "Gold", "Silver", "Bronze"];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0B0F15]/70 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
        <div className="text-slate-100 font-extrabold tracking-tight text-lg sm:text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-indigo-300 to-fuchsia-300 drop-shadow">Cards</span>
          <span className="text-slate-100"> Cartel</span>
        </div>

        <div className="relative ml-2 flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search cards by name..."
            className="w-full rounded-lg bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            {tiers.map(t => (
              <button
                key={t}
                onClick={() => onFilter(t === "All" ? "" : t)}
                className={`px-2.5 py-1 text-xs rounded-md transition ${filter === (t === "All" ? "" : t) ? "bg-white/10 text-slate-100" : "text-slate-400 hover:text-slate-200"}`}
              >{t}</button>
            ))}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200"
            >
              {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <button onClick={onConnect} className="ml-2 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30">
          <Wallet className="h-4 w-4" />
          {mounted && wallet?.address ? truncate(wallet.address) : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}

function truncate(addr) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}
