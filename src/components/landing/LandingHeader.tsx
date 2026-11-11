import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, X } from "lucide-react";

const nav = [
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/safety", label: "Safety" },
] as const;

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Mphe-Motho home">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sunset-gradient shadow-gold">
        <Heart className="h-5 w-5 fill-ink text-ink" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-cream">Mphe-Motho</span>
    </Link>
  );
}

export function LandingHeader({ onJoin }: { onJoin: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-cream/10 bg-ink/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className="text-sm font-medium text-cream/70 transition-colors hover:text-sunset data-[status=active]:text-sunset">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/auth" className="rounded-full px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cream/10">
            Log In
          </Link>
          <button onClick={onJoin} className="rounded-full bg-sunset px-5 py-2.5 text-sm font-bold text-ink shadow-gold transition-transform hover:-translate-y-0.5">
            Join Mzansi
          </button>
        </div>
        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream md:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-cream/10 bg-ink px-5 pb-6 pt-3 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="border-b border-cream/10 py-4 text-sm font-medium text-cream/80">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link to="/auth" className="rounded-full border border-cream/20 px-4 py-3 text-center text-sm font-semibold text-cream">Log In</Link>
            <button onClick={() => { setMenuOpen(false); onJoin(); }} className="rounded-full bg-sunset px-4 py-3 text-sm font-bold text-ink">Join Mzansi</button>
          </div>
        </div>
      )}
    </header>
  );
}
