import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Users, Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Field, homeField, useHomeAction } from '@/components/HomeFeatureForm';
import { useHomeFeatures } from '@/hooks/use-home-features';
import { useMe, useProfiles } from '@/hooks/use-me';
import { PROVINCES } from '@/lib/sa';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/group-dates')({ head: () => pageHead('Third-Wheel Group Dates', 'Plan public-venue group hangouts and double dates in Mzansi.'), component: Groups });
function Groups() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const { data, error } = useHomeFeatures(); const qc = useQueryClient();
  const [f, setF] = useState({ title: '', venue: '', province: '', starts_at: '', capacity: 4 }); const [busy, setBusy] = useState(false);
  const create = useHomeAction(async () => { if (!me) throw new Error('Please sign in'); const r = await supabase.from('group_dates').insert({ ...f, host: me.id, starts_at: new Date(f.starts_at).toISOString() }); if (r.error) throw r.error; setF({ ...f, title: '', venue: '', starts_at: '' }); }, 'Group date created');
  async function act(id: string, joined: boolean, host: boolean) {
    if (!me || busy) return; setBusy(true);
    try { const r = host ? await supabase.from('group_dates').update({ cancelled: true }).eq('id', id) : joined ? await supabase.from('group_date_members').delete().eq('date_id',id).eq('user_id',me.id) : await supabase.from('group_date_members').insert({ date_id: id, user_id: me.id }); if (r.error) throw r.error; await qc.invalidateQueries({ queryKey: ['home-features'] }); toast.success(host ? 'Group date cancelled' : joined ? 'You left the group' : 'You joined the group'); } catch(e) { toast.error(e instanceof Error ? e.message : 'Please try again'); } finally { setBusy(false); }
  }
  const upcoming = data?.groups.filter(g => !g.cancelled && new Date(g.starts_at).getTime() > Date.now()) ?? [];
  return <AppShell><SectionTitle><Users className="mr-2 inline h-5 w-5 text-gold" />Third-Wheel Group Dates</SectionTitle>
    <form className="space-y-3" onSubmit={e => { e.preventDefault(); create.mutate(); }}>
      <Field label="Hangout name"><input aria-label="Hangout name" required maxLength={100} className={homeField} value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></Field>
      <Field label="Public venue"><input aria-label="Group venue" required maxLength={200} className={homeField} value={f.venue} onChange={e => setF({ ...f, venue: e.target.value })} /></Field>
      <Field label="Province"><select aria-label="Group province" required className={homeField} value={f.province} onChange={e => setF({ ...f, province: e.target.value })}><option value="">Choose province</option>{PROVINCES.map(p => <option key={p.name}>{p.name}</option>)}</select></Field>
      <Field label="Date & time"><input aria-label="Group date and time" required type="datetime-local" className={homeField} value={f.starts_at} onChange={e => setF({ ...f, starts_at: e.target.value })} /></Field>
      <Field label="People (including you)"><input aria-label="Group capacity" type="number" required min={3} max={12} className={homeField} value={f.capacity} onChange={e => setF({ ...f, capacity: Number(e.target.value) })} /></Field>
      <Button className="w-full" disabled={create.isPending}><Plus />Create group date</Button>
    </form><SectionTitle>Upcoming hangouts</SectionTitle>{error ? <Empty>{error.message}</Empty> : !upcoming.length ? <Empty>No upcoming group dates yet.</Empty> : <ul className="divide-y divide-gold/20">{upcoming.map(g => { const members = data?.members.filter(m => m.date_id===g.id) ?? []; const host = g.host===me?.id; const joined = members.some(m => m.user_id===me?.id); const full = members.length+1>=g.capacity; return <li key={g.id} className="space-y-3 py-5"><strong>{g.title}</strong><p className="text-sm text-cream/70">{g.venue} · {g.province}<br />{new Date(g.starts_at).toLocaleString('en-ZA')}<br />Hosted by {profiles?.find(p => p.id===g.host)?.display_name ?? 'Member'} · {members.length+1}/{g.capacity} people</p><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={busy || (!host && !joined && full)} onClick={() => void act(g.id,joined,host)}>{host ? 'Cancel hangout' : joined ? 'Leave group' : full ? 'Full' : 'Join group'}</Button><Button asChild variant="outline" size="icon"><a aria-label={`Map for ${g.venue}`} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.venue+', '+g.province+', South Africa')}`} target="_blank" rel="noreferrer"><MapPin /></a></Button></div></li>; })}</ul>}
  </AppShell>;
}