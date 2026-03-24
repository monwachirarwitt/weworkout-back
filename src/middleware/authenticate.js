import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    // 1. รับ Token จาก Header (รูปแบบต้องเป็น: Bearer eyJhbGci...)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "กรุณาเข้าสู่ระบบ (ไม่มี Token หรือรูปแบบผิด)" });
    }

    // 2. ตัดคำว่า Bearer ออก เอาแค่ตัว Token ยึกยือๆ มา
    const token = authHeader.split(' ')[1];

    // 3. ถอดรหัสและตรวจสอบ Token ด้วยกุญแจลับของเรา
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. ฝังข้อมูล user (เช่น id, email) ลงไปใน Request เพื่อให้โค้ดส่วนต่อไปรู้ว่าใครกำลังใช้งานอยู่
    req.user = decoded;
    
    next(); // บัตรผ่านของจริง เชิญผ่านด่านได้!
  } catch (error) {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};