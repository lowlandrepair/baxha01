import { createServerFn } from "@tanstack/react-start";
import { orderSchema, priceOrder } from "./order-schema";

// Guest checkout is intentionally public. Only validated catalog items may be
// written; the endpoint never exposes other customers' orders or accepts prices.
export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const priced = priceOrder(data);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = {
      id: data.id, customer_name: data.name, phone: data.phone,
      address: data.address, city: data.city, country: data.country,
      car_details: data.car, items: priced.items,
      subtotal_cents: priced.subtotal, shipping_cents: priced.shipping, total_cents: priced.total,
    };
    // A stable event id makes retrying the same submission safe. Ignore duplicate
    // writes rather than replacing an existing order supplied by another caller.
    const { error } = await supabaseAdmin.from("shop_orders").upsert(row, { onConflict: "id", ignoreDuplicates: true });
    if (error) { console.error("Order storage failed", error.code); throw new Error("Porosia nuk u ruajt. Ju lutemi provoni përsëri."); }
    return { id: data.id, total: priced.total, emailSent: false as const };
  });