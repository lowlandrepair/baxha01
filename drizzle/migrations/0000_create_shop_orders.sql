CREATE TABLE public.shop_orders (
 id uuid PRIMARY KEY,
 created_at timestamptz NOT NULL DEFAULT now(),
 customer_name text NOT NULL,
 phone text NOT NULL,
 address text NOT NULL,
 city text NOT NULL,
 country text NOT NULL CHECK (country IN ('kosovo','albania','northMacedonia')),
 car_details text NOT NULL DEFAULT '',
 items jsonb NOT NULL,
 subtotal_cents integer NOT NULL CHECK (subtotal_cents > 0),
 shipping_cents integer NOT NULL CHECK (shipping_cents >= 0),
 total_cents integer NOT NULL CHECK (total_cents = subtotal_cents + shipping_cents),
 payment_method text NOT NULL DEFAULT 'cash_on_delivery',
 status text NOT NULL DEFAULT 'received'
);
GRANT ALL ON public.shop_orders TO service_role;
ALTER TABLE public.shop_orders ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.shop_orders IS 'Guest checkout submissions: server-only validated writes and receipt responses; no public customer-data access.';