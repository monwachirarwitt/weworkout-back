import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number({ required_error: "กรุณาให้คะแนนรีวิว" })
      .min(1, "คะแนนต่ำสุดคือ 1 ดาว")
      .max(5, "คะแนนสูงสุดคือ 5 ดาว")
  })
});