import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js'; // นำเข้าแบบ default ไม่ต้องมีปีกกา

const app = express();

app.use(cors());
app.use(express.json());

// เชื่อมต่อ Route เข้ากับ Path /api/auth
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ success: true });
});

export default app;