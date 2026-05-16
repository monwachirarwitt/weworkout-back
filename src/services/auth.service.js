import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const registerUser = async (userData) => {

  // 1. กระจายของออกจากถาด: แยกตัวแปรออกมาให้เรียกใช้ง่ายๆ
  const { email, password, name, gender } = userData;

  //  สถานีที่ 1: ตรวจสอบความซ้ำซ้อน (Validation in Service)
  // สั่งให้ Prisma เดินไปถาม MySQL ว่า "ขอเช็กหน่อย มีใครใช้อีเมลนี้หรือยัง?"
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  // ถ้า existingUser มีค่า (แปลว่าเจอคนใช้เมลนี้แล้ว)
  if (existingUser) {
    // โยน Error ออกไปทันที! เพื่อให้ Controller ใน block catch เป็นคนรับช่วงต่อ
    throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
  }

  // สถานีที่ 2: การสับละเอียดรหัสผ่าน (Hashing)
  // **ห้ามเก็บรหัสจริง "123456" ลงเครื่องเด็ดขาด** // bcrypt.hash จะปั่นรหัสให้กลายเป็นข้อความยึกยือที่เดาไม่ได้
  // เลข 10 (Salt Rounds) คือความละเอียดในการสับ ยิ่งเยอะยิ่งปลอดภัย
  const hashedPassword = await bcrypt.hash(password, 10);

  // สถานีที่ 3: ขั้นตอนการฝังลงดิน (Save to Database)
  // สั่งให้ Prisma สร้างแถวข้อมูล (Row) ใหม่ในตาราง User
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword, // เซฟเฉพาะรหัสที่สับแล้วเท่านั้น!
      name,
      gender,
    },
  });
  // สถานีที่ 4: การรักษาความลับ (Data Sanitization)
  // แม้จะสร้างสำเร็จแล้ว แต่เรา "ไม่ควร" ส่งรหัส (แม้จะสับแล้ว) กลับไปให้หน้าบ้านเห็น
  // เราใช้การ Destructuring เพื่อดึง password ออกมาเก็บในตัวแปร _ (ทิ้งไป)
  // และเอาส่วนที่เหลือเก็บไว้ใน userWithoutPassword
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword; //มันคือการตัดรหัสผ่านออกไป
  //{
  // id: 1,
  // email: "mon@example.com",
  // name: "คุณมล",
  // gender: "male"
  // }
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  // 🔍 สถานีที่ 1: ตรวจสอบตัวตน (Authentication Check)
  // ไปค้นในตู้เก็บข้อมูล (MySQL) ว่ามี User ที่ใช้เมลนี้ไหม
  const user = await prisma.user.findUnique({
    where: { email },
  });
// ถ้าไม่พบ User (เมลไม่มีในระบบ)
  if (!user) {
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }

  // 2. ตรวจสอบรหัสผ่าน
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  }

  //  ขั้นตอนที่ 2: แก้ไขการสร้าง JWT Token ให้แพ็กข้อมูล "รูป" และ "ชื่อ" ลงไปด้วย มันคือเอา jwt ใน env ผสมลงไปด้วย
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