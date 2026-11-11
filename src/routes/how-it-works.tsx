import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, HeartHandshake, MessageCircle } from "lucide-react";
import { MarketingLayout, PublicPageHero } from "@/components/landing/MarketingLayout";
import { HowItWorksSteps } from "@/components/landing/HowItWorksSteps";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/how-it-works")({
  head: () => pageHead("How It Works", "Join with a South African number, choose your province and intent, match mutually and start a conversation within 48 hours."),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <MarketingLayout>
      <PublicPageHero eyebrow="How it works" title="Intentional dating in three simple steps." description="Mphe-Motho helps you move from a local profile to a mutual match and an actual conversation, without losing the warmth along the way." />
      <section className="bg-sand/60 px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto max-w-7xl"><HowItWorksSteps /></div></section>
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            { icon: HeartHandshake, title: "Mutual means mutual", text: "You match when both people like each other. A one-sided like does not open a private conversation." },
            { icon: Clock3, title: "A gentle 48-hour nudge", text: "New matches have a conversation window. Sending a message marks it open, so you can keep getting to know each other." },
            { icon: MessageCircle, title: "A first message with substance", text: "Use shared interests, a voice introduction or an AI icebreaker to begin with more than a simple ‘hey’." },
          ].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[1.75rem] border border-ink/10 bg-paper p-6 shadow-card"><Icon className="h-6 w-6 text-terra" /><h2 className="mt-5 font-display text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-ink/55">{text}</p></article>)}
        </div>
        <div className="mt-12 text-center"><Link to="/auth" search={{ mode: "up" }} className="inline-flex items-center gap-2 rounded-full bg-terra px-8 py-4 font-bold text-paper">Start your profile <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
    </MarketingLayout>
  );
}
