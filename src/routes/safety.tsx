import { createFileRoute } from "@tanstack/react-router";
import { Ban, Coffee, EyeOff, PhoneCall, ShieldCheck, Users } from "lucide-react";
import { MarketingLayout, PublicPageHero } from "@/components/landing/MarketingLayout";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/safety")({
  head: () => pageHead("Safety Guidelines", "Practical dating safety guidance, private video submissions, blocking and honest verification status for Mphe-Motho members in South Africa."),
  component: SafetyPage,
});

const guidelines = [
  { icon: Coffee, title: "Meet in a public place", text: "Choose a busy venue for early dates, arrange your own transport and keep your first meeting within comfortable hours." },
  { icon: Users, title: "Tell someone you trust", text: "Share your date’s details and location with a friend or family member, and agree when you’ll check in." },
  { icon: EyeOff, title: "Protect private information", text: "Keep your home address, workplace, banking details and identity documents private until trust is well established." },
  { icon: Ban, title: "Block and step away", text: "Use the Block button on a member’s profile if contact feels unwelcome. Blocking also prevents new likes and messages from that account." },
  { icon: ShieldCheck, title: "Never send money", text: "Do not send cash, airtime, vouchers or banking details to someone you have only met online, however urgent their story sounds." },
  { icon: PhoneCall, title: "Get urgent help", text: "If you are in immediate danger in South Africa, call 10111 or 112 from a mobile phone. The app is not an emergency service." },
];

function SafetyPage() {
  return (
    <MarketingLayout>
      <PublicPageHero eyebrow="Safety & trust" title="Keep your heart open and your boundaries clear." description="Online dating should feel exciting, not pressured. Use the tools available, take your time and trust your instincts whenever something feels wrong." />
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-[2rem] border border-terra/20 bg-sand p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold"><ShieldCheck className="text-terra" />What Safety Shield does — and does not do</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-ink/65">Members can submit a private introduction video. Those videos are not public, and submitting one does <strong>not</strong> verify identity. Automated identity checks and a verified video badge are not active. South African mobile numbers are required at sign-up, but this is not the same as SMS identity verification.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guidelines.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[1.75rem] border border-ink/10 bg-paper p-6 shadow-card"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sand text-terra"><Icon className="h-5 w-5" /></span><h2 className="mt-5 font-display text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-ink/55">{text}</p></article>)}
          </div>
          <p className="mt-8 text-xs leading-5 text-ink/45">No dating service can guarantee another person’s identity or intentions. Always use your own judgement, even when a profile appears complete.</p>
        </div>
      </section>
    </MarketingLayout>
  );
}
