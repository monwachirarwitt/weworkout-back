import { giveReview, getUserReviews } from '../services/review.service.js';

export async function createReview(req, res) {
  try {
    const fromUserId = req.user.id; // คนที่กำลังล็อกอิน (คนให้ดาว)
    const { targetUserId } = req.params; // ID ของเพื่อนที่เราจะให้ดาว (รับจาก URL)
    const { rating } = req.body;

    const review = await giveReview(fromUserId, targetUserId, rating);
    res.status(201).json({ message: "ให้คะแนนรีวิวสำเร็จ!", data: review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getReviews(req, res) {
  try {
    const { userId } = req.params; // ID ของคนที่เราอยากดูโปรไฟล์/คะแนน
    const data = await getUserReviews(userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}