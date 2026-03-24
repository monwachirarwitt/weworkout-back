import { loginUser, registerUser } from '../services/auth.service.js';

export async function register(req, res) {
  try {
    const userData = req.body;
    const createdUser = await registerUser(userData);
    
    // ส่งสถานะ 201 กลับไปเมื่อสร้างสำเร็จ
    res.status(201).json(createdUser);
  } catch (error) {
    // กรณี Error เช่น อีเมลซ้ำ หรือ Database มีปัญหา
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