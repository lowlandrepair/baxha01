import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, MessageCircle, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/storefront/cart-provider";
import { products, eur } from "@/lib/catalog";
import { orderSchema, type OrderInput } from "@/lib/order-schema";
import { checkoutAttempt, clearCheckoutAttempt } from "@/lib/checkout-attempt";
import { shopDetails } from "@/lib/shop-details";
import { submitOrder } from "@/lib/orders.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Përfundo porosinë | autoprojoni" },
    { name: "description", content: "Porosit pjesë dhe aksesorë autoprojoni me dërgesë në Kosovë, Shqipëri dhe Maqedoni. Pagesa në dorëzim." },
    { property: "og:title", content: "Porosia juaj | autoprojoni" },
    { property: "og:description", content: "Përfundo porosinë e pjesëve dhe aksesorëve për veturën tuaj." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: Checkout,
});

function Checkout() {
  const { cart, setCart } = useCart();
  const sendOrder = useServerFn(submitOrder);
  const [fields, setFields] = useState({ name: "", phone: "", address: "", city: "", country: "kosovo" as "kosovo" | "albania" | "northMacedonia", car: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const [receipt, setReceipt] = useState<{ id: string; total: number; message: string; emailSent: boolean; input: OrderInput } | null>(null);
  const lines = products.filter((p) => cart[p.id] && p.price !== null);
  const quoteLines = products.filter((p) => cart[p.id] && p.price === null);
  const subtotal = lines.reduce((sum, p) => sum + (p.price ?? 0) * (cart[p.id] ?? 0), 0);
  const shipping = shopDetails.shipping[fields.country];
  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return;
    const parsed = orderSchema.safeParse(checkoutAttempt({ ...fields, items: lines.map((p) => ({ id: p.id, quantity: cart[p.id]! })) }));
    if (!parsed.success) { setError("Plotësoni emrin, telefonin dhe adresën e saktë."); return; }
    submitting.current = true;
    setPending(true); setError("");
    try {
      const result = await sendOrder({ data: parsed.data });
      const message = `Porosia ${result.id}\n${fields.name} · ${fields.phone}\n${fields.address}, ${fields.city}, ${fields.country}\n${fields.car}\n${lines.map((p) => `${cart[p.id]} × ${p.title}`).join("\n")}\nTotali: ${eur(result.total / 100)} · Pagesa në dorëzim`;
      setReceipt({ ...result, message, input: parsed.data });
      clearCheckoutAttempt();
      setCart((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !lines.some((p) => p.id === Number(id)))));
    } catch { setError("Porosia nuk u ruajt. Provoni përsëri ose na shkruani në WhatsApp."); }
    finally { submitting.current = false; setPending(false); }
  }
  async function retryNotification() {
    if (!receipt || submitting.current) return;
    submitting.current = true; setPending(true); setError("");
    try {
      const result = await sendOrder({ data: receipt.input });
      setReceipt({ ...receipt, ...result });
      if (!result.emailSent) setError("Emaili nuk u dërgua ende. Porosia është ruajtur; mund të na kontaktoni në WhatsApp.");
    } catch { setError("Njoftimi nuk u konfirmua. Porosia është ruajtur; provoni përsëri më vonë."); }
    finally { submitting.current = false; setPending(false); }
  }
  return <main className="min-h-screen bg-background">
    <header className="border-b border-border"><div className="page-width flex items-center justify-between py-5"><Link to="/" className="font-display text-2xl font-bold">autoprojoni</Link><Button asChild variant="ghost"><Link to="/"><ArrowLeft />Kthehu në dyqan</Link></Button></div></header>
    <div className="page-width py-10">
      {receipt ? <div className="mx-auto max-w-xl space-y-5 py-10"><CheckCircle2 className="size-12 text-success" /><h1 className="font-display text-3xl font-semibold">Porosia u pranua</h1><p className="break-all text-sm text-muted-foreground">Nr. {receipt.id}</p><p className="text-xl font-bold">Totali: {eur(receipt.total / 100)}</p><p>Pagesa në dorëzim.</p><p role="status" className="text-sm text-muted-foreground">{receipt.emailSent ? "Dyqani u njoftua me email. Do t'ju kontaktojmë për konfirmimin e porosisë." : "Porosia është ruajtur, por njoftimi me email nuk është konfirmuar. Provoni përsëri ose kontaktoni dyqanin në WhatsApp."}</p>{!receipt.emailSent && <Button type="button" variant="outline" disabled={pending} onClick={retryNotification}>{pending ? "Duke dërguar…" : "Provo njoftimin përsëri"}</Button>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button asChild><a href={`https://wa.me/${shopDetails.whatsappNumber}?text=${encodeURIComponent(receipt.message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle />Dërgo porosinë në WhatsApp</a></Button><Button asChild variant="outline"><Link to="/">Vazhdo blerjen</Link></Button></div> : !lines.length ? <div className="py-16 text-center"><ShoppingBag className="mx-auto size-12 text-muted-foreground" /><h1 className="my-5 font-display text-3xl">{quoteLines.length ? "Produktet tuaja kërkojnë ofertë" : "Shporta është bosh"}</h1>{quoteLines.length > 0 && <p className="mb-5">Kthehuni në shportë dhe kërkoni çmimin në WhatsApp.</p>}<Button asChild><Link to="/">Zgjidh produktet</Link></Button></div> : <>
        <h1 className="mb-8 font-display text-4xl font-semibold">Përfundo porosinë</h1>{quoteLines.length > 0 && <p role="status" className="mb-6 text-sm text-muted-foreground">{quoteLines.length} produkte pa çmim kërkojnë ofertë në WhatsApp. Ato mbeten në shportë dhe nuk përfshihen në këtë porosi.</p>}
        <form onSubmit={placeOrder} className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <fieldset disabled={pending} className="min-w-0 space-y-5"><legend className="mb-5 text-lg font-semibold">Të dhënat e dërgesës</legend>
            {([{ key: "name", label: "Emri dhe mbiemri", autoComplete: "name", min: 2, max: 100 }, { key: "phone", label: "Telefoni", autoComplete: "tel", min: 7, max: 25 }, { key: "address", label: "Adresa", autoComplete: "street-address", min: 5, max: 250 }, { key: "city", label: "Qyteti", autoComplete: "address-level2", min: 2, max: 100 }] as const).map((field) => <div key={field.key}><label htmlFor={field.key} className="mb-2 block text-sm font-semibold">{field.label}</label><Input id={field.key} required type={field.key === "phone" ? "tel" : "text"} autoComplete={field.autoComplete} minLength={field.min} maxLength={field.max} value={fields[field.key]} onChange={(e) => setFields({ ...fields, [field.key]: e.target.value })} /></div>)}
            <div><label htmlFor="country" className="mb-2 block text-sm font-semibold">Shteti</label><select id="country" value={fields.country} onChange={(e) => setFields({ ...fields, country: e.target.value as typeof fields.country })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="kosovo">Kosovë</option><option value="albania">Shqipëri</option><option value="northMacedonia">Maqedoni e Veriut</option></select></div>
            <div><label htmlFor="car" className="mb-2 block text-sm font-semibold">Vetura (opsionale)</label><Input id="car" placeholder="Marka, modeli, viti" maxLength={150} value={fields.car} onChange={(e) => setFields({ ...fields, car: e.target.value })} /></div>
          </fieldset>
          <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-8"><h2 className="mb-5 text-lg font-semibold">Porosia juaj</h2><div className="space-y-4">{lines.map((p) => <div key={p.id} className="flex items-center gap-3"><img src={p.img} alt={p.title} className="size-16 bg-secondary object-contain p-1" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{p.title}</p><p className="text-xs text-muted-foreground">{cart[p.id]} × {eur(p.price ?? 0)}</p></div><span className="shrink-0 text-sm font-semibold">{eur((p.price ?? 0) * (cart[p.id] ?? 0))}</span></div>)}</div><div className="my-6 space-y-3 border-y border-border py-5"><p className="flex justify-between"><span>Nëntotali</span><span>{eur(subtotal)}</span></p><p className="flex justify-between"><span>Dërgesa</span><span>{eur(shipping)}</span></p><p className="flex justify-between text-xl font-bold"><span>Totali</span><span>{eur(subtotal + shipping)}</span></p></div><p className="mb-5 flex items-center gap-2 text-sm"><Truck className="size-4 text-primary" />Pagesa në dorëzim</p>{error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}<Button disabled={pending} type="submit" className="h-12 w-full">{pending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}{pending ? "Duke ruajtur…" : "Konfirmo porosinë"}</Button></div>
        </form>
      </>}
    </div>
  </main>;
}
