import spoiler from "@/assets/p-spoiler.jpg";
import mats from "@/assets/p-mats.jpg";
import led from "@/assets/p-led.jpg";
import bumper from "@/assets/audi-a6-c7-rs-bumper.jpg.asset.json";
import lip from "@/assets/card-lip.jpg";
import diffuser from "@/assets/card-diffuser.jpg";
import tint from "@/assets/card-tint.jpg";
import mercedes from "@/assets/mercedes-w206.png.asset.json";
import audiGrille from "@/assets/audi-rs3-grille.png.asset.json";
import bmwGrille from "@/assets/bmw-e39-grille.png.asset.json";
import bmwSpoiler from "@/assets/bmw-g11-spoiler.png.asset.json";
import golfDiffuser from "@/assets/golf8-diffuser.jpg.asset.json";
import audiDiffuser from "@/assets/audi-a7-diffuser.png.asset.json";
import portofino from "@/assets/cesare-portofino.jpg.asset.json";
import cedar from "@/assets/cesare-cedar.jpg.asset.json";
import citrus from "@/assets/cesare-citrus.jpg.asset.json";
import { catalogAdditions } from "@/lib/catalog-additions";

export type Product = { id: number; title: string; cat: string; brand: string; price: number | null; img: string; tag?: string; source?: string };
export const categories = [
  { name: "Branikë & Grila", img: bumper.url, sub: "RS, AMG & M-style" },
  { name: "Spoilers & Lipat", img: lip, sub: "Detaje sportive" },
  { name: "Shtroje Gome", img: mats, sub: "Mbrojtje & rehati" },
  { name: "LED & Drita", img: led, sub: "Ndriçim i pastër" },
  { name: "Difuzorë", img: audiDiffuser.url, sub: "Pamje e re" },
  { name: "Aksesorë & Aroma", img: portofino.url, sub: "Detajet bëjnë dallimin" },
];
const existingProducts: Product[] = [
  { id: 9, title: "Branik RS për Audi A6 C7", cat: "Branikë & Grila", brand: "Audi", price: null, img: bumper.url, tag: "RS STYLE" },
  { id: 10, title: "Grilë RS3 për Audi A3", cat: "Branikë & Grila", brand: "Audi", price: null, img: audiGrille.url, tag: "RS STYLE" },
  { id: 1, title: "Spoiler për Mercedes Benz C-Class W206", cat: "Spoilers & Lipat", brand: "Mercedes", price: 30, img: mercedes.url, tag: "STYLING" },
  { id: 2, title: "Shtroje gome për VW Golf 8", cat: "Shtroje Gome", brand: "Volkswagen", price: 35, img: mats },
  { id: 3, title: "LED H7 Canbus 12000LM (palë)", cat: "LED & Drita", brand: "Universal", price: 25, img: led, tag: "LED" },
  { id: 4, title: "Spoiler për BMW Seria 3 G20", cat: "Spoilers & Lipat", brand: "BMW", price: 45, img: spoiler },
  { id: 5, title: "Shtroje gome për Audi A4 B9", cat: "Shtroje Gome", brand: "Audi", price: 38, img: mats },
  { id: 6, title: "LED H4 Bi-Xenon Look (palë)", cat: "LED & Drita", brand: "Universal", price: 28, img: led },
  { id: 7, title: "Spoiler për Audi A3 8Y", cat: "Spoilers & Lipat", brand: "Audi", price: 40, img: spoiler },
  { id: 8, title: "Shtroje gome për Toyota RAV4", cat: "Shtroje Gome", brand: "Toyota", price: 32, img: mats },
  { id: 11, title: "Grila të zeza për BMW E39", cat: "Branikë & Grila", brand: "BMW", price: null, img: bmwGrille.url },
  { id: 12, title: "Spoiler për BMW Seria 7 G11 / G12", cat: "Spoilers & Lipat", brand: "BMW", price: null, img: bmwSpoiler.url },
  { id: 13, title: "Difuzor Black Glossy për Golf 8 R-Line (2020–2023)", cat: "Difuzorë", brand: "Volkswagen", price: null, img: golfDiffuser.url, tag: "R-LINE" },
  { id: 14, title: "Difuzor Shark për Audi A7 (2019–2023)", cat: "Difuzorë", brand: "Audi", price: null, img: audiDiffuser.url, tag: "SHARK STYLE" },
  { id: 15, title: "Aromë për veturë Mr&Mrs Cesare Portofino", cat: "Aksesorë & Aroma", brand: "Universal", price: null, img: portofino.url },
  { id: 16, title: "Aromë për veturë Mr&Mrs Cesare Cedar Wood", cat: "Aksesorë & Aroma", brand: "Universal", price: null, img: cedar.url },
  { id: 17, title: "Aromë për veturë Mr&Mrs Cesare Citrus & Musk", cat: "Aksesorë & Aroma", brand: "Universal", price: null, img: citrus.url },
];
const titleKey = (title: string) => title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
export const products: Product[] = categories.flatMap((category) => {
  const original = existingProducts.filter((p) => p.cat === category.name);
  const additions = catalogAdditions.filter((p) => p.cat === category.name && !original.some((old) => titleKey(old.title) === titleKey(p.title)));
  return [...original, ...additions].slice(0, 12);
});
export const eur = (n: number) => `€${n.toFixed(2)}`;