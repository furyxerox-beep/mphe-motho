import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Heart, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell, Empty, SectionTitle } from "@/components/AppShell";
import { MemberPhoto } from "@/components/Avatar";
import { useLikes, useMe, useProfiles } from "@/hooks/use-me";
import { age, compatibility } from "@/lib/sa";
import { supabase } from "@/integrations/supabase/client";
import { HomeFeatureLinks } from '@/components/HomeFeatureLinks';

export const Route = createFileRoute("/_authenticated/discover")({
  head: () => ({ meta: [{ title: "Discover — Mphe-Motho" }, { name: "description", content: "Singles near you, auto-matched." }] }),
  component: Discover,
});

function Discover() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: profiles } = useProfiles();
  const { data: likes } = useLikes();

  const feed = useMemo(() => {
    if (!me || !profiles) return [];
    const liked = new Set(likes?.filter((l) => l.liker === me.id).map((l) => l.liked));
    return profiles
      .filter((p) => p.id !== me.id && !liked.has(p.id))
      .map((p) => ({ p, ...compatibility(me, p) }))
      .sort((a, b) => b.score - a.score);
  }, [me, profiles, likes]);

  const top = feed[0];
  async function like(id: string, name: string) {
    const { error } = await supabase.from("likes").insert({ liker: me!.id, liked: id });
    if (error) { toast.error(error.message); return; }
    if (likes?.some((l) => l.liker === id && l.liked === me!.id)) toast.success(`💛 It's a match with ${name}!`);
    else toast.success(`Connection request sent to ${name}`);
    qc.invalidateQueries({ queryKey: ["likes"] });
  }
  const [skipped, setSkipped] = [null, (id: string) => qc.setQueryData(["profiles"], (old: typeof profiles) => old?.filter((p) => p.id !== id))];
  void skipped;

  const nudge = me && (!me.avatar_path || !me.interests.length) ? (
      <Link to="/profile" className="mb-4 block rounded-2xl border border-gold/40 bg-card/20 p-4 text-sm text-cream">
        ✨ Complete your profile (photo & interests) to get better matches →
      </Link>
    ) : null;

  return (
    <AppShell>
      <HomeFeatureLinks />
      {nudge}
      {!top ? (
        <Empty>No new singles right now. Check back soon — new members join every day.</Empty>
      ) : (
        <article key={top.p.id} className="animate-in fade-in zoom-in-95 overflow-hidden rounded-3xl border border-gold/40 bg-card shadow-glow">
          <Link to="/people/$id" params={{ id: top.p.id }} className="relative block aspect-[3/4]">
            <MemberPhoto path={top.p.avatar_path} name={top.p.display_name} className="h-full w-full text-7xl" />
            <div className="absolute inset-0 bg-card-fade" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-display text-3xl text-gold">{top.p.display_name}{age(top.p.birthdate) ? `, ${age(top.p.birthdate)}` : ""}</h3>
                  {top.p.job && <p className="text-cream/90">{top.p.job}</p>}
                  <p className="flex items-center gap-1 text-sm text-cream/70">
                    <MapPin className="h-3.5 w-3.5" />
                    {[top.p.city, top.p.province].filter(Boolean).join(", ") || "Mzansi"}
                    {top.dist != null && ` · ${Math.round(top.dist)} km away`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl text-gold">{top.score}%</p>
                  <p className="text-xs text-cream/70">Match</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {top.p.interests.slice(0, 5).map((t) => (
                  <span key={t} className="rounded-full border border-gold/40 px-3 py-1 text-xs text-cream">{t}</span>
                ))}
              </div>
            </div>
          </Link>
          <div className="flex gap-3 p-4">
            <button onClick={() => setSkipped(top.p.id)} aria-label="Pass" className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold"><X /></button>
            <button onClick={() => like(top.p.id, top.p.display_name)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-gradient font-semibold text-cream shadow-glow">
              <Heart className="h-5 w-5 fill-gold text-gold" /> Let's Connect
            </button>
          </div>
        </article>
      )}

      {feed.length > 1 && (
        <>
          <SectionTitle>More matches near you</SectionTitle>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {feed.slice(1, 20).map(({ p, score }) => (
              <Link to="/people/$id" params={{ id: p.id }} key={p.id} className="relative w-32 shrink-0 overflow-hidden rounded-2xl border border-gold/30">
                <MemberPhoto path={p.avatar_path} name={p.display_name} className="aspect-[3/4] w-full text-4xl" />
                <span className="absolute inset-x-0 bottom-0 bg-card-fade p-2 text-sm text-cream">{p.display_name} · {score}%</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
