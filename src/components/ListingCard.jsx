import { ExternalLink, Clock4, Tag, LineChart, Layers } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ListingCard({ item }) {
  const diff = Number(item.difference || 0);
  const goodDeal = diff >= 0; // positive means price below alt_value
  const diffColor = goodDeal
    ? "text-emerald-300 bg-emerald-900/30 border-emerald-700/50"
    : "text-rose-300 bg-rose-900/30 border-rose-700/50";

  return (
    <a
      href={item.marketplace_url}
      target="_blank"
      rel="noreferrer"
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_30px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_24px_60px_-18px_rgba(0,0,0,0.85)] transition-all duration-300"
    >
      {/* Glow + subtle Pokemon-themed gradient ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent"
        style={{
          background:
            "radial-gradient(700px circle at var(--x,50%) var(--y,50%), rgba(59,130,246,0.12), transparent 40%)",
        }}
      />
      <div className="absolute inset-0 rounded-2xl" style={{
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.06), 0 1px 0 0 rgba(255,255,255,0.03)",
        background:
          "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(59,130,246,0.05) 40%, rgba(234,88,12,0.05))",
      }} />

      {/* Base layout: image + quick stats (always visible) */}
      <div className="relative grid grid-cols-[120px_1fr] gap-4 p-4">
        {/* Image */}
        <div className="aspect-[3/4] w-30 rounded-xl overflow-hidden ring-1 ring-white/10 bg-[#0b0f15]">
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transform group-hover:scale-[1.04] transition-transform duration-500"
          />
        </div>

        {/* Quick stats */}
        <div className="min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-sm font-semibold text-slate-100">
              {item.name}
            </h3>
            <span
              className={classNames(
                "shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
                diffColor
              )}
            >
              <LineChart className="h-3.5 w-3.5" />
              {diff > 0 ? "+" : ""}
              {diff.toFixed(2)}%
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-300/90">
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-yellow-300/90" /> ${
                Number(item.price).toLocaleString()
              }
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/80" /> ALT: ${
                Number(item.alt_value).toLocaleString()
              }
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400/80" /> {item.marketplace}
            </div>
          </div>

          {/* Subtle Pokeball divider */}
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Hover panel shadow placeholder height to avoid layout shift */}
          <div className="h-12 sm:h-0" />
        </div>
      </div>

      {/* HOVER REVEAL PANEL: slides in from right on hover */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[62%] translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out">
        <div className="h-full rounded-l-2xl border-l border-white/10 bg-[#0e1420cc] backdrop-blur-xl p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-sky-300/90" /> Grade: {item.grade}</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400/80" /> Supply: {item.supply}</div>
            <div className="flex items-center gap-1.5"><Clock4 className="h-3.5 w-3.5 text-indigo-300/90" /> {timeAgo(item.listed_at)}</div>
            <div className={classNames("flex items-center justify-start")}> 
              <span className={classNames("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] border", tierStyles(item.cartel_category))}>
                {item.cartel_category} Tier
              </span>
            </div>
            <div className="col-span-2 flex items-center gap-2 text-sky-300/90">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="truncate">Open on {item.marketplace}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner accent badge for Pokemon theme */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400/15 via-sky-400/10 to-rose-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-28 w-28 rounded-full bg-gradient-to-tr from-rose-500/10 via-emerald-400/10 to-sky-400/10 blur-2xl" />
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
