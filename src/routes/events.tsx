import { createFileRoute } from "@tanstack/react-router";
import { Video, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell, SectionTitle } from "@/components/AppShell";
import { events } from "@/lib/data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Mphe-Motho" },
      { name: "description", content: "Weekly video speed dating and mixers by region." },
      { property: "og:title", content: "Events — Mphe-Motho" },
      { property: "og:description", content: "Weekly video speed dating and mixers by region." },
    ],
  }),
  component: Events,
});

function Events() {
  return (
    <AppShell>
      <SectionTitle>Upcoming events</SectionTitle>
      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.title} className="flex items-center gap-4 rounded-2xl border border-gold/30 bg-card/10 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-gradient"><Video className="h-6 w-6 text-primary" /></span>
            <div className="flex-1">
              <p className="font-semibold text-cream">{e.title}</p>
              <p className="text-xs text-cream/70">{e.region} · {e.when} · {e.spots} spots left</p>
            </div>
            <button onClick={() => toast.success(`You're in: ${e.title}`)} className="rounded-full bg-primary-gradient px-4 py-2 text-sm font-semibold text-cream">Join</button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gold/40 p-4">
        <ShieldCheck className="h-6 w-6 text-gold" />
        <p className="text-sm text-cream/80">Meet only at vetted safe venues. Panic button with location share is always one tap away.</p>
      </div>
    </AppShell>
  );
}
