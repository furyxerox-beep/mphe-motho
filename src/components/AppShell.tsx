import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, CalendarHeart, Compass, User, Bell, Flame } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Discover", icon: Compass },
  { to: "/matches", label: "Matches", icon: Heart },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/events", label: "Events", icon: CalendarHeart },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-romance">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="flex items-center justify-between px-5 pt-6 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gold-gradient shadow-gold">
              <Heart className="h-5 w-5 fill-primary text-primary" />
              <Flame className="absolute -top-2 h-4 w-4 text-gold" />
            </span>
            <h1 className="font-display text-2xl text-gold-gradient">Mphe-Motho</h1>
          </div>
          <div className="flex gap-2">
            <button aria-label="Profile" className="grid h-10 w-10 place-items-center rounded-full bg-card/10 text-gold"><User className="h-5 w-5" /></button>
            <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full bg-card/10 text-gold">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-accent" />
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 pb-28">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-gold/20 bg-wine/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <ul className="grid grid-cols-4">
            {tabs.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: true }}
                  className="flex flex-col items-center gap-1 py-3 text-xs text-cream/60 transition-colors data-[status=active]:text-gold"
                >
                  <Icon className="h-6 w-6" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 mt-6 font-display text-xl text-cream">{children}</h2>;
}
