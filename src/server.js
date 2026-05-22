import 'dotenv/config';
import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = 8000;

// Create HTTP server manually to bind Socket.IO
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins for development
  }
});

// Set 'io' on the app object so we can access it inside controllers
app.set('io', io);

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // When a client requests to join an event room
  socket.on('join_room', (eventId) => {
    socket.join(eventId);
    console.log(`[Socket] User ${socket.id} joined room: ${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});