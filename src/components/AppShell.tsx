import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, MessageCircle, CalendarHeart, Compass, LogOut, Flame } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMe } from "@/hooks/use-me";
import { inSouthAfrica, nearestProvince } from "@/lib/sa";
import { MemberPhoto } from "@/components/Avatar";

const tabs = [
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/matches", label: "Matches", icon: Heart },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/events", label: "Events", icon: CalendarHeart },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: me } = useMe();

  // Auto-locate (Mzansi only) + presence
  useEffect(() => {
    if (!me?.id) return;
    void supabase.from("profiles").update({ last_active: new Date().toISOString() }).eq("id", me.id);
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        if (!inSouthAfrica(lat, lng)) {
          toast.error("Mphe-Motho is for Mzansi only — you appear to be outside South Africa.");
          return;
        }
        await supabase
          .from("profiles")
          .update({ lat, lng, province: me.province ?? nearestProvince(lat, lng) })
          .eq("id", me.id);
        qc.invalidateQueries({ queryKey: ["me"] });
      },
      () => {},
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }, [me?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Real-time: likes and new messages
  useEffect(() => {
    if (!me?.id) return;
    const ch = supabase
      .channel("me-" + me.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "likes", filter: `liked=eq.${me.id}` }, async (p) => {
        await qc.invalidateQueries({ queryKey: ["likes"] });
        const likes = qc.getQueryData<{ liker: string; liked: string }[]>(["likes"]);
        const liker = (p.new as { liker: string }).liker;
        if (likes?.some((l) => l.liker === me.id && l.liked === liker)) toast.success("💛 It's a match! Say hello in Messages.");
        else toast("Someone new likes you 💛");
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `receiver=eq.${me.id}` }, () => {
        qc.invalidateQueries({ queryKey: ["messages"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [me?.id, qc]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-romance">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="flex items-center justify-between px-5 pt-6 pb-3">
          <Link to="/discover" className="flex items-center gap-2">
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gold-gradient shadow-gold">
              <Heart className="h-5 w-5 fill-primary text-primary" />
              <Flame className="absolute -top-2 h-4 w-4 text-gold" />
            </span>
            <h1 className="font-display text-2xl text-gold-gradient">Mphe-Motho</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/profile" aria-label="My profile" className="overflow-hidden rounded-full border-2 border-gold/60">
              <MemberPhoto path={me?.avatar_path} name={me?.display_name ?? "?"} className="h-10 w-10" />
            </Link>
            <button onClick={signOut} aria-label="Sign out" className="grid h-10 w-10 place-items-center rounded-full bg-card/10 text-gold">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 pb-28">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-gold/20 bg-wine/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <ul className="grid grid-cols-4">
            {tabs.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className="flex flex-col items-center gap-1 py-3 text-xs text-cream/60 transition-colors data-[status=active]:text-gold">
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

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-gold/20 bg-card/10 p-6 text-center text-sm text-cream/70">{children}</p>;
}
