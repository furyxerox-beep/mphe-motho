import { Link } from '@tanstack/react-router';
import { Gauge, BadgeCheck, Utensils, Mic, Hourglass } from 'lucide-react';

const links = [
  { to: '/lobola', label: 'Lobola Meter', icon: Gauge },
  { to: '/choma', label: 'Choma Approved', icon: BadgeCheck },
  { to: '/date-planner', label: 'Braai & Vibe', icon: Utensils },
  { to: '/voice-intro', label: 'Voice Intro', icon: Mic },
  { to: '/match-countdown', label: '48-hour Matches', icon: Hourglass },
] as const;
export function FeatureLinks() {
  return <nav aria-label="Connection features" className="mb-5 grid grid-cols-3 gap-x-2 gap-y-3 border-y border-gold/20 py-3">
    {links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className="flex flex-col items-center gap-1 text-center text-xs text-cream/80 data-[status=active]:text-gold"><Icon className="h-5 w-5 text-gold" />{label}</Link>)}
  </nav>;
}