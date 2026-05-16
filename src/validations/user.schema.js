import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    // 💥 เติม .nullable() เข้าไป เพื่อบอกยามว่า "ถ้าส่ง null (ค่าว่าง) มา ก็ให้ผ่านได้"
    weight: z.number().positive("น้ำหนักต้องมากกว่า 0").optional().nullable(),
    height: z.number().positive("ส่วนสูงต้องมากกว่า 0").optional().nullable(),
    medicalNotes: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    
    // แจ้งชื่อกับยาม Zod ให้รู้จักรูปโปรไฟล์แล้ว!
    profileImageUrl: z.string().url("รูปแบบ URL รูปภาพไม่ถูกต้อง").optional().nullable(),
    birthDate: z.string().datetime({ message: "รูปแบบวันที่ไม่ถูกต้อง" }).optional().nullable(),
  }),
});