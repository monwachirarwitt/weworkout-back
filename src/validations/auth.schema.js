import { z } from 'zod';

// Schema สำหรับตรวจสอบข้อมูลตอน สมัครสมาชิก (Register)
export const registerSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "กรุณากรอกอีเมล" }).email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z.string({ required_error: "กรุณากรอกรหัสผ่าน" }).min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    name: z.string({ required_error: "กรุณากรอกชื่อ" }).min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
    gender: z.string().optional(),
  }),
});

// Schema สำหรับตรวจสอบข้อมูลตอน เข้าสู่ระบบ (Login)
export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "กรุณากรอกอีเมล" }).email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z.string({ required_error: "กรุณากรอกรหัสผ่าน" }).min(1, "กรุณากรอกรหัสผ่าน"),
  }),
});