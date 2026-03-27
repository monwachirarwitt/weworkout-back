// src/validations/event.schema.js
import { z } from 'zod';

// ตัวดักจับเวลาสร้างตี้กีฬา
export const createEventSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "กรุณาระบุชื่อตี้กีฬา" }).min(3, "ชื่อตี้สั้นเกินไป (ต้อง 3 ตัวอักษรขึ้นไป)"),
    description: z.string({ required_error: "กรุณาระบุรายละเอียดตี้" }).min(5, "รายละเอียดสั้นเกินไป"),
    locationName: z.string({ required_error: "กรุณาระบุชื่อสถานที่" }),
    // url อาจจะต้องใช้ z.string().url() แต่เพื่อกันพังตอนเทสต์ ให้ใช้ string() ธรรมดาก่อนได้ครับ
    locationUrl: z.string({ required_error: "กรุณาใส่ลิงก์สถานที่" }).url("รูปแบบลิงก์ไม่ถูกต้อง"), 
    
    // สำคัญ: รับค่าเป็น String แล้วค่อยให้ Prisma จัดการ
    eventDate: z.string({ required_error: "กรุณาระบุวันที่จัดกิจกรรม" }), 
    startTime: z.string({ required_error: "กรุณาระบุเวลาเริ่ม" }),
    endTime: z.string({ required_error: "กรุณาระบุเวลาเลิก" }),
    
    category: z.string({ required_error: "กรุณาระบุชนิดกีฬา" }),
    // ให้ Zod เช็กว่าเป็นตัวเลขจริงๆ
    maxParticipants: z.number({ required_error: "กรุณาระบุจำนวนคนที่รับ" }).min(2, "ต้องรับอย่างน้อย 2 คนครับ")
  })
});

// ตัวดักจับตอนรับคนเข้าตี้
export const manageParticipantSchema = z.object({
  body: z.object({
    status: z.enum(['ACCEPTED', 'REJECTED'], { required_error: "สถานะต้องเป็น ACCEPTED หรือ REJECTED เท่านั้น" })
  })
});

// ตัวดักจับข้อความคอมเมนต์
export const commentSchema = z.object({
  body: z.object({
    message: z.string({ required_error: "กรุณาพิมพ์ข้อความ" }).min(1, "ข้อความห้ามว่างเปล่า"),
  })
});