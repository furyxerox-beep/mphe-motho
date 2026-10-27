import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { AppShell, SectionTitle } from "@/components/AppShell";
import { matchIds, useLikes, useMe, useProfiles } from "@/hooks/use-me";
import { suggestStarters } from "@/lib/icebreakers.functions";

export const Route = createFileRoute("/_authenticated/icebreakers")({
  head: () => ({ meta: [
    { title: "AI Icebreakers — Mphe-Motho" },
    { name: "description", content: "Personalised conversation starters based on shared interests." },
    { property: "og:title", content: "AI Icebreakers — Mphe-Motho" },
    { property: "og:description", content: "Personalised conversation starters based on shared interests." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Icebreakers,
});

const field = "w-full rounded-2xl border border-gold/30 bg-card/20 px-4 py-3 text-cream placeholder:text-cream/40 outline-none";

function Icebreakers() {
  const { data: me } = useMe();
  const { data: profiles } = useProfiles();
  const { data: likes } = useLikes();
  const matches = (profiles ?? []).filter((p) => matchIds(me?.id, likes).includes(p.id));
  const suggest = useServerFn(suggestStarters);
  const [matchId, setMatchId] = useState("");
  const [form, setForm] = useState({ name: "", interests: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [starters, setStarters] = useState<string[]>([]);

  function pick(id: string) {
    setMatchId(id);
    const p = profiles?.find((x) => x.id === id);
    if (p) setForm({ name: p.display_name, interests: p.interests.join(", "), bio: p.bio ?? "" });
  }

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Add their name first."); return; }
    setLoading(true); setStarters([]);
    try {
      const r = await suggest({ data: { ...form, myInterests: me?.interests.join(", ") ?? "" } });
      if (r.error) toast.error(r.error);
      setStarters(r.starters);
    } catch { toast.error("Couldn't create suggestions right now."); }
    finally { setLoading(false); }
  }

  return (
    <AppShell>
      <SectionTitle>AI Icebreakers</SectionTitle>
      <p className="mb-4 text-sm text-cream/70">Pick a match or type their details, and get first messages based on what you share.</p>
      <form onSubmit={run} className="space-y-3">
        {matches.length > 0 && (
          <select value={matchId} onChange={(e) => pick(e.target.value)} className={field}>
            <option value="">Fill in from a match…</option>
            {matches.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
          </select>
        )}
        <input className={field} placeholder="Their name" maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={field} placeholder="Their interests (e.g. amapiano, hiking, braai)" maxLength={500} value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
        <textarea className={field} rows={3} placeholder="Their bio (optional)" maxLength={1000} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-gradient py-3 font-semibold text-cream shadow-glow disabled:opacity-60">
          <Sparkles className="h-5 w-5 text-gold" /> {loading ? "Thinking…" : "Suggest starters"}
        </button>
      </form>
      {starters.length > 0 && (
        <ul className="mt-5 space-y-2">
          {starters.map((s) => (
            <li key={s} className="flex items-start gap-2 rounded-2xl border border-gold/30 bg-card/10 p-3 text-sm text-cream">
              <span className="flex-1">{s}</span>
              <button aria-label="Copy" onClick={() => { void navigator.clipboard.writeText(s); toast.success("Copied"); }} className="text-gold"><Copy className="h-4 w-4" /></button>
            </li>
          ))}
          {matchId && <Link to="/messages/$id" params={{ id: matchId }} className="block text-center text-sm text-gold underline">Open chat with {form.name}</Link>}
        </ul>
      )}
    </AppShell>
  );
}
