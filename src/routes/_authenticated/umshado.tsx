import { createFileRoute, Link } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Gem } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { MemberPhoto } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { useMe, useProfiles } from '@/hooks/use-me';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

const intents = [{ v: 'vibes', label: 'Just the vibes' }, { v: 'open', label: 'Open' }, { v: 'serious', label: 'Serious / Marriage' }] as const;
type Intent = typeof intents[number]['v'];
export const Route = createFileRoute('/_authenticated/umshado')({ head: () => pageHead('Umshado Forecast', 'Match with members who share your relationship timeline.'), component: Umshado });
function Umshado() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const qc = useQueryClient();
  const mine = (me as { umshado_intent?: Intent | null } | null | undefined)?.umshado_intent ?? null;
  const save = useMutation({ mutationFn: async (v: Intent) => { if (!me) throw new Error('Please sign in'); const r = await supabase.from('profiles').update({ umshado_intent: v }).eq('id', me.id); if (r.error) throw r.error; }, onSuccess: () => { void qc.invalidateQueries({ queryKey: ['me'] }); void qc.invalidateQueries({ queryKey: ['profiles'] }); toast.success('Forecast saved'); }, onError: e => toast.error(e.message) });
  const same = (profiles ?? []).filter(p => p.id !== me?.id && (p as { umshado_intent?: string | null }).umshado_intent === mine);
  return <AppShell><SectionTitle><Gem className="mr-2 inline h-5 w-5 text-gold" />Umshado Forecast</SectionTitle>
    <p className="mb-3 text-sm text-cream/70">What are you looking for?</p>
    <div className="grid grid-cols-3 gap-2">{intents.map(i => <Button key={i.v} className="h-auto whitespace-normal py-3" variant={mine === i.v ? 'default' : 'outline'} disabled={save.isPending} onClick={() => save.mutate(i.v)}>{i.label}</Button>)}</div>
    <SectionTitle>Members on your timeline</SectionTitle>
    {!mine ? <Empty>Choose your forecast to see matching members.</Empty> : !same.length ? <Empty>No members share this forecast yet.</Empty> : <ul className="divide-y divide-gold/20">{same.map(p => <li key={p.id}><Link to="/people/$id" params={{ id: p.id }} className="flex items-center gap-3 py-3"><MemberPhoto path={p.avatar_path} name={p.display_name} className="h-12 w-12 rounded-full" /><span>{p.display_name}<span className="block text-xs text-cream/60">{p.province ?? 'Mzansi'}</span></span></Link></li>)}</ul>}
  </AppShell>;
}
