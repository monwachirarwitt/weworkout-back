import express from 'express';
import { getMe, login, register } from '../controllers/auth.controller.js';
import { loginSchema, registerSchema } from '../validations/auth.schema.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Path คือ /register (เมื่อรวมกับ prefix ใน app.js จะกลายเป็น /api/auth/register)
router.post('/register', validate(registerSchema), register);

// เพิ่มบรรทัดนี้ สำหรับ Login
router.post('/login', validate(loginSchema), login);

// เพิ่มเส้นทางดูโปรไฟล์ (ต้องผ่านด่าน authenticate ก่อนถึงจะเรียก getMe ได้)
router.get('/me', authenticate, getMe);

export default router; 