import { createEvent } from '../services/event.service.js';

export async function createNewEvent(req, res) {
  try {
    const hostId = req.user.id; // ได้มาจากรปภ. (authenticate middleware)
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