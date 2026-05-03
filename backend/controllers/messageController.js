const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get all conversations for the logged-in user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id
        })
            .populate('participants', 'firstName lastName avatar')
            .populate('task', 'title budget status')
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (error) {
        console.error('Get Conversations Error:', error);
        res.status(500).json({ message: 'Server Error fetching conversations' });
    }
};

// @desc    Get all messages in a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is a participant
        const isParticipant = conversation.participants.some(
            (p) => p.toString() === req.user._id.toString()
        );

        if (!isParticipant) {
            return res.status(401).json({ message: 'Not authorized to view this conversation' });
        }

        const messages = await Message.find({ conversation: req.params.conversationId })
            .populate('sender', 'firstName lastName avatar')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({ message: 'Server Error fetching messages' });
    }
};

// @desc    Send a message (REST fallback)
// @route   POST /api/messages/:conversationId
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const conversation = await Conversation.findById(req.params.conversationId);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Check if user is a participant
        const isParticipant = conversation.participants.some(
            (p) => p.toString() === req.user._id.toString()
        );

        if (!isParticipant) {
            return res.status(401).json({ message: 'Not authorized to send messages in this conversation' });
        }

        const message = await Message.create({
            conversation: conversation._id,
            sender: req.user._id,
            text,
            readBy: [req.user._id],
        });

        // Update conversation's last message
        conversation.lastMessage = {
            text,
            sender: req.user._id,
            createdAt: new Date(),
        };
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'firstName lastName avatar');

        // Emit via Socket.IO if available
        const io = req.app.get('io');
        if (io) {
            io.to(`conversation_${conversation._id}`).emit('receive_message', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ message: 'Server Error sending message' });
    }
};

module.exports = {
    getConversations,
    getMessages,
    sendMessage,
};
