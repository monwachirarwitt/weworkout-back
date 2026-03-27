// src/middleware/validate.js
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    // แก้ตรงนี้ครับ: เช็กว่า error เป็นของ Zod ไหม จะได้จับโยนข้อความออกไปสวยๆ
    if (error.errors) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      return res.status(400).json({ error: errorMessage });
    }
    // ถ้าพังอย่างอื่น
    return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
  }
};