import express from 'express';
import cors from 'cors';

const app = express();

// Import auth routes
import authRoutes from "./routes/auth.route.js";

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true });
});

// Mount auth routes
app.use("/api/auth", authRoutes);

export default app;