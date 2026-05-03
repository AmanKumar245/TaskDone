const express = require('express');
const router = express.Router();
const {
    getConversations,
    getMessages,
    sendMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/conversations').get(protect, getConversations);
router.route('/:conversationId').get(protect, getMessages).post(protect, sendMessage);

module.exports = router;
