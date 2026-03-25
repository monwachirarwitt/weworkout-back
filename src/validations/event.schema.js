import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "กรุณาระบุชื่อตี้" }),
    description: z.string().optional(),
    
    // --- เปลี่ยนตรงนี้ครับ ---
    locationName: z.string({ required_error: "กรุณาระบุชื่อสถานที่" }),
    locationUrl: z.string({ required_error: "กรุณาระบุลิงก์แผนที่" }).url("รูปแบบ URL ของแผนที่ไม่ถูกต้อง"),
    // ----------------------

    eventDate: z.string({ required_error: "กรุณาระบุวันที่" }).datetime({ message: "รูปแบบวันที่ไม่ถูกต้อง" }),
    startTime: z.string({ required_error: "กรุณาระบุเวลาเริ่ม" }),
    endTime: z.string({ required_error: "กรุณาระบุเวลาจบ" }),
    category: z.string({ required_error: "กรุณาระบุประเภทกีฬา" }),
    maxParticipants: z.number({ required_error: "กรุณาระบุจำนวนคนรับสมัคร" }).min(2, "ต้องรับสมัครอย่างน้อย 2 คน"),
    imgEvent: z.string().url("รูปแบบ URL รูปภาพไม่ถูกต้อง").optional(),
  }),
});

// ... โค้ด createEventSchema เดิมปล่อยไว้ ...

// เพิ่มตัวตรวจจับสถานะ
export const manageParticipantSchema = z.object({
  body: z.object({
    status: z.enum(["ACCEPTED", "REJECTED"], {
      required_error: "กรุณาระบุสถานะ (ACCEPTED หรือ REJECTED)",
      invalid_type_error: "สถานะต้องเป็น ACCEPTED หรือ REJECTED เท่านั้น"
    })
  })
});

// ... โค้ดเดิมทั้งหมดปล่อยไว้ ...

// ตัวดักจับข้อมูลคอมเมนต์
export const commentSchema = z.object({
  body: z.object({
    message: z.string({ required_error: "กรุณาพิมพ์ข้อความ" }).min(1, "ข้อความห้ามว่างเปล่า"),
  })
});