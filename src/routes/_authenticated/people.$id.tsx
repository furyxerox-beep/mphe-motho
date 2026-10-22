import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, MapPin, MessageCircle, Navigation, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Empty } from "@/components/AppShell";
import { MemberPhoto } from "@/components/Avatar";
import { matchIds, useLikes, useMe, useProfiles } from "@/hooks/use-me";
import { age, compatibility } from "@/lib/sa";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/people/$id")({
  head: () => ({ meta: [{ title: "Profile — Mphe-Motho" }, { name: "description", content: "Member profile." }] }),
  component: Person,
});

function Person() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: profiles } = useProfiles();
  const { data: likes } = useLikes();
  const p = profiles?.find((x) => x.id === id);
  if (!p || !me) return <AppShell><Empty>Loading profile…</Empty></AppShell>;
  const iLiked = likes?.some((l) => l.liker === me.id && l.liked === id);
  const matched = matchIds(me.id, likes).includes(id);
  const { score, dist } = compatibility(me, p);
  const place = [p.city, p.province].filter(Boolean).join(", ");

  async function like() {
    const { error } = iLiked
      ? await supabase.from("likes").delete().eq("liker", me!.id).eq("liked", id)
      : await supabase.from("likes").insert({ liker: me!.id, liked: id });
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["likes"] });
  }

  return (
    <AppShell>
      <div className="overflow-hidden rounded-3xl border border-gold/30 bg-card/10">
        <div className="h-28 bg-primary-gradient" />
        <div className="-mt-14 px-5 pb-5">
          <MemberPhoto path={p.avatar_path} name={p.display_name} className="h-28 w-28 rounded-full border-4 border-gold text-4xl" />
          <h1 className="mt-3 font-display text-2xl text-gold">{p.display_name}{age(p.birthdate) ? `, ${age(p.birthdate)}` : ""}</h1>
          {(p as { is_video_verified?: boolean }).is_video_verified && <p className="text-xs font-semibold text-gold">✔ Video verified</p>}
          {p.job && <p className="flex items-center gap-1 text-sm text-cream/80"><Briefcase className="h-4 w-4" />{p.job}</p>}
          <p className="flex items-center gap-1 text-sm text-cream/70"><MapPin className="h-4 w-4" />{place || "Mzansi"}{dist != null && ` · ${Math.round(dist)} km away`}</p>
          <p className="mt-1 text-sm text-gold">{score}% compatible</p>
          <div className="mt-4 flex gap-2">
            <button onClick={like} className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 font-semibold ${iLiked ? "border border-gold text-gold" : "bg-primary-gradient text-cream"}`}>
              <Heart className="h-4 w-4" /> {matched ? "Matched" : iLiked ? "Requested" : "Connect"}
            </button>
            {matched && (
              <Link to="/messages/$id" params={{ id }} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gold py-3 font-semibold text-gold">
                <MessageCircle className="h-4 w-4" /> Message
              </Link>
            )}
          </div>
          <button
            onClick={async () => {
              if (!confirm(`Block ${p.display_name}? They won't be able to message or like you.`)) return;
              const { error } = await supabase.from("blocks").insert({ blocker: me!.id, blocked: id });
              if (error) { toast.error(error.message); return; }
              await supabase.from("likes").delete().eq("liker", me!.id).eq("liked", id);
              qc.invalidateQueries({ queryKey: ["likes"] });
              toast.success("Blocked");
            }}
            className="mt-2 w-full text-center text-xs text-cream/60 underline"
          >
            Block this member
          </button>
          {matched && place && (
            <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place + ", South Africa")}`} className="mt-2 flex items-center justify-center gap-2 text-sm text-gold">
              <Navigation className="h-4 w-4" /> Directions to their area
            </a>
          )}
        </div>
      </div>
      <section className="mt-4 rounded-2xl border border-gold/20 bg-card/10 p-5">
        <h2 className="font-display text-lg text-cream">About</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-cream/80">{p.bio || "No bio yet."}</p>
        {p.interests.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {p.interests.map((t) => <span key={t} className="rounded-full border border-gold/40 px-3 py-1 text-xs text-cream">{t}</span>)}
          </div>
        )}
      </section>
    </AppShell>
  );
}
