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

  // ถ้าไม่เจออีเมลนี้ ให้โยน Error
  if (!user) {
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); 
  }

  // 2. ตรวจสอบรหัสผ่านว่าตรงกับที่เข้ารหัสไว้ไหม
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }

  // 3. สร้าง JWT Token (บัตรผ่านสำหรับใช้ในแอป)
  const token = jwt.sign(
    { id: user.id, email: user.email }, // ข้อมูลที่จะฝังใน Token
    process.env.JWT_SECRET,             // กุญแจลับ (ต้องตั้งในไฟล์ .env)
    { expiresIn: '7d' }                 // กำหนดอายุ Token 7 วัน
  );

  // 4. คืนค่าข้อมูล User (ตัดรหัสผ่านทิ้ง) พร้อมกับ Token
  const { password: _, ...userWithoutPassword } = user;
  return { 
    user: userWithoutPassword, 
    token 
  };
};