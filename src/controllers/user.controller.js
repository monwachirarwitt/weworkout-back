// 💥 สร้าง Controller สำหรับอัปเดตข้อมูลโปรไฟล์ (รวมถึงรูปภาพด้วย)
export const updateProfile = async (req, res) => {
  try {
    // 1. ดึง ID ของคนที่ล็อกอินอยู่ (ได้มาจาก middleware authenticate)
    const userId = req.user.id; 
    
    // 2. ดึงข้อมูลที่หน้าบ้านส่งมา (เช่น { profileImageUrl: "https://..." })
    const updateData = req.body; 

    // 3. สั่ง Prisma ให้อัปเดตข้อมูลลง Database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // 4. ส่งคำตอบกลับไปบอกหน้าบ้านว่า "เซฟสำเร็จแล้วนะ!"
    res.status(200).json({
      message: "อัปเดตโปรไฟล์สำเร็จ",
      user: updatedUser
    });

  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};