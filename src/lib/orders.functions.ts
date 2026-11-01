import { createServerFn } from "@tanstack/react-start";
import { orderSchema } from "./order-schema";

// Guest checkout is intentionally public. Only validated catalog items may be
// written; the endpoint never exposes other customers' orders or accepts prices.
export const submitOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { finalizeOrder } = await import("./orders.server");
    return finalizeOrder(data);
  });
