import '../styles/global.css';
import { useState } from 'react';
import { session }   from '../utils/session';

export default function AuthPage() {
  /* ---------------- STATE ---------------- */
  const [login, setLogin] = useState({ email: '', password: '' });
  const [reg,   setReg]   = useState({ email: '', password: '', repeat: '' });

  const [msg,  setMsg]  = useState(null);
  const [err,  setErr]  = useState(null);
  const [busy, setBusy] = useState(false);

  /* ---------------- HELPERS -------------- */
  const notify = (ok, text) => {
    setErr(ok ? null : text);
    setMsg(ok ? text : null);
    setTimeout(() => { setMsg(null); setErr(null); }, 3000);
  };

  /* ---------------- HANDLERS ------------- */
  async function handleLogin(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login),
      });
      const data = await r.json();
      if (data.ok) {
        session.set(data.user);
        location.href = '/';
      } else {
        notify(false, data.message || 'Ошибка входа');
      }
    } catch {
      notify(false, 'Сервер недоступен');
    } finally {
      setBusy(false);
    }
  }

  async function handleReg(e) {
    e.preventDefault();
    if (reg.password !== reg.repeat) {
      return notify(false, 'Пароли не совпадают');
    }
    setBusy(true);
    try {
      const r = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: reg.email, password: reg.password }),
      });
      const data = await r.json();
      if (data.ok) {
        session.set(data.user);
        location.href = '/';
      } else {
        notify(false, data.message || 'Ошибка регистрации');
      }
    } catch {
      notify(false, 'Сервер недоступен');
    } finally {
      setBusy(false);
    }
  }

  /* ---------------- UI ------------------- */
  return (
    <div className="app auth-page">
      {/* ---------- HEADER ---------- */}
      <header className="header">
        <div>
          <h2 className="logo">E-COMMERCE APP</h2>
          <span className="tagline">Доступный интернет-магазин для всех пользователей</span>
        </div>
      </header>

      {/* ---------- MESSAGES ---------- */}
      {msg && <p className="auth-msg auth-success">{msg}</p>}
      {err && <p className="auth-msg auth-error">{err}</p>}

      {/* ---------- FORMS GRID ------------ */}
      <div className="auth-grid">
        {/* --- LOGIN FORM --- */}
        <form className="auth-card" onSubmit={handleLogin}>
          <h2 className="auth-title">Вход</h2>
          <input
            type="email"
            placeholder="Введите email"
            required
            value={login.email}
            onChange={e => setLogin({ ...login, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Введите пароль"
            required
            value={login.password}
            onChange={e => setLogin({ ...login, password: e.target.value })}
          />
          <button className="auth-btn" disabled={busy}>Войти</button>
          <a href="#" className="auth-link">Забыли пароль?</a>
        </form>

        {/* --- REGISTER FORM --- */}
        <form className="auth-card" onSubmit={handleReg}>
          <h2 className="auth-title">Регистрация</h2>
          <input
            type="email"
            placeholder="Введите email"
            required
            value={reg.email}
            onChange={e => setReg({ ...reg, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Введите пароль"
            required
            value={reg.password}
            onChange={e => setReg({ ...reg, password: e.target.value })}
          />
          <input
            type="password"
            placeholder="Подтвердите пароль"
            required
            value={reg.repeat}
            onChange={e => setReg({ ...reg, repeat: e.target.value })}
          />
          <button className="auth-btn" disabled={busy}>Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
}
