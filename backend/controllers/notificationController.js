const Notification = require('../models/Notification');

// @desc    Get notifications for logged in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'firstName lastName avatar')
            .populate('task', 'title')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(notifications);
    } catch (error) {
        console.error('Fetch Notifications Error:', error);
        res.status(500).json({ message: 'Server Error fetching notifications' });
    }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            read: false,
        });
        res.json({ count });
    } catch (error) {
        console.error('Unread Count Error:', error);
        res.status(500).json({ message: 'Server Error getting unread count' });
    }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark Read Error:', error);
        res.status(500).json({ message: 'Server Error marking notification' });
    }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { read: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark All Read Error:', error);
        res.status(500).json({ message: 'Server Error marking all notifications' });
    }
};

// Helper: create notification and emit via socket
const createNotification = async (io, { recipient, sender, type, task, message }) => {
    try {
        // Don't notify yourself
        if (recipient.toString() === sender.toString()) return null;

        const notification = await Notification.create({
            recipient,
            sender,
            type,
            task,
            message,
        });

        const populated = await Notification.findById(notification._id)
            .populate('sender', 'firstName lastName avatar')
            .populate('task', 'title');

        // Emit real-time notification to the recipient
        if (io) {
            io.to(`user_${recipient}`).emit('new_notification', populated);
        }

        return populated;
    } catch (error) {
        console.error('Create Notification Error:', error);
        return null;
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
};
