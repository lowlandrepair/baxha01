import { describe, expect, it } from "vitest";
import { shopDetails } from "@/lib/shop-details";

describe("User-supplied delivery rules", () => {
  it("delivers within 24 hours", () => { expect(shopDetails.deliveryHours).toBe(24); });
  it("charges 2.5 euros for Kosovo", () => { expect(shopDetails.shipping.kosovo).toBe(2.5); });
  it("charges 5 euros for North Macedonia", () => { expect(shopDetails.shipping.northMacedonia).toBe(5); });
  it("charges 5 euros for Albania", () => { expect(shopDetails.shipping.albania).toBe(5); });
  it("allows payment on receipt", () => { expect(shopDetails.paymentOnDelivery).toBe(true); });
});