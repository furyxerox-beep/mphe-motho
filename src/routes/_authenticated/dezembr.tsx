import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Sun, Save, CalendarHeart } from 'lucide-react';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Field, homeField, useHomeAction } from '@/components/HomeFeatureForm';
import { useHomeFeatures } from '@/hooks/use-home-features';
import { useMe, useProfiles } from '@/hooks/use-me';
import { PROVINCES } from '@/lib/sa';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/dezembr')({ head: () => pageHead('Dezembr Mode', 'Holiday availability and festive connections across South Africa.'), component: Dezembr });
function Dezembr() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const { data, error } = useHomeFeatures();
  const [f, setF] = useState({ province: '', available_from: '', available_until: '', festive_mode: true });
  const own = data?.holidays.find(h => h.user_id === me?.id);
  useEffect(() => { if (own) setF({ province: own.province, available_from: own.available_from, available_until: own.available_until, festive_mode: own.festive_mode }); }, [own]);
  const save = useHomeAction(async () => { if (!me) throw new Error('Please sign in'); const r = await supabase.from('holiday_preferences').upsert({ ...f, user_id: me.id }); if (r.error) throw r.error; });
  const compatible = data?.holidays.filter(h => h.user_id !== me?.id && h.festive_mode && f.festive_mode && h.province === f.province && h.available_from <= f.available_until && h.available_until >= f.available_from) ?? [];
  return <AppShell><SectionTitle><Sun className="mr-2 inline h-5 w-5 text-gold" />Dezembr Mode</SectionTitle>
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); save.mutate(); }}>
      <label className="flex items-center gap-3"><input type="checkbox" checked={f.festive_mode} onChange={e => setF({ ...f, festive_mode: e.target.checked })} />Festive availability</label>
      <Field label="Holiday province"><select aria-label="Holiday province" required className={homeField} value={f.province} onChange={e => setF({ ...f, province: e.target.value })}><option value="">Choose province</option>{PROVINCES.map(p => <option key={p.name}>{p.name}</option>)}</select></Field>
      <div className="grid grid-cols-2 gap-3"><Field label="From"><input aria-label="Holiday from" required type="date" className={homeField} value={f.available_from} onChange={e => setF({ ...f, available_from: e.target.value })} /></Field><Field label="Until"><input aria-label="Holiday until" required type="date" min={f.available_from} className={homeField} value={f.available_until} onChange={e => setF({ ...f, available_until: e.target.value })} /></Field></div>
      <Button disabled={save.isPending} className="w-full"><Save />Save availability</Button>
    </form>
    <Button asChild variant="outline" className="mt-4 w-full"><Link to="/events"><CalendarHeart />Local events & RSVPs</Link></Button>
    <SectionTitle>Holiday connections</SectionTitle>{error ? <Empty>{error.message}</Empty> : !compatible.length ? <Empty>No overlapping holiday plans yet.</Empty> : <ul className="divide-y divide-gold/20">{compatible.map(h => <li key={h.user_id} className="py-4"><Link className="text-gold" to="/people/$id" params={{ id: h.user_id }}>{profiles?.find(p => p.id === h.user_id)?.display_name ?? 'Member'}</Link><p className="text-sm text-cream/70">{h.province} · {h.available_from} – {h.available_until}</p></li>)}</ul>}
  </AppShell>;
}