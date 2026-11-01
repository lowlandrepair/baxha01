import { z } from "zod";
import { products } from "./catalog";
import { shopDetails } from "./shop-details";

export const orderSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(25).regex(/^[+\d\s()-]+$/),
  address: z.string().trim().min(5).max(250),
  city: z.string().trim().min(2).max(100),
  country: z.enum(["kosovo", "albania", "northMacedonia"]),
  car: z.string().trim().max(150).default(""),
  items: z.array(z.object({ id: z.number().int(), quantity: z.number().int().min(1).max(99) })).min(1).max(72),
});
export type OrderInput = z.infer<typeof orderSchema>;
export function priceOrder(input: OrderInput) {
  const ids = new Set<number>();
  const items = input.items.map((line) => {
    const product = products.find((p) => p.id === line.id);
    if (!product || product.price === null || ids.has(line.id)) throw new Error("Produkt i pavlefshëm.");
    ids.add(line.id);
    return { id: product.id, title: product.title, quantity: line.quantity, unit_cents: Math.round(product.price * 100) };
  });
  const subtotal = items.reduce((sum, line) => sum + line.unit_cents * line.quantity, 0);
  const shipping = Math.round(shopDetails.shipping[input.country] * 100);
  return { items, subtotal, shipping, total: subtotal + shipping };
}
export function whatsappEnquiry(title: string, car: string) {
  return `https://wa.me/${shopDetails.whatsappNumber}?text=${encodeURIComponent(`Përshëndetje! Jam i interesuar për: ${title}.\nVetura ime: ${car.trim() || "Do t'ju dërgoj detajet e veturës."}`)}`;
}