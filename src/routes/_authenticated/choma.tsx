import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { MemberPhoto } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { useMe, useProfiles } from '@/hooks/use-me';
import { useFeatureData } from '@/hooks/use-features';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/choma')({ head: () => pageHead('Choma Approved', 'Friend vouches from signed-in Mphe-Motho members.'), component: Choma });
function Choma() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const { data, error } = useFeatureData(); const qc = useQueryClient(); const [search, setSearch] = useState('');
  const mutation = useMutation({ mutationFn: async ({ member, remove }: { member: string; remove: boolean }) => { if (!me) throw new Error('Please sign in'); const result = remove ? await supabase.from('choma_vouches').delete().eq('voucher', me.id).eq('member', member) : await supabase.from('choma_vouches').insert({ voucher: me.id, member }); if (result.error) throw result.error; }, onSuccess: () => { void qc.invalidateQueries({ queryKey: ['connection-features'] }); toast.success('Vouch updated'); }, onError: e => toast.error(e.message) });
  const received = data?.vouches.filter(v => v.member === me?.id) ?? [];
  const members = profiles?.filter(p => p.id !== me?.id && p.display_name.toLowerCase().includes(search.toLowerCase())) ?? [];
  return <AppShell><SectionTitle><BadgeCheck className="mr-2 inline h-5 w-5 text-gold" />Choma Approved</SectionTitle>
    <p className="mb-3 text-sm text-cream/70">{received.length} friend {received.length === 1 ? 'vouch' : 'vouches'}</p>
    {received.map(v => { const p = profiles?.find(p => p.id === v.voucher); return p && <Link key={v.voucher} to="/people/$id" params={{ id: p.id }} className="mr-3 mb-3 inline-flex items-center gap-2 text-sm text-gold"><MemberPhoto path={p.avatar_path} name={p.display_name} className="h-8 w-8 rounded-full" />{p.display_name}</Link>; })}
    <SectionTitle>Your Chomas</SectionTitle><input aria-label="Find a friend" placeholder="Find a friend" value={search} onChange={e => setSearch(e.target.value)} className="mb-3 w-full rounded-md border border-gold/30 bg-wine p-3" />
    {error ? <Empty>{error.message}</Empty> : !members.length ? <Empty>No members found.</Empty> : <ul className="divide-y divide-gold/20">{members.map(p => { const vouched = data?.vouches.some(v => v.voucher === me?.id && v.member === p.id); const count = data?.vouches.filter(v => v.member === p.id).length ?? 0; return <li key={p.id} className="flex items-center gap-3 py-4"><MemberPhoto path={p.avatar_path} name={p.display_name} className="h-12 w-12 shrink-0 rounded-full" /><Link to="/people/$id" params={{ id: p.id }} className="min-w-0 flex-1 break-words">{p.display_name}<span className="block text-xs text-cream/60">{count} vouches</span></Link><Button disabled={mutation.isPending} variant="outline" onClick={() => mutation.mutate({ member: p.id, remove: !!vouched })}><BadgeCheck />{vouched ? 'Withdraw' : 'Vouch'}</Button></li>; })}</ul>}
  </AppShell>;
}