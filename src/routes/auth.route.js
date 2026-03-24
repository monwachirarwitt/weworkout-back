// Import necessary modules
import express from "express";
import { validate } from "../middleware/validate.js";
import { register } from "../controllers/auth.controller.js";
import { registerSchema } from "../validations/auth.schema.js";

const router = express.Router();

// POST /register route
router.post("/register", validate(registerSchema), register);

export default router;