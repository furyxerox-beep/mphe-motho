import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Video, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell, SectionTitle } from "@/components/AppShell";
import { useMe } from "@/hooks/use-me";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/events")({
  head: () => ({ meta: [{ title: "Events — Mphe-Motho" }, { name: "description", content: "Speed dating and mixers across Mzansi." }] }),
  component: Events,
});

function Events() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const [e, r] = await Promise.all([supabase.from("events").select("*").order("starts_at"), supabase.from("event_rsvps").select("event_id, user_id")]);
      return { events: e.data ?? [], rsvps: r.data ?? [] };
    },
  });
  useEffect(() => {
    const ch = supabase.channel("rsvps").on("postgres_changes", { event: "*", schema: "public", table: "event_rsvps" }, () => qc.invalidateQueries({ queryKey: ["events"] })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  async function toggle(id: string, joined: boolean, title: string) {
    if (!me) return;
    const { error } = joined
      ? await supabase.from("event_rsvps").delete().eq("event_id", id).eq("user_id", me.id)
      : await supabase.from("event_rsvps").insert({ event_id: id, user_id: me.id });
    if (error) { toast.error(error.message); return; }
    toast.success(joined ? "RSVP cancelled" : `You're in: ${title}`);
    qc.invalidateQueries({ queryKey: ["events"] });
  }

  return (
    <AppShell>
      <SectionTitle>Upcoming events</SectionTitle>
      <div className="space-y-3">
        {data?.events.map((e) => {
          const going = data.rsvps.filter((r) => r.event_id === e.id);
          const joined = going.some((r) => r.user_id === me?.id);
          const left = e.capacity - going.length;
          return (
            <div key={e.id} className="flex items-center gap-4 rounded-2xl border border-gold/30 bg-card/10 p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-gradient"><Video className="h-6 w-6 text-primary" /></span>
              <div className="flex-1">
                <p className="font-semibold text-cream">{e.title}</p>
                <p className="text-xs text-cream/70">
                  {e.region} · {new Date(e.starts_at).toLocaleString("en-ZA", { weekday: "short", hour: "2-digit", minute: "2-digit" })} · {left} spots left
                </p>
              </div>
              <button disabled={!joined && left <= 0} onClick={() => toggle(e.id, joined, e.title)} className={`rounded-full px-4 py-2 text-sm font-semibold ${joined ? "border border-gold text-gold" : "bg-primary-gradient text-cream"}`}>
                {joined ? "Going ✓" : "Join"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gold/40 p-4">
        <ShieldCheck className="h-6 w-6 text-gold" />
        <p className="text-sm text-cream/80">Meet only at public, safe venues. Tell a friend where you're going.</p>
      </div>
    </AppShell>
  );
}
