import { ExternalLink, Clock4, Tag, LineChart, Layers } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ListingCard({ item }) {
  const diff = Number(item.difference || 0);
  const goodDeal = diff >= 0; // positive means price below alt_value
  const diffColor = goodDeal ? "text-emerald-300 bg-emerald-900/30 border-emerald-700/50" : "text-rose-300 bg-rose-900/30 border-rose-700/50";

  return (
    <a
      href={item.marketplace_url}
      target="_blank"
      rel="noreferrer"
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_30px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_14px_40px_-10px_rgba(0,0,0,0.75)] transition-all duration-300"
    >
      {/* Glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
        background: "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(99,102,241,0.15), transparent 40%)"
      }} />
      <div className="grid grid-cols-[112px_1fr] gap-4 p-4">
        <div className="aspect-[3/4] w-28 rounded-lg overflow-hidden ring-1 ring-white/10">
          <img src={item.image_url} alt={item.name} loading="lazy" className="h-full w-full object-cover transform group-hover:scale-[1.03] transition-transform duration-300" />
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-sm font-semibold text-slate-100">
              {item.name}
            </h3>
            <span className={classNames("shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold", diffColor)}>
              <LineChart className="h-3 w-3" />
              {diff > 0 ? "+" : ""}{diff.toFixed(2)}%
            </span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-300/90">
            <div className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-sky-300/80" /> ${Number(item.price).toLocaleString()}</div>
            <div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-amber-300/80" /> {item.grade}</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-400/70" /> Supply: {item.supply}</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-fuchsia-400/70" /> ALT: ${Number(item.alt_value).toLocaleString()}</div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-slate-400">
            <div className="inline-flex items-center gap-1.5">
              <Clock4 className="h-3.5 w-3.5" /> {timeAgo(item.listed_at)}
            </div>
            <div className={classNames("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] border", tierStyles(item.cartel_category))}>
              {item.cartel_category} Tier
            </div>
            <div className="inline-flex items-center gap-1.5 text-sky-300 group-hover:text-sky-200">
              {item.marketplace}
              <ExternalLink className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

function timeAgo(iso) {
  try {
    const then = new Date(iso);
    const s = Math.floor((Date.now() - then.getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  } catch {
    return "";
  }
}

function tierStyles(tier) {
  switch ((tier || "").toLowerCase()) {
    case "gold":
      return "border-yellow-400/30 bg-yellow-400/5 text-yellow-200";
    case "silver":
      return "border-slate-300/30 bg-slate-300/5 text-slate-200";
    case "bronze":
      return "border-amber-700/30 bg-amber-700/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-slate-200";
  }
}
