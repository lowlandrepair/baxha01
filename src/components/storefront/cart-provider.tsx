import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Cart = Record<number, number>;
const CartContext = createContext<{ cart: Cart; setCart: React.Dispatch<React.SetStateAction<Cart>> } | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem("autoprojoni-cart") || "{}");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) {
        setCart(Object.fromEntries(Object.entries(stored).filter(([id, qty]) => /^\d+$/.test(id) && typeof qty === "number" && Number.isInteger(qty) && qty > 0 && qty <= 99)) as Cart);
      }
    } catch { /* Ignore damaged basket data. */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { sessionStorage.setItem("autoprojoni-cart", JSON.stringify(cart)); } catch { /* Basket still works without storage. */ } } }, [cart, ready]);
  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartProvider is required");
  return context;
}