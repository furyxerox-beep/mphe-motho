import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Quote } from "lucide-react";
import { previewStories } from "@/lib/landing-content";

export function SuccessStories() {
  const [active, setActive] = useState(0);
  const story = previewStories[active]!;
  const move = (direction: number) => setActive((current) => (current + direction + previewStories.length) % previewStories.length);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative overflow-hidden rounded-[2rem] bg-terra p-7 text-paper shadow-card sm:p-12">
        <Quote className="absolute right-8 top-8 h-20 w-20 text-paper/10" />
        <div className="relative">
          <Heart className="h-7 w-7 fill-sunset text-sunset" />
          <blockquote className="mt-6 min-h-32 font-display text-2xl font-medium leading-relaxed sm:text-3xl">“{story.quote}”</blockquote>
          <div className="mt-7 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-sunset font-display font-bold text-ink">{story.names.charAt(0)}</span>
            <div><p className="font-semibold">{story.names}</p><p className="text-sm text-paper/70">{story.place}</p></div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-2" aria-label="Choose a story">
          {previewStories.map((item, index) => (
            <button key={item.names} aria-label={`Show story ${index + 1}`} aria-current={index === active} onClick={() => setActive(index)} className={`h-2.5 rounded-full transition-all ${index === active ? "w-8 bg-terra" : "w-2.5 bg-ink/20"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => move(-1)} aria-label="Previous story" className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-sand"><ArrowLeft className="h-5 w-5" /></button>
          <button onClick={() => move(1)} aria-label="Next story" className="grid h-11 w-11 place-items-center rounded-full bg-ink text-cream transition-transform hover:-translate-y-0.5"><ArrowRight className="h-5 w-5" /></button>
        </div>
      </div>
      <p className="mt-5 text-center text-xs leading-5 text-ink/45">Illustrative stories for this product preview, not verified member testimonials.</p>
    </div>
  );
}
