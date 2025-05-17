// server.js
const express = require('express');
const cors    = require('cors');
const path    = require('node:path');
const fs      = require('node:fs/promises');

const app  = express();
const PORT = process.env.PORT || 4000;

/* ------------------------------------------------------------------ */
/*  1.  Миддлвары                                                    */
/* ------------------------------------------------------------------ */
app.use(cors());
app.use(express.json());

/* ------------------------------------------------------------------ */
/*  2.  К А Т А Л О Г   Т О В А Р О В                                 */
/* ------------------------------------------------------------------ */
// GET /api/products  → массив объектов [{ id, title, price, image }, …]
app.get('/api/products', async (_req, res) => {
  try {
    const file = path.join(__dirname, 'src', 'data', 'electronic', 'products.json');
    const raw  = await fs.readFile(file, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: 'Не удалось прочитать products.json' });
  }
});

// Статика с изображениями, путь в JSON: /static/products/eletronic/1.jpg
app.use(
  '/static/products/eletronic',
  express.static(path.join(__dirname, 'src', 'media', 'products', 'eletronic'))
);

/* ------------------------------------------------------------------ */
/*  3.  А В Т О Р И З А Ц И Я                                        */
/* ------------------------------------------------------------------ */
const USERS_PATH = path.join(__dirname, 'src', 'data', 'users.json');

const loadUsers = async () => JSON.parse(await fs.readFile(USERS_PATH, 'utf-8')).users;
const saveUsers = async users => fs.writeFile(USERS_PATH, JSON.stringify({ users }, null, 2));

/*  POST /api/register  { email, password } → { ok:true, user }  */
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'email и password обязательны' });
  }

  const users = await loadUsers();
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ ok: false, message: 'Пользователь уже существует' });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    email,
    password,          // в учебном примере храним как есть
    cart: [],
    favorites: [],
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);

  res.json({ ok: true, user: { id: newUser.id, email: newUser.email } });
});

/*  POST /api/login  { email, password } → { ok:true, user } | 401  */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'email и password обязательны' });
  }

  const users = await loadUsers();
  const user  = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ ok: false, message: 'Неверный логин или пароль' });
  }

  res.json({ ok: true, user: { id: user.id, email: user.email } });
});

/* ===== orders storage ============================================ */
 const ORDERS_PATH = path.join(__dirname, 'src', 'data', 'orders.json');
 const loadOrders  = async () =>
   JSON.parse(await fs.readFile(ORDERS_PATH, 'utf-8')).orders;
 const saveOrders  = async o =>
   fs.writeFile(ORDERS_PATH, JSON.stringify({ orders: o }, null, 2));

/* …после /api/login вставь : */

/**
 * POST /api/orders
 * { userId, items:[{ id,title,price,image }], total }
 * → { ok:true, orderId }
 */
app.post('/api/orders', async (req, res) => {
  const { userId = null, items = [], total = 0 } = req.body;
  if (!items.length) return res.status(400).json({ ok:false, message:'Пустой заказ' });

  const orders   = await loadOrders();
  const orderId  = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;

  orders.push({
    id: orderId,
    userId,
    items,
    total,
    createdAt: new Date().toISOString(),
  });

  await saveOrders(orders);
  res.json({ ok: true, orderId });
});

/* ---- FAVORITES --------------------------------------------------- */
/* GET  /api/users/:id/favorites                      → [ {product}, … ] */
app.get('/api/users/:id/favorites', async (req, res) => {
  const users = await loadUsers();
  const user  = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ ok:false, message:'User not found' });
  res.json(user.favorites || []);
});

/* POST /api/users/:id/favorites { product }  (toggle) → { added:true/false } */
app.post('/api/users/:id/favorites', async (req, res) => {
  const users   = await loadUsers();
  const userIdx = users.findIndex(u => u.id === Number(req.params.id));
  if (userIdx === -1) return res.status(404).json({ ok:false });

  const favs = users[userIdx].favorites || [];
  const exists = favs.find(p => p.id === req.body.product.id);

  users[userIdx].favorites = exists
    ? favs.filter(p => p.id !== req.body.product.id)   // remove
    : [...favs, req.body.product];                     // add

  await saveUsers(users);
  res.json({ ok:true, added: !exists });
});

/* GET /api/users/:id/orders  →  [ { id, total, createdAt, items:[…] } ] */
app.get('/api/users/:id/orders', async (req, res) => {
  const orders = await loadOrders();                    // from orders.json
  const userId = Number(req.params.id);
  res.json(orders.filter(o => o.userId === userId));
});


/* ------------------------------------------------------------------ */
app.listen(PORT, () =>
  console.log(`🚀  Back-end запущен на http://localhost:${PORT}`)
);
