import { createEvent, getAllEvents, getEventById, joinEvent } from '../services/event.service.js';

// 1. ฟังก์ชันสร้างตี้ใหม่ (Create Event)
export async function createNewEvent(req, res) {
  try {
    const hostId = req.user.id; 
    const eventData = req.body;

    const event = await createEvent(hostId, eventData);

    res.status(201).json({
      message: "ตั้งตี้สำเร็จแล้ว!",
      event: event
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 2. ฟังก์ชันดึงตี้ทั้งหมดไปโชว์หน้า Feed (Get All Events)
export async function getEvents(req, res) {
  try {
    const events = await getAllEvents();
    
    res.status(200).json({
      message: "ดึงข้อมูลตี้ทั้งหมดสำเร็จ",
      events: events
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 3. ฟังก์ชันดึงรายละเอียดตี้แบบเจาะจง (Get Single Event)
export async function getEvent(req, res) {
  try {
    const { id } = req.params; // รับ ID ของตี้มาจาก URL
    const event = await getEventById(id);
    
    res.status(200).json(event);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
// 4. ฟังก์ชันรับเรื่องขอจอยตี้
export async function joinExistingEvent(req, res) {
  try {
    const { id } = req.params; // รับ ID ตี้จาก URL
    const userId = req.user.id; // รับ ID คนกดจอย จาก Token (รปภ.)

    const result = await joinEvent(id, userId);

    res.status(200).json({
      message: "ส่งคำขอเข้าร่วมตี้สำเร็จ! (รอ Host อนุมัติ)",
      data: result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}