require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Make io accessible in route handlers
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- Socket.IO Auth Middleware ---
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: No token'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }

        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid token'));
    }
});

// --- Socket.IO Events ---
io.on('connection', (socket) => {
    console.log(`🟢 User connected: ${socket.user.firstName} (${socket.user._id})`);

    // Join user's personal room for notifications
    socket.join(`user_${socket.user._id}`);
    // Join a conversation room
    socket.on('join_room', (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`  → ${socket.user.firstName} joined room: conversation_${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave_room', (conversationId) => {
        socket.leave(`conversation_${conversationId}`);
    });

    // Send a message
    socket.on('send_message', async ({ conversationId, text }) => {
        try {
            const conversation = await Conversation.findById(conversationId);
            if (!conversation) return;

            // Verify sender is a participant
            const isParticipant = conversation.participants.some(
                (p) => p.toString() === socket.user._id.toString()
            );
            if (!isParticipant) return;

            // Save message to DB
            const message = await Message.create({
                conversation: conversationId,
                sender: socket.user._id,
                text,
                readBy: [socket.user._id],
            });

            // Update conversation's last message
            conversation.lastMessage = {
                text,
                sender: socket.user._id,
                createdAt: new Date(),
            };
            await conversation.save();

            // Populate sender info
            const populatedMessage = await Message.findById(message._id)
                .populate('sender', 'firstName lastName avatar');

            // Broadcast to all in the room
            io.to(`conversation_${conversationId}`).emit('receive_message', populatedMessage);
        } catch (err) {
            console.error('Socket send_message error:', err);
        }
    });

    // Typing indicator
    socket.on('typing', ({ conversationId, isTyping }) => {
        socket.to(`conversation_${conversationId}`).emit('user_typing', {
            userId: socket.user._id,
            firstName: socket.user.firstName,
            isTyping,
        });
    });

    socket.on('disconnect', () => {
        console.log(`🔴 User disconnected: ${socket.user.firstName}`);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
