import React, { memo } from 'react';
import { useCart }    from '../context/CartContext';
import { useFav }     from '../context/FavoritesContext';
import { session }    from '../utils/session';

export default memo(function ProductCard({ product }) {
  const { id, title, price, image } = product;

  // корзина
  const { add, items: cart } = useCart();
  const inCart = cart.some(p => p.id === id);

  // избранное
  const { ids: favIds, toggle } = useFav();
  const inFav = favIds.has(id);

  const handleAdd = () => {
    if (!session.get()) {
      location.href = '/auth';
      return;
    }
    if (!inCart) add(product);
  };

  const handleFav = () => {
    toggle(product); // toggle уже кидает на /auth, если нужно
  };

  return (
    <li className="card">
      {/* лайк */}
      <button
        className={`icon-btn icon-like ${inFav ? 'is-fav' : ''}`}
        onClick={handleFav}
      >
        <img
          src={`/assets/icons/${inFav ? 'alternate-like-active' : 'like'}.svg`}
          alt=""
        />
      </button>

      <img src={image} className="prod-img" alt={title} />
      <h3 className="prod-title">{title}</h3>

      <div className="price-row">
        <span>
          <span className="price-label">Цена:</span>{' '}
          <span className="price">{price.toLocaleString()} тг</span>
        </span>

        <button
          className={`add-btn ${inCart ? 'is-added' : ''}`}
          onClick={handleAdd}
          disabled={inCart}
        >
          <img
            src={`/assets/icons/${inCart ? 'alternate-done' : 'plus'}.svg`}
            alt=""
          />
        </button>
      </div>
    </li>
  );
});
