import express from 'express';
import { createNewEvent, getEvents, getEvent, joinExistingEvent, updateParticipantStatus, cancelJoinEvent, getEventComments, createComment } from '../controllers/event.controller.js';
import { commentSchema, createEventSchema, manageParticipantSchema } from '../validations/event.schema.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// 1. สร้างตี้ใหม่ (ใช้ validate เช็กข้อมูลก่อน)
router.post('/', authenticate, validate(createEventSchema), createNewEvent);

// 2. ดึงตี้ทั้งหมด (หน้า Feed)
router.get('/', authenticate, getEvents);

// 3. ดึงตี้แบบเจาะจงด้วย ID (เอาไว้ดูรายละเอียด)
router.get('/:id', authenticate, getEvent);

// เส้นทางนี้ไว้ : สำหรับกดจอยตี้
router.post('/:id/join', authenticate, joinExistingEvent);

//  สำหรับ Host จัดการสถานะ (ต้องระบุทั้ง ID ตี้ และ ID คนขอจอย)
router.put('/:eventId/participants/:userId', authenticate, validate(manageParticipantSchema), updateParticipantStatus);

//ลูกตี้กดออกจากตี้ (ใช้ DELETE เพราะเป็นการลบข้อมูลออกจากระบบ)
router.delete('/:id/leave', authenticate, cancelJoinEvent);

// เพิ่มเส้นทางใหม่ล่างสุด: ระบบคอมเมนต์
router.post('/:id/comments', authenticate, validate(commentSchema), createComment);
router.get('/:id/comments', authenticate, getEventComments);

export default router;