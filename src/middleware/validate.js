// src/middleware/validate.js

// สร้างฟังก์ชันชื่อ validate โดยรับค่า schema (คู่มือตรวจ) เข้ามาเป็นพารามิเตอร์
export const validate = (schema) => (req, res, next) => {
  try {
    // 1. นำข้อมูลที่ส่งมา (body, query, params) ไปตรวจสอบกับ schema ที่ได้รับมา
    // .parse() คือคำสั่งของ Zod ที่ใช้ตรวจสอบ ถ้าข้อมูลผิดกฎมันจะโยน Error ออกไปทันที
    schema.parse({
      body: req.body,    // ข้อมูลจาก Form หรือ Body ที่ส่งมา
      query: req.query,  // ข้อมูลที่แนบมากับ URL (หลังเครื่องหมาย ?)
      params: req.params // ข้อมูลที่อยู่ใน URL Path (เช่น /api/event/:id)
    });

    // 2. ถ้าตรวจสอบผ่าน (ไม่มี Error) ให้เรียก next() เพื่อส่งงานต่อให้แผนกถัดไป (Controller)
    next();
  } catch (error) {
    // 3. ถ้าตรวจสอบไม่ผ่าน (เกิด Error ขึ้น)

    // เช็กว่า error นี้เป็นของ Zod (error.errors) หรือไม่
    if (error.errors) {
      // ดึงข้อความแจ้งเตือนทั้งหมดที่มีใน error มาต่อกันด้วยเครื่องหมายคอมม่า (,)
      const errorMessage = error.errors.map(e => e.message).join(', ');
      
      // ส่งสถานะ 400 (ข้อมูลไม่ถูกต้อง) กลับไปหาหน้าบ้านพร้อมรายละเอียดว่าผิดตรงไหน
      return res.status(400).json({ error: errorMessage });
    }

    // กรณีพังด้วยสาเหตุอื่นๆ ที่ไม่ใช่เรื่องการตรวจข้อมูล
    return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
  }
};