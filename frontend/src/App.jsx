import { Routes, Route } from 'react-router-dom';
import Layout        from './components/Layout';
import HomePage      from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import AuthPage      from './pages/AuthPage';
import OrdersPage    from './pages/OrdersPage';   // сделаешь позже

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>            {/* Header + Drawer */}
        <Route path="/"           element={<HomePage />} />
        <Route path="/favorites"  element={<FavoritesPage />} />
        <Route path="/orders"     element={<OrdersPage />} />
      </Route>

      {/* вне Layout, чтобы без Header на auth? — можно и внутрь поместить */}
      <Route path="/auth"         element={<AuthPage />} />
      <Route path="*"             element={<h2 style={{textAlign:'center'}}>404</h2>} />
    </Routes>
  );
}
