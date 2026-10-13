import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhone, passwordIssues } from "@/lib/sa";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Mphe-Motho" },
      { name: "description", content: "Sign in or join Mphe-Motho, dating for South Africa." },
      { property: "og:title", content: "Sign in — Mphe-Motho" },
      { property: "og:description", content: "Join Mzansi's dating community." },
    ],
  }),
  component: AuthPage,
});

const field = "w-full rounded-xl border border-gold/30 bg-card/20 px-4 py-3 text-cream placeholder:text-cream/40 outline-none focus:border-gold";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", adult: false });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => data.user && navigate({ to: "/discover" }));
  }, [navigate]);

  const issues = passwordIssues(f.password);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email.trim(), password: f.password });
        if (error) throw error;
        navigate({ to: "/discover" });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(f.email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        toast.success("Check your email for a reset link.");
      } else {
        const phone = normalizePhone(f.phone);
        if (!f.name.trim()) throw new Error("Please enter your name.");
        if (!phone) throw new Error("Use a South African mobile number, e.g. 082 123 4567.");
        if (issues.length) throw new Error("Password needs " + issues.join(", ") + ".");
        if (!f.adult) throw new Error("You must be 18 or older.");
        const { error } = await supabase.auth.signUp({
          email: f.email.trim(),
          password: f.password,
          options: { emailRedirectTo: `${window.location.origin}/profile`, data: { display_name: f.name.trim(), phone } },
        });
        if (error) throw error;
        setSent(true);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-romance">
      <div className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-center font-display text-4xl text-gold-gradient">Mphe-Motho</h1>
        <p className="mt-1 text-center text-sm text-cream/70">Dating for Mzansi 🇿🇦</p>
        {sent ? (
          <div className="mt-10 rounded-2xl border border-gold/40 bg-card/20 p-6 text-center text-cream">
            <p className="font-display text-xl text-gold">Check your email</p>
            <p className="mt-2 text-sm text-cream/80">We sent a confirmation link to {f.email}. Tap it to activate your account.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-4 rounded-3xl border border-gold/30 bg-card/10 p-6 shadow-glow">
            <h2 className="font-display text-2xl text-cream">{mode === "in" ? "Welcome back" : mode === "up" ? "Create your profile" : "Reset password"}</h2>
            {mode === "up" && <input className={field} placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
            <input className={field} type="email" required placeholder="Email address" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            {mode === "up" && (
              <input className={field} type="tel" required placeholder="SA mobile (082 123 4567)" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            )}
            {mode !== "forgot" && (
              <input className={field} type="password" required placeholder="Password" autoComplete={mode === "up" ? "new-password" : "current-password"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
            )}
            {mode === "up" && f.password && issues.length > 0 && <p className="text-xs text-cream/70">Needs {issues.join(", ")}.</p>}
            {mode === "up" && (
              <label className="flex items-center gap-2 text-sm text-cream/80">
                <input type="checkbox" checked={f.adult} onChange={(e) => setF({ ...f, adult: e.target.checked })} /> I'm 18+ and live in South Africa
              </label>
            )}
            <button disabled={busy} className="w-full rounded-full bg-primary-gradient py-3 font-semibold text-cream shadow-glow disabled:opacity-60">
              {busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Join Mphe-Motho" : "Send reset link"}
            </button>
            <div className="flex justify-between text-sm text-gold">
              <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "New here? Join" : "Have an account? Sign in"}</button>
              {mode === "in" && <button type="button" onClick={() => setMode("forgot")}>Forgot password?</button>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
