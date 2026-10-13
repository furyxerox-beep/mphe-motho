import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Empty, SectionTitle } from "@/components/AppShell";
import { MemberPhoto } from "@/components/Avatar";
import { matchIds, useLikes, useMe, useProfiles } from "@/hooks/use-me";
import { compatibility } from "@/lib/sa";

export const Route = createFileRoute("/_authenticated/matches")({
  head: () => ({ meta: [{ title: "Matches — Mphe-Motho" }, { name: "description", content: "Your mutual connections." }] }),
  component: Matches,
});

function Matches() {
  const { data: me } = useMe();
  const { data: profiles } = useProfiles();
  const { data: likes } = useLikes();
  const ids = new Set(matchIds(me?.id, likes));
  const matches = profiles?.filter((p) => ids.has(p.id)) ?? [];
  const likedMe = profiles?.filter((p) => likes?.some((l) => l.liker === p.id && l.liked === me?.id) && !ids.has(p.id)) ?? [];

  return (
    <AppShell>
      <SectionTitle>Your matches</SectionTitle>
      {!matches.length ? (
        <Empty>No matches yet. Tap "Let's Connect" on Discover — when they connect back, you match.</Empty>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {matches.map((p) => (
            <Link to="/messages/$id" params={{ id: p.id }} key={p.id} className="relative overflow-hidden rounded-2xl border border-gold/30 shadow-glow">
              <MemberPhoto path={p.avatar_path} name={p.display_name} className="aspect-[3/4] w-full text-5xl" />
              <div className="absolute inset-x-0 bottom-0 bg-card-fade p-3">
                <p className="font-display text-lg text-gold">{p.display_name}</p>
                {me && <p className="text-xs text-cream/80">{compatibility(me, p).score}% match · Tap to chat</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
      {likedMe.length > 0 && (
        <>
          <SectionTitle>They like you 💛</SectionTitle>
          <div className="flex gap-3 overflow-x-auto">
            {likedMe.map((p) => (
              <Link to="/people/$id" params={{ id: p.id }} key={p.id} className="w-24 shrink-0 text-center">
                <MemberPhoto path={p.avatar_path} name={p.display_name} className="h-24 w-24 rounded-full border-2 border-gold text-3xl" />
                <p className="mt-1 truncate text-xs text-cream">{p.display_name}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
