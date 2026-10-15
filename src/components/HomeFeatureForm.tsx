import type { ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const homeField = 'mt-1 w-full rounded-md border border-gold/30 bg-wine p-3 text-cream';
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm text-cream/80">{label}{children}</label>;
}
export function useHomeAction(action: () => Promise<void>, success = 'Saved') {
  const qc = useQueryClient();
  return useMutation({ mutationFn: action, onSuccess: () => { void qc.invalidateQueries({ queryKey: ['home-features'] }); toast.success(success); }, onError: e => toast.error(e.message) });
}