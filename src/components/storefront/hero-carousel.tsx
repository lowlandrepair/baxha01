import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import golf from "@/assets/golf-styling.jpg";
import mats from "@/assets/hero-mats.jpg";
import lip from "@/assets/card-lip.jpg";

const slides = [
  { image: golf, eyebrow: "STYLING & AKSESORË PËR VETURA", title: "AUTOPROJONI", line: "Një pamje tjetër. E njëjta veturë.", description: "Branikë, spoilerë dhe detaje që bëjnë dallimin.", category: "Branikë & Grila", label: "Zbulo koleksionin" },
  { image: mats, eyebrow: "PËR ÇDO UDHËTIM", title: "SHTROJE PREMIUM", line: "Mbrojtje që përshtatet.", description: "Shtroje gome për Volkswagen, Audi, BMW dhe më shumë.", category: "Shtroje Gome", label: "Shiko shtrojet" },
  { image: lip, eyebrow: "DETAJE ME KARAKTER", title: "SPORT STYLE", line: "Nga pamja e parë.", description: "Lipa dhe spoilerë për një përfundim më sportiv.", category: "Spoilers & Lipat", label: "Shiko pjesët styling" },
];

export function HeroCarousel({ onCategory }: { onCategory: (cat: string) => void }) {
  const [ref, api] = useEmblaCarousel({ loop: true });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const selected = useCallback(() => { if (api) setActive(api.selectedScrollSnap()); }, [api]);
  useEffect(() => { if (!api) return; selected(); api.on("select", selected); return () => { api.off("select", selected); }; }, [api, selected]);
  useEffect(() => {
    if (!api || paused || hovered || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => { if (!document.hidden) api.scrollNext(); }, 6500);
    return () => window.clearInterval(timer);
  }, [api, paused, hovered]);
  return <section aria-label="Koleksionet e autoprojoni" aria-roledescription="carousel" className="relative overflow-hidden bg-ink text-ink-foreground" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false); }}>
    <div ref={ref}><div className="flex">{slides.map((slide, index) => <div key={slide.title} aria-hidden={active !== index} className="relative min-w-0 shrink-0 basis-full">
      <img src={slide.image} alt={index === 0 ? "Volkswagen Golf avec lip sportif" : slide.title} width={1600} height={900} loading={index === 0 ? "eager" : "lazy"} className={`absolute inset-0 h-full w-full object-cover object-[64%_center] ${active === index ? "hero-photo" : ""}`} />
      <div className="hero-shade absolute inset-0" />
      <div className="page-width relative flex min-h-[490px] items-center py-16 max-sm:min-h-[460px]">
        <div key={`${index}-${active === index}`} className={`max-w-lg pb-8 ${active === index ? "hero-copy" : ""}`}>
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold"><span className="h-0.5 w-7 bg-primary" />{slide.eyebrow}</p>
          {index === 0 ? <h1 className="font-display text-7xl font-bold leading-none max-sm:text-5xl">{slide.title}</h1> : <h2 className="font-display text-7xl font-bold leading-none max-sm:text-5xl">{slide.title}</h2>}
          <p className="mt-3 font-display text-3xl font-medium max-sm:text-2xl">{slide.line}</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-ink-foreground/75">{slide.description}</p>
          <Button onClick={() => onCategory(slide.category)} tabIndex={active === index ? 0 : -1} size="lg" className="mt-7 h-12 rounded-sm px-6 font-semibold">{slide.label}<ArrowRight /></Button>
        </div>
      </div>
    </div>)}</div></div>
    <div className="page-width absolute inset-x-0 bottom-6 flex items-center justify-between">
      <div className="flex items-center gap-2">{slides.map((s, i) => <Button key={s.title} variant="ghost" className="hero-dot" aria-label={`Koleksioni ${i + 1}`} aria-pressed={active === i} onClick={() => api?.scrollTo(i)} />)}<span className="ml-3 text-xs text-ink-foreground/60">0{active + 1} / 03</span></div>
      <div className="flex gap-2"><Button size="icon" variant="ghost" onClick={() => setPaused(!paused)} aria-label={paused ? "Luaj karuselin" : "Ndalo karuselin"} title={paused ? "Luaj" : "Ndalo"} className="text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground">{paused ? <Play /> : <Pause />}</Button><Button size="icon" variant="ghost" aria-label="Koleksioni paraprak" onClick={() => api?.scrollPrev()} className="border border-ink-foreground/30 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"><ArrowLeft /></Button><Button size="icon" variant="ghost" aria-label="Koleksioni tjetër" onClick={() => api?.scrollNext()} className="border border-ink-foreground/30 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"><ArrowRight /></Button></div>
    </div>
  </section>;
}