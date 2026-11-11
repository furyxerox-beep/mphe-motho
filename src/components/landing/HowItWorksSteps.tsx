import { Heart, MapPin, PhoneCheck } from "lucide-react";

const steps = [
  {
    icon: PhoneCheck,
    number: "01",
    title: "Start with your +27 number",
    text: "Create your 18+ account with a South African mobile number and email. Safety video submission is optional and does not itself verify identity.",
  },
  {
    icon: MapPin,
    number: "02",
    title: "Choose province, intent & vibe",
    text: "Set your location, interests and relationship intent so discovery feels local and relevant from the beginning.",
  },
  {
    icon: Heart,
    number: "03",
    title: "Match & make the first move",
    text: "Like someone who caught your eye, hear their voice intro and start a real conversation before your 48-hour window closes.",
  },
];

export function HowItWorksSteps() {
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {steps.map(({ icon: Icon, number, title, text }) => (
        <li key={number} className="relative rounded-[2rem] border border-ink/10 bg-paper p-7 shadow-card">
          <div className="flex items-center justify-between">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sand text-terra"><Icon className="h-6 w-6" /></span>
            <span className="font-display text-4xl font-bold text-ink/10">{number}</span>
          </div>
          <h3 className="mt-7 font-display text-xl font-bold text-ink">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-ink/60">{text}</p>
        </li>
      ))}
    </ol>
  );
}
