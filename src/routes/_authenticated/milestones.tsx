import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { HeartHandshake, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Field, homeField, useHomeAction } from '@/components/HomeFeatureForm';
import { useHomeFeatures } from '@/hooks/use-home-features';
import { useMe, useProfiles } from '@/hooks/use-me';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/milestones')({ head: () => pageHead('Milestones & Success Stories', 'Save your relationship anniversaries and share your Mzansi love story.'), component: Milestones });
function Milestones() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const { data, error } = useHomeFeatures(); const qc = useQueryClient();
  const [f, setF] = useState({ title: '', anniversary: '', story: '', shared: false });
  const save = useHomeAction(async () => { if (!me) throw new Error('Please sign in'); const r = await supabase.from('relationship_milestones').insert({ ...f, user_id: me.id }); if (r.error) throw r.error; setF({ title: '', anniversary: '', story: '', shared: false }); }, 'Milestone saved');
  const remove = useMutation({ mutationFn: async (id: string) => { const r = await supabase.from('relationship_milestones').delete().eq('id',id); if (r.error) throw r.error; }, onSuccess: () => { void qc.invalidateQueries({ queryKey: ['home-features'] }); }, onError: e => toast.error(e.message) });
  const mine = data?.milestones.filter(m => m.user_id===me?.id) ?? []; const shared = data?.milestones.filter(m => m.shared && m.user_id!==me?.id) ?? [];
  function nextAnniversary(value: string) { const [year, month, day] = value.split('-').map(Number); const now = new Date(); let next = new Date(now.getFullYear(),month-1,day); if (next.getTime()<new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime()) next = new Date(now.getFullYear()+1,month-1,day); return `${Math.ceil((next.getTime()-new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime())/86400000)} days to anniversary · since ${year}`; }
  return <AppShell><SectionTitle><HeartHandshake className="mr-2 inline h-5 w-5 text-gold" />Milestones & Stories</SectionTitle>
    <form className="space-y-3" onSubmit={e => { e.preventDefault(); save.mutate(); }}>
      <Field label="Milestone"><input aria-label="Milestone title" required maxLength={100} className={homeField} value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></Field>
      <Field label="Special date"><input aria-label="Special date" required type="date" className={homeField} value={f.anniversary} onChange={e => setF({ ...f, anniversary: e.target.value })} /></Field>
      <Field label="Your story"><textarea aria-label="Your story" maxLength={2000} rows={4} className={homeField} value={f.story} onChange={e => setF({ ...f, story: e.target.value })} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.shared} onChange={e => setF({ ...f, shared: e.target.checked })} />Share with members</label>
      <Button className="w-full" disabled={save.isPending}><Plus />Save milestone</Button>
    </form><SectionTitle>Your anniversaries</SectionTitle>{error ? <Empty>{error.message}</Empty> : !mine.length ? <Empty>No milestones yet.</Empty> : <ul className="divide-y divide-gold/20">{mine.map(m => <li key={m.id} className="py-4"><div className="flex justify-between gap-3"><div className="min-w-0"><strong className="break-words">{m.title}</strong><p className="mt-1 text-xs text-gold">{nextAnniversary(m.anniversary)}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{m.story}</p><p className="mt-2 text-xs text-cream/60">{m.shared ? 'Shared with members' : 'Private'}</p></div><Button aria-label={`Delete ${m.title}`} variant="ghost" size="icon" disabled={remove.isPending} onClick={() => { if (window.confirm('Delete this milestone?')) remove.mutate(m.id); }}><Trash2 /></Button></div></li>)}</ul>}
    <SectionTitle>Community love stories</SectionTitle>{!shared.length ? <Empty>No shared stories yet.</Empty> : shared.map(m => <article key={m.id} className="border-b border-gold/20 py-4"><strong className="break-words">{m.title}</strong><p className="text-xs text-gold">{profiles?.find(p => p.id===m.user_id)?.display_name ?? 'Member'}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{m.story}</p></article>)}
    <p className="mt-5 text-sm text-cream/60">Partner rewards and discounts are not available yet.</p>
  </AppShell>;
}