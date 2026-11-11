import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Heart, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { DiscoveryPreview } from "@/components/landing/DiscoveryPreview";
import { AudioBioButton } from "@/components/landing/AudioBioButton";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorksSteps } from "@/components/landing/HowItWorksSteps";
import { SuccessStories } from "@/components/landing/SuccessStories";
import { previewProfiles } from "@/lib/landing-content";
import { normalizePhone } from "@/lib/sa";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mphe-Motho — Real Mzansi Connections, Built for Intention" },
      { name: "description", content: "Meet intentional South African singles with +27 sign-up, local discovery, voice introductions and shared interests across all 9 provinces." },
      { property: "og:title", content: "Mphe-Motho — Real Mzansi Connections, Built for Intention" },
      { property: "og:description", content: "South African dating with local discovery, shared intentions and genuine conversation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const sample = previewProfiles[0]!;

function Landing() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [sampleLiked, setSampleLiked] = useState(false);

  function openPreview() {
    setPhoneError("");
    setPreviewOpen(true);
  }

  function submitPhone(event: React.FormEvent) {
    event.preventDefault();
    const raw = phone.trim();
    const normalized = normalizePhone(raw.startsWith("+") || raw.startsWith("0") ? raw : `0${raw}`);
    if (!normalized) {
      setPhoneError("Enter a valid SA mobile number, for example 82 123 4567.");
      return;
    }
    setNormalizedPhone(normalized);
    openPreview();
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <LandingHeader onJoin={openPreview} />
      <main>
        <section className="relative overflow-hidden bg-landing-glow text-cream">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-20">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-sunset/30 bg-sunset/10 px-4 py-2 text-xs font-semibold text-sunset">
                <span className="h-2 w-2 rounded-full bg-sunset" />Dating with intention, made for Mzansi
              </div>
              <h1 className="mt-7 max-w-3xl font-display text-4xl font-bold leading-[1.12] sm:text-6xl lg:text-[4.25rem]">
                Real Mzansi Connections, <span className="text-gold-gradient">Built for Intention</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-cream/65 sm:text-lg">
                Meet South Africans who share your vibe and your intentions. Email confirmation, +27 sign-up and local discovery across all 9 provinces.
              </p>
              <form onSubmit={submitPhone} className="mt-8 max-w-xl" noValidate>
                <label htmlFor="hero-phone" className="mb-2 block text-sm font-semibold text-cream">Try your discovery preview</label>
                <div className="flex flex-col gap-3 rounded-[1.75rem] bg-paper p-2.5 shadow-card sm:flex-row sm:rounded-full">
                  <div className="flex min-w-0 flex-1 items-center rounded-full bg-sand px-4 text-ink">
                    <span className="border-r border-ink/15 pr-3 font-semibold">+27</span>
                    <input
                      id="hero-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="82 123 4567"
                      aria-describedby={phoneError ? "hero-phone-error" : "hero-phone-note"}
                      className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-base text-ink outline-none placeholder:text-ink/35"
                    />
                  </div>
                  <button className="flex items-center justify-center gap-2 rounded-full bg-terra px-6 py-3.5 font-bold text-paper transition-transform hover:-translate-y-0.5">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {phoneError ? <p id="hero-phone-error" role="alert" className="mt-2 text-sm text-sunset">{phoneError}</p> : <p id="hero-phone-note" className="mt-3 text-xs text-cream/45">Explore the preview first — no account needed. Membership is 18+ and Mzansi only.</p>}
              </form>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-cream/60">
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-sunset" />All 9 provinces</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-sunset" />Mutual matches</span>
                <span className="flex items-center gap-2"><Check className="h-4 w-4 text-sunset" />48 hours to say hello</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
              <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] border border-sunset/20 bg-sunset/5" aria-hidden="true" />
              <article className="relative overflow-hidden rounded-[2rem] bg-paper text-ink shadow-card">
                <div className="relative h-80 overflow-hidden sm:h-96">
                  <img src={sample.image} alt="Naledi, an illustrative Mphe-Motho sample profile" className="h-full w-full object-cover object-top" />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-card-fade" />
                  <span className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-semibold text-cream backdrop-blur"><MapPin className="h-3.5 w-3.5 text-sunset" />Gauteng</span>
                  <span className="absolute right-5 top-5 rounded-full bg-sunset px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink">Sample profile</span>
                  <div className="absolute bottom-5 left-5 right-5 text-cream">
                    <h2 className="font-display text-3xl font-bold">Naledi, 28</h2>
                    <p className="mt-1 text-sm text-cream/70">Johannesburg · Serious / Umshado</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-terra"><ShieldCheck className="h-4 w-4" />Verified Shield badge example</span>
                    <span className="text-xs text-ink/45">Preview only</span>
                  </div>
                  <AudioBioButton profile={sample} light />
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => setSampleLiked((value) => !value)} aria-pressed={sampleLiked} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold ${sampleLiked ? "bg-terra text-paper" : "bg-ink text-cream"}`}><Heart className={`h-4 w-4 ${sampleLiked ? "fill-current" : ""}`} />{sampleLiked ? "Sample liked" : "Like the sample"}</button>
                    <button onClick={openPreview} className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-sand" aria-label="Open discovery preview"><ArrowRight className="h-5 w-5" /></button>
                  </div>
                </div>
              </article>
              <div className="absolute -bottom-7 -left-4 hidden items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-4 text-ink shadow-card sm:flex lg:-left-12">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sand text-terra"><Sparkles className="h-5 w-5" /></span>
                <div><p className="text-xs font-bold">Shared-interest icebreakers</p><p className="mt-0.5 text-xs text-ink/50">Less “hey”, more genuine hello.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-terra">More ways to find your person</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">Dating that understands your culture, your voice and your vibe.</h2></div>
              <p className="max-w-sm text-sm leading-6 text-ink/55">From the first icebreaker to your next milestone, every feature is designed to move beyond endless swiping.</p>
            </div>
            <FeatureGrid />
          </div>
        </section>

        <section className="bg-sand/60 px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-terra">How it works</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">From local hello to real connection.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink/55">Three simple steps, with your intentions at the centre.</p></div>
            <HowItWorksSteps />
            <div className="mt-9 text-center"><button onClick={openPreview} className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-cream">Try the interactive preview <ArrowRight className="h-4 w-4" /></button></div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-terra">Mzansi success stories</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Every real connection starts with a hello.</h2></div>
            <SuccessStories />
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-landing-glow px-6 py-14 text-center text-cream sm:px-12 sm:py-16">
            <Heart className="mx-auto h-9 w-9 fill-sunset text-sunset" />
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold sm:text-4xl">Your next great conversation could be closer than you think.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-cream/60">Choose your province, set your intention and see how Mphe-Motho feels.</p>
            <button onClick={openPreview} className="mt-7 inline-flex items-center gap-2 rounded-full bg-sunset px-8 py-4 font-bold text-ink shadow-gold">Join Mzansi <ArrowRight className="h-4 w-4" /></button>
          </div>
        </section>
      </main>
      <LandingFooter />
      <DiscoveryPreview open={previewOpen} onOpenChange={setPreviewOpen} initialPhone={normalizedPhone} />
    </div>
  );
}
