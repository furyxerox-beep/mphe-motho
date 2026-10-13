import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, SectionTitle } from "@/components/AppShell";
import { profiles } from "@/lib/data";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Your matches — Mphe-Motho" },
      { name: "description", content: "See everyone who matched with you on Mphe-Motho." },
      { property: "og:title", content: "Your matches — Mphe-Motho" },
      { property: "og:description", content: "Your mutual connections, ranked by compatibility." },
    ],
  }),
  component: Matches,
});

function Matches() {
  return (
    <AppShell>
      <SectionTitle>Your matches</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {profiles.map((p) => (
          <Link to="/messages" key={p.id} className="relative overflow-hidden rounded-2xl border border-gold/30 shadow-glow">
            <img src={p.photo} alt={p.name} className="aspect-[3/4] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-card-fade p-3">
              <p className="font-display text-lg text-gold">{p.name}, {p.age}</p>
              <p className="text-xs text-cream/80">{p.match}% match</p>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
