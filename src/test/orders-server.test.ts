import { beforeEach, describe, expect, it, vi } from "vitest";
import { priceOrder, type OrderInput } from "@/lib/order-schema";
import type { StoredOrder } from "@/lib/order-email.server";

const mocks = vi.hoisted(() => ({ from: vi.fn(), send: vi.fn() }));
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { from: mocks.from } }));
vi.mock("@/lib/order-email.server", () => ({ sendOrderEmail: mocks.send }));
import { finalizeOrder } from "@/lib/orders.server";

const input: OrderInput = {
  id: "06b7f2b1-b6b8-4f22-9197-735d971d8c41", name: "Test Customer", phone: "+383 48000000",
  address: "Test Street 12", city: "Vushtrri", country: "kosovo", car: "Audi A6 2016", items: [{ id: 9, quantity: 2 }],
};
function stored(overrides: Partial<StoredOrder> = {}): StoredOrder {
  const priced = priceOrder(input);
  return {
    id: input.id, customer_name: input.name, phone: input.phone, address: input.address, city: input.city,
    country: input.country, car_details: input.car, items: priced.items, subtotal_cents: priced.subtotal,
    shipping_cents: priced.shipping, total_cents: priced.total, created_at: "2026-11-01T12:00:00Z",
    payment_method: "cash_on_delivery", status: "received", email_status: "pending", email_attempted_at: null, email_sent_at: null,
    ...overrides,
  };
}
function query(result: unknown) {
  const builder: Record<string, unknown> = {};
  for (const method of ["upsert", "select", "eq", "neq", "or", "update"]) builder[method] = vi.fn(() => builder);
  builder["single"] = vi.fn(async () => result);
  builder["maybeSingle"] = vi.fn(async () => result);
  builder["then"] = (resolve: (value: unknown) => void) => Promise.resolve(result).then(resolve);
  mocks.from.mockReturnValueOnce(builder);
  return builder;
}
beforeEach(() => { mocks.from.mockReset(); mocks.send.mockReset().mockResolvedValue(undefined); });
describe("Order finalization", () => {
  it("stores catalog prices before sending and records successful delivery", async () => {
    const insert = query({ error: null }); query({ data: stored(), error: null });
    query({ data: stored({ email_status: "sending" }), error: null });
    const update = query({ error: null });
    await expect(finalizeOrder(input)).resolves.toEqual({ id: input.id, total: 64250, emailSent: true });
    expect(insert["upsert"]).toHaveBeenCalledWith(expect.objectContaining({ total_cents: 64250 }), { onConflict: "id", ignoreDuplicates: true });
    expect(mocks.send).toHaveBeenCalledOnce();
    expect(update["update"]).toHaveBeenCalledWith(expect.objectContaining({ email_status: "sent" }));
  });
  it("never sends email when storage fails", async () => {
    query({ error: { code: "missing_table" } });
    await expect(finalizeOrder(input)).rejects.toThrow("nuk u ruajt");
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("keeps a saved order retryable if email fails", async () => {
    query({ error: null }); query({ data: stored(), error: null });
    query({ data: stored(), error: null }); const update = query({ error: null });
    mocks.send.mockRejectedValueOnce(new Error("EmailJS unavailable"));
    await expect(finalizeOrder(input)).resolves.toMatchObject({ emailSent: false });
    expect(update["update"]).toHaveBeenCalledWith({ email_status: "failed" });
  });
  it("does not resend a delivered notification and returns the stored total", async () => {
    query({ error: null }); query({ data: stored({ email_status: "sent", total_cents: 60000 }), error: null });
    await expect(finalizeOrder(input)).resolves.toEqual({ id: input.id, total: 60000, emailSent: true });
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("does not send when another request holds the notification claim", async () => {
    query({ error: null }); query({ data: stored(), error: null }); query({ data: null, error: null });
    await expect(finalizeOrder(input)).resolves.toMatchObject({ emailSent: false });
    expect(mocks.send).not.toHaveBeenCalled();
  });
  it("rejects an ID reused with changed customer details", async () => {
    query({ error: null }); query({ data: stored({ customer_name: "Another Customer" }), error: null });
    await expect(finalizeOrder(input)).rejects.toThrow("ndryshuar");
    expect(mocks.send).not.toHaveBeenCalled();
  });
});
