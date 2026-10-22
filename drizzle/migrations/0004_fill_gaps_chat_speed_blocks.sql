CREATE INDEX IF NOT EXISTS messages_pair_created_idx ON public.messages (sender, receiver, created_at DESC);
CREATE INDEX IF NOT EXISTS messages_receiver_unread_idx ON public.messages (receiver) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS profiles_lat_lng_idx ON public.profiles (lat, lng);
CREATE UNIQUE INDEX IF NOT EXISTS private_details_phone_unique ON public.private_details (phone);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_video_verified boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.protect_video_verified()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF current_user IN ('authenticated','anon') AND NEW.is_video_verified IS DISTINCT FROM COALESCE(OLD.is_video_verified,false) THEN
    NEW.is_video_verified := COALESCE(OLD.is_video_verified,false);
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS protect_video_verified ON public.profiles;
CREATE TRIGGER protect_video_verified BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_video_verified();

CREATE TABLE IF NOT EXISTS public.blocks (
  blocker uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker, blocked)
);
GRANT SELECT, INSERT, DELETE ON public.blocks TO authenticated;
GRANT ALL ON public.blocks TO service_role;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "See own blocks" ON public.blocks FOR SELECT TO authenticated USING (auth.uid() = blocker);
CREATE POLICY "Block as myself" ON public.blocks FOR INSERT TO authenticated WITH CHECK (auth.uid() = blocker AND blocker <> blocked);
CREATE POLICY "Unblock own" ON public.blocks FOR DELETE TO authenticated USING (auth.uid() = blocker);

CREATE OR REPLACE FUNCTION public.is_blocked(a uuid, b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.blocks WHERE (blocker=a AND blocked=b) OR (blocker=b AND blocked=a))
$$;

CREATE POLICY "No messages when blocked" ON public.messages AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (NOT public.is_blocked(sender, receiver));
CREATE POLICY "No likes when blocked" ON public.likes AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (NOT public.is_blocked(liker, liked));