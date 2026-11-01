import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { whatsappEnquiry } from "@/lib/order-schema";

export function WhatsAppEnquiry({ title }: { title: string }) {
  const [car, setCar] = useState("");
  return <div className="mt-5 space-y-3 border-t border-border pt-4">
    <label className="block text-xs font-semibold" htmlFor="enquiry-car">Marka, modeli dhe viti i veturës</label>
    <Input id="enquiry-car" value={car} maxLength={150} onChange={(e) => setCar(e.target.value)} placeholder="p.sh. Audi A6 C7, 2016" />
    <Button asChild variant="outline" className="w-full"><a href={whatsappEnquiry(title, car)} target="_blank" rel="noopener noreferrer"><MessageCircle />Pyet në WhatsApp</a></Button>
  </div>;
}