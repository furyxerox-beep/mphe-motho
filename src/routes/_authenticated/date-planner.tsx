import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Utensils, Send, Check, X, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { useMe, useProfiles, useLikes, matchIds } from '@/hooks/use-me';
import { useFeatureData } from '@/hooks/use-features';
import { PROVINCES } from '@/lib/sa';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/date-planner')({ head: () => pageHead('Braai & Vibe', 'Plan a public-venue date and respond to invitations from your matches.'), component: DatePlanner });
function DatePlanner() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const { data: likes } = useLikes(); const { data, error } = useFeatureData(); const qc = useQueryClient();
  const ids = matchIds(me?.id, likes); const matches = profiles?.filter(p => ids.includes(p.id)) ?? [];
  const [f, setF] = useState({ receiver: '', venue: '', province: '', starts_at: '' });
  const mutation = useMutation({ mutationFn: async (action: { id?: string; status?: 'accepted' | 'declined' | 'cancelled' }) => {
    if (!me) throw new Error('Please sign in');
    const result = action.id && action.status ? await supabase.from('date_invitations').update({ status: action.status }).eq('id', action.id) : await supabase.from('date_invitations').insert({ ...f, sender: me.id, starts_at: new Date(f.starts_at).toISOString() });
    if (result.error) throw result.error;
  }, onSuccess: (_, action) => { void qc.invalidateQueries({ queryKey: ['connection-features'] }); if (!action.id) setF({ ...f, venue: '', starts_at: '' }); toast.success(action.id ? 'Invitation updated' : 'Date invitation sent'); }, onError: e => toast.error(e.message) });
  const input = 'mt-1 w-full rounded-md border border-gold/30 bg-wine p-3 text-cream';
  return <AppShell><SectionTitle><Utensils className="mr-2 inline h-5 w-5 text-gold" />Braai & Vibe</SectionTitle>
    {!matches.length ? <Empty>No active matches available for a date invitation.</Empty> : <form className="space-y-3" onSubmit={e => { e.preventDefault(); mutation.mutate({}); }}>
      <label className="block text-sm">Your match<select required aria-label="Your match" className={input} value={f.receiver} onChange={e => setF({ ...f, receiver: e.target.value })}><option value="">Choose a match</option>{matches.map(p => <option key={p.id} value={p.id}>{p.display_name}</option>)}</select></label>
      <label className="block text-sm">Province<select required aria-label="Date province" className={input} value={f.province} onChange={e => setF({ ...f, province: e.target.value })}><option value="">Choose a province</option>{PROVINCES.map(p => <option key={p.name}>{p.name}</option>)}</select></label>
      {f.province && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Shisanyama and cafes in ' + f.province + ', South Africa')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gold"><MapPin className="h-4 w-4" />Find Shisanyamas & cafés</a>}
      <label className="block text-sm">Public venue<input required aria-label="Public venue" maxLength={160} placeholder="Venue name and address" className={input} value={f.venue} onChange={e => setF({ ...f, venue: e.target.value })} /></label>
      <label className="block text-sm">Date & time<input required aria-label="Date and time" type="datetime-local" className={input} value={f.starts_at} onChange={e => setF({ ...f, starts_at: e.target.value })} /></label>
      <Button disabled={mutation.isPending} className="w-full bg-primary-gradient"><Send />Send invitation</Button>
    </form>}
    <SectionTitle>Your dates</SectionTitle>{error ? <Empty>{error.message}</Empty> : !data?.dates.length ? <Empty>No date invitations yet.</Empty> : <ul className="divide-y divide-gold/20">{data.dates.map(d => <li key={d.id} className="space-y-2 py-4"><div className="flex justify-between gap-2"><strong className="break-words">{d.venue}</strong><span className="text-sm text-gold">{d.status}</span></div><p className="text-sm text-cream/70">{profiles?.find(p => p.id === (d.sender === me?.id ? d.receiver : d.sender))?.display_name} · {new Date(d.starts_at).toLocaleString('en-ZA')} · {d.province}</p><a target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-gold" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.venue + ', ' + d.province + ', South Africa')}`}><MapPin className="h-4 w-4" />Venue map</a>{d.status === 'pending' && <div className="flex gap-2">{d.receiver === me?.id ? <><Button disabled={mutation.isPending} onClick={() => mutation.mutate({ id: d.id, status: 'accepted' })}><Check />Accept</Button><Button disabled={mutation.isPending} variant="outline" onClick={() => mutation.mutate({ id: d.id, status: 'declined' })}><X />Decline</Button></> : <Button variant="outline" disabled={mutation.isPending} onClick={() => mutation.mutate({ id: d.id, status: 'cancelled' })}><X />Cancel invitation</Button>}</div>}</li>)}</ul>}
  </AppShell>;
}