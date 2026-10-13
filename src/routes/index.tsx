import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { AppShell, SectionTitle } from "@/components/AppShell";
import { profiles } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Discover singles — Mphe-Motho" },
      { name: "description", content: "Discover verified singles in your province with Mphe-Motho." },
      { property: "og:title", content: "Discover singles — Mphe-Motho" },
      { property: "og:description", content: "Global hearts, local connections." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const [i, setI] = useState(0);
  const p = profiles[i % profiles.length];
  const next = () => setI((n) => n + 1);

  return (
    <AppShell>
      <article key={p.id} className="animate-in fade-in zoom-in-95 overflow-hidden rounded-3xl border border-gold/40 bg-card shadow-glow">
        <div className="relative aspect-[3/4]">
          <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-card-fade" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-display text-3xl text-gold">{p.name}, {p.age}</h3>
                <p className="text-cream/90">{p.job}</p>
                <p className="flex items-center gap-1 text-sm text-cream/70"><MapPin className="h-3.5 w-3.5" />{p.location}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl text-gold">{p.match}%</p>
                <p className="text-xs text-cream/70">Match</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.interests.map((t) => (
                <span key={t} className="rounded-full border border-gold/40 px-3 py-1 text-xs text-cream">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-4">
          <button onClick={next} aria-label="Pass" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold"><X /></button>
          <button
            onClick={() => { toast.success(`Connection request sent to ${p.name}`); next(); }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-gradient font-semibold text-cream shadow-glow"
          >
            <Heart className="h-5 w-5 fill-gold text-gold" /> Let's Connect
          </button>
        </div>
      </article>

      <SectionTitle>More matches in Gauteng</SectionTitle>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {profiles.map((m) => (
          <Link to="/matches" key={m.id} className="relative w-32 shrink-0 overflow-hidden rounded-2xl border border-gold/30">
            <img src={m.photo} alt={m.name} className="aspect-[3/4] w-full object-cover" loading="lazy" />
            <span className="absolute inset-x-0 bottom-0 bg-card-fade p-2 text-sm text-cream">{m.name}</span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
