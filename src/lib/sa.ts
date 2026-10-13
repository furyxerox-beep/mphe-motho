import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PROVINCES = [
  { name: "Gauteng", lat: -26.2, lng: 28.05 },
  { name: "Western Cape", lat: -33.9, lng: 18.6 },
  { name: "KwaZulu-Natal", lat: -29.6, lng: 30.6 },
  { name: "Eastern Cape", lat: -32.3, lng: 26.4 },
  { name: "Free State", lat: -28.6, lng: 26.6 },
  { name: "Limpopo", lat: -23.6, lng: 29.4 },
  { name: "Mpumalanga", lat: -25.6, lng: 30.5 },
  { name: "North West", lat: -26.0, lng: 25.6 },
  { name: "Northern Cape", lat: -29.0, lng: 21.9 },
] as const;

export function inSouthAfrica(lat: number, lng: number) {
  return lat <= -22 && lat >= -35 && lng >= 16 && lng <= 33;
}

export function nearestProvince(lat: number, lng: number) {
  return [...PROVINCES].sort((a, b) => km(lat, lng, a.lat, a.lng) - km(lat, lng, b.lat, b.lng))[0]!.name;
}

export function km(a1: number, o1: number, a2: number, o2: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(a2 - a1) / 2) ** 2 + Math.cos(r(a1)) * Math.cos(r(a2)) * Math.sin(r(o2 - o1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function normalizePhone(input: string): string | null {
  const d = input.replace(/[\s\-()]/g, "");
  const p = d.startsWith("+27") ? d : d.startsWith("27") ? "+" + d : d.startsWith("0") ? "+27" + d.slice(1) : d;
  return /^\+27[6-8]\d{8}$/.test(p) ? p : null;
}

export function passwordIssues(pw: string) {
  const issues: string[] = [];
  if (pw.length < 10) issues.push("at least 10 characters");
  if (!/[A-Z]/.test(pw)) issues.push("an uppercase letter");
  if (!/[a-z]/.test(pw)) issues.push("a lowercase letter");
  if (!/\d/.test(pw)) issues.push("a number");
  if (!/[^A-Za-z0-9]/.test(pw)) issues.push("a symbol");
  return issues;
}

export function age(birthdate: string | null) {
  if (!birthdate) return null;
  const b = new Date(birthdate);
  const n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
}

export type Profile = {
  id: string;
  display_name: string;
  gender: string | null;
  interested_in: string | null;
  birthdate: string | null;
  bio: string | null;
  job: string | null;
  province: string | null;
  city: string | null;
  interests: string[];
  avatar_path: string | null;
  lat: number | null;
  lng: number | null;
  last_active: string;
};

export function compatibility(me: Profile, p: Profile) {
  const shared = p.interests.filter((i) => me.interests.map((x) => x.toLowerCase()).includes(i.toLowerCase())).length;
  let score = 55 + shared * 10;
  if (me.province && me.province === p.province) score += 10;
  if (me.interested_in && p.gender && (me.interested_in === "Everyone" || me.interested_in === p.gender)) score += 10;
  const dist = me.lat != null && me.lng != null && p.lat != null && p.lng != null ? km(me.lat, me.lng, p.lat, p.lng) : null;
  if (dist != null) score += dist < 10 ? 10 : dist < 50 ? 6 : dist < 200 ? 2 : 0;
  return { score: Math.min(99, score), dist };
}

export function useAvatar(path: string | null | undefined) {
  return useQuery({
    queryKey: ["avatar", path],
    enabled: !!path,
    staleTime: 50 * 60 * 1000,
    queryFn: async () => {
      const { data } = await supabase.storage.from("avatars").createSignedUrl(path!, 3600);
      return data?.signedUrl ?? null;
    },
  }).data;
}
