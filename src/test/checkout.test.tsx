import type { ComponentType, ReactNode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CartProvider } from "@/components/storefront/cart-provider";
import { clearCheckoutAttempt } from "@/lib/checkout-attempt";
import { Route } from "@/routes/checkout";

const Checkout = Route.options.component as ComponentType;

const mocks = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("@/lib/orders.functions", () => ({ submitOrder: mocks.send }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: (fn: unknown) => fn }));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options }),
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => <a href={to} {...props}>{children}</a>,
}));
beforeEach(() => {
  mocks.send.mockReset(); clearCheckoutAttempt(); sessionStorage.clear();
  sessionStorage.setItem("autoprojoni-cart", JSON.stringify({ 9: 2 }));
});
afterEach(cleanup);
async function fillCheckout() {
  render(<CartProvider><Checkout /></CartProvider>);
  await screen.findByRole("button", { name: "Konfirmo porosinë" });
  for (const [label, value] of [["Emri dhe mbiemri", "Test Customer"], ["Telefoni", "+38348000000"], ["Adresa", "Test Street 12"], ["Qyteti", "Vushtrri"]]) {
    fireEvent.change(screen.getByLabelText(label!), { target: { value } });
  }
}
function confirm() { fireEvent.click(screen.getByRole("button", { name: "Konfirmo porosinë" })); }
it("confirms a saved and emailed order and clears the ordered items", async () => {
  mocks.send.mockImplementation(async ({ data }) => ({ id: data.id, total: 64250, emailSent: true }));
  await fillCheckout(); confirm();
  await screen.findByRole("heading", { name: "Porosia u pranua" });
  expect(screen.getByRole("status")).toHaveTextContent("Dyqani u njoftua me email");
  expect(screen.getByText("Totali: €642.50")).toBeInTheDocument();
  await waitFor(() => expect(JSON.parse(sessionStorage.getItem("autoprojoni-cart")!)).toEqual({}));
});
it("keeps the basket after a storage error and retries the same order ID", async () => {
  mocks.send.mockRejectedValueOnce(new Error("Storage unavailable"));
  mocks.send.mockImplementationOnce(async ({ data }) => ({ id: data.id, total: 64250, emailSent: true }));
  await fillCheckout(); confirm();
  await screen.findByRole("alert");
  expect(JSON.parse(sessionStorage.getItem("autoprojoni-cart")!)).toEqual({ 9: 2 });
  confirm();
  await screen.findByRole("heading", { name: "Porosia u pranua" });
  expect(mocks.send.mock.calls[0]![0].data.id).toBe(mocks.send.mock.calls[1]![0].data.id);
});
it("allows notification retry from the receipt without recreating the order", async () => {
  mocks.send.mockImplementationOnce(async ({ data }) => ({ id: data.id, total: 64250, emailSent: false }));
  mocks.send.mockImplementationOnce(async ({ data }) => ({ id: data.id, total: 64250, emailSent: true }));
  await fillCheckout(); confirm();
  const retry = await screen.findByRole("button", { name: "Provo njoftimin përsëri" });
  expect(screen.getByRole("status")).toHaveTextContent("Porosia është ruajtur");
  fireEvent.click(retry);
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Dyqani u njoftua me email"));
  expect(mocks.send.mock.calls[0]![0]).toEqual(mocks.send.mock.calls[1]![0]);
});
