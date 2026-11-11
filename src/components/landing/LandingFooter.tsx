import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { PROVINCES } from "@/lib/sa";
import { provinceSlug } from "@/lib/landing-content";

export function LandingFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_1.6fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sunset-gradient"><Heart className="h-5 w-5 fill-ink text-ink" /></span>
            <span className="font-display text-xl font-bold">Mphe-Motho</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-cream/60">Real Mzansi connections, built for intention. Made in South Africa, for South Africa.</p>
          <p className="mt-5 text-sm text-sunset">18+ · Mzansi only 🇿🇦</p>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-sunset" />Find your province</h2>
          <nav aria-label="Provinces" className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-cream/60">
            {PROVINCES.map((province) => (
              <Link key={province.name} to="/provinces/$province" params={{ province: provinceSlug(province.name) }} className="transition-colors hover:text-sunset">
                {province.name}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Trust & legal</h2>
          <nav aria-label="Trust and legal" className="mt-4 flex flex-col gap-3 text-sm text-cream/60">
            <Link to="/privacy" className="hover:text-sunset">POPIA Privacy Policy</Link>
            <Link to="/safety" className="hover:text-sunset">Safety Guidelines</Link>
            <Link to="/terms" className="hover:text-sunset">Terms of Service</Link>
          </nav>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Mphe-Motho. Global hearts, local connections.</p>
          <p>Sample profiles and stories on this site are illustrative previews.</p>
        </div>
      </div>
    </footer>
  );
}
