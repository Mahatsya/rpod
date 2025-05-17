// src/components/Layout.jsx
import { Outlet }   from 'react-router-dom';
import Header       from './Header';
import CartDrawer   from './CartDrawer';
import { useCart }  from '../context/CartContext';

export default function Layout() {
  const { setOpen } = useCart();      // открыть корзину

  return (
    <>
      <div className="app">
        <Header onOpenCart={() => setOpen(true)} />
        <Outlet />                     {/* сюда попадают страницы */}
      </div>

      <CartDrawer />                  {/* один экземпляр на всё приложение */}
    </>
  );
}
