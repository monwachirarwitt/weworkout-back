import express from 'express';
import { createReview, getReviews } from '../controllers/review.controller.js';
import { createReviewSchema } from '../validations/review.schema.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// 1. กดให้ดาวเพื่อน (ต้องมี Token และคะแนนต้องเป็น 1-5)
router.post('/:targetUserId', authenticate, validate(createReviewSchema), createReview);

// 2. เข้าไปดูดาวของใครสักคน
router.get('/:userId', authenticate, getReviews);

export default router;