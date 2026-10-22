ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_facebook boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_tiktok boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_whatsapp boolean NOT NULL DEFAULT true;