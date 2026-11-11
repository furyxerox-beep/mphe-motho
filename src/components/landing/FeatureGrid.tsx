import { Bus, Gem, Gift, HeartHandshake, Mic, Music2, ShieldCheck, Sparkles, Sun, Users } from "lucide-react";

const features = [
  { title: "Dezembr Mode", badge: "Festivities", icon: Sun, description: "Find holiday events and someone whose December plans match your energy.", className: "md:col-span-2", tone: "bg-sand" },
  { title: "Safety Shield", badge: "Trust", icon: ShieldCheck, description: "Keep private video submissions separate from identity verification, with South African +27 accounts only.", className: "", tone: "bg-paper" },
  { title: "Umshado Forecast", badge: "Intention", icon: Gem, description: "Filter for vibes, openness or serious commitment, then celebrate your relationship milestones.", className: "", tone: "bg-paper" },
  { title: "Groove Match", badge: "Music", icon: Music2, description: "Connect through amapiano, hip-hop, local artists and the playlists that feel like home.", className: "md:col-span-2", tone: "bg-terra text-paper" },
  { title: "Language Audio Bio", badge: "Voice", icon: Mic, description: "Hear short introductions in isiZulu, isiXhosa, Sesotho, Afrikaans, English and more official languages.", className: "", tone: "bg-paper" },
  { title: "The Date Fund & Gifting", badge: "Thoughtful", icon: Gift, description: "Send free symbolic Rooibos, Shisanyama or Protea gifts while paid vouchers are still being prepared.", className: "md:col-span-2", tone: "bg-sand" },
  { title: "Third-Wheel Group Dates", badge: "Together", icon: Users, description: "Plan a relaxed group hangout and take the pressure out of that very first hello.", className: "", tone: "bg-paper" },
  { title: "Taxicab Confessions", badge: "Community", icon: Bus, description: "Share anonymous dating stories and ask the community for honest, judgement-free advice.", className: "", tone: "bg-paper" },
  { title: "AI Icebreakers", badge: "Conversation", icon: Sparkles, description: "Turn shared interests into respectful first-message ideas when you’re not sure how to start.", className: "", tone: "bg-ink text-cream" },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map(({ title, badge, icon: Icon, description, className, tone }) => {
        const dark = tone.includes("text-cream") || tone.includes("text-paper");
        return (
          <article key={title} className={`group rounded-[1.75rem] border border-ink/10 p-6 shadow-card transition-transform hover:-translate-y-1 ${className} ${tone}`}>
            <div className="flex items-start justify-between gap-4">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${dark ? "bg-paper/15 text-sunset" : "bg-terra/10 text-terra"}`}><Icon className="h-5 w-5" /></span>
              <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${dark ? "border-paper/20 text-paper/70" : "border-ink/10 text-ink/50"}`}>{badge}</span>
            </div>
            <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
            <p className={`mt-2 text-sm leading-6 ${dark ? "text-paper/70" : "text-ink/60"}`}>{description}</p>
          </article>
        );
      })}
    </div>
  );
}

export function ConnectionPromise() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-4 text-ink shadow-card">
      <HeartHandshake className="h-6 w-6 shrink-0 text-terra" />
      <p className="text-sm leading-6"><strong>Made for mutual interest.</strong> A like becomes a match only when you both choose each other.</p>
    </div>
  );
}
