import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    weight: z.number().positive("น้ำหนักต้องมากกว่า 0").optional(),
    height: z.number().positive("ส่วนสูงต้องมากกว่า 0").optional(),
    medicalNotes: z.string().optional(),
    bio: z.string().optional(),
    profileImageUrl: z.string().url("รูปแบบ URL รูปภาพไม่ถูกต้อง").optional(),
    birthDate: z.string().datetime({ message: "รูปแบบวันที่ไม่ถูกต้อง" }).optional(),
  }),
});