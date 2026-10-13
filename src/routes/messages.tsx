import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell, SectionTitle } from "@/components/AppShell";
import { chats } from "@/lib/data";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Mphe-Motho" },
      { name: "description", content: "Secure one-on-one chats with your matches." },
      { property: "og:title", content: "Messages — Mphe-Motho" },
      { property: "og:description", content: "Secure one-on-one chats with your matches." },
    ],
  }),
  component: Messages,
});

function Messages() {
  return (
    <AppShell>
      <div className="mt-2 flex items-start gap-3 rounded-2xl border border-gold/40 bg-card/10 p-4">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
        <div>
          <p className="text-sm font-semibold text-gold">Today's Spark</p>
          <p className="text-sm text-cream/90">"What's a small thing that always makes your day better?"</p>
        </div>
      </div>
      <SectionTitle>Conversations</SectionTitle>
      <ul className="divide-y divide-gold/10 overflow-hidden rounded-2xl bg-card/10">
        {chats.map((c) => (
          <li key={c.id} className="flex items-center gap-3 p-3">
            <img src={c.photo} alt={c.name} className="h-14 w-14 rounded-full border-2 border-gold/60 object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between">
                <p className="font-semibold text-cream">{c.name}</p>
                <span className="text-xs text-cream/50">{c.time}</span>
              </div>
              <p className="truncate text-sm text-cream/70">{c.last}</p>
            </div>
            {c.unread > 0 && <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs text-cream">{c.unread}</span>}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
