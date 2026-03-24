import express from 'express';
import { updateProfile } from '../controllers/user.controller.js';
import { updateProfileSchema } from '../validations/user.schema.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// ต้องผ่านด่าน authenticate (มี Token) และด่าน validate (ข้อมูลตัวเลขถูกต้อง)
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;