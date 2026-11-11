import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Heart, MapPin, Music2, Users } from "lucide-react";
import { MarketingLayout } from "@/components/landing/MarketingLayout";
import { pageHead } from "@/lib/page-head";
import { previewProfiles, provinceDetails, provinceFromSlug } from "@/lib/landing-content";
import { AudioBioButton } from "@/components/landing/AudioBioButton";

export const Route = createFileRoute("/provinces/$province")({
  loader: ({ params }) => {
    const province = provinceFromSlug(params.province);
    if (!province) throw notFound();
    return { ...province, detail: provinceDetails[province.name]! };
  },
  head: ({ params }) => {
    const province = provinceFromSlug(params.province);
    return pageHead(province ? `Dating in ${province.name}` : "Province Dating", province ? `Meet intentional South African singles in ${province.name}. Discover shared interests, relationship intentions and local connections with Mphe-Motho.` : "Discover local dating across South Africa's nine provinces with Mphe-Motho.");
  },
  component: ProvincePage,
});

function ProvincePage() {
  const province = Route.useLoaderData();
  const sample = previewProfiles.find((profile) => profile.province === province.name) ?? previewProfiles[0]!;
  return (
    <MarketingLayout initialProvince={province.name}>
      <section className="bg-landing-glow px-5 py-16 text-cream sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sunset"><MapPin className="h-4 w-4" />Dating in {province.name}</p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">Find your kind of connection in {province.name}.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-cream/65">{province.detail.line} Set your intentions, share your interests and start with a genuine conversation.</p>
            <p className="mt-5 text-sm font-semibold text-sunset">{province.detail.cities}</p>
            <Link to="/auth" search={{ mode: "up", province: province.name }} className="mt-8 inline-flex items-center gap-2 rounded-full bg-sunset px-7 py-3.5 font-bold text-ink">Join from {province.name} <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <article className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-paper text-ink shadow-card">
            <img src={sample.image} alt={`${sample.name}, illustrative sample dating profile`} className="h-80 w-full object-cover object-top" />
            <div className="p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-bold">{sample.name}, {sample.age} <span className="ml-2 rounded-full bg-sand px-2 py-1 align-middle text-[10px] font-sans uppercase tracking-wider text-terra">Sample</span></h2><p className="mt-1 text-sm text-ink/55">{sample.city} · {sample.intent}</p></div><Heart className="text-terra" /></div><div className="mt-4"><AudioBioButton profile={sample} light /></div></div>
          </article>
        </div>
      </section>
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[{ icon: Users, title: "Local discovery", text: `Explore members who share your province and preferences across ${province.name}.` }, { icon: Music2, title: "Your kind of vibe", text: "Match through local music, shared interests, language and the weekends you love." }, { icon: Heart, title: "Intent first", text: "Choose Umshado, open to something real or just the vibes before you start swiping." }].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[1.75rem] border border-ink/10 bg-paper p-6 shadow-card"><Icon className="h-6 w-6 text-terra" /><h2 className="mt-5 font-display text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-ink/55">{text}</p></article>)}
        </div>
      </section>
    </MarketingLayout>
  );
}
