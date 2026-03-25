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
      },
      // 🔥 ไฮไลท์ใหม่: ให้ Database ช่วย "นับจำนวน" คนที่อยู่ในตี้มาให้ด้วยเลย!
      _count: {
        select: {
          participants: {
            where: { status: 'ACCEPTED' } // นับเฉพาะคนที่ Host กดยอมรับแล้วเท่านั้น
          }
        }
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

// ... โค้ด 4 ฟังก์ชันเดิมปล่อยไว้ ...

// 5. ฟังก์ชันสำหรับจัดการคนขอจอยตี้ (Host กดรับ/ปฏิเสธ)
export const manageParticipant = async (eventId, hostId, participantUserId, status) => {
  // ด่านที่ 1: เช็กก่อนว่าคนกดอนุมัติ เป็นเจ้าของตี้นี้จริงๆ ไหม
  const event = await prisma.activityEvent.findUnique({
    where: { id: eventId }
  });

  if (!event) throw new Error('ไม่พบข้อมูลตี้นี้');
  if (event.hostId !== hostId) throw new Error('คุณไม่ใช่เจ้าของตี้นี้ ไม่มีสิทธิ์จัดการคำขอครับ!');

  // ด่านที่ 2: เช็กว่า User คนที่จะจัดการ ได้กดขอจอยมาจริงๆ ไหม
  const participant = await prisma.eventParticipant.findFirst({
    where: { eventId: eventId, userId: participantUserId }
  });

  if (!participant) throw new Error('ไม่พบคำขอเข้าร่วมจากผู้ใช้งานคนนี้');

  // ถ้าผ่านทุกด่าน ก็อัปเดตสถานะได้เลย!
  const updatedParticipant = await prisma.eventParticipant.update({
    where: { id: participant.id },
    data: { status: status }
  });

  return updatedParticipant;
};

// ... โค้ดเดิมทั้งหมดปล่อยไว้ ...

// 6. ฟังก์ชันสำหรับลูกตี้กดออกจากตี้ หรือยกเลิกคำขอ
export const leaveEvent = async (eventId, userId) => {
  // เช็กก่อนว่าเคยกดจอยไว้จริงๆ ไหม
  const participant = await prisma.eventParticipant.findFirst({
    where: { eventId: eventId, userId: userId }
  });

  if (!participant) {
    throw new Error('คุณไม่ได้อยู่ในตี้นี้ หรือยังไม่ได้กดส่งคำขอครับ');
  }

  // ลบข้อมูลการจอยออกจาก Database
  await prisma.eventParticipant.delete({
    where: { id: participant.id }
  });

  return { message: "ยกเลิกการเข้าร่วมตี้สำเร็จ" };
};

// ... โค้ดฟังก์ชันเดิมทั้งหมดปล่อยไว้ ...

// 7. ฟังก์ชันสำหรับส่งคอมเมนต์
export const addComment = async (eventId, userId, message) => {
  // เช็กว่าตี้นี้ยังมีอยู่ไหม
  const event = await prisma.activityEvent.findUnique({ where: { id: eventId } });
  if (!event) throw new Error('ไม่พบข้อมูลตี้นี้');

  const comment = await prisma.comment.create({
    data: {
      message: message,
      eventId: eventId,
      userId: userId,
    },
    include: {
      // ดึงข้อมูลคนพิมพ์คอมเมนต์มาด้วย จะได้โชว์รูปกับชื่อในแชทได้
      user: { select: { id: true, name: true, profileImageUrl: true } }
    }
  });

  return comment;
};

// 8. ฟังก์ชันดึงคอมเมนต์ทั้งหมดของตี้นั้นมาโชว์
export const getCommentsByEvent = async (eventId) => {
  const comments = await prisma.comment.findMany({
    where: { eventId: eventId },
    orderBy: { createdAt: 'asc' }, // สำคัญ: เรียงจากเก่าไปใหม่ (บนลงล่างแบบแชทแอปทั่วไป)
    include: {
      user: { select: { id: true, name: true, profileImageUrl: true } }
    }
  });

  return comments;
};