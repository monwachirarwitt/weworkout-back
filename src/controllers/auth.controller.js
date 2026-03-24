// Import necessary modules
import { registerUser } from "../services/auth.service.js";

/**
 * Controller to handle user registration
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export async function register(req, res) {
  try {
    const userData = req.body;
    const createdUser = await registerUser(userData);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}