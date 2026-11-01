import { beforeEach, expect, it } from "vitest";
import { checkoutAttempt, clearCheckoutAttempt } from "@/lib/checkout-attempt";

const input = { name: "Test Customer", phone: "+38348000000", address: "Street 12", city: "Vushtrri", country: "kosovo" as const, car: "", items: [{ id: 9, quantity: 1 }] };
beforeEach(() => { sessionStorage.clear(); clearCheckoutAttempt(); });
it("reuses a submission ID after a lost response or reload", () => {
  expect(checkoutAttempt(input).id).toBe(checkoutAttempt(input).id);
});
it("starts a new submission when customer details or items change", () => {
  const first = checkoutAttempt(input);
  expect(checkoutAttempt({ ...input, address: "Other Street 10" }).id).not.toBe(first.id);
  expect(checkoutAttempt({ ...input, items: [{ id: 9, quantity: 2 }] }).id).not.toBe(first.id);
});
it("allows another identical purchase after a confirmed order", () => {
  const first = checkoutAttempt(input);
  clearCheckoutAttempt();
  expect(checkoutAttempt(input).id).not.toBe(first.id);
});
