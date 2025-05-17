import { Link, NavLink } from 'react-router-dom';
import { session }       from '../utils/session';
import { useCart }       from '../context/CartContext';
import { useFav }        from '../context/FavoritesContext';

export default function Header({ onOpenCart }) {
  const user              = session.get();
  const { total }         = useCart();
  const { items: favs }   = useFav();

  const handleCartClick = () => {
    if (user) {
      onOpenCart();
    } else {
      // если не залогинен — сразу на страницу входа
      location.href = '/auth';
    }
  };

  const active = ({ isActive }) => isActive ? { fontWeight: 600 } : undefined;

  return (
    <header className="header">
      <div>
        <h2 className="logo">E-COMMERCE APP</h2>
        <span className="tagline">Доступный интернет-магазин для всех</span>
      </div>

      <nav className="actions">
        <button className="icon-btn" onClick={handleCartClick}>
          <img src="/assets/icons/cart.svg" alt="" /> {total.toLocaleString()} тг
        </button>

        {user && (
          <NavLink className="icon-btn" style={active} to="/favorites">
            <img src="/assets/icons/heart.svg" alt="" /> Избранное ({favs.length})
          </NavLink>
        )}

        {user ? (
          <>
            <NavLink className="icon-btn" style={active} to="/orders">
              <img src="/assets/icons/orders.svg" alt="" /> Мои заказы
            </NavLink>
            <button
              className="icon-btn"
              onClick={() => { session.clear(); location.reload(); }}
            >
              <img src="/assets/icons/exit.svg" alt="" /> Выход
            </button>
          </>
        ) : (
          <NavLink className="icon-btn" style={active} to="/auth">
            <img src="/assets/icons/user.svg" alt="" /> Вход
          </NavLink>
        )}
      </nav>
    </header>
  );
}
