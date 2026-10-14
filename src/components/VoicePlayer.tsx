import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export function VoicePlayer({ path, name }: { path: string; name: string }) {
  const { data, error } = useQuery({ queryKey: ['voice-url', path], staleTime: 50 * 60000, queryFn: async () => { const { data, error } = await supabase.storage.from('voice-intros').createSignedUrl(path, 3600); if (error) throw error; return data.signedUrl; } });
  if (error) return <p role="alert" className="text-sm text-destructive">{error.message}</p>;
  return data ? <audio aria-label={`${name}'s voice introduction`} controls src={data} className="h-10 w-full max-w-full" /> : <p className="text-xs text-cream/60">Loading voice…</p>;
}