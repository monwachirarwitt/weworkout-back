import { registerUser } from '../services/auth.service.js';

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