import { useState, type ReactNode } from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { DiscoveryPreview } from "@/components/landing/DiscoveryPreview";

export function MarketingLayout({ children, initialProvince = "" }: { children: ReactNode; initialProvince?: string }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <div className="min-h-screen bg-paper text-ink">
      <LandingHeader onJoin={() => setPreviewOpen(true)} />
      <main>{children}</main>
      <LandingFooter />
      <DiscoveryPreview open={previewOpen} onOpenChange={setPreviewOpen} initialProvince={initialProvince} />
    </div>
  );
}

export function PublicPageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="bg-landing-glow text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sunset">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-cream/65">{description}</p>
      </div>
    </section>
  );
}
