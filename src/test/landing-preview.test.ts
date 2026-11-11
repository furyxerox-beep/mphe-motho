import { describe, expect, it } from "vitest";
import { previewProfiles, previewScore, rankedPreviewProfiles } from "@/lib/landing-content";
import { normalizePhone } from "@/lib/sa";

describe("landing discovery preview", () => {
  it("adds 30 points when the selected province matches", () => {
    const naledi = previewProfiles.find((profile) => profile.id === "naledi")!;
    expect(previewScore(naledi, "Gauteng", "")).toBe(80);
    expect(previewScore(naledi, "Limpopo", "")).toBe(50);
  });

  it("adds 20 points when the selected relationship intent matches", () => {
    const naledi = previewProfiles.find((profile) => profile.id === "naledi")!;
    expect(previewScore(naledi, "Limpopo", "Umshado")).toBe(70);
    expect(previewScore(naledi, "Limpopo", "Vibes")).toBe(50);
  });

  it("keeps all three sample profiles available while ranking the best fit first", () => {
    const ranked = rankedPreviewProfiles("Gauteng", "Umshado");
    expect(ranked).toHaveLength(3);
    expect(ranked[0]?.id).toBe("naledi");
  });
});

describe("South African sign-up phone handoff", () => {
  it("accepts a national +27 mobile number", () => {
    expect(normalizePhone("082 123 4567")).toBe("+27821234567");
  });

  it("rejects a non-South-African number", () => {
    expect(normalizePhone("+1 202 555 0123")).toBeNull();
  });
});
