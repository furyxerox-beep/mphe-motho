import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { AppShell, SectionTitle } from "@/components/AppShell";
import { MemberPhoto } from "@/components/Avatar";
import { useMe } from "@/hooks/use-me";
import { PROVINCES, normalizePhone } from "@/lib/sa";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My profile — Mphe-Motho" }, { name: "description", content: "Edit your profile." }] }),
  component: MyProfile,
});

const field = "w-full rounded-xl border border-gold/30 bg-card/20 px-4 py-3 text-cream placeholder:text-cream/40 outline-none focus:border-gold";

function MyProfile() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: priv } = useQuery({
    queryKey: ["private", me?.id],
    enabled: !!me,
    queryFn: async () => (await supabase.from("private_details").select("phone").eq("user_id", me!.id).maybeSingle()).data,
  });
  const [f, setF] = useState({ display_name: "", birthdate: "", gender: "", interested_in: "", job: "", city: "", province: "", bio: "", interests: "", phone: "", facebook_url: "", tiktok_handle: "", whatsapp_number: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (me)
      setF({
        display_name: me.display_name, birthdate: me.birthdate ?? "", gender: me.gender ?? "", interested_in: me.interested_in ?? "",
        job: me.job ?? "", city: me.city ?? "", province: me.province ?? "", bio: me.bio ?? "", interests: me.interests.join(", "), phone: priv?.phone ?? "",
        facebook_url: (me as any).facebook_url ?? "", tiktok_handle: (me as any).tiktok_handle ?? "", whatsapp_number: (me as any).whatsapp_number ?? "",
      });
  }, [me, priv]);

  async function upload(file: File) {
    if (!me) return;
    const path = `${me.id}/${Date.now()}-${file.name.replace(/[^\w.]/g, "")}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return; }
    await supabase.from("profiles").update({ avatar_path: path }).eq("id", me.id);
    qc.invalidateQueries({ queryKey: ["me"] });
    qc.invalidateQueries({ queryKey: ["profiles"] });
    toast.success("Photo updated");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!me) return;
    if (f.birthdate) {
      const a = (Date.now() - new Date(f.birthdate).getTime()) / 31557600000;
      if (a < 18) { toast.error("You must be 18 or older."); return; }
    }
    const phone = normalizePhone(f.phone);
    if (!phone) { toast.error("Use a South African mobile number."); return; }
    const wa = f.whatsapp_number.trim() ? normalizePhone(f.whatsapp_number) : "";
    if (wa === null || wa === undefined) { toast.error("WhatsApp must be a South African number."); return; }
    const fb = f.facebook_url.trim();
    if (fb && !/^(https?:\/\/)?(www\.|m\.)?(facebook|fb)\.com\/[\w.\-/?=]+$/i.test(fb)) { toast.error("Use a facebook.com profile link."); return; }
    const tt = f.tiktok_handle.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?tiktok\.com\/@/i, "").split(/[/?]/)[0];
    if (tt && !/^[\w.]{2,24}$/.test(tt)) { toast.error("Use a valid TikTok username."); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: f.display_name.trim() || "Member", birthdate: f.birthdate || null, gender: f.gender || null, interested_in: f.interested_in || null,
      job: f.job, city: f.city, province: f.province || null, bio: f.bio.slice(0, 600),
      interests: f.interests.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 10),
      facebook_url: fb ? (fb.startsWith("http") ? fb : `https://${fb}`) : "", tiktok_handle: tt, whatsapp_number: wa || "",
    }).eq("id", me.id);
    const { error: e2 } = phone !== priv?.phone ? await supabase.from("private_details").update({ phone }).eq("user_id", me.id) : { error: null };
    setSaving(false);
    if (error || e2) { toast.error((error ?? e2)!.message); return; }
    qc.invalidateQueries();
    toast.success("Profile saved");
  }

  return (
    <AppShell>
      <form onSubmit={save} className="space-y-3">
        <div className="flex flex-col items-center pt-2">
          <label className="relative cursor-pointer">
            <MemberPhoto path={me?.avatar_path} name={f.display_name || "?"} className="h-28 w-28 rounded-full border-4 border-gold text-4xl" />
            <span className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-gold-gradient text-primary"><Camera className="h-4 w-4" /></span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
        </div>
        <SectionTitle>About you</SectionTitle>
        <input className={field} placeholder="Display name" value={f.display_name} onChange={(e) => setF({ ...f, display_name: e.target.value })} />
        <label className="block text-xs text-cream/60">Birthday<input type="date" className={field} value={f.birthdate} onChange={(e) => setF({ ...f, birthdate: e.target.value })} /></label>
        <div className="grid grid-cols-2 gap-3">
          <select className={field} value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value })}>
            <option value="">I am…</option><option>Man</option><option>Woman</option>
          </select>
          <select className={field} value={f.interested_in} onChange={(e) => setF({ ...f, interested_in: e.target.value })}>
            <option value="">Looking for…</option><option>Man</option><option>Woman</option><option>Everyone</option>
          </select>
        </div>
        <input className={field} placeholder="Job title" value={f.job} onChange={(e) => setF({ ...f, job: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className={field} placeholder="City / Town" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
          <select className={field} value={f.province} onChange={(e) => setF({ ...f, province: e.target.value })}>
            <option value="">Province</option>
            {PROVINCES.map((p) => <option key={p.name}>{p.name}</option>)}
          </select>
        </div>
        <textarea className={field} rows={4} placeholder="Tell people about yourself…" value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
        <input className={field} placeholder="Interests, comma separated (Jazz, Hiking, Braai)" value={f.interests} onChange={(e) => setF({ ...f, interests: e.target.value })} />
        <label className="block text-xs text-cream/60">Mobile (private, never shown)<input type="tel" className={field} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        <SectionTitle>Link your socials (shown to matches only)</SectionTitle>
        <input className={field} placeholder="Facebook profile link (facebook.com/…)" value={f.facebook_url} onChange={(e) => setF({ ...f, facebook_url: e.target.value })} />
        <input className={field} placeholder="TikTok username (@…)" value={f.tiktok_handle} onChange={(e) => setF({ ...f, tiktok_handle: e.target.value })} />
        <input type="tel" className={field} placeholder="WhatsApp number (+27…), optional" value={f.whatsapp_number} onChange={(e) => setF({ ...f, whatsapp_number: e.target.value })} />
        <button disabled={saving} className="w-full rounded-full bg-primary-gradient py-3 font-semibold text-cream shadow-glow">{saving ? "Saving…" : "Save profile"}</button>
      </form>
    </AppShell>
  );
}
