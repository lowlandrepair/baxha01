import { describe, expect, it } from "vitest";
import { orderSchema, priceOrder, whatsappEnquiry } from "@/lib/order-schema";
import { products } from "@/lib/catalog";
import { shopDetails } from "@/lib/shop-details";

const input = { id: "06b7f2b1-b6b8-4f22-9197-735d971d8c41", name: "Test Customer", phone: "+383 48000000", address: "Test Street 12", city: "Vushtrri", country: "kosovo" as const, car: "Audi A6 2016", items: [{ id: 9, quantity: 2 }, { id: 3, quantity: 1 }] };
describe("Checkout requirements", () => {
  it("sends enquiries to the supplied WhatsApp number with part and car", () => {
    const url = new URL(whatsappEnquiry("Branik Audi", "Audi A6 2016"));
    expect(url.pathname).toBe("/38348330888");
    expect(url.searchParams.get("text")).toContain("Branik Audi");
    expect(url.searchParams.get("text")).toContain("Audi A6 2016");
  });
  it("retains the exact owner email", () => { expect(shopDetails.orderEmail).toBe("jondallku@gmail.com"); });
  it("requires customer name", () => { expect(orderSchema.safeParse({ ...input, name: "" }).success).toBe(false); });
  it("requires customer phone", () => { expect(orderSchema.safeParse({ ...input, phone: "" }).success).toBe(false); });
  it("requires delivery address", () => { expect(orderSchema.safeParse({ ...input, address: "" }).success).toBe(false); });
  it("requires order items", () => { expect(orderSchema.safeParse({ ...input, items: [] }).success).toBe(false); });
  it("includes every selected item and quantity at catalog prices", () => {
    const result = priceOrder(orderSchema.parse(input));
    expect(result.items).toHaveLength(2); expect(result.subtotal).toBe(66500); expect(result.total).toBe(66750);
  });
  it("accepts every priced catalog product", () => {
    const result = priceOrder(orderSchema.parse({ ...input, items: products.map((p) => ({ id: p.id, quantity: 1 })) }));
    expect(result.items).toHaveLength(72);
  });
  it("rejects unknown and duplicate parts", () => {
    expect(() => priceOrder({ ...input, items: [{ id: -1, quantity: 1 }] })).toThrow();
    expect(() => priceOrder({ ...input, items: [input.items[0], input.items[0]] })).toThrow();
  });
});