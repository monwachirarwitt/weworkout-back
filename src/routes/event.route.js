import express from 'express';
import { createNewEvent, getEvents, getEvent, joinExistingEvent } from '../controllers/event.controller.js';
import { createEventSchema } from '../validations/event.schema.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// 1. สร้างตี้ใหม่ (ใช้ validate เช็กข้อมูลก่อน)
router.post('/', authenticate, validate(createEventSchema), createNewEvent);

// 2. ดึงตี้ทั้งหมด (หน้า Feed)
router.get('/', authenticate, getEvents);

// 3. ดึงตี้แบบเจาะจงด้วย ID (เอาไว้ดูรายละเอียด)
router.get('/:id', authenticate, getEvent);

// เพิ่มเส้นทางนี้ไว้ล่างสุดครับ: สำหรับกดจอยตี้
router.post('/:id/join', authenticate, joinExistingEvent);

export default router;