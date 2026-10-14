CREATE TABLE public.cultural_preferences (
 user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
 intention text NOT NULL DEFAULT 'Getting to know people',
 family text NOT NULL DEFAULT '', tradition text NOT NULL DEFAULT '', language text NOT NULL DEFAULT '', updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cultural_preferences TO authenticated;
GRANT ALL ON public.cultural_preferences TO service_role;
ALTER TABLE public.cultural_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read cultural preferences" ON public.cultural_preferences FOR SELECT TO authenticated USING (true);
CREATE POLICY "Own cultural preferences" ON public.cultural_preferences FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TABLE public.choma_vouches (
 voucher uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
 member uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(voucher,member), CHECK(voucher <> member)
);
GRANT SELECT, INSERT, DELETE ON public.choma_vouches TO authenticated;
GRANT ALL ON public.choma_vouches TO service_role;
ALTER TABLE public.choma_vouches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read vouches" ON public.choma_vouches FOR SELECT TO authenticated USING(true);
CREATE POLICY "Vouch as myself" ON public.choma_vouches FOR INSERT TO authenticated WITH CHECK(auth.uid() = voucher AND voucher <> member);
CREATE POLICY "Withdraw own vouch" ON public.choma_vouches FOR DELETE TO authenticated USING(auth.uid() = voucher);
CREATE TABLE public.match_windows (
 member_a uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
 member_b uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
 matched_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now() + interval '48 hours', opened_at timestamptz,
 PRIMARY KEY(member_a,member_b), CHECK(member_a < member_b)
);
GRANT SELECT ON public.match_windows TO authenticated;
GRANT ALL ON public.match_windows TO service_role;
ALTER TABLE public.match_windows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own match windows" ON public.match_windows FOR SELECT TO authenticated USING(auth.uid() IN (member_a,member_b));
INSERT INTO public.match_windows(member_a,member_b,matched_at,expires_at,opened_at)
SELECT l.liker,l.liked,greatest(l.created_at,r.created_at),now()+interval '48 hours',
(select min(m.created_at) from public.messages m where (m.sender=l.liker AND m.receiver=l.liked) OR (m.sender=l.liked AND m.receiver=l.liker))
FROM public.likes l JOIN public.likes r ON r.liker=l.liked AND r.liked=l.liker WHERE l.liker < l.liked;
CREATE OR REPLACE FUNCTION public.create_match_window() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 PERFORM pg_advisory_xact_lock(hashtextextended(least(new.liker,new.liked)::text || greatest(new.liker,new.liked)::text,0));
 IF EXISTS(SELECT 1 FROM public.likes WHERE liker=new.liked AND liked=new.liker) THEN
 INSERT INTO public.match_windows(member_a,member_b) VALUES(least(new.liker,new.liked),greatest(new.liker,new.liked)) ON CONFLICT DO NOTHING;
 END IF;
 RETURN new;
END $$;
CREATE TRIGGER create_match_window AFTER INSERT ON public.likes FOR EACH ROW EXECUTE FUNCTION public.create_match_window();
CREATE OR REPLACE FUNCTION public.is_match(a uuid,b uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
SELECT EXISTS(SELECT 1 FROM public.likes WHERE liker=a AND liked=b) AND EXISTS(SELECT 1 FROM public.likes WHERE liker=b AND liked=a)
AND EXISTS(SELECT 1 FROM public.match_windows WHERE member_a=least(a,b) AND member_b=greatest(a,b) AND (opened_at IS NOT NULL OR expires_at > now()))
$$;
CREATE OR REPLACE FUNCTION public.open_match_conversation() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 UPDATE public.match_windows SET opened_at=coalesce(opened_at,now()) WHERE member_a=least(new.sender,new.receiver) AND member_b=greatest(new.sender,new.receiver) AND (opened_at IS NOT NULL OR expires_at > now());
 IF NOT FOUND THEN RAISE EXCEPTION 'This match has expired'; END IF;
 RETURN new;
END $$;
CREATE TRIGGER open_match_conversation BEFORE INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.open_match_conversation();
CREATE TABLE public.date_invitations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), sender uuid REFERENCES public.profiles(id) NOT NULL, receiver uuid REFERENCES public.profiles(id) NOT NULL,
 venue text NOT NULL, province text NOT NULL, starts_at timestamptz NOT NULL, status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(status IN ('pending','accepted','declined','cancelled')), CHECK(sender <> receiver)
);
GRANT SELECT,INSERT,UPDATE ON public.date_invitations TO authenticated;
GRANT ALL ON public.date_invitations TO service_role;
ALTER TABLE public.date_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own date invitations" ON public.date_invitations FOR SELECT TO authenticated USING(auth.uid() IN(sender,receiver));
CREATE POLICY "Invite matches" ON public.date_invitations FOR INSERT TO authenticated WITH CHECK(auth.uid()=sender AND public.is_match(sender,receiver) AND status='pending');
CREATE POLICY "Respond to invitations" ON public.date_invitations FOR UPDATE TO authenticated USING(auth.uid() IN(sender,receiver)) WITH CHECK(auth.uid() IN(sender,receiver));
CREATE OR REPLACE FUNCTION public.validate_date_invitation() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF TG_OP='INSERT' THEN
 IF new.starts_at <= now() THEN RAISE EXCEPTION 'Choose a future date'; END IF;
 IF new.province NOT IN ('Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Free State','Limpopo','Mpumalanga','North West','Northern Cape') THEN RAISE EXCEPTION 'Choose a South African province'; END IF;
 ELSIF new.sender<>old.sender OR new.receiver<>old.receiver OR new.venue<>old.venue OR new.province<>old.province OR new.starts_at<>old.starts_at OR new.id<>old.id OR new.created_at<>old.created_at THEN RAISE EXCEPTION 'Invitation details cannot be changed';
 ELSE
 IF old.status<>'pending' OR NOT ((auth.uid()=old.receiver AND new.status IN ('accepted','declined')) OR (auth.uid()=old.sender AND new.status='cancelled')) THEN RAISE EXCEPTION 'Invalid invitation response'; END IF;
 END IF;
 RETURN new;
END $$;
CREATE TRIGGER validate_date_invitation BEFORE INSERT OR UPDATE ON public.date_invitations FOR EACH ROW EXECUTE FUNCTION public.validate_date_invitation();
CREATE TABLE public.voice_introductions (
 user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE, path text NOT NULL, duration numeric NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(), CHECK(duration > 0 AND duration <= 7)
);
GRANT SELECT,INSERT,UPDATE,DELETE ON public.voice_introductions TO authenticated;
GRANT ALL ON public.voice_introductions TO service_role;
ALTER TABLE public.voice_introductions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members hear introductions" ON public.voice_introductions FOR SELECT TO authenticated USING(true);
CREATE POLICY "Own voice introduction" ON public.voice_introductions FOR ALL TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id AND split_part(path,'/',1)=auth.uid()::text);
CREATE POLICY "Members hear voice files" ON storage.objects FOR SELECT TO authenticated USING(bucket_id='voice-intros');
CREATE POLICY "Upload own voice files" ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='voice-intros' AND (storage.foldername(name))[1]=auth.uid()::text);
CREATE POLICY "Delete own voice files" ON storage.objects FOR DELETE TO authenticated USING(bucket_id='voice-intros' AND (storage.foldername(name))[1]=auth.uid()::text);
DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['cultural_preferences','choma_vouches','match_windows','date_invitations','voice_introductions','profiles','likes','messages'] LOOP
 IF NOT EXISTS(SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename=t) THEN EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I',t); END IF;
END LOOP; END $$;