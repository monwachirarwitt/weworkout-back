import { log } from 'console';
import { prisma } from '../lib/prisma.js'

// 1. ฟังก์ชันดึงโปรไฟล์และคำนวณ BMI
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('ไม่พบข้อมูลผู้ใช้งาน');
  }

  const { password, ...userProfile } = user;

  let bmi = null;
  if (user.weight && user.height) {
    const heightInMeters = user.height / 100;
    bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(2);
  }

  return {
    ...userProfile,
    bmi: bmi ? parseFloat(bmi) : null
  };
};

// 2. ฟังก์ชันอัปเดตข้อมูลโปรไฟล์ (ตัวที่ Error เมื่อกี้)
// src/services/user.service.js

export const updateUserProfile = async (userId, updateData) => {
  console.log("Data from frontend:", updateData);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      // ปรับให้รับค่า profileImageUrl จากหน้าบ้าน 
      // หรือถ้าหน้าบ้านส่งชื่ออื่นมา ต้อง map ให้ตรงกับ prisma schema
      profileImageUrl: updateData.profileImageUrl || updateData.profileImage 
    },
  });

  const { password, ...userProfile } = updatedUser;
  return userProfile;
};