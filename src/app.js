import express from 'express';
import cors from 'cors'; // นำเข้าแค่รอบเดียวพอครับ
import authRoutes from './routes/auth.route.js'; 
import userRoutes from './routes/user.route.js'; 
import eventRoutes from './routes/event.route.js';
import reviewRoutes from './routes/review.route.js';

const app = express();

// ตั้งค่า Middleware (เปิดประตูบ้าน & รับข้อมูลเป็น JSON) เอาไว้บนสุดตรงนี้ถูกแล้วครับ
app.use(cors());
app.use(express.json());

// เสียบปลั๊ก Route ต่างๆ
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/event', eventRoutes); 
app.use('/api/review', reviewRoutes);



// เส้นทางเช็กสุขภาพเซิร์ฟเวอร์
app.get('/health', (req, res) => {
  res.json({ success: true });
});

export default app;