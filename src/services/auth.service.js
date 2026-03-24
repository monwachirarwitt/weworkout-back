import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js'; // กฎเหล็ก: ต้องมี .js เสมอ

export const registerUser = async (userData) => {
  const { email, password, name, gender } = userData;

  // 1. เช็กก่อนว่ามีอีเมลนี้ในระบบหรือยัง
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
  }

  // 2. เข้ารหัสผ่าน (Hashing) โดยใช้ระดับความยากที่ 10 (Salt Rounds)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. บันทึกข้อมูลลง Database
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      gender,
    },
  });

  // 4. คืนค่าข้อมูลกลับไป (แต่ต้องตัดรหัสผ่านออก ไม่ส่งกลับไปให้ Frontend เห็น)
  const { password: _, ...userWithoutPassword } = newUser;
  
  return userWithoutPassword;
};