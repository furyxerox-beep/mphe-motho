import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Gauge, Save } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { useMe, useProfiles } from '@/hooks/use-me';
import { useFeatureData } from '@/hooks/use-features';
import { culturalScore } from '@/lib/features';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/lobola')({ head: () => pageHead('Lobola Meter', 'Cultural compatibility and relationship intentions for Mzansi singles.'), component: Lobola });
const fields = [
  { key: 'intention', label: 'Relationship intention', options: ['Getting to know people', 'Serious relationship', 'Marriage-minded'] },
  { key: 'family', label: 'Family involvement', options: ['Very important', 'Some involvement', 'We decide together'] },
  { key: 'tradition', label: 'Lobola & traditions', options: ['Important to me', 'Open to discussing', 'Not part of my plans'] },
  { key: 'language', label: 'Preferred home language', options: ['isiZulu', 'isiXhosa', 'Sesotho', 'Setswana', 'Sepedi', 'Afrikaans', 'English', 'siSwati', 'Tshivenda', 'itsonga', 'isiNdebele', 'South African Sign Language'] },
] as const;
function Lobola() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const { data, error } = useFeatureData(); const qc = useQueryClient();
  const mine = data?.cultures.find(c => c.user_id === me?.id);
  const [form, setForm] = useState({ intention: 'Getting to know people', family: '', tradition: '', language: '' });
  useEffect(() => { if (mine) setForm({ intention: mine.intention, family: mine.family, tradition: mine.tradition, language: mine.language }); }, [mine]);
  const save = useMutation({ mutationFn: async () => { if (!me) throw new Error('Please sign in'); const { error } = await supabase.from('cultural_preferences').upsert({ user_id: me.id, ...form, updated_at: new Date().toISOString() }); if (error) throw error; }, onSuccess: () => { void qc.invalidateQueries({ queryKey: ['connection-features'] }); toast.success('Your preferences are saved'); }, onError: e => toast.error(e.message) });
  const scores = data?.cultures.filter(c => c.user_id !== me?.id).map(c => ({ c, score: culturalScore(mine, c), person: profiles?.find(p => p.id === c.user_id) })).filter(r => r.score !== null && r.person).sort((a,b) => (b.score ?? 0) - (a.score ?? 0)) ?? [];
  return <AppShell><SectionTitle><Gauge className="mr-2 inline h-5 w-5 text-gold" />Lobola Meter</SectionTitle>
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); save.mutate(); }}>
      {fields.map(f => <label key={f.key} className="block text-sm text-cream/80">{f.label}<select required aria-label={f.label} className="mt-1 w-full rounded-md border border-gold/30 bg-wine p-3 text-cream" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}><option value="">Choose…</option>{f.options.map(o => <option key={o}>{o}</option>)}</select></label>)}
      <Button disabled={save.isPending || !me} type="submit" className="w-full bg-primary-gradient"><Save />{save.isPending ? 'Saving…' : 'Save preferences'}</Button>
    </form>
    <SectionTitle>Cultural connections</SectionTitle>
    {error ? <Empty>{error.message}</Empty> : !scores.length ? <Empty>{mine ? 'No other members have shared their cultural preferences yet.' : 'Your cultural preferences are not saved yet.'}</Empty> : <ul className="divide-y divide-gold/20">{scores.map(({ c, score, person }) => person && <li key={c.user_id}><Link to="/people/$id" params={{ id: person.id }} className="flex items-center justify-between py-4"><span>{person.display_name}<span className="block text-xs text-cream/60">{c.intention}</span></span><strong className="text-gold">{score}%</strong></Link></li>)}</ul>}
  </AppShell>;
}