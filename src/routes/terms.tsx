import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout, PublicPageHero } from "@/components/landing/MarketingLayout";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/terms")({
  head: () => pageHead("Terms of Service", "Read the membership, respectful conduct, matching, digital gift and safety terms for using Mphe-Motho in South Africa."),
  component: TermsPage,
});

const sections = [
  { title: "Who may join", body: "You must be at least 18 years old, live in South Africa and provide accurate account information, including a valid South African mobile number and email address. You are responsible for keeping your password private and for activity on your account." },
  { title: "Respectful conduct", body: "Do not harass, threaten, impersonate, exploit or defraud other members. Do not upload unlawful, hateful, sexually explicit or non-consensual content. Do not use anonymous confessions to target or identify another person. You may block a member whose contact you do not want." },
  { title: "Profiles, matches and conversations", body: "A match requires mutual interest. New matches may have a 48-hour window to begin a conversation, as shown in the app. Mphe-Motho does not guarantee compatibility, identity, availability, a relationship outcome or that another member’s statements are accurate." },
  { title: "Voice, video and AI features", body: "Only upload voice, photos or video that you have the right and consent to share. Private safety-video submission does not verify identity. AI icebreakers are suggestions only: review them before sending and do not rely on them for safety, legal or relationship decisions." },
  { title: "Digital gifts and events", body: "Current Date Fund gifts are symbolic digital items with no cash value. They are not paid vouchers, airtime or money transfers. Event and group-date listings are invitations between members; use the safety guidelines and make your own arrangements." },
  { title: "Your content and licence", body: "You retain ownership of content you upload. You give Mphe-Motho the limited permission needed to store, display and transmit it to provide the features you use. Removing content from a feature does not guarantee removal from another member’s independent records or device." },
  { title: "Account action and availability", body: "Access may be restricted for fraud, abuse, underage use or breaches of these terms. Features may change as the service develops. We aim for reliable real-time service but cannot promise uninterrupted availability or preservation of every message after technical failure." },
  { title: "South African law and launch review", body: "South African law applies, subject to consumer protections that cannot legally be excluded. These plain-language terms are a product draft and should be reviewed by a qualified South African legal professional before public launch. Last updated 11 November 2026." },
];

function TermsPage() {
  return (
    <MarketingLayout>
      <PublicPageHero eyebrow="Terms of service" title="Clear expectations make better connections." description="The ground rules for using Mphe-Motho respectfully, safely and as an adult member of the Mzansi community." />
      <section className="px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto max-w-4xl space-y-5">{sections.map((section, index) => <article key={section.title} className="rounded-[1.75rem] border border-ink/10 bg-paper p-6 shadow-card sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-terra">Section {index + 1}</p><h2 className="mt-2 font-display text-2xl font-bold">{section.title}</h2><p className="mt-4 text-sm leading-7 text-ink/65">{section.body}</p></article>)}</div></section>
    </MarketingLayout>
  );
}
