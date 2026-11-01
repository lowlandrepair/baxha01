import { afterEach, describe, expect, it, vi } from "vitest";
import { orderEmailParams, sendOrderEmail, type StoredOrder } from "@/lib/order-email.server";

export const storedOrder: StoredOrder = {
  id: "06b7f2b1-b6b8-4f22-9197-735d971d8c41", customer_name: "Test Customer", phone: "+383 48000000",
  address: "Test Street 12", city: "Vushtrri", country: "kosovo", car_details: "Audi A6 2016",
  items: [{ id: 9, title: "Branik RS për Audi A6 C7", quantity: 2, unit_cents: 32000 }],
  subtotal_cents: 64000, shipping_cents: 250, total_cents: 64250,
  created_at: "2026-11-01T12:00:00Z", payment_method: "cash_on_delivery", status: "received",
  email_status: "pending", email_attempted_at: null, email_sent_at: null,
};

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
function configure() {
  vi.stubEnv("EMAILJS_SERVICE_ID", "service_test");
  vi.stubEnv("EMAILJS_TEMPLATE_ID", "template_test");
  vi.stubEnv("EMAILJS_PUBLIC_KEY", "public_test");
  vi.stubEnv("EMAILJS_PRIVATE_KEY", "private_test");
}
describe("Owner order emails", () => {
  it("includes the fixed recipient, customer, car, items and calculated totals", () => {
    const params = orderEmailParams(storedOrder);
    expect(params.to_email).toBe("jondallku@gmail.com");
    for (const value of [storedOrder.id, storedOrder.customer_name, storedOrder.phone, storedOrder.address, storedOrder.city, "Kosovë", storedOrder.car_details, "2 × Branik RS", "€640.00", "€2.50", "€642.50", "Pagesa në dorëzim"]) {
      expect(params.message).toContain(value);
    }
  });
  it("sends the documented EmailJS REST payload", async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    await sendOrderEmail(storedOrder);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://api.emailjs.com/api/v1.0/email/send");
    expect(JSON.parse(request.body)).toMatchObject({ service_id: "service_test", template_id: "template_test", user_id: "public_test", accessToken: "private_test", template_params: { to_email: "jondallku@gmail.com" } });
  });
  it("does not report a rejected EmailJS request as sent", async () => {
    configure(); vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(sendOrderEmail(storedOrder)).rejects.toThrow("403");
  });
  it("does not call EmailJS without credentials", async () => {
    vi.stubEnv("EMAILJS_SERVICE_ID", "");
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    await expect(sendOrderEmail(storedOrder)).rejects.toThrow("configuration");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
