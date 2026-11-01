import { ArrowUpRight, Headphones, MapPin, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shopDetails } from "@/lib/shop-details";

export function ShoppingBenefits() {
  const benefits = [
    { icon: Truck, title: "Transporti", text: `Porosia dorëzohet brenda ${shopDetails.deliveryHours} orëve. Transporti ${shopDetails.shipping.kosovo}€ në Kosovë, ${shopDetails.shipping.northMacedonia}€ në Maqedoni dhe Shqipëri. ${shopDetails.paymentOnDelivery ? "Paguan kur e merr." : ""}` },
    { icon: ShieldCheck, title: "Kualitet i garantuar", text: "Çdo produkt ofrohet me cilësi të lartë dhe i përshtatet saktë modelit të veturës tënde." },
    { icon: Headphones, title: "Mbështetje çdo ditë", text: "Na shkruaj në WhatsApp ose Viber dhe të ndihmojmë të gjesh pjesën e duhur për veturën." },
  ];
  return <section aria-labelledby="benefits-title" className="page-width pb-12 pt-5">
    <div className="mb-6 flex items-center gap-5"><h2 id="benefits-title" className="shrink-0 font-display text-3xl font-semibold">Pse të bleni online</h2><div className="h-px flex-1 bg-border" /></div>
    <div className="grid gap-4 md:grid-cols-3">{benefits.map(({ icon: Icon, title, text }) => <article key={title} className="bg-secondary p-7"><Icon className="mb-5 size-7 text-primary" /><h3 className="font-display text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div>
  </section>;
}

export function ShopMap() {
  return <div className="min-w-0"><div className="mb-4 flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 text-sm font-semibold"><MapPin size={16} />Ku ndodhet dyqani</h3><ArrowUpRight size={16} className="text-ink-foreground/60" /></div>
    <iframe title="Vendndodhja e autoprojoni në Google Maps" src={shopDetails.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full rounded-sm border-0 bg-secondary" allowFullScreen />
    <Button asChild variant="secondary" className="mt-3 w-full rounded-sm"><a href={shopDetails.mapUrl} target="_blank" rel="noopener noreferrer">Hap në Google Maps<ArrowUpRight /></a></Button>
  </div>;
}