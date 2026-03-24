import { prisma } from '../lib/prisma.js';

// 1. ฟังก์ชันสำหรับสร้างตี้ใหม่
export const createEvent = async (hostId, eventData) => {
  const newEvent = await prisma.activityEvent.create({
    data: {
      ...eventData,
      hostId: hostId, // เอา ID ของคนที่ล็อกอินอยู่มาเป็นเจ้าของตี้
    },
  });

  return newEvent;
};

// 2. ฟังก์ชันสำหรับดึงรายการตี้ทั้งหมด (หน้า Feed)
// เพิ่มฟังก์ชันดึงตี้ตาม ID
export const getEventById = async (eventId) => {
  const event = await prisma.activityEvent.findUnique({
    where: { id: eventId },
    include: {
      host: { // ดึงข้อมูลเจ้าของตี้มาด้วย
        select: { id: true, name: true, profileImageUrl: true }
      },
      participants: { // ดึงรายชื่อคนที่ขอจอยตี้มาโชว์ด้วย
        include: {
          user: { select: { id: true, name: true, profileImageUrl: true } }
        }
      }
    }
  });

  if (!event) {
    throw new Error('ไม่พบข้อมูลตี้นี้ (อาจจะถูกลบไปแล้ว)');
  }

  return event;
};