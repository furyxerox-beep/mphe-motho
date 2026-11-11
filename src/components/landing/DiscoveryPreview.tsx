import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Heart, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PROVINCES } from "@/lib/sa";
import { previewScore, rankedPreviewProfiles, type PreviewIntent } from "@/lib/landing-content";
import { AudioBioButton } from "@/components/landing/AudioBioButton";

const intentions: { value: PreviewIntent; title: string; detail: string }[] = [
  { value: "Umshado", title: "Serious / Umshado", detail: "Commitment, shared values and a future together" },
  { value: "Open", title: "Open to something real", detail: "Start naturally and see where the connection goes" },
  { value: "Vibes", title: "Just the vibes", detail: "Easy conversation and meeting new people" },
];

export function DiscoveryPreview({ open, onOpenChange, initialPhone = "", initialProvince = "" }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPhone?: string;
  initialProvince?: string;
}) {
  const [step, setStep] = useState(0);
  const [province, setProvince] = useState(initialProvince);
  const [intent, setIntent] = useState<PreviewIntent | "">("");
  const [profileIndex, setProfileIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [starterIndex, setStarterIndex] = useState(0);
  const profiles = useMemo(() => rankedPreviewProfiles(province, intent), [province, intent]);
  const profile = profiles[profileIndex]!;

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setProvince(initialProvince);
    setIntent("");
    setProfileIndex(0);
    setLiked(new Set());
    setStarterIndex(0);
  }, [open, initialProvince]);

  function toggleLike() {
    setLiked((current) => {
      const next = new Set(current);
      if (next.has(profile.id)) next.delete(profile.id); else next.add(profile.id);
      return next;
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto rounded-[2rem] border-ink/10 bg-paper p-0 text-ink shadow-card">
        <div className="border-b border-ink/10 bg-sand px-6 pb-5 pt-6 sm:px-8">
          <div className="flex items-center gap-2 pr-10 text-xs font-bold uppercase tracking-[0.18em] text-terra"><Sparkles className="h-4 w-4" />Interactive discovery preview</div>
          <DialogTitle className="mt-3 font-display text-2xl font-bold sm:text-3xl">
            {step === 0 ? "Where in Mzansi are you?" : step === 1 ? "What are you open to?" : "Meet your sample matches"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-ink/60">
            {step === 2 ? "Demo profiles only — nobody real is contacted or liked." : "Two quick choices, then explore three local profile examples."}
          </DialogDescription>
          <div className="mt-5 flex gap-2" aria-label={`Step ${step + 1} of 3`}>
            {[0, 1, 2].map((item) => <span key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-terra" : "bg-ink/10"}`} />)}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {step === 0 && (
            <div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PROVINCES.map((item) => (
                  <button key={item.name} onClick={() => setProvince(item.name)} aria-pressed={province === item.name} className={`flex min-h-20 items-center justify-between gap-2 rounded-2xl border p-4 text-left text-sm font-semibold transition-colors ${province === item.name ? "border-terra bg-terra text-paper" : "border-ink/10 bg-paper hover:bg-sand"}`}>
                    {item.name}{province === item.name && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                ))}
              </div>
              <button disabled={!province} onClick={() => setStep(1)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-cream disabled:opacity-40">
                Choose my intent <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="space-y-3">
                {intentions.map((item) => (
                  <button key={item.value} onClick={() => setIntent(item.value)} aria-pressed={intent === item.value} className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-5 text-left transition-colors ${intent === item.value ? "border-terra bg-sand" : "border-ink/10 bg-paper hover:bg-sand/60"}`}>
                    <span><span className="block font-display text-lg font-bold">{item.title}</span><span className="mt-1 block text-sm text-ink/55">{item.detail}</span></span>
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${intent === item.value ? "border-terra bg-terra text-paper" : "border-ink/20"}`}>{intent === item.value && <Check className="h-4 w-4" />}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(0)} className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3.5 font-semibold"><ArrowLeft className="h-4 w-4" />Back</button>
                <button disabled={!intent} onClick={() => setStep(2)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-cream disabled:opacity-40">Preview my matches <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-ink/55">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-terra" />{province} · {intent}</span>
                <span>{profileIndex + 1} of {profiles.length} · {previewScore(profile, province, intent)}% preview fit</span>
              </div>
              <article className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-paper shadow-card">
                <div className="grid sm:grid-cols-[0.85fr_1.15fr]">
                  <div className="relative min-h-72 sm:min-h-96">
                    <img src={profile.image} alt={`${profile.name}, illustrative sample profile`} className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur">Sample profile</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div><h3 className="font-display text-2xl font-bold">{profile.name}, {profile.age}</h3><p className="mt-1 flex items-center gap-1 text-sm text-ink/55"><MapPin className="h-4 w-4" />{profile.city}, {profile.province}</p></div>
                      <span className="flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold text-terra"><ShieldCheck className="h-3.5 w-3.5" />Badge preview</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-ink/65">{profile.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-2">{profile.interests.map((interest) => <span key={interest} className="rounded-full bg-sand px-3 py-1 text-xs font-medium">{interest}</span>)}</div>
                    <div className="mt-5"><AudioBioButton profile={profile} /></div>
                    <div className="mt-4 rounded-2xl border border-terra/20 bg-sand/70 p-4">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terra"><Sparkles className="h-4 w-4" />AI Icebreaker preview</p>
                      <p className="mt-2 text-sm leading-6">{profile.icebreakers[starterIndex % profile.icebreakers.length]}</p>
                      <button onClick={() => setStarterIndex((value) => value + 1)} className="mt-2 text-xs font-semibold text-terra underline underline-offset-4">Show another sample suggestion</button>
                      <p className="mt-2 text-[10px] leading-4 text-ink/45">Live personalised AI suggestions are available after signing in.</p>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <button onClick={toggleLike} aria-pressed={liked.has(profile.id)} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition-colors ${liked.has(profile.id) ? "bg-terra text-paper" : "bg-ink text-cream"}`}><Heart className={`h-4 w-4 ${liked.has(profile.id) ? "fill-current" : ""}`} />{liked.has(profile.id) ? "Preview liked" : "Like this sample"}</button>
                      <button onClick={() => { setProfileIndex((value) => (value + 1) % profiles.length); setStarterIndex(0); }} aria-label="Next sample profile" className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 hover:bg-sand"><ArrowRight className="h-5 w-5" /></button>
                    </div>
                  </div>
                </div>
              </article>
              <div className="mt-6 rounded-2xl bg-ink p-5 text-cream">
                <p className="font-display text-lg font-bold">Ready for the real thing?</p>
                <p className="mt-1 text-sm text-cream/60">Create your account to build a profile and discover actual members. Your preview likes are not saved.</p>
                <Link to="/auth" search={{ mode: "up", phone: initialPhone || undefined, province, intent: intent || undefined }} onClick={() => onOpenChange(false)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-sunset px-6 py-3.5 font-bold text-ink">Join Mzansi <ArrowRight className="h-4 w-4" /></Link>
                <button onClick={() => setStep(1)} className="mt-3 w-full py-1 text-xs font-semibold text-cream/60">Change province or intent</button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
