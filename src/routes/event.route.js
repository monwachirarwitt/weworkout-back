import express from 'express';
import { createNewEvent } from '../controllers/event.controller.js';
import { createEventSchema } from '../validations/event.schema.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// ต้องมี Token (authenticate) และข้อมูลต้องเป๊ะ (validate) ถึงจะสร้างตี้ได้
router.post('/', authenticate, validate(createEventSchema), createNewEvent);

export default router;