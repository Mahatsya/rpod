import { createContext, useContext, useEffect, useState } from 'react';
import { session } from '../utils/session';

const FavCtx = createContext();
export const useFav = () => useContext(FavCtx);

export function FavoritesProvider({ children }) {
  const user = session.get();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/users/${user.id}/favorites`)
      .then(r => r.json())
      .then(setItems)
      .catch(console.error);
  }, [user]);

  async function toggle(product) {
    if (!user) {
      // обязательно залогиньтесь
      location.href = '/auth';
      return;
    }
    const res = await fetch(`/api/users/${user.id}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product }),
    });
    const { added } = await res.json();
    setItems(prev =>
      added ? [...prev, product] : prev.filter(p => p.id !== product.id)
    );
  }

  const ids = new Set(items.map(i => i.id));
  return (
    <FavCtx.Provider value={{ items, ids, toggle }}>
      {children}
    </FavCtx.Provider>
  );
}
