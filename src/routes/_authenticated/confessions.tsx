import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bus, Send } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { homeField } from '@/components/HomeFeatureForm';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/confessions')({ head: () => pageHead('Taxicab Confessions', 'Share dating stories and ask for advice anonymously.'), component: Confessions });
function Confessions() {
  const qc = useQueryClient(); const [body, setBody] = useState(''); const [kind, setKind] = useState<'story' | 'advice'>('story'); const [filter, setFilter] = useState<'all' | 'story' | 'advice'>('all');
  useEffect(() => { const ch = supabase.channel('confessions').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'confessions' }, () => { void qc.invalidateQueries({ queryKey: ['confessions'] }); }).subscribe(); return () => { void supabase.removeChannel(ch); }; }, [qc]);
  const { data, error } = useQuery({ queryKey: ['confessions'], queryFn: async () => { const r = await supabase.from('confessions').select('id, kind, body, created_at').order('created_at', { ascending: false }).limit(200); if (r.error) throw r.error; return r.data; } });
  const post = useMutation({ mutationFn: async () => { const { data: u } = await supabase.auth.getUser(); if (!u.user) throw new Error('Please sign in'); const r = await supabase.from('confessions').insert({ body: body.trim(), kind, author: u.user.id }); if (r.error) throw r.error; }, onSuccess: () => { setBody(''); void qc.invalidateQueries({ queryKey: ['confessions'] }); toast.success('Posted anonymously'); }, onError: e => toast.error(e.message) });
  const list = (data ?? []).filter(c => filter === 'all' || c.kind === filter);
  return <AppShell><SectionTitle><Bus className="mr-2 inline h-5 w-5 text-gold" />Taxicab Confessions</SectionTitle>
    <p className="mb-3 text-sm text-cream/70">Your name is never shown to other members.</p>
    <form className="space-y-3" onSubmit={e => { e.preventDefault(); post.mutate(); }}>
      <div className="flex gap-2">{(['story', 'advice'] as const).map(k => <Button type="button" key={k} variant={kind === k ? 'default' : 'outline'} onClick={() => setKind(k)}>{k === 'story' ? 'Dating story' : 'Need advice'}</Button>)}</div>
      <textarea aria-label="Your confession" required minLength={3} maxLength={1500} rows={4} className={homeField} value={body} onChange={e => setBody(e.target.value)} placeholder="Spill the tea…" />
      <Button className="w-full" disabled={post.isPending}><Send />Post anonymously</Button>
    </form>
    <div className="mt-6 flex gap-2">{(['all', 'story', 'advice'] as const).map(k => <Button key={k} size="sm" variant={filter === k ? 'default' : 'outline'} onClick={() => setFilter(k)}>{k === 'all' ? 'All' : k === 'story' ? 'Stories' : 'Advice'}</Button>)}</div>
    {error ? <Empty>{error.message}</Empty> : !list.length ? <Empty>No confessions yet. Be the first!</Empty> : <ul className="divide-y divide-gold/20">{list.map(c => <li key={c.id} className="py-4"><p className="text-xs text-gold">{c.kind === 'story' ? 'Dating story' : 'Advice wanted'} · {new Date(c.created_at).toLocaleString('en-ZA')}</p><p className="mt-1 whitespace-pre-wrap break-words text-sm">{c.body}</p></li>)}</ul>}
  </AppShell>;
}
