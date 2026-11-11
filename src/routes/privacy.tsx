import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout, PublicPageHero } from "@/components/landing/MarketingLayout";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("POPIA Privacy Policy", "Learn what personal information Mphe-Motho collects, why it is used and the privacy choices available to South African members."),
  component: PrivacyPage,
});

const sections = [
  { title: "Information we collect", body: "Account details such as your name, email address, South African mobile number and password credentials handled by the authentication service; profile details you choose to add; province and approximate device location when you allow it; preferences, likes, matches, messages, event attendance and feature activity; uploaded photos, voice introductions and private safety videos; and basic technical information needed to operate and secure the service." },
  { title: "How we use information", body: "We use this information to create and secure your account, show relevant local profiles, calculate compatibility, enable mutual matches and conversations, provide the features you choose, prevent abuse and improve Mphe-Motho. We do not use your private safety video as proof that your identity has been verified." },
  { title: "What other members can see", body: "Your public member profile may include your display name, age, province, city, bio, interests, photos, voice introduction and relationship intent. Social links you add are intended for matches and each has its own visibility control. Messages are visible to their sender and receiver. Anonymous confessions are displayed without your member name, but no online anonymity tool should be treated as a guarantee against re-identification through what you write." },
  { title: "Location and matching", body: "If you grant location permission, the app checks that the coordinates fall within South Africa and uses them for nearby discovery and province selection. You can deny location permission, but distance-based matching will be limited. Location is not used as proof of identity." },
  { title: "Storage and service providers", body: "Mphe-Motho uses Lovable Cloud for authentication, database storage, file storage and real-time features. AI icebreakers send the profile text needed for that request through the app’s AI service. These providers process information only to supply their part of the service. We do not sell your private messages, safety videos or account contact details." },
  { title: "Retention and security", body: "Information is kept while your account is active and for as long as needed for safety, legal and operational purposes. No online service is perfectly secure, so use a unique password and avoid sharing sensitive information in chats. Private files rely on access controls rather than being publicly listed." },
  { title: "Your POPIA choices", body: "You may request access to or correction of your personal information and may object to certain processing where South African law allows. You can edit profile details and social visibility in the app, and remove voice or safety-video submissions through their feature pages. A dedicated privacy contact for other access, correction and deletion requests must be published by the app operator before public launch." },
  { title: "Children and updates", body: "Mphe-Motho is only for adults aged 18 and older. Material changes to this policy should be dated and communicated through the app. This plain-language policy should be reviewed by a qualified South African privacy professional before public launch." },
];

function PrivacyPage() {
  return (
    <MarketingLayout>
      <PublicPageHero eyebrow="POPIA & privacy" title="Your story belongs to you." description="This plain-language policy explains the information used to provide Mphe-Motho and the choices you have. Last updated 11 November 2026." />
      <section className="px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto max-w-4xl space-y-5">{sections.map((section, index) => <article key={section.title} className="rounded-[1.75rem] border border-ink/10 bg-paper p-6 shadow-card sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-terra">Section {index + 1}</p><h2 className="mt-2 font-display text-2xl font-bold">{section.title}</h2><p className="mt-4 text-sm leading-7 text-ink/65">{section.body}</p></article>)}</div></section>
    </MarketingLayout>
  );
}
