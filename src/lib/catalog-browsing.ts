import type { Product } from "@/lib/catalog";

export const PAGE_SIZE = 12;
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function filterProducts(items: Product[], category: string, brand: string, query: string, sort: string) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return items.filter((p) => (category === "Të gjitha" || p.cat === category) && (brand === "Të gjitha" || p.brand === brand) && words.every((word) => normalize(`${p.title} ${p.cat} ${p.brand}`).includes(word))).sort((a, b) => {
    if (sort === "name") return a.title.localeCompare(b.title);
    if (sort !== "low" && sort !== "high") return 0;
    if (a.price === null) return b.price === null ? 0 : 1;
    if (b.price === null) return -1;
    return sort === "low" ? a.price - b.price : b.price - a.price;
  });
}