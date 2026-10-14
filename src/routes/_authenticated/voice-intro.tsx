import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Mic, Square, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AppShell, Empty, SectionTitle } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { VoicePlayer } from '@/components/VoicePlayer';
import { useMe, useProfiles } from '@/hooks/use-me';
import { useFeatureData } from '@/hooks/use-features';
import { pageHead } from '@/lib/page-head';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/_authenticated/voice-intro')({ head: () => pageHead('Voice introductions', 'Seven-second voice icebreakers from Mphe-Motho members.'), component: VoiceIntro });
function VoiceIntro() {
  const { data: me } = useMe(); const { data: profiles } = useProfiles(); const { data, error } = useFeatureData(); const qc = useQueryClient();
  const [recording, setRecording] = useState(false); const [elapsed, setElapsed] = useState(0); const [clip, setClip] = useState<{ blob: Blob; url: string; duration: number } | null>(null);
  const recorder = useRef<MediaRecorder | null>(null); const stream = useRef<MediaStream | null>(null); const timer = useRef<ReturnType<typeof setInterval> | null>(null); const mounted = useRef(true); const requesting = useRef(false); const [starting, setStarting] = useState(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (recorder.current?.state === 'recording') recorder.current.stop(); stream.current?.getTracks().forEach(t => t.stop()); if (timer.current) clearInterval(timer.current); }; }, []);
  useEffect(() => () => { if (clip) URL.revokeObjectURL(clip.url); }, [clip]);
  function stop() { if (recorder.current?.state === 'recording') recorder.current.stop(); }
  async function start() {
    if (requesting.current || recording) return;
    requesting.current = true; setStarting(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('Voice recording is not supported in this browser.');
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { media.getTracks().forEach(t => t.stop()); return; }
      stream.current = media; const rec = new MediaRecorder(media); recorder.current = rec; const chunks: BlobPart[] = []; const started = Date.now();
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = () => { media.getTracks().forEach(t => t.stop()); if (timer.current) clearInterval(timer.current); if (!mounted.current) return; const blob = new Blob(chunks, { type: rec.mimeType }); setClip({ blob, url: URL.createObjectURL(blob), duration: Math.min(7, (Date.now() - started) / 1000) }); setRecording(false); };
      rec.start(); setRecording(true); setElapsed(0); timer.current = setInterval(() => { const seconds = (Date.now() - started) / 1000; setElapsed(Math.min(7, seconds)); if (seconds >= 7) stop(); }, 100);
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Microphone unavailable'); } finally { requesting.current = false; if (mounted.current) setStarting(false); }
  }
  const mine = data?.voices.find(v => v.user_id === me?.id);
  const save = useMutation({ mutationFn: async (remove: boolean) => {
    if (!me) throw new Error('Please sign in');
    if (remove) { const { error } = await supabase.from('voice_introductions').delete().eq('user_id', me.id); if (error) throw error; if (mine) await supabase.storage.from('voice-intros').remove([mine.path]); return; }
    if (!clip || !clip.blob.size) throw new Error('Record your introduction first');
    const path = `${me.id}/${crypto.randomUUID()}.${clip.blob.type.includes('mp4') ? 'm4a' : 'webm'}`;
    const upload = await supabase.storage.from('voice-intros').upload(path, clip.blob, { contentType: clip.blob.type }); if (upload.error) throw upload.error;
    const result = await supabase.from('voice_introductions').upsert({ user_id: me.id, path, duration: clip.duration, updated_at: new Date().toISOString() });
    if (result.error) { await supabase.storage.from('voice-intros').remove([path]); throw result.error; }
    if (mine) await supabase.storage.from('voice-intros').remove([mine.path]);
  }, onSuccess: () => { setClip(null); void qc.invalidateQueries({ queryKey: ['connection-features'] }); toast.success('Voice introduction updated'); }, onError: e => toast.error(e.message) });
  return <AppShell><SectionTitle><Mic className="mr-2 inline h-5 w-5 text-gold" />Voice icebreaker</SectionTitle>
    <div className="space-y-4 border-b border-gold/20 pb-6"><p className="text-center font-display text-3xl text-gold tabular-nums">{recording ? elapsed.toFixed(1) : '0.0'} / 7s</p><div className="flex justify-center gap-2"><Button disabled={save.isPending || starting} onClick={recording ? stop : () => void start()}>{recording ? <Square /> : <Mic />}{starting ? 'Opening microphone…' : recording ? 'Stop recording' : 'Record introduction'}</Button></div>
    {clip && <><audio controls src={clip.url} className="h-10 w-full" aria-label="Introduction preview" /><Button disabled={save.isPending || recording || starting} className="w-full" onClick={() => save.mutate(false)}><Upload />{save.isPending ? 'Saving…' : 'Save introduction'}</Button></>}
    {mine && <><VoicePlayer path={mine.path} name="Your saved" /><Button variant="outline" disabled={save.isPending || recording || starting} onClick={() => save.mutate(true)}><Trash2 />Remove introduction</Button></>}
    </div><SectionTitle>Hear the vibe</SectionTitle>{error ? <Empty>{error.message}</Empty> : !data?.voices.some(v => v.user_id !== me?.id) ? <Empty>No other voice introductions yet.</Empty> : <ul className="divide-y divide-gold/20">{data.voices.filter(v => v.user_id !== me?.id).map(v => <li key={v.user_id} className="space-y-2 py-4"><p className="text-sm text-gold">{profiles?.find(p => p.id === v.user_id)?.display_name ?? 'Member'}</p><VoicePlayer path={v.path} name={profiles?.find(p => p.id === v.user_id)?.display_name ?? 'Member'} /></li>)}</ul>}
  </AppShell>;
}