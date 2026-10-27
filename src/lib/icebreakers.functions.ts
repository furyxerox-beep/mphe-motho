import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const input = z.object({
  name: z.string().trim().min(1).max(60),
  interests: z.string().trim().max(500),
  bio: z.string().trim().max(1000),
  myInterests: z.string().trim().max(500),
});

export const suggestStarters = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { starters: [] as string[], error: "AI is not configured yet." };
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        maxRetries: 0,
        instructions:
          "You write warm, respectful first-message conversation starters for a South African (Mzansi) dating app. Focus on shared interests. Keep each under 25 words, playful but never crude. Output exactly 5 starters, one per line, no numbering.",
        messages: [{
          role: "user",
          content: `Their name: ${data.name}\nTheir interests: ${data.interests || "unknown"}\nTheir bio: ${data.bio || "none"}\nMy interests: ${data.myInterests || "unknown"}`,
        }],
        providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } },
      });
      const text = await result.text;
      const starters = text.split("\n").map((s) => s.replace(/^[\s\-*\d.)]+/, "").trim()).filter(Boolean).slice(0, 5);
      return { starters, error: starters.length ? null : "No suggestions came back. Please try again." };
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      console.error("starters", e);
      const error = status === 429 ? "Too many requests right now — try again in a minute."
        : status === 402 ? "AI credits have run out for this app."
        : status === 403 ? "AI access is currently blocked for this app."
        : "Couldn't create suggestions right now.";
      return { starters: [] as string[], error };
    }
  });
