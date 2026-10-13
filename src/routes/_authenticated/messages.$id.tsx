import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { MemberPhoto } from "@/components/Avatar";
import { matchIds, useLikes, useMe, useProfiles } from "@/hooks/use-me";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/messages/$id")({
  head: () => ({ meta: [{ title: "Chat — Mphe-Motho" }, { name: "description", content: "Private chat." }] }),
  component: Chat,
});

const sparks = ["What's your perfect Sunday in Mzansi?", "Braai or fine dining?", "Which song always gets you dancing?", "Dream weekend getaway?"];

function Chat() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: profiles } = useProfiles();
  const { data: likes } = useLikes();
  const other = profiles?.find((p) => p.id === id);
  const isMatch = matchIds(me?.id, likes).includes(id);
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const key = ["messages", "thread", id];

  const { data: msgs = [] } = useQuery({
    queryKey: key,
    enabled: !!me,
    queryFn: async () =>
      (
        await supabase
          .from("messages")
          .select("*")
          .or(`and(sender.eq.${me!.id},receiver.eq.${id}),and(sender.eq.${id},receiver.eq.${me!.id})`)
          .order("created_at")
      ).data ?? [],
  });

  useEffect(() => {
    if (!me) return;
    const ch = supabase
      .channel(`chat-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `sender=eq.${id}` }, () => qc.invalidateQueries({ queryKey: key }))
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [me?.id, id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
    if (me && msgs.some((m) => m.sender === id && !m.read_at))
      void supabase.from("messages").update({ read_at: new Date().toISOString() }).eq("sender", id).eq("receiver", me.id).is("read_at", null).then(() => qc.invalidateQueries({ queryKey: ["messages", "all"] }));
  }, [msgs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  async function send(body: string) {
    if (!body.trim() || !me) return;
    setText("");
    const { error } = await supabase.from("messages").insert({ sender: me.id, receiver: id, body: body.trim() });
    if (error) return toast.error("Couldn't send — you can only message your matches.");
    qc.invalidateQueries({ queryKey: key });
  }

  return (
    <div className="flex h-screen flex-col bg-romance">
      <header className="mx-auto flex w-full max-w-md items-center gap-3 border-b border-gold/20 px-4 py-4">
        <Link to="/messages" aria-label="Back" className="text-gold"><ArrowLeft /></Link>
        {other && (
          <Link to="/people/$id" params={{ id }} className="flex items-center gap-3">
            <MemberPhoto path={other.avatar_path} name={other.display_name} className="h-10 w-10 rounded-full border border-gold" />
            <div>
              <p className="font-semibold text-cream">{other.display_name}</p>
              <p className="text-xs text-cream/60">{Date.now() - new Date(other.last_active).getTime() < 5 * 60000 ? "Online now" : "Active recently"}</p>
            </div>
          </Link>
        )}
      </header>
      <div className="mx-auto w-full max-w-md flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {msgs.length === 0 && (
          <div className="space-y-2 text-center">
            <p className="text-sm text-cream/70">Break the ice with a Daily Spark:</p>
            {sparks.map((s) => (
              <button key={s} onClick={() => send(s)} disabled={!isMatch} className="block w-full rounded-full border border-gold/40 px-4 py-2 text-sm text-cream">{s}</button>
            ))}
          </div>
        )}
        {msgs.map((m) => (
          <div key={m.id} className={m.sender === me?.id ? "flex justify-end" : "flex"}>
            <p className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${m.sender === me?.id ? "bg-primary-gradient text-cream" : "bg-card/40 text-cream"}`}>{m.body}</p>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); void send(text); }} className="mx-auto flex w-full max-w-md gap-2 border-t border-gold/20 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <input value={text} onChange={(e) => setText(e.target.value)} disabled={!isMatch} placeholder={isMatch ? "Type a message…" : "Match first to chat"} className="flex-1 rounded-full border border-gold/30 bg-card/20 px-4 py-3 text-cream placeholder:text-cream/40 outline-none" />
        <button aria-label="Send" disabled={!isMatch} className="grid h-12 w-12 place-items-center rounded-full bg-primary-gradient text-cream"><Send className="h-5 w-5" /></button>
      </form>
    </div>
  );
}
