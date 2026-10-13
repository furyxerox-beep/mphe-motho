import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell, Empty, SectionTitle } from "@/components/AppShell";
import { MemberPhoto } from "@/components/Avatar";
import { matchIds, useLikes, useMe, useProfiles } from "@/hooks/use-me";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/messages/")({
  head: () => ({ meta: [{ title: "Messages — Mphe-Motho" }, { name: "description", content: "Chats with your matches." }] }),
  component: Inbox,
});

function Inbox() {
  const { data: me } = useMe();
  const { data: profiles } = useProfiles();
  const { data: likes } = useLikes();
  const { data: msgs } = useQuery({
    queryKey: ["messages", "all"],
    queryFn: async () => (await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(500)).data ?? [],
  });
  const ids = matchIds(me?.id, likes);
  const rows = ids
    .map((id) => {
      const p = profiles?.find((x) => x.id === id);
      const thread = msgs?.filter((m) => m.sender === id || m.receiver === id) ?? [];
      return { p, last: thread[0], unread: thread.filter((m) => m.sender === id && !m.read_at).length };
    })
    .filter((r) => r.p)
    .sort((a, b) => (b.last?.created_at ?? "").localeCompare(a.last?.created_at ?? ""));

  return (
    <AppShell>
      <SectionTitle>Conversations</SectionTitle>
      {!rows.length ? (
        <Empty>Match with someone to start chatting.</Empty>
      ) : (
        <ul className="divide-y divide-gold/10 overflow-hidden rounded-2xl bg-card/10">
          {rows.map(({ p, last, unread }) => (
            <li key={p!.id}>
              <Link to="/messages/$id" params={{ id: p!.id }} className="flex items-center gap-3 p-3">
                <MemberPhoto path={p!.avatar_path} name={p!.display_name} className="h-14 w-14 rounded-full border-2 border-gold/60 text-xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold text-cream">{p!.display_name}</p>
                    {last && <span className="text-xs text-cream/50">{new Date(last.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
                  </div>
                  <p className="truncate text-sm text-cream/70">{last ? (last.sender === me?.id ? "You: " : "") + last.body : "Say hello 👋"}</p>
                </div>
                {unread > 0 && <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs text-cream">{unread}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
