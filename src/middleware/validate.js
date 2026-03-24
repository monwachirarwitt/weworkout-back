export const validate = (schema) => (req, res, next) => {
  try {
    // ให้ Zod ตรวจสอบข้อมูลที่เข้ามา
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next(); // ถ้าผ่านด่าน ให้ไปทำงานโค้ดส่วนต่อไปได้เลย
  } catch (error) {
    // ถ้าไม่ผ่าน ให้ดึงข้อความ Error ที่เราตั้งไว้ใน Schema ส่งกลับไป
    return res.status(400).json({
      message: "ข้อมูลไม่ถูกต้อง",
      errors: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }
};