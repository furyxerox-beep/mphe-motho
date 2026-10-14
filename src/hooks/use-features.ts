import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useClock() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  return now;
}
export function useFeatureData() {
  return useQuery({ queryKey: ['connection-features'], queryFn: async () => {
    const [cultures, vouches, windows, dates, voices] = await Promise.all([
      supabase.from('cultural_preferences').select('*'), supabase.from('choma_vouches').select('*'),
      supabase.from('match_windows').select('*'), supabase.from('date_invitations').select('*').order('starts_at'),
      supabase.from('voice_introductions').select('*'),
    ]);
    for (const result of [cultures, vouches, windows, dates, voices]) if (result.error) throw result.error;
    return { cultures: cultures.data ?? [], vouches: vouches.data ?? [], windows: windows.data ?? [], dates: dates.data ?? [], voices: voices.data ?? [] };
  }});
}
export function useFeatureLive(userId?: string) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!userId) return;
    let channel = supabase.channel(`connection-features-${userId}`);
    for (const table of ['cultural_preferences','choma_vouches','match_windows','date_invitations','voice_introductions'] as const) {
      channel = channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        void qc.invalidateQueries({ queryKey: ['connection-features'] });
        if (table === 'match_windows') void qc.invalidateQueries({ queryKey: ['likes'] });
      });
    }
    channel = channel.on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
      void qc.invalidateQueries({ queryKey: ['profiles'] });
    }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [userId, qc]);
}