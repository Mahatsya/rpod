import React from 'react';
import { useFav }  from '../context/FavoritesContext';

import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/global.css';

export default function FavoritesPage() {
  const { items: favs } = useFav();
  const nav = useNavigate();

  return (
    <div className="page">
      <h1>Избранное</h1>

      {favs.length === 0 ? (
        <div className="empty-state">
          <img src="/assets/alerts/non-favorites.png" width="96" alt="" />
          <h2>Закладок нет :(</h2>
          <p>Вы ничего не добавили в закладки</p>
          <button className="back-btn" onClick={() => nav(-1)}>
            ← Вернуться назад
          </button>
        </div>
      ) : (
        <>
          <ul className="grid">
            {favs.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
          <button className="back-btn" onClick={() => nav(-1)}>
            ← Вернуться назад
          </button>
        </>
      )}
    </div>
  );
}
