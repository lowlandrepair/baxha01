import { describe, expect, it } from "vitest";
import { categories, products } from "@/lib/catalog";
import { filterProducts } from "@/lib/catalog-browsing";

describe("Expanded catalog", () => {
  for (const category of ["Branikë & Grila", "Spoilers & Lipat", "Shtroje Gome", "LED & Drita", "Difuzorë", "Aksesorë & Aroma"]) {
    it(`provides 12 products in ${category}`, () => {
      expect(products.filter((p) => p.cat === category)).toHaveLength(12);
    });
  }
  it("uses unique identifiers for every cart selection", () => { expect(new Set(products.map((p) => p.id)).size).toBe(72); });
  it("filters each category without including siblings", () => {
    for (const category of categories) expect(filterProducts(products, category.name, "Të gjitha", "", "featured").every((p) => p.cat === category.name)).toBe(true);
  });
  it("finds diffuser listings without typing Albanian accents", () => {
    const matches = filterProducts(products, "Të gjitha", "Të gjitha", "difuzor audi", "featured");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((p) => p.brand === "Audi")).toBe(true);
  });
  it("sorts actual prices while keeping unpriced items last", () => {
    const matches = filterProducts(products, "Të gjitha", "Të gjitha", "", "low");
    expect(matches[0]?.price).toBe(25);
    expect(matches.at(-1)?.price).toBe(null);
  });
});