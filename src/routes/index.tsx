import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShieldCheck, MapPin, MessageCircle } from "lucide-react";
import neo from "@/assets/neo.jpg";
import thandi from "@/assets/thandi.jpg";
import sipho from "@/assets/sipho.jpg";
import { HomeFeatureLinks } from '@/components/HomeFeatureLinks';

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mphe-Motho — Dating for Mzansi" },
      { name: "description", content: "Meet verified South African singles near you. Global hearts, local connections." },
      { property: "og:title", content: "Mphe-Motho — Dating for Mzansi" },
      { property: "og:description", content: "Meet verified South African singles near you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-romance">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <h1 className="text-center font-display text-4xl text-gold-gradient">Mphe-Motho</h1>
        <p className="mt-1 text-center text-sm tracking-widest text-cream/70">GLOBAL HEARTS, LOCAL CONNECTIONS</p>
        <div className="relative mx-auto mt-10 h-72 w-full">
          <img src={thandi} alt="" className="absolute left-0 top-6 h-56 w-40 -rotate-6 rounded-3xl border-2 border-gold/50 object-cover shadow-glow" />
          <img src={sipho} alt="" className="absolute right-0 top-6 h-56 w-40 rotate-6 rounded-3xl border-2 border-gold/50 object-cover shadow-glow" />
          <img src={neo} alt="" className="absolute left-1/2 top-0 h-64 w-44 -translate-x-1/2 rounded-3xl border-2 border-gold object-cover shadow-glow" />
        </div>
        <ul className="mt-8 space-y-3 text-sm text-cream/90">
          <li className="flex gap-3"><MapPin className="h-5 w-5 text-gold" />Auto-matched with singles near you, across all 9 provinces</li>
          <li className="flex gap-3"><MessageCircle className="h-5 w-5 text-gold" />Live private chat with your matches</li>
          <li className="flex gap-3"><ShieldCheck className="h-5 w-5 text-gold" />South African numbers only, verified email</li>
        </ul>
        <HomeFeatureLinks />
        <Link to="/auth" className="mt-auto flex items-center justify-center gap-2 rounded-full bg-primary-gradient py-4 font-semibold text-cream shadow-glow">
          <Heart className="h-5 w-5 fill-gold text-gold" /> Get started
        </Link>
      </div>
    </div>
  );
}
