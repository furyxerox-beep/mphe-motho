import { Link } from '@tanstack/react-router';
import { Sun, Users, ShieldCheck, HeartHandshake, Music2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
  { to: '/dezembr', label: 'Dezembr Mode', detail: 'Festivity Finder', icon: Sun },
  { to: '/group-dates', label: 'Third-Wheel', detail: 'Group Dates', icon: Users },
  { to: '/safety-shield', label: 'Safety Shield', detail: 'Video Verification', icon: ShieldCheck },
  { to: '/milestones', label: 'Milestones', detail: 'Success Stories', icon: HeartHandshake },
  { to: '/groove-match', label: 'Groove Match', detail: 'Music Connections', icon: Music2 },
] as const;

export function HomeFeatureLinks() {
  return <nav aria-label="Love and lifestyle" className="my-6 grid grid-cols-2 gap-2">
    {links.map(({ to, label, detail, icon: Icon }) => <Button asChild variant="outline" key={to} className="h-auto min-h-24 justify-start whitespace-normal border-gold/30 bg-card/20 px-3 py-4 text-cream last:col-span-2">
      <Link to={to}><Icon className="text-gold" /><span className="min-w-0 flex-1 text-left"><span className="block font-semibold">{label}</span><span className="mt-1 block text-xs font-normal text-cream/60">{detail}</span></span><ArrowUpRight className="text-gold/60" /></Link>
    </Button>)}
  </nav>;
}