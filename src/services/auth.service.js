import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import {prisma} from '../lib/prisma.js';

export const registerUser = async (userData) => {
  const { email, password, name, gender } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      gender,
    },
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  // 1. ค้นหา User จากอีเมล
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); 
  }

  // 2. ตรวจสอบรหัสผ่าน
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }

  // 💥 ขั้นตอนที่ 2: แก้ไขการสร้าง JWT Token ให้แพ็กข้อมูล "รูป" และ "ชื่อ" ลงไปด้วย
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name, // 👈 เพิ่มชื่อ
      profileImageUrl: user.profileImageUrl // 👈 เพิ่ม URL รูปภาพจาก MySQL ลงไปในบัตร!
    }, 
    process.env.JWT_SECRET,             
    { expiresIn: '7d' }                 
  );

  // 4. คืนค่าข้อมูล User พร้อมกับ Token
  const { password: _, ...userWithoutPassword } = user;
  return { 
    user: userWithoutPassword, 
    token 
  };
};