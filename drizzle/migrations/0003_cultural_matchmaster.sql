CREATE TABLE public.confessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), author uuid NOT NULL DEFAULT auth.uid(), kind text NOT NULL DEFAULT 'story' CHECK (kind IN ('story','advice')), body text NOT NULL CHECK (char_length(body) BETWEEN 3 AND 1500), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT (id, kind, body, created_at), INSERT (kind, body) ON public.confessions TO authenticated;
GRANT ALL ON public.confessions TO service_role;
ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read confessions" ON public.confessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Post as myself" ON public.confessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = author);

CREATE TABLE public.date_gifts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), sender uuid NOT NULL REFERENCES public.profiles(id), receiver uuid NOT NULL REFERENCES public.profiles(id), gift text NOT NULL CHECK (gift IN ('Cup of Rooibos','Shisanyama Plate','Protea Bouquet')), note text NOT NULL DEFAULT '' CHECK (char_length(note) <= 200), created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT ON public.date_gifts TO authenticated;
GRANT ALL ON public.date_gifts TO service_role;
ALTER TABLE public.date_gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own gifts" ON public.date_gifts FOR SELECT TO authenticated USING (auth.uid() = sender OR auth.uid() = receiver);
CREATE POLICY "Send gifts" ON public.date_gifts FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender AND sender <> receiver);

ALTER TABLE public.profiles ADD COLUMN umshado_intent text CHECK (umshado_intent IN ('vibes','open','serious'));
ALTER TABLE public.voice_introductions ADD COLUMN language text NOT NULL DEFAULT 'English';
ALTER PUBLICATION supabase_realtime ADD TABLE public.confessions, public.date_gifts;