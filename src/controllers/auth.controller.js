import { loginUser, registerUser } from '../services/auth.service.js';

// ประกาศฟังก์ชัน register แบบ async (เพราะต้องมีการ "รอ" การทำงานของฐานข้อมูล)
export async function register(req, res) {
  try {
    // 1. รับแฟ้มข้อมูล: 
    // ดึงข้อมูลที่หน้าบ้านส่งมา (ที่ผ่านการตรวจจากยามแล้วว่าถูกต้องแน่นอน) มาเก็บไว้ในตัวแปร userData
    const userData = req.body;

    // 2. ส่งงานต่อให้ผู้เชี่ยวชาญ (Service):
    // สั่งให้ฟังก์ชัน registerUser (ซึ่งอยู่ในไฟล์ Service) เอา userData ไปทำงานต่อ 
    // คำว่า 'await' สำคัญมาก! มันแปลว่า "ผู้จัดการขอยืนรอตรงนี้นะ จนกว่า Service จะบันทึกข้อมูลเสร็จ ถึงจะไปบรรทัดต่อไป"
    const createdUser = await registerUser(userData);
    
    // 3. แจ้งผลสำเร็จกลับไปหน้าบ้าน:
    // เมื่อ Service ทำงานเสร็จและส่งข้อมูลกลับมา (createdUser) 
    // ผู้จัดการจะตอบกลับหน้าบ้านด้วยรหัส 201 (Created - แปลว่าสร้างข้อมูลใหม่สำเร็จ) พร้อมส่งข้อมูลกลับไปให้ดู
    res.status(201).json(createdUser);

  } catch (error) {
    // 4. แผนสำรองกรณีเกิดข้อผิดพลาด:
    // ถ้าในขั้นตอนที่ 2 (Service) เกิดปัญหาคอขาดบาดตาย เช่น "อีเมลนี้มีคนใช้ไปแล้ว" หรือ "ฐานข้อมูลล่ม"
    // โค้ดจะกระโดดเด้งมาที่ block 'catch' นี้ทันที
    // ผู้จัดการจะตอบกลับหน้าบ้านด้วยรหัส 500 (Internal Server Error) พร้อมบอกสาเหตุของปัญหา (error.message)
    res.status(500).json({ error: error.message });
  }
}






export async function login(req, res) {
  try {
    const userData = req.body;
    const result = await loginUser(userData);
    
    // ส่งสถานะ 200 (OK) กลับไปพร้อมกับข้อมูล User และ Token
    res.status(200).json(result);
  } catch (error) {
    // ส่งสถานะ 401 (Unauthorized - ไม่มีสิทธิ์เข้าถึง)
    res.status(401).json({ error: error.message });
  }
}

// ... โค้ด register กับ login ของเดิม ...
import { getUserProfile } from '../services/user.service.js'; // เพิ่มบรรทัดนำเข้านี้ไว้ด้านบนด้วยนะครับ

export async function getMe(req, res) {
  try {
    // req.user.id ได้มาจาก middleware รปภ. ที่เราเขียนไว้ในข้อ 1 ครับ
    const userId = req.user.id; 
    const profile = await getUserProfile(userId);
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}