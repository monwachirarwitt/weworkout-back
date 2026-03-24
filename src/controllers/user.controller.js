import { updateUserProfile } from '../services/user.service.js';

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id; // รปภ. (authenticate) แนบ ID มาให้แล้ว
    const updateData = req.body; // ข้อมูลใหม่ที่ส่งมาจากหน้าบ้าน

    const updatedProfile = await updateUserProfile(userId, updateData);

    res.status(200).json({
      message: "อัปเดตข้อมูลโปรไฟล์สำเร็จ",
      user: updatedProfile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}