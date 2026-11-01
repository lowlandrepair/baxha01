import type { Tables } from "@/integrations/supabase/types";
import { shopDetails } from "./shop-details";
import { eur } from "./catalog";
import { emailRuntimeEnv } from "./runtime-env.server";

export type StoredOrder = Tables<"shop_orders">;
export type OrderLine = { id: number; title: string; quantity: number; unit_cents: number };
const countries: Record<string, string> = { kosovo: "Kosovë", albania: "Shqipëri", northMacedonia: "Maqedoni e Veriut" };

export function orderEmailParams(order: StoredOrder) {
  const items = (order.items as OrderLine[]).map((item) =>
    `${item.quantity} × ${item.title} — ${eur(item.unit_cents / 100)} / copë — ${eur(item.quantity * item.unit_cents / 100)}`,
  ).join("\n");
  const country = countries[order.country] ?? order.country;
  const message = [
    `Porosia: ${order.id}`, `Klienti: ${order.customer_name}`, `Telefoni: ${order.phone}`,
    `Adresa: ${order.address}, ${order.city}, ${country}`, `Vetura: ${order.car_details || "Nuk është dhënë"}`,
    "", items, "", `Nëntotali: ${eur(order.subtotal_cents / 100)}`,
    `Dërgesa: ${eur(order.shipping_cents / 100)}`, `Totali: ${eur(order.total_cents / 100)}`, "Pagesa në dorëzim",
  ].join("\n");
  return {
    to_email: shopDetails.orderEmail, to_name: shopDetails.name,
    subject: `Porosi e re ${order.id} | ${shopDetails.name}`,
    order_id: order.id, customer_name: order.customer_name, customer_phone: order.phone,
    address: order.address, city: order.city, country, car: order.car_details,
    items, subtotal: eur(order.subtotal_cents / 100), shipping: eur(order.shipping_cents / 100),
    total: eur(order.total_cents / 100), payment_method: "Pagesa në dorëzim", message,
  };
}

export async function sendOrderEmail(order: StoredOrder) {
  const env = await emailRuntimeEnv();
  const service = env["EMAILJS_SERVICE_ID"]?.trim();
  const template = env["EMAILJS_TEMPLATE_ID"]?.trim();
  const publicKey = env["EMAILJS_PUBLIC_KEY"]?.trim();
  const privateKey = env["EMAILJS_PRIVATE_KEY"]?.trim();
  const missing = [!service && "EMAILJS_SERVICE_ID", !template && "EMAILJS_TEMPLATE_ID", !publicKey && "EMAILJS_PUBLIC_KEY"].filter(Boolean);
  if (missing.length) throw new Error(`EmailJS configuration is missing: ${missing.join(", ")}.`);

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      service_id: service, template_id: template, user_id: publicKey,
      ...(privateKey ? { accessToken: privateKey } : {}),
      template_params: orderEmailParams(order),
    }),
  });
  // Never log the request body, credentials, or customer details.
  if (!response.ok) throw new Error(`EmailJS request failed (${response.status}).`);
}
