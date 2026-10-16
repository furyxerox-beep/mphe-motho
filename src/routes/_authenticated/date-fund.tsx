import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Gift } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Field, homeField } from '@/components/HomeFeatureForm';
import { useMe, useProfiles } from '@/hooks/use-me';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

const gifts = ['Cup of Rooibos', 'Shisanyama Plate', 'Protea Bouquet'] as const;
export const Route = createFileRoute('/_authenticated/date-fund')({ head: () => pageHead('The Date Fund', 'Send sweet digital gifts to show genuine interest.'), component: DateFund });
function DateFund() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const qc = useQueryClient();
  const [to, setTo] = useState(''); const [gift, setGift] = useState<typeof gifts[number]>(gifts[0]); const [note, setNote] = useState('');
  useEffect(() => { const ch = supabase.channel('gifts').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'date_gifts' }, () => { void qc.invalidateQueries({ queryKey: ['gifts'] }); }).subscribe(); return () => { void supabase.removeChannel(ch); }; }, [qc]);
  const { data, error } = useQuery({ queryKey: ['gifts'], queryFn: async () => { const r = await supabase.from('date_gifts').select('*').order('created_at', { ascending: false }); if (r.error) throw r.error; return r.data; } });
  const send = useMutation({ mutationFn: async () => { if (!me) throw new Error('Please sign in'); if (!to) throw new Error('Choose a member'); const r = await supabase.from('date_gifts').insert({ sender: me.id, receiver: to, gift, note: note.trim() }); if (r.error) throw r.error; }, onSuccess: () => { setNote(''); void qc.invalidateQueries({ queryKey: ['gifts'] }); toast.success('Gift sent 🎁'); }, onError: e => toast.error(e.message) });
  const name = (id: string) => profiles?.find(p => p.id === id)?.display_name ?? 'Member';
  const received = data?.filter(g => g.receiver === me?.id) ?? []; const sent = data?.filter(g => g.sender === me?.id) ?? [];
  return <AppShell><SectionTitle><Gift className="mr-2 inline h-5 w-5 text-gold" />The Date Fund</SectionTitle>
    <p className="mb-3 text-sm text-cream/70">Gifts are symbolic for now — paid vouchers at local spots are coming soon.</p>
    <form className="space-y-3" onSubmit={e => { e.preventDefault(); send.mutate(); }}>
      <Field label="Send to"><select aria-label="Send to" required className={homeField} value={to} onChange={e => setTo(e.target.value)}><option value="">Choose a member</option>{profiles?.filter(p => p.id !== me?.id).map(p => <option key={p.id} value={p.id}>{p.display_name}</option>)}</select></Field>
      <div className="grid grid-cols-3 gap-2">{gifts.map(g => <Button type="button" key={g} className="h-auto whitespace-normal py-3" variant={gift === g ? 'default' : 'outline'} onClick={() => setGift(g)}>{g}</Button>)}</div>
      <Field label="Note"><input aria-label="Note" maxLength={200} className={homeField} value={note} onChange={e => setNote(e.target.value)} /></Field>
      <Button className="w-full" disabled={send.isPending}><Gift />Send gift</Button>
    </form>
    <SectionTitle>Gifts for you</SectionTitle>{error ? <Empty>{error.message}</Empty> : !received.length ? <Empty>No gifts yet.</Empty> : <ul className="divide-y divide-gold/20">{received.map(g => <li key={g.id} className="py-3 text-sm"><strong className="text-gold">{g.gift}</strong> from {name(g.sender)}{g.note && <p className="break-words text-cream/70">{g.note}</p>}</li>)}</ul>}
    <SectionTitle>Sent</SectionTitle>{!sent.length ? <Empty>You haven't sent any gifts.</Empty> : <ul className="divide-y divide-gold/20">{sent.map(g => <li key={g.id} className="py-3 text-sm">{g.gift} to {name(g.receiver)}</li>)}</ul>}
  </AppShell>;
}
