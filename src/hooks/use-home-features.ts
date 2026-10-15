import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useHomeFeatures() {
  const qc = useQueryClient();
  useEffect(() => {
    let channel = supabase.channel('home-experiences');
    for (const table of ['holiday_preferences', 'music_preferences', 'group_dates', 'group_date_members', 'relationship_milestones', 'safety_submissions']) {
      channel = channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => { void qc.invalidateQueries({ queryKey: ['home-features'] }); });
    }
    channel.subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [qc]);
  return useQuery({ queryKey: ['home-features'], queryFn: async () => {
    const [holidays, music, groups, members, milestones, safety] = await Promise.all([
      supabase.from('holiday_preferences').select('*'), supabase.from('music_preferences').select('*'),
      supabase.from('group_dates').select('*').order('starts_at'), supabase.from('group_date_members').select('*'),
      supabase.from('relationship_milestones').select('*').order('anniversary'), supabase.from('safety_submissions').select('*').order('created_at', { ascending: false }),
    ]);
    for (const r of [holidays, music, groups, members, milestones, safety]) if (r.error) throw r.error;
    return { holidays: holidays.data ?? [], music: music.data ?? [], groups: groups.data ?? [], members: members.data ?? [], milestones: milestones.data ?? [], safety: safety.data ?? [] };
  }});
}