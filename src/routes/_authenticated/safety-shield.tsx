import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ShieldCheck, Upload, Trash2 } from 'lucide-react';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { useHomeAction } from '@/components/HomeFeatureForm';
import { useHomeFeatures } from '@/hooks/use-home-features';
import { useMe } from '@/hooks/use-me';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/safety-shield')({ head: () => pageHead('Safety Shield', 'Private video submissions and honest verification status for Mzansi members.'), component: Safety });
function Safety() {
  const { data: me } = useMe(); const { data, error } = useHomeFeatures(); const [file, setFile] = useState<File | null>(null);
  const upload = useHomeAction(async () => {
    if (!me || !file) throw new Error('Choose a video first');
    if (file.size > 20*1024*1024 || !['video/mp4','video/webm','video/quicktime'].includes(file.type)) throw new Error('Choose an MP4, WebM or MOV video under 20 MB');
    const ext = file.type==='video/webm' ? 'webm' : file.type==='video/quicktime' ? 'mov' : 'mp4';
    const path = `${me.id}/${crypto.randomUUID()}.${ext}`;
    const r = await supabase.storage.from('safety-videos').upload(path,file); if (r.error) throw r.error;
    const saved = await supabase.from('safety_submissions').insert({ user_id: me.id, path });
    if (saved.error) { await supabase.storage.from('safety-videos').remove([path]); throw saved.error; }
    setFile(null);
  }, 'Video submitted privately');
  const withdraw = useHomeAction(async () => { const own = data?.safety.filter(s => s.user_id===me?.id) ?? []; for (const s of own) { const r = await supabase.storage.from('safety-videos').remove([s.path]); if (r.error) throw r.error; const d = await supabase.from('safety_submissions').delete().eq('id',s.id); if (d.error) throw d.error; } }, 'Videos withdrawn');
  const own = data?.safety.filter(s => s.user_id===me?.id) ?? [];
  return <AppShell><SectionTitle><ShieldCheck className="mr-2 inline h-5 w-5 text-gold" />Safety Shield</SectionTitle>
    <p className="mb-4 text-sm text-cream/80">Video submissions are private. Automated identity checks and Gold Crown verification are not active; submitting a video does not verify your identity.</p>
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); upload.mutate(); }}><label className="block text-sm">Your introduction video<input key={own.length} aria-label="Introduction video" type="file" accept="video/mp4,video/webm,video/quicktime" capture="user" className="mt-3 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:p-3 file:text-cream" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label><p className="text-xs text-cream/60">MP4, WebM or MOV · up to 20 MB</p><Button className="w-full" disabled={!file || upload.isPending}><Upload />{upload.isPending ? 'Uploading…' : 'Submit private video'}</Button></form>
    <SectionTitle>Your submissions</SectionTitle>{error ? <Empty>{error.message}</Empty> : !own.length ? <Empty>No video submitted. Not verified.</Empty> : <><ul className="divide-y divide-gold/20">{own.map(s => <li key={s.id} className="py-3"><p className="text-gold">{s.status === 'submitted' ? 'Submitted — not verified' : s.status}</p><p className="text-xs text-cream/60">{new Date(s.created_at).toLocaleString('en-ZA')}</p></li>)}</ul><Button variant="outline" disabled={withdraw.isPending} onClick={() => { if (window.confirm('Withdraw and delete all your verification videos?')) withdraw.mutate(); }}><Trash2 />Withdraw videos</Button></>}
  </AppShell>;
}