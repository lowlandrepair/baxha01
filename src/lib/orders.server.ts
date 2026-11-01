import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { priceOrder, type OrderInput } from "./order-schema";
import { sendOrderEmail, type OrderLine, type StoredOrder } from "./order-email.server";

export type OrderReceipt = { id: string; total: number; emailSent: boolean };
const storageError = () => new Error("Porosia nuk u ruajt. Ju lutemi provoni përsëri.");
const itemKey = (items: { id: number; quantity: number }[]) =>
  JSON.stringify(items.map(({ id, quantity }) => ({ id, quantity })).sort((a, b) => a.id - b.id));

function matchesOrder(order: StoredOrder, data: OrderInput) {
  return order.customer_name === data.name && order.phone === data.phone && order.address === data.address &&
    order.city === data.city && order.country === data.country && order.car_details === data.car &&
    itemKey(order.items as OrderLine[]) === itemKey(data.items);
}

export async function finalizeOrder(data: OrderInput): Promise<OrderReceipt> {
  const priced = priceOrder(data);
  const row = {
    id: data.id, customer_name: data.name, phone: data.phone,
    address: data.address, city: data.city, country: data.country,
    car_details: data.car, items: priced.items,
    subtotal_cents: priced.subtotal, shipping_cents: priced.shipping, total_cents: priced.total,
  };
  const { error } = await supabaseAdmin.from("shop_orders").upsert(row, { onConflict: "id", ignoreDuplicates: true });
  if (error) { console.error("Order storage failed", error.code); throw storageError(); }
  const { data: order, error: readError } = await supabaseAdmin.from("shop_orders").select("*").eq("id", data.id).single();
  if (readError || !order) throw storageError();
  // Reused IDs must never overwrite or reveal a different customer's receipt.
  if (!matchesOrder(order, data)) throw new Error("Kjo porosi ka ndryshuar. Rifreskoni faqen dhe provoni përsëri.");
  const receipt = { id: order.id, total: order.total_cents, emailSent: order.email_status === "sent" };
  if (receipt.emailSent) return receipt;

  const now = new Date();
  // Claim atomically: simultaneous retries cannot both send the notification.
  // A stale claim can be retried after two minutes if a worker was interrupted.
  const { data: claimed, error: claimError } = await supabaseAdmin.from("shop_orders")
    .update({ email_status: "sending", email_attempted_at: now.toISOString() })
    .eq("id", order.id).neq("email_status", "sent")
    .or(`email_status.neq.sending,email_attempted_at.lt.${new Date(now.getTime() - 120000).toISOString()}`)
    .select("*").maybeSingle();
  if (claimError || !claimed) return receipt;

  try {
    await sendOrderEmail(claimed);
  } catch (error) {
    console.error("Order notification failed", error instanceof Error ? error.message : "Unknown error");
    await supabaseAdmin.from("shop_orders").update({ email_status: "failed" })
      .eq("id", order.id).eq("email_attempted_at", now.toISOString());
    return receipt; // The order is safely stored even when email is unavailable.
  }
  const { error: statusError } = await supabaseAdmin.from("shop_orders")
    .update({ email_status: "sent", email_sent_at: new Date().toISOString() })
    .eq("id", order.id).eq("email_attempted_at", now.toISOString());
  if (statusError) console.error("Order notification status update failed", statusError.code);
  return { ...receipt, emailSent: true };
}
