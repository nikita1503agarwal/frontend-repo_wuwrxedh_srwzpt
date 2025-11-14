import { useEffect } from "react";

export default function WalletModal({ open, onClose, onConnected }) {
  useEffect(() => {
    function onEsc(e) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  async function connectMetaMask() {
    try {
      if (!window.ethereum) {
        alert('MetaMask not found. Please install MetaMask.');
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts[0]) {
        onConnected({ address: accounts[0], provider: 'metamask' });
        onClose();
      }
    } catch (e) {
      console.error(e);
      alert('Connection failed');
    }
  }

  async function connectWalletConnect() {
    alert('WalletConnect is not fully wired in this demo, please use MetaMask in this preview.');
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-sm rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-4 shadow-2xl">
        <div className="text-slate-100 font-semibold text-lg">Connect Wallet</div>
        <p className="text-slate-400 text-sm mt-1">Choose a provider to continue</p>
        <div className="mt-4 grid gap-2">
          <button onClick={connectMetaMask} className="w-full rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-100 py-2 text-sm">MetaMask</button>
          <button onClick={connectWalletConnect} className="w-full rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-100 py-2 text-sm">WalletConnect</button>
        </div>
        <button onClick={onClose} className="mt-4 text-slate-400 hover:text-slate-200 text-sm">Close</button>
      </div>
    </div>
  );
}
