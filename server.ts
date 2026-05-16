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
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase (Client SDK in Node)
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId);

  app.use(express.json());

  // Create uploads directory
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // --- MULTER SETUP ---
  const multer = (await import('multer')).default;
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });

  // Serve uploads
  app.use('/uploads', express.static(uploadsDir));

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
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const uploadsSnapshot = await getDocs(collection(db, 'uploads'));
      
      let totalRevenue = 0;
      const ordersData = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        totalRevenue += data.amount || 0;
        return { id: doc.id, ...data };
      });

      // Simple revenue by month chart data
      const monthlyRevenue: { [key: string]: number } = {};
      ordersData.forEach((order: any) => {
        if (order.createdAt?.seconds) {
          const date = new Date(order.createdAt.seconds * 1000);
          const month = date.toLocaleString('default', { month: 'short' });
          monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (order.amount || 0);
        }
      });

      const chartData = Object.keys(monthlyRevenue).map(month => ({
        name: month,
        revenue: monthlyRevenue[month]
      }));

      res.json({
        revenue: totalRevenue,
        orders: ordersData.length,
        products: productsSnapshot.size,
        users: usersSnapshot.size,
        uploads: uploadsSnapshot.size,
        avgOrderValue: ordersData.length > 0 ? totalRevenue / ordersData.length : 0,
        recentOrders: ordersData.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 5),
        chartData: chartData.length > 0 ? chartData : [{ name: 'Jan', revenue: 0 }]
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Users
  app.get('/api/admin/users', authMiddleware, async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/admin/users/:id', authMiddleware, async (req, res) => {
    try {
      await deleteDoc(doc(db, 'users', req.params.id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Uploads Management
  app.get('/api/admin/uploads', authMiddleware, async (req, res) => {
    try {
      const snapshot = await getDocs(query(collection(db, 'uploads'), orderBy('createdAt', 'desc')));
      res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
      
      const fileData = {
        name: req.file.originalname,
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'uploads'), fileData);
      res.json({ id: docRef.id, ...fileData });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/admin/uploads/:id', authMiddleware, async (req, res) => {
    try {
      const docRef = doc(db, 'uploads', req.params.id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const filePath = path.join(uploadsDir, data.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await deleteDoc(docRef);
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Settings
  app.get('/api/admin/settings', authMiddleware, async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, 'settings'));
      const settings: any = {};
      snapshot.docs.forEach(doc => {
        settings[doc.id] = doc.data().value;
      });
      res.json(settings);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/settings', authMiddleware, async (req, res) => {
    try {
      const { key, value } = req.body;
      await updateDoc(doc(db, 'settings', key), { value });
      res.json({ success: true });
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
