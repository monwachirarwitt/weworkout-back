import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken'; // 💥 เพิ่มการนำเข้า jwt ไว้ด้านบนสุดของไฟล์ด้วยนะครับ!

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    
    // 💥 1. ดึงเฉพาะข้อมูลที่เราต้องการให้เซฟจริงๆ ออกมาจาก req.body (เพื่อความปลอดภัย)
    const { weight, height, medicalNotes, bio, profileImageUrl } = req.body; 

    // 💥 2. สั่ง Prisma อัปเดตข้อมูลลง MySQL โดยระบุฟิลด์ให้ชัดเจน
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        weight: weight,
        height: height,
        medicalNotes: medicalNotes,
        bio: bio,
        profileImageUrl: profileImageUrl
      },
    });

    // 💥 จุดสำคัญ: สร้าง Token (บัตรประจำตัว) ใบใหม่ที่มี URL รูปภาพล่าสุดติดไปด้วย!
    const payload = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImageUrl: updatedUser.profileImageUrl // ยัดข้อมูลรูปจาก MySQL ใส่ลงในบัตรใบใหม่
    };
    
    // สร้าง Token ใหม่ (อิง Secret Key ตามที่เราตกลงกันไว้ใน .env)
    const newToken = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'weworkout_2026_secret', 
      { expiresIn: '20d' } 
    );

    // 3. ส่งทั้งข้อมูล User และ "บัตรใบใหม่" (newToken) กลับไปให้หน้าบ้าน
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