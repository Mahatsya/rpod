// src/pages/OrdersPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate }       from 'react-router-dom';
import { session }          from '../utils/session';
import '../styles/global.css';

export default function OrdersPage() {
  const user = session.get();
  const nav  = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/users/${user.id}/orders`)
      .then(r => r.json())
      .then(setOrders)
      .catch(console.error);
  }, [user]);

  // Сводим все items из всех заказов в один массив
  const items = orders.flatMap(o => o.items);

  return (
    <div className="page orders-page">
      <h1>Мои заказы</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <img src="/assets/alerts/non-orders.png" width="96" alt="" />
          <h2>У вас нет заказов</h2>
          <p>Добавьте товары в корзину. Оформите хотя бы один заказ.</p>
          <button className="back-btn" onClick={() => nav(-1)}>
            ← Вернуться назад
          </button>
        </div>
      ) : (
        <>
          <ul className="grid">
            {items.map(({ id, title, price, image }, idx) => (
              <li key={`${id}-${idx}`} className="card">
                <img src={image} className="prod-img" alt={title} />
                <h3 className="prod-title">{title}</h3>
                <div className="price-row">
                  <span>
                    <span className="price-label">Цена:</span>{' '}
                    <span className="price">{price.toLocaleString()} тг</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <button className="back-btn" onClick={() => nav(-1)}>
            ← На главную
          </button>
        </>
      )}
    </div>
  );
}
