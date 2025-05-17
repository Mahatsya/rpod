// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/global.css';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then(r => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(setItems)
      .catch(console.error);
  }, []);

  const filtered = items.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="catalog">
      {/* header с динамическим заголовком */}
      <div className="catalog-head">
        <h1>
          {query
            ? `Найдено по запросу: “${query}”`
            : 'Все товары'}
        </h1>

        <label className="search">
          <img src="/assets/icons/search.svg" alt="" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск товаров"
          />
        </label>
      </div>

      {/* сам результат */}
      {filtered.length > 0 ? (
        <ul className="grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      ) : (
        query && (
          <p className="no-results">
            По запросу “{query}” ничего не найдено
          </p>
        )
      )}
    </section>
  );
}
