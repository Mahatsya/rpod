import { createContext, useContext, useEffect, useState } from 'react';

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  /* — синхронизируем с localStorage — */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const add = item => setItems(prev => (prev.find(i => i.id === item.id) ? prev : [...prev, item]));
  const remove = id => setItems(prev => prev.filter(i => i.id !== id));
  const clear  = () => setItems([]);

  const total  = items.reduce((s, i) => s + Number(i.price), 0);

  return (
    <CartCtx.Provider value={{ items, add, remove, clear, total, open, setOpen }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
