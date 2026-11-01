import type { OrderInput } from "./order-schema";

let memoryAttempt: { id: string; payload: string } | null = null;
export function clearCheckoutAttempt() {
  memoryAttempt = null;
  try { sessionStorage.removeItem("autoprojoni-order-attempt"); } catch { /* Optional persistence. */ }
}

// Preserve an uncertain submission across reloads. Editing the order starts a
// new attempt; retrying the same payload reuses its ID.
export function checkoutAttempt(input: Omit<OrderInput, "id">): OrderInput {
  const payload = JSON.stringify({ ...input, items: [...input.items].sort((a, b) => a.id - b.id) });
  if (memoryAttempt?.payload === payload) return { ...input, id: memoryAttempt.id };
  try {
    const previous = JSON.parse(sessionStorage.getItem("autoprojoni-order-attempt") || "null");
    if (previous?.payload === payload && typeof previous.id === "string") {
      memoryAttempt = previous;
      return { ...input, id: previous.id };
    }
  } catch { /* Checkout also works when storage is unavailable. */ }
  const id = crypto.randomUUID();
  memoryAttempt = { id, payload };
  try { sessionStorage.setItem("autoprojoni-order-attempt", JSON.stringify({ id, payload })); } catch { /* Optional persistence. */ }
  return { ...input, id };
}
