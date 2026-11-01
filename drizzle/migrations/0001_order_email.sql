ALTER TABLE public.shop_orders
 ADD COLUMN email_status text NOT NULL DEFAULT 'pending'
   CHECK (email_status IN ('pending', 'sending', 'sent', 'failed')),
 ADD COLUMN email_attempted_at timestamptz,
 ADD COLUMN email_sent_at timestamptz;
