# WeWorkout-API 🏋️‍♂️
แอปพลิเคชัน Backend สำหรับระบบหาเพื่อนเล่นกีฬา (Matchmaking) และสังคมคนรักสุขภาพ

### 🔑 env guide (การตั้งค่าระบบ)
สร้างไฟล์ `.env` ไว้ที่ Root ของโปรเจกต์:
- PORT=8000
- DATABASE_URL=mysql://root:password@localhost:3306/weworkout002
- JWT_SECRET=weworkout_2026_secret

---

### 🚀 การเริ่มใช้งาน (Quick Start)
1. ติดตั้ง Library พื้นฐาน: `npm install`
2. อัปเดตฐานข้อมูล (Sync Schema): `npx prisma db push`
3. รันเซิร์ฟเวอร์โหมดพัฒนา: `npm run dev`

---

### 📑 รายการ API (Endpoints) - Master Plan

#### 1. ระบบจัดการโปรไฟล์และเข้าสู่ระบบ (Auth & Profile)
| Path | Method | Authen | Body | ความหมาย |
| :--- | :--- | :---: | :--- | :--- |
| `/api/auth/register` | POST | - | `{ email, password, name, gender }` | สมัครสมาชิกใหม่ |
| `/api/auth/login` | POST | - | `{ email, password }` | เข้าสู่ระบบเพื่อรับ Token |
| `/api/auth/me` | GET | Y | - | ดูข้อมูลโปรไฟล์ตัวเอง |
| `/api/user/profile` | PUT | Y | `{ weight, height, medicalNotes, bio, profileImageUrl }` | อัปเดตข้อมูลสุขภาพและโปรไฟล์ |

#### 2. ระบบตั้งตี้กีฬา (Activity Event Management)
| Path | Method | Authen | Body | ความหมาย |
| :--- | :--- | :---: | :--- | :--- |
| `/api/event` | POST | Y | `{ title, location, eventDate, startTime, endTime, category, maxParticipants }` | สร้างนัดเล่นกีฬา (ตั้งตี้) |
| `/api/event` | GET | Y | - | ดูรายการนัดเล่นกีฬาทั้งหมด |
| `/api/event/:id` | GET | Y | - | ดูรายละเอียดของตี้แบบเจาะจง |
| `/api/event/:id` | PUT | Y | `{ title, location, eventDate... }` | เจ้าของแก้ไขรายละเอียดตี้ |
| `/api/event/:id` | DELETE | Y | - | เจ้าของขอยกเลิกตี้ |

#### 3. ระบบขอเข้าร่วมและคัดกรอง (Matchmaking & Participation)
| Path | Method | Authen | Body | ความหมาย |
| :--- | :--- | :---: | :--- | :--- |
| `/api/event/:eventId/join` | POST | Y | - | ผู้ใช้กดขอเข้าร่วมตี้ (สถานะ PENDING) |
| `/api/event/:eventId/participants/:userId` | PATCH | Y | `{ status: "ACCEPTED" หรือ "REJECTED" }` | เจ้าของตี้กดยืนยันหรือปฏิเสธคนขอจอย |
| `/api/event/:eventId/leave` | DELETE | Y | - | ผู้ใช้ขอถอนตัวออกจากตี้ |

#### 4. ระบบคอมมูนิตี้พูดคุย (Event Community & Comments)
| Path | Method | Authen | Body | ความหมาย |
| :--- | :--- | :---: | :--- | :--- |
| `/api/event/:eventId/comment` | GET | Y | - | โหลดแชท/คอมเมนต์ในตี้นั้นๆ |
| `/api/event/:eventId/comment` | POST | Y | `{ message }` | พิมพ์ข้อความคุยกันในตี้ |
| `/api/comment/:id` | DELETE | Y | - | ลบคอมเมนต์ของตัวเอง |

#### 5. ระบบรีวิวความน่าเชื่อถือ (Trust & Review System)
| Path | Method | Authen | Body | ความหมาย |
| :--- | :--- | :---: | :--- | :--- |
| `/api/user/:userId/review` | GET | Y | - | ดูคะแนนความประพฤติของ User คนนี้ |
| `/api/user/:userId/review` | POST | Y | `{ rating }` | ให้คะแนนเพื่อนร่วมทีมหลังเล่นเสร็จ |