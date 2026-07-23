import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_COMPUTERS, INITIAL_MONITORS, INITIAL_PRINTERS } from './src/data/initialData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

  // Initialize DB file if not present
  function loadDatabase() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.monitors && parsed.computers && parsed.printers) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error reading db.json:', err);
    }

    const defaultData = {
      monitors: INITIAL_MONITORS,
      computers: INITIAL_COMPUTERS,
      printers: INITIAL_PRINTERS
    };

    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error creating default db.json:', err);
    }

    return defaultData;
  }

  function saveDatabase(data: { monitors: any[]; computers: any[]; printers: any[] }) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error saving db.json:', err);
      return false;
    }
  }

  // --- API ROUTES ---
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.post('/api/auth/login', (req, res) => {
    const { password, username } = req.body;
    if (password === 'admin' && (!username || username === 'admin')) {
      res.json({ success: true, user: { username: 'admin', role: 'Quản trị viên (Admin)' } });
    } else {
      res.status(401).json({ success: false, message: 'Mật khẩu không đúng!' });
    }
  });

  app.get('/api/data', (_req, res) => {
    const data = loadDatabase();
    res.json(data);
  });

  app.post('/api/data', (req, res) => {
    const { monitors, computers, printers } = req.body;
    if (Array.isArray(monitors) && Array.isArray(computers) && Array.isArray(printers)) {
      const ok = saveDatabase({ monitors, computers, printers });
      if (ok) {
        res.json({ success: true, message: 'Đã lưu dữ liệu thành công' });
      } else {
        res.status(500).json({ success: false, message: 'Không thể ghi file dữ liệu' });
      }
    } else {
      res.status(400).json({ success: false, message: 'Dữ liệu gửi lên không đúng định dạng' });
    }
  });

  app.post('/api/data/reset', (_req, res) => {
    const defaultData = {
      monitors: INITIAL_MONITORS,
      computers: INITIAL_COMPUTERS,
      printers: INITIAL_PRINTERS
    };
    saveDatabase(defaultData);
    res.json({ success: true, data: defaultData });
  });

  // --- VITE OR STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
