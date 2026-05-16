import express from 'express';
// 💥 เพิ่ม deleteActivity เข้ามาในรายการอิมพอร์ตจาก controller
import { 
  createNewEvent, 
  getEvents, 
  getEvent, 
  joinExistingEvent, 
  updateParticipantStatus, 
  cancelJoinEvent, 
  getEventComments, 
  createComment,
  deleteActivity // <--- ตัวใหม่ที่เราเพิ่งสร้าง
} from '../controllers/event.controller.js';

import { commentSchema, createEventSchema, manageParticipantSchema } from '../validations/event.schema.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// 1. สร้างตี้ใหม่ (ต้องล็อกอิน และตรวจสอบข้อมูลฟอร์มก่อนสร้าง)
router.post('/', authenticate, validate(createEventSchema), createNewEvent);

// 2. ดึงตี้ทั้งหมด (สำหรับโชว์ในหน้า Feed/Find Activities)
router.get('/', authenticate, getEvents);

// 3. ดึงรายละเอียดตี้แบบเจาะจงด้วย ID
router.get('/:id', authenticate, getEvent);

// 💥 4. ลบตี้ (ต้องเป็นเจ้าของตี้เท่านั้นถึงจะลบได้ - ลอจิกเช็กอยู่ใน controller/service)
// จิมมี่แนะนำให้วางไว้ตรงนี้ครับ เพราะใช้พารามิเตอร์ :id เหมือนกับตัวด้านบน
router.delete('/:id', authenticate, deleteActivity);

// 5. สำหรับลูกตี้: กดส่งคำขอเข้าร่วมตี้
router.post('/:id/join', authenticate, joinExistingEvent);

// 6. สำหรับ Host: จัดการสถานะลูกตี้ (อนุมัติ/ปฏิเสธ)
router.put('/:eventId/participants/:userId', authenticate, validate(manageParticipantSchema), updateParticipantStatus);

// 7. สำหรับลูกตี้: กดยกเลิกคำขอ หรือออกจากตี้ (Leave)
router.delete('/:id/leave', authenticate, cancelJoinEvent);

// 8. ระบบคอมเมนต์: ส่งข้อความคุยกันในตี้
router.post('/:id/comments', authenticate, validate(commentSchema), createComment);

// 9. ระบบคอมเมนต์: ดึงข้อความทั้งหมดในตี้นั้นมาโชว์
router.get('/:id/comments', authenticate, getEventComments);

export default router;