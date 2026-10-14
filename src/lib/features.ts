import type { Database } from '@/integrations/supabase/types';

export type Culture = Database['public']['Tables']['cultural_preferences']['Row'];
export type Window = Database['public']['Tables']['match_windows']['Row'];
export function culturalScore(a?: Culture, b?: Culture) {
  if (!a || !b) return null;
  const keys = ['intention', 'family', 'tradition', 'language'] as const;
  const answered = keys.filter(k => a[k] && b[k]);
  if (!answered.length) return null;
  return Math.round(answered.filter(k => a[k] === b[k]).length / answered.length * 100);
}
export function windowFor(windows: Window[], a: string, b: string) {
  return windows.find(w => (w.member_a === a && w.member_b === b) || (w.member_a === b && w.member_b === a));
}
export function matchActive(w: Window | undefined, now = Date.now()) {
  return !!w && (!!w.opened_at || new Date(w.expires_at).getTime() > now);
}
export function countdown(w: Window | undefined, now = Date.now()) {
  if (!w) return 'Waiting for connection';
  if (w.opened_at) return 'Conversation started';
  const seconds = Math.max(0, Math.floor((new Date(w.expires_at).getTime() - now) / 1000));
  if (!seconds) return 'Match expired';
  return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')} left`;
}