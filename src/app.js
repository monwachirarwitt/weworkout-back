// 1. การนำเข้าเครื่องมือและโมดูล (Imports)
import express from 'express'; // Framework หลักในการสร้าง Web API
import cors from 'cors'; // Middleware สำหรับจัดการเรื่องความปลอดภัยและการเข้าถึงจาก Domain ต่างๆ

// นำเข้า Router ของแต่ละฟีเจอร์ (แยกแผนกงานเพื่อให้โค้ดไม่อัดแน่นในไฟล์เดียว)
import authRoutes from './routes/auth.route.js'; // แผนกยืนยันตัวตน (Login/Register)
import userRoutes from './routes/user.route.js'; // แผนกจัดการข้อมูลผู้ใช้และโปรไฟล์
import eventRoutes from './routes/event.route.js'; // แผนกกิจกรรมกีฬา (หัวใจหลักของ WeWorkout)
import reviewRoutes from './routes/review.route.js'; // แผนกให้คะแนนและรีวิวเพื่อนร่วมตี้

// 2. การสร้าง Instance ของแอปพลิเคชัน
const app = express(); // สร้างตัวแปรแอปขึ้นมาเพื่อเริ่มตั้งค่าสารพัดประโยชน์

// 3. การติดตั้ง Middleware (พนักงานคัดกรองข้อมูลก่อนเข้าถึง Logic หลัก)
/**
 * app.use(cors()): 
 * หน้าที่: อนุญาตให้ Frontend (เช่นที่รันบน localhost:3000 หรือ Domain อื่น) 
 * ส่ง Request มาที่ Backend นี้ได้ ถ้าไม่ใส่หน้าบ้านจะโดน Browser บล็อกทันทีด้วยนโยบาย CORS
 */
app.use(cors()); 

/**
 * app.use(express.json()): 
 * หน้าที่: เป็น "เครื่องแปลภาษา" ข้อมูลที่ส่งมาในรูปแบบ JSON (Text) 
 * จะถูกแปลงเป็น JavaScript Object โดยอัตโนมัติ เพื่อให้เราเรียกใช้ผ่าน req.body ได้
 */
app.use(express.json()); 

// 4. การประกาศเส้นทาง (Route Registration)
/**
 * การทำ Prefixing (/api/...):
 * เรากำหนดว่า Request ที่ขึ้นต้นด้วย path เหล่านี้ จะถูกส่งต่อไปยัง Router ที่เกี่ยวข้อง
 * ข้อดี: จัดระเบียบได้ง่าย และสามารถเปลี่ยนเวอร์ชัน API ได้สะดวกในอนาคต
 */
app.use('/api/auth', authRoutes); 
app.use('/api/user', userRoutes); 
app.use('/api/event', eventRoutes); 
app.use('/api/review', reviewRoutes); 

// 5. ระบบตรวจสอบสถานะเบื้องต้น (Utility Route)
/**
 * GET /health:
 * หน้าที่: เอาไว้เช็กว่าระบบยังทำงานปกติไหม
 * โดยส่งค่ากลับไปเป็น JSON ง่ายๆ ไม่ต้องโหลดข้อมูลหนักๆ
 */
app.get('/health', (req, res) => {
  res.json({ success: true });
});

// 6. การส่งออกแอป (Export)
export default app; 
// ส่งก้อน app ที่ตั้งค่าเสร็จแล้วไปให้ server.js สั่งรัน