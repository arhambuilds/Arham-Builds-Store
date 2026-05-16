import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase (Client SDK in Node)
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId);

  app.use(express.json());

  // --- ADMIN API ---
  const ADMIN_USERNAME = 'arham2026';
  const ADMIN_PASSWORD = 'admin2026';

  const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const password = req.headers['x-admin-password'];
    const username = req.headers['x-admin-username'];
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  // Login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      res.json({ success: true, message: 'Logged in successfully' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Dashboard Stats
  app.get('/api/admin/stats', authMiddleware, async (req, res) => {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const productsSnapshot = await getDocs(collection(db, 'products'));
      
      let totalRevenue = 0;
      const ordersData = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        totalRevenue += data.amount || 0;
        return { id: doc.id, ...data };
      });

      res.json({
        revenue: totalRevenue,
        orders: ordersData.length,
        products: productsSnapshot.size,
        avgOrderValue: ordersData.length > 0 ? totalRevenue / ordersData.length : 0,
        recentOrders: ordersData.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 5)
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Orders
  app.get('/api/admin/orders', authMiddleware, async (req, res) => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/admin/orders/:id', authMiddleware, async (req, res) => {
    try {
      await deleteDoc(doc(db, 'orders', req.params.id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Products
  app.get('/api/admin/products', authMiddleware, async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/products', authMiddleware, async (req, res) => {
    try {
      const data = { ...req.body, _adminSecret: 'admin2026', updatedAt: serverTimestamp(), createdAt: serverTimestamp() };
      const docRef = await addDoc(collection(db, 'products'), data);
      res.json({ id: docRef.id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/admin/products/:id', authMiddleware, async (req, res) => {
    try {
      const data = { ...req.body, _adminSecret: 'admin2026', updatedAt: serverTimestamp() };
      await updateDoc(doc(db, 'products', req.params.id), data);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/admin/products/:id', authMiddleware, async (req, res) => {
    try {
      await deleteDoc(doc(db, 'products', req.params.id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
