import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Music2, Save, ExternalLink } from 'lucide-react';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Field, homeField, useHomeAction } from '@/components/HomeFeatureForm';
import { useHomeFeatures } from '@/hooks/use-home-features';
import { useMe, useProfiles } from '@/hooks/use-me';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/groove-match')({ head: () => pageHead('Groove Match', 'Connect through shared Amapiano, Afropop and favourite music.'), component: Groove });
const genres = ['Amapiano', 'Afropop', 'Gqom', 'Kwaito', 'Hip-hop', 'R&B', 'House', 'Gospel'];
function safePlaylist(value: string) { try { const u = new URL(value); return u.protocol === 'https:' && ['open.spotify.com', 'music.apple.com', 'music.youtube.com'].includes(u.hostname) ? u.href : null; } catch { return null; } }
function Groove() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const { data, error } = useHomeFeatures();
  const [f, setF] = useState({ genres: [] as string[], artist: '', track: '', playlist_url: '' });
  const own = data?.music.find(m => m.user_id === me?.id);
  useEffect(() => { if (own) setF({ genres: own.genres, artist: own.artist, track: own.track, playlist_url: own.playlist_url }); }, [own]);
  const save = useHomeAction(async () => { if (!me) throw new Error('Please sign in'); if (f.playlist_url && !safePlaylist(f.playlist_url)) throw new Error('Use a Spotify, Apple Music or YouTube Music HTTPS link'); const r = await supabase.from('music_preferences').upsert({ ...f, user_id: me.id }); if (r.error) throw r.error; });
  const matches = (data?.music ?? []).filter(m => m.user_id !== me?.id).map(m => ({ ...m, shared: m.genres.filter(g => f.genres.includes(g)) })).filter(m => m.shared.length).sort((a,b) => b.shared.length-a.shared.length);
  return <AppShell><SectionTitle><Music2 className="mr-2 inline h-5 w-5 text-gold" />Groove Match</SectionTitle>
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); save.mutate(); }}><fieldset><legend className="mb-3 text-sm">Your sound</legend><div className="grid grid-cols-2 gap-3">{genres.map(g => <label key={g} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.genres.includes(g)} onChange={e => setF({ ...f, genres: e.target.checked ? [...f.genres,g] : f.genres.filter(x => x!==g) })} />{g}</label>)}</div></fieldset>
      <Field label="Favourite artist"><input aria-label="Favourite artist" maxLength={100} className={homeField} value={f.artist} onChange={e => setF({ ...f, artist: e.target.value })} /></Field>
      <Field label="Favourite track"><input aria-label="Favourite track" maxLength={100} className={homeField} value={f.track} onChange={e => setF({ ...f, track: e.target.value })} /></Field>
      <Field label="Playlist link (optional)"><input aria-label="Playlist link" type="url" className={homeField} value={f.playlist_url} onChange={e => setF({ ...f, playlist_url: e.target.value })} /></Field>
      <Button disabled={save.isPending} className="w-full"><Save />Save my sound</Button>
    </form><SectionTitle>Shared rhythm</SectionTitle>{error ? <Empty>{error.message}</Empty> : !matches.length ? <Empty>No shared music tastes yet.</Empty> : <ul className="divide-y divide-gold/20">{matches.map(m => <li key={m.user_id} className="space-y-2 py-4"><Link className="font-semibold text-gold" to="/people/$id" params={{ id: m.user_id }}>{profiles?.find(p => p.id===m.user_id)?.display_name ?? 'Member'}</Link><p className="text-sm">{m.shared.join(' · ')}</p><p className="text-sm text-cream/70">{[m.artist,m.track].filter(Boolean).join(' — ')}</p>{safePlaylist(m.playlist_url) && <Button asChild variant="outline" size="sm"><a href={safePlaylist(m.playlist_url) ?? undefined} target="_blank" rel="noreferrer"><ExternalLink />Open playlist</a></Button>}</li>)}</ul>}
  </AppShell>;
}