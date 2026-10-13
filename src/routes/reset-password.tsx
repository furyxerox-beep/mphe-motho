import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { passwordIssues } from "@/lib/sa";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Mphe-Motho" },
      { name: "description", content: "Choose a new Mphe-Motho password." },
      { property: "og:title", content: "Reset password — Mphe-Motho" },
      { property: "og:description", content: "Choose a new password." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  const issues = passwordIssues(pw);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (issues.length) { toast.error("Password needs " + issues.join(", ")); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/discover" });
  }
  return (
    <div className="min-h-screen bg-romance px-6 py-16">
      <form onSubmit={save} className="mx-auto max-w-md space-y-4 rounded-3xl border border-gold/30 bg-card/10 p-6">
        <h1 className="font-display text-2xl text-gold">New password</h1>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full rounded-xl border border-gold/30 bg-card/20 px-4 py-3 text-cream" />
        <button className="w-full rounded-full bg-primary-gradient py-3 font-semibold text-cream">Save</button>
      </form>
    </div>
  );
}
