import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken'; // 💥 1. อย่าลืม Import JWT เข้ามาด้วยนะ!

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const updateData = req.body; 

    // 1. สั่ง Prisma ให้อัปเดตข้อมูลลง MySQL (ทำถูกต้องแล้ว!)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // 💥 2. สร้าง Token ใบใหม่ ที่อัปเดตรูปภาพล่าสุดแล้ว!
    const payload = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImageUrl: updatedUser.profileImageUrl // ยัดรูปล่าสุดจาก MySQL ใส่ลงไป
    };
    
    // (ใช้ SECRET KEY ตัวเดียวกับตอนทำ Login นะครับ)
    const newToken = jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { 
      expiresIn: '7d' 
    });

    // 💥 3. ส่งข้อมูล + Token ใบใหม่ กลับไปให้หน้าบ้าน
    res.status(200).json({
      message: "อัปเดตโปรไฟล์สำเร็จ",
      user: updatedUser,
      token: newToken // ส่ง Token กลับไปให้หน้าบ้านเซฟทับ!
    });

  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
}; 