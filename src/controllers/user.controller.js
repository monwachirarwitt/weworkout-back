import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken'; // 💥 เพิ่มการนำเข้า jwt ไว้ด้านบนสุดของไฟล์ด้วยนะครับ!

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const updateData = req.body; 

    // 1. สั่ง Prisma อัปเดตข้อมูลลง MySQL ตามปกติ
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // 💥 จุดสำคัญ: สร้าง Token (บัตรประจำตัว) ใบใหม่ที่มี URL รูปภาพล่าสุดติดไปด้วย!
    const payload = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImageUrl: updatedUser.profileImageUrl // ยัดข้อมูลรูปจาก MySQL ใส่ลงในบัตรใบใหม่
    };
    
    // สร้าง Token ใหม่ (ใช้ Secret Key และอายุการใช้งานเดียวกับตอน Login)
    const newToken = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'secret123', 
      { expiresIn: '20d' } 
    );

    // 2. ส่งทั้งข้อมูล User และ "บัตรใบใหม่" (newToken) กลับไปให้หน้าบ้าน
    res.status(200).json({
      message: "อัปเดตโปรไฟล์สำเร็จ",
      user: updatedUser,
      token: newToken // 💥 ส่งบัตรใบใหม่กลับไปตรงนี้ครับ!
    });

  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};