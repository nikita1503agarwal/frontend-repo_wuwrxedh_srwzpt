import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import ListingCard from './components/ListingCard';
import WalletModal from './components/WalletModal';
import './index.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function App() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('listed_at_desc');
  const [openWallet, setOpenWallet] = useState(false);
  const [wallet, setWallet] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cc_wallet') || 'null'); } catch { return null; }
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wallet) localStorage.setItem('cc_wallet', JSON.stringify(wallet));
    else localStorage.removeItem('cc_wallet');
  }, [wallet]);

  // Poll listings frequently for near real-time updates
  useEffect(() => {
    let active = true;
    async function fetchListings() {
      try {
        const res = await fetch(`${API_BASE}/api/listings`);
        const data = await res.json();
        if (active) {
          setListings(data);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    fetchListings();
    const id = setInterval(fetchListings, 15000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const filtered = useMemo(() => {
    let arr = listings;
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(x => x.name.toLowerCase().includes(q));
    }
    if (filter) {
      arr = arr.filter(x => (x.cartel_category || '').toLowerCase() === filter.toLowerCase());
    }
    const sortMap = {
      'listed_at_desc': (a,b) => new Date(b.listed_at) - new Date(a.listed_at),
      'listed_at_asc': (a,b) => new Date(a.listed_at) - new Date(b.listed_at),
      'price_desc': (a,b) => Number(b.price) - Number(a.price),
      'price_asc': (a,b) => Number(a.price) - Number(b.price),
      'difference_desc': (a,b) => Number(b.difference) - Number(a.difference),
      'difference_asc': (a,b) => Number(a.difference) - Number(b.difference),
    };
    return [...arr].sort(sortMap[sort] || (()=>0));
  }, [listings, query, filter, sort]);

  // Track mouse for glow
  useEffect(() => {
    const root = document.documentElement;
    function handle(e){
      root.style.setProperty('--x', e.clientX + 'px');
      root.style.setProperty('--y', e.clientY + 'px');
    }
    window.addEventListener('pointermove', handle);
    return () => window.removeEventListener('pointermove', handle);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-200 relative overflow-hidden">
      {/* Hex background */}
      <HexBackground />

      <Header
        query={query}
        onQuery={setQuery}
        filter={filter}
        onFilter={setFilter}
        sort={sort}
        onSort={setSort}
        wallet={wallet}
        onConnect={() => setOpenWallet(true)}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="grid place-items-center py-24 text-slate-400">Loading listings…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filtered.map(item => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <WalletModal open={openWallet} onClose={() => setOpenWallet(false)} onConnected={setWallet} />
    </div>
  );
}

function HexBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25]" aria-hidden>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" width="48" height="42" patternUnits="userSpaceOnUse" patternTransform="translate(0,0)">
            <g fill="none" stroke="url(#g)" strokeWidth="1">
              <polygon points="12,1 36,1 47,21 36,41 12,41 1,21" />
            </g>
          </pattern>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#232B3A" />
            <stop offset="100%" stopColor="#211a36" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)">
          <animate attributeName="x" from="0" to="48" dur="20s" repeatCount="indefinite" />
          <animate attributeName="y" from="0" to="42" dur="30s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  );
}
