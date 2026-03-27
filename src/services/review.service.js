import { prisma } from '../lib/prisma.js';

// 1. ฟังก์ชันกดให้ดาวเพื่อน
export const giveReview = async (fromUserId, toUserId, rating) => {
  // เช็ก 1: ห้ามรีวิวให้ตัวเอง!
  if (fromUserId === toUserId) {
    throw new Error("คุณไม่สามารถให้คะแนนรีวิวตัวเองได้ครับ");
  }

  // เช็ก 2: คนที่จะรีวิวให้ มีตัวตนในระบบไหม
  const targetUser = await prisma.user.findUnique({ where: { id: toUserId } });
  if (!targetUser) throw new Error("ไม่พบผู้ใช้งานนี้ในระบบ");

  // บันทึกคะแนนลง Database
  const review = await prisma.review.create({
    data: {
      fromUserId: fromUserId,
      toUserId: toUserId,
      rating: rating
    }
  });

  return review;
};

// 2. ฟังก์ชันดึงคะแนนรีวิวและคำนวณดาวเฉลี่ยของคนคนนั้น
export const getUserReviews = async (userId) => {
  const reviews = await prisma.review.findMany({
    where: { toUserId: userId },
    include: {
      fromUser: { select: { id: true, name: true, profileImageUrl: true } } // ดึงข้อมูลคนให้คะแนนมาด้วย
    },
    orderBy: { createdAt: 'desc' }
  });

  // ระบบคำนวณดาวเฉลี่ย (Average Rating)
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

  return {
    averageRating: parseFloat(averageRating),
    totalReviews: reviews.length, // จำนวนคนที่เคยมารีวิวให้
    reviews: reviews
  };
};