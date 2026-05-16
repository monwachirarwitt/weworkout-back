import express from 'express';
// 1. นำเข้าพนักงานจัดการ (Controller) ที่จะทำงานจริงๆ หลังจากผ่านด่านตรวจแล้ว
import { getMe, login, register } from '../controllers/auth.controller.js';

// 2. นำเข้า "กฎเหล็ก" (Schema) จาก Zod เพื่อบอกว่าข้อมูลที่ส่งมาต้องหน้าตาเป็นยังไง
import { loginSchema, registerSchema } from '../validations/auth.schema.js';

// 3. นำเข้า "สารวัตรนักเรียน" (validate) และ "รปภ. ตรวจบัตร" (authenticate)
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

/**
 * [POST] /api/auth/register
 * ด่าน 1: validate(registerSchema) -> ตรวจว่าพิมพ์ Email ถูกไหม? Password ยาวพอไหม?
 * ด่าน 2: register -> ถ้าผ่านด่านแรก จะส่งข้อมูลไปบันทึกลงฐานข้อมูล
 * หมายเหตุ: ใช้ POST เพราะเป็นการ "สร้าง" ข้อมูล User ใหม่ลงในระบบ
 */
router.post('/register', validate(registerSchema), register);

/**
 * [POST] /api/auth/login
 * ด่าน 1: validate(loginSchema) -> ตรวจว่ากรอก Email และ Password มาครบไหม?
 * ด่าน 2: login -> ตรวจสอบรหัสผ่านจริงใน DB และออกบัตรผ่าน (JWT Token)
 * หมายเหตุ: ใช้ POST เพื่อซ่อนรหัสผ่านไม่ให้โชว์บน URL (เพื่อความปลอดภัย)
 */
router.post('/login', validate(loginSchema), login);

/**
 * [GET] /api/auth/me
 * ด่าน 1: authenticate -> รปภ. จะขอดู JWT Token ใน Header ว่า "เป็นตัวจริงไหม?"
 * ด่าน 2: getMe -> ถ้าบัตรผ่านถูกต้อง จะไปดึงข้อมูลเจ้าของบัตรมาโชว์
 * หมายเหตุ: ใช้ GET เพราะเป็นการ "ขอเรียกดู" ข้อมูลเฉยๆ ไม่มีการแก้ไข
 */
router.get('/me', authenticate, getMe);

export default router;