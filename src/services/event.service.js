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
export const getAllEvents = async () => {
  const events = await prisma.activityEvent.findMany({
    orderBy: {
      createdAt: 'desc', // เรียงจากตี้ที่เพิ่งสร้างล่าสุดขึ้นก่อน
    },
    include: {
      host: { // ดึงข้อมูลเจ้าของตี้มาด้วย
        select: { id: true, name: true, profileImageUrl: true }
      }
    }
  });

  return events;
};

// 3. ฟังก์ชันดึงตี้แบบเจาะจงด้วย ID
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

// 4. ฟังก์ชันสำหรับกดเข้าร่วมตี้ (Join Event)
export const joinEvent = async (eventId, userId) => {
  // เช็ก 1: หาตี้ให้เจอก่อน พร้อมดึงข้อมูลคนจอยมานับจำนวน
  const event = await prisma.activityEvent.findUnique({
    where: { id: eventId },
    include: { participants: true }
  });

  if (!event) throw new Error('ไม่พบข้อมูลตี้นี้');

  // เช็ก 2: เจ้าของตี้ไม่ต้องกดจอยตี้ตัวเอง
  if (event.hostId === userId) {
    throw new Error('คุณเป็นเจ้าของตี้นี้อยู่แล้วครับ');
  }

  // เช็ก 3: ตี้เต็มหรือยัง (เทียบจำนวนคนจอย กับ maxParticipants)
  if (event.participants.length >= event.maxParticipants) {
    throw new Error('ขออภัยครับ ตี้นี้คนเต็มแล้ว');
  }

  // เช็ก 4: เคยกดจอยไปแล้วหรือยัง
  const existingParticipant = await prisma.eventParticipant.findFirst({
    where: { userId: userId, eventId: eventId }
  });

  if (existingParticipant) {
    throw new Error('คุณเคยกดส่งคำขอเข้าร่วมตี้นี้ไปแล้วครับ');
  }

  // ถ้าผ่านทุกด่าน ก็สร้างใบสมัครเข้าร่วมตี้ได้เลย (สถานะเริ่มต้นจะเป็น PENDING รอเจ้าของอนุมัติ)
  const participation = await prisma.eventParticipant.create({
    data: {
      userId: userId,
      eventId: eventId,
    }
  });

  return participation;
};