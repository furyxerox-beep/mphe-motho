import { createFileRoute, Link } from '@tanstack/react-router';
import { Hourglass, MessageCircle } from 'lucide-react';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { MemberPhoto } from '@/components/Avatar';
import { useMe, useProfiles } from '@/hooks/use-me';
import { useClock, useFeatureData } from '@/hooks/use-features';
import { countdown, matchActive } from '@/lib/features';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/_authenticated/match-countdown')({ head: () => pageHead('48-hour matches', 'Live match countdowns and conversation deadlines.'), component: Countdowns });
function Countdowns() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const { data, error } = useFeatureData(); const now = useClock();
  return <AppShell><SectionTitle><Hourglass className="mr-2 inline h-5 w-5 text-gold" />48-hour matches</SectionTitle>
    {error ? <Empty>{error.message}</Empty> : !data?.windows.length ? <Empty>No mutual connections yet.</Empty> : <ul className="divide-y divide-gold/20">{data.windows.map(w => { const id = w.member_a === me?.id ? w.member_b : w.member_a; const p = profiles?.find(p => p.id === id); return <li key={id} className="flex items-center gap-3 py-5"><MemberPhoto path={p?.avatar_path} name={p?.display_name ?? '?'} className="h-14 w-14 shrink-0 rounded-full" /><div className="min-w-0 flex-1"><p className="break-words font-semibold">{p?.display_name ?? 'Member'}</p><p className="text-sm text-gold tabular-nums">{countdown(w, now)}</p></div>{matchActive(w, now) && <Button asChild variant="outline" size="icon"><Link to="/messages/$id" params={{ id }} aria-label={`Chat with ${p?.display_name ?? 'match'}`}><MessageCircle /></Link></Button>}</li>; })}</ul>}
  </AppShell>;
}