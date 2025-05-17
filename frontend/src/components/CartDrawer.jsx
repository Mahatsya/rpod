// src/components/CartDrawer.jsx
import { useState } from 'react';
import { session }   from '../utils/session';
import { useCart }   from '../context/CartContext';
import '../styles/global.css';

export default function CartDrawer() {
  const { items, remove, total, open, setOpen, clear } = useCart();
  const [successId, setSuccessId] = useState(null);
  const user = session.get();

  /* При клике вне панели закрываем и сбрасываем success */
  const handleOverlayClick = () => {
    setOpen(false);
    setSuccessId(null);
  };

  /* Оформление заказа */
  async function handleOrder() {
    if (!user) {
      // если не авторизован, редиректим на /auth
      location.href = '/auth';
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items,
          total,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccessId(data.orderId);
        clear();
      } else {
        alert(data.message || 'Не удалось оформить заказ');
      }
    } catch (err) {
      alert('Сервер недоступен');
    }
  }

  return (
    <>
      {open && <div className="drawer-overlay" onClick={handleOverlayClick} />}

      <aside className={`drawer ${open ? 'is-open' : ''}`}>
        <header className="drawer-head">
          <h3>Корзина</h3>
        </header>

        {successId ? (
          /* Экран «Заказ оформлен» */
          <div className="drawer-empty">
            <img src="/assets/alerts/success-order.svg" width="120" alt="Успех" />
            <h2 style={{ color: '#4caf50' }}>Заказ оформлен!</h2>
            <small>
              Ваш заказ №{successId} скоро будет передан курьерской доставке
            </small>
            <button
              className="auth-btn"
              onClick={() => {
                setOpen(false);
                setSuccessId(null);
              }}
            >
              ← Вернуться назад
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Экран пустой корзины */
          <div className="drawer-empty">
            <img src="/assets/alerts/empty-cart.svg" width="96" alt="Пусто" />
            <h1>Корзина пуста</h1>
            <small>Добавьте хотя бы один товар, чтобы оформить заказ.</small>
            <button className="auth-btn" onClick={() => setOpen(false)}>
              ← Вернуться назад
            </button>
          </div>
        ) : (
          /* Список товаров + итог */
          <>
            <ul className="drawer-list">
              {items.map(({ id, title, price, image }) => (
                <li key={id} className="drawer-item">
                  <img src={image} alt={title} />
                  <div className="item-info">
                    <span className="item-title">{title}</span>
                    <b className="item-price">{price.toLocaleString()} тг</b>
                  </div>
                  <button
                    className="item-remove-btn"
                    onClick={() => remove(id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="drawer-footer">
              <div className="total-row">
                <span className="total-label">Итого:</span>
                <span className="total-price">{total.toLocaleString()} тг</span>
              </div>

              
              <button className="order-btn" onClick={() => {
                  if (!session.get()) return location.href = '/auth';
                  handleOrder();
                }}>
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
