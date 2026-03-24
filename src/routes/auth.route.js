import express from 'express';
import { register } from '../controllers/auth.controller.js';
import { registerSchema } from '../validations/auth.schema.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Path คือ /register (เมื่อรวมกับ prefix ใน app.js จะกลายเป็น /api/auth/register)
router.post('/register', validate(registerSchema), register);

export default router; 