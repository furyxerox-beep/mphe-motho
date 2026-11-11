import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MarketingLayout, PublicPageHero } from "@/components/landing/MarketingLayout";
import { ConnectionPromise, FeatureGrid } from "@/components/landing/FeatureGrid";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/features")({
  head: () => pageHead("Dating Features", "Explore Mphe-Motho's local music, voice, intention, group date, gifting, safety and AI conversation features for South African singles."),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <MarketingLayout>
      <PublicPageHero eyebrow="Signature features" title="More than a swipe. A whole world of connection." description="Meet through the music you love, the language you speak, the future you want and the small moments that make dating feel natural." />
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <FeatureGrid />
          <div className="mt-6"><ConnectionPromise /></div>
          <div className="mt-12 rounded-[2rem] bg-sand p-7 text-center sm:p-10">
            <h2 className="font-display text-2xl font-bold">Bring your real self. We’ll help with the hello.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/55">Create your profile to try the live member features. Some public examples on this site use sample data and are clearly labelled.</p>
            <Link to="/auth" search={{ mode: "up" }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-cream">Create your profile <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
