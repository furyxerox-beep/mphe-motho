import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { PreviewProfile } from "@/lib/landing-content";

export function AudioBioButton({ profile, light = false }: { profile: PreviewProfile; light?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function toggleAudio() {
    setError("");
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setError("Audio narration is not supported in this browser.");
      return;
    }
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(profile.audio);
    utterance.lang = profile.languageCode;
    utterance.rate = 0.96;
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang === profile.languageCode);
    if (voice) utterance.voice = voice;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = (event) => {
      setPlaying(false);
      if (event.error !== "canceled" && event.error !== "interrupted") setError("The audio preview could not play. Please try again.");
    };
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={`${playing ? "Stop" : "Play"} ${profile.name}'s sample audio bio`}
        className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors ${
          light ? "border-ink/10 bg-paper text-ink hover:bg-sand" : "border-ink/10 bg-sand text-ink hover:bg-paper"
        }`}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-terra text-paper">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold">Language Audio Bio · sample narration</span>
          <span className="mt-1 flex h-5 items-center gap-0.5" aria-hidden="true">
            {[9, 15, 8, 18, 12, 20, 10, 16, 7, 19, 12, 17, 8, 14, 10, 18, 8, 13, 7, 15, 9, 12].map((height, index) => (
              <span
                key={index}
                style={{ height, animationDelay: `${index * 45}ms` }}
                className={`w-0.5 rounded-full bg-terra ${playing ? "audio-wave" : ""}`}
              />
            ))}
          </span>
        </span>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-ink/50">{profile.languages}</span>
      </button>
      {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
