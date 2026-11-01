import { Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eur, type Product } from "@/lib/catalog";

export function ProductCard({ product: p, onQuick, onAdd }: { product: Product; onQuick: (p: Product) => void; onAdd: (id: number) => void }) {
  return <article className="product-card group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
    <div className="relative aspect-[1.15] overflow-hidden bg-secondary">
      <Button variant="ghost" onClick={() => onQuick(p)} className="h-full w-full rounded-none p-0 hover:bg-transparent" aria-label={`Shiko ${p.title}`}>
        <img src={p.img} alt={p.title} loading="lazy" width={600} height={520} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
      </Button>
      {p.tag && <span className="pointer-events-none absolute left-3 top-3 bg-background px-2 py-1 text-[10px] font-bold text-foreground">{p.tag}</span>}
      <Button size="icon" variant="outline" title="Shiko shpejt" aria-label={`Shiko shpejt ${p.title}`} onClick={() => onQuick(p)} className="absolute bottom-3 right-3 h-8 w-8 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"><Eye /></Button>
    </div>
    <div className="flex flex-1 flex-col p-4">
      <span className="text-[11px] font-semibold uppercase text-muted-foreground">{p.brand} / {p.cat}</span>
      <h3 className="mb-4 mt-2 min-h-16 text-sm font-semibold leading-5"><Button variant="link" onClick={() => onQuick(p)} className="h-auto whitespace-normal p-0 text-left text-foreground">{p.title}</Button></h3>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
        <div>{p.price === null ? <span className="text-sm font-semibold">Çmimi sipas kërkesës</span> : <><span className="text-xl font-bold">{eur(p.price)}</span><span className="mt-0.5 block text-[11px] text-success">Në stok</span></>}</div>
        <Button size="icon" title={p.price === null ? "Shto në përzgjedhje" : "Shto në shportë"} aria-label={`Shto në shportë ${p.title}`} onClick={() => onAdd(p.id)} className="shrink-0 rounded-full"><Plus /></Button>
      </div>
    </div>
  </article>;
}