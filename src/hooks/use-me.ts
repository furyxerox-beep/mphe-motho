import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/sa";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return data as Profile | null;
    },
  });
}

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("last_active", { ascending: false }).limit(500);
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useLikes() {
  return useQuery({
    queryKey: ["likes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("likes").select("liker, liked");
      if (error) throw error;
      return data;
    },
  });
}

export function matchIds(me: string | undefined, likes: { liker: string; liked: string }[] | undefined) {
  if (!me || !likes) return [];
  const mine = new Set(likes.filter((l) => l.liker === me).map((l) => l.liked));
  return likes.filter((l) => l.liked === me && mine.has(l.liker)).map((l) => l.liker);
}
