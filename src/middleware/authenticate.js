import jwt from 'jsonwebtoken'; 

export const authenticate = (req, res, next) => {
  try {
    // 1. รับ Token จาก Header (รูปแบบต้องเป็น: Bearer eyJhbGci...)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {        
      return res.status(401).json({ message: "กรุณาเข้าสู่ระบบ (ไม่มี Token หรือรูปแบบผิด)" });
    }

// 2. แกะบัตร: ตัดคำว่า "Bearer " ออกเพื่อเอาแต่ตัว Token จริงๆ
    const token = authHeader.split(' ')[1];

// 3. ตรวจตราประทับ: ใช้ JWT_SECRET ของเราพิสูจน์ว่าเป็นของจริงไหม
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 4. ระบุตัวตน: ฝังข้อมูล User (id, email) ไว้ในตัวแปร req.user
    // เพื่อให้ Controller ที่อยู่ด่านต่อไปหยิบไปใช้ง่ายๆ
    req.user = decoded;
    
    next(); // บัตรผ่านของจริง เชิญผ่านด่านได้!
  } catch (error) {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};


