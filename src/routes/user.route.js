import express from 'express';

// 💥 1. นำเข้า updateProfile ที่เราเพิ่งสร้างใน Controller มาใช้งาน
import { updateProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/authenticate.js';

// 💥 2. นำเข้ายาม Zod และ Schema ที่เราปั้นไว้มาใช้งาน
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validations/user.schema.js';

const router = express.Router();

// ประตูเดิมที่มีอยู่แล้ว
router.get('/profile', authenticate);
router.get('/events', authenticate);

// 💥 3. สร้างประตูบานใหม่! รับข้อมูลแบบ PUT และให้ยาม Zod ตรวจก่อนเข้า
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;