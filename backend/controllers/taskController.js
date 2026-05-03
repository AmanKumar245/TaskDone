const Task = require('../models/Task');
const Conversation = require('../models/Conversation');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const {
            title,
            dateType,
            selectedDate,
            certainTime,
            selectedTime,
            locationType,
            suburb,
            details,
            budget
        } = req.body;

        const task = new Task({
            user: req.user._id,
            title,
            dateType,
            selectedDate,
            certainTime,
            selectedTime,
            locationType,
            suburb,
            details,
            budget
        });

        const createdTask = await task.save();

        res.status(201).json(createdTask);
    } catch (error) {
        console.error('Task Creation Error:', error);
        res.status(500).json({ message: 'Server Error during task creation' });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('user', 'firstName lastName avatar rating').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Fetch Tasks Error:', error);
        res.status(500).json({ message: 'Server Error fetching tasks' });
    }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Public
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('user', 'firstName lastName avatar rating')
            .populate('offers.user', 'firstName lastName avatar rating')
            .populate('questions.user', 'firstName lastName avatar rating')
            .populate('offers.replies.user', 'firstName lastName avatar rating')
            .populate('questions.replies.user', 'firstName lastName avatar rating')
            .populate('assignedTo', 'firstName lastName avatar rating');
        
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Fetch Task Error:', error);
        res.status(500).json({ message: 'Server Error fetching task details' });
    }
};

// @desc    Add an offer to a task
// @route   POST /api/tasks/:id/offers
// @access  Private
const addOfferToTask = async (req, res) => {
    try {
        const { price, message } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.status !== 'open') {
            return res.status(400).json({ message: 'Task is no longer open for offers' });
        }

        // Validate price against budget
        if (Number(price) >= task.budget) {
            return res.status(400).json({ message: 'Offer price must be less than the original budget' });
        }

        // Check if user already has an offer on this task
        const existingOfferIndex = task.offers.findIndex(
            o => o.user.toString() === req.user._id.toString()
        );

        if (existingOfferIndex !== -1) {
            // Update existing offer
            task.offers[existingOfferIndex].price = Number(price);
            task.offers[existingOfferIndex].message = message;
            task.offers[existingOfferIndex].createdAt = new Date();
            await task.save();
            return res.json({ message: 'Offer updated successfully', updated: true });
        }

        // Create new offer
        const offer = {
            user: req.user._id,
            price: Number(price),
            message
        };

        task.offers.push(offer);
        await task.save();

        // Notify task owner about the new offer
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: task.user,
            sender: req.user._id,
            type: 'new_offer',
            task: task._id,
            message: `${req.user.firstName} made an offer of ₹${price} on your task "${task.title}"`,
        });

        res.status(201).json({ message: 'Offer added successfully', updated: false });
    } catch (error) {
        console.error('Add Offer Error:', error);
        res.status(500).json({ message: 'Server Error adding offer' });
    }
};

// @desc    Add a question to a task
// @route   POST /api/tasks/:id/questions
// @access  Private
const addQuestionToTask = async (req, res) => {
    try {
        const { message } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const question = {
            user: req.user._id,
            message
        };

        task.questions.push(question);
        await task.save();

        // Notify task owner about the new question
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: task.user,
            sender: req.user._id,
            type: 'new_question',
            task: task._id,
            message: `${req.user.firstName} asked a question on your task "${task.title}"`,
        });

        res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
        console.error('Add Question Error:', error);
        res.status(500).json({ message: 'Server Error adding question' });
    }
};

// @desc    Get logged in user's tasks
// @route   GET /api/tasks/myTasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id })
            .populate('user', 'firstName lastName avatar rating')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Fetch My Tasks Error:', error);
        res.status(500).json({ message: 'Server Error fetching my tasks' });
    }
};

// @desc    Get tasks assigned to logged in user (as a tasker)
// @route   GET /api/tasks/assignedToMe
// @access  Private
const getAssignedTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('user', 'firstName lastName avatar rating')
            .populate('assignedTo', 'firstName lastName avatar rating')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Fetch Assigned Tasks Error:', error);
        res.status(500).json({ message: 'Server Error fetching assigned tasks' });
    }
};

// @desc    Accept an offer on a task
// @route   PATCH /api/tasks/:id/offers/:offerId/accept
// @access  Private
const acceptOffer = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only the task owner can accept an offer
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to accept offers for this task' });
        }

        if (task.status !== 'open') {
            return res.status(400).json({ message: 'Task is no longer open for offers' });
        }

        // Check if offer exists
        const offer = task.offers.id(req.params.offerId);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        // 1. Create Conversation between poster & tasker
        const conversation = await Conversation.create({
            task: task._id,
            participants: [task.user, offer.user],
            lastMessage: {
                text: `Offer of ₹${offer.price} accepted. You can now chat!`,
                sender: task.user,
                createdAt: new Date(),
            }
        });

        // 2. Create Payment escrow record
        await Payment.create({
            task: task._id,
            poster: task.user,
            tasker: offer.user,
            amount: offer.price,
            status: 'held',
            heldAt: new Date(),
        });

        // 3. Update task status & assignment
        task.status = 'assigned';
        task.assignedTo = offer.user;
        task.acceptedOffer = { offerId: offer._id, price: offer.price };
        task.conversationId = conversation._id;
        await task.save();

        res.json({ message: 'Offer accepted successfully', task, conversationId: conversation._id });

        // Notify the tasker that their offer was accepted
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: offer.user,
            sender: task.user,
            type: 'offer_accepted',
            task: task._id,
            message: `Your offer on "${task.title}" has been accepted!`,
        });
    } catch (error) {
        console.error('Accept Offer Error:', error);
        res.status(500).json({ message: 'Server Error accepting offer' });
    }
};

// @desc    Tasker marks work as done
// @route   PATCH /api/tasks/:id/complete
// @access  Private
const markTaskComplete = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only the assigned tasker can mark complete
        if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Only the assigned tasker can mark this task as complete' });
        }

        if (task.status !== 'assigned') {
            return res.status(400).json({ message: 'Task must be in assigned status to mark complete' });
        }

        task.status = 'completed_pending';
        await task.save();

        // Notify the poster that the tasker marked task as complete
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: task.user,
            sender: req.user._id,
            type: 'task_completed',
            task: task._id,
            message: `${req.user.firstName} has marked "${task.title}" as complete. Please review and release payment.`,
        });

        res.json({ message: 'Task marked as complete, awaiting poster confirmation', task });
    } catch (error) {
        console.error('Mark Complete Error:', error);
        res.status(500).json({ message: 'Server Error marking task complete' });
    }
};

// @desc    Poster confirms completion & releases payment
// @route   PATCH /api/tasks/:id/release-payment
// @access  Private
const releasePayment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only the poster can release payment
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Only the task poster can release payment' });
        }

        if (task.status !== 'completed_pending') {
            return res.status(400).json({ message: 'Tasker must mark the task complete before payment can be released' });
        }

        // Update task status
        task.status = 'completed';
        await task.save();

        // Update payment record
        await Payment.findOneAndUpdate(
            { task: task._id },
            { status: 'released', releasedAt: new Date() }
        );

        res.json({ message: 'Payment released! Task completed.', task });

        // Notify the tasker that payment was released
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: task.assignedTo,
            sender: req.user._id,
            type: 'payment_released',
            task: task._id,
            message: `Payment has been released for "${task.title}". Well done!`,
        });
    } catch (error) {
        console.error('Release Payment Error:', error);
        res.status(500).json({ message: 'Server Error releasing payment' });
    }
};

// @desc    Reply to an offer
// @route   POST /api/tasks/:id/offers/:offerId/reply
// @access  Private
const replyToOffer = async (req, res) => {
    try {
        const { message } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const offer = task.offers.id(req.params.offerId);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        const reply = {
            user: req.user._id,
            message
        };

        offer.replies.push(reply);
        await task.save();

        // Notify the offer author about the reply
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: offer.user,
            sender: req.user._id,
            type: 'new_reply',
            task: task._id,
            message: `${req.user.firstName} replied to your offer on "${task.title}"`,
        });

        res.status(201).json({ message: 'Reply added successfully' });
    } catch (error) {
        console.error('Add Offer Reply Error:', error);
        res.status(500).json({ message: 'Server Error adding reply' });
    }
};

// @desc    Reply to a question
// @route   POST /api/tasks/:id/questions/:questionId/reply
// @access  Private
const replyToQuestion = async (req, res) => {
    try {
        const { message } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const question = task.questions.id(req.params.questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const reply = {
            user: req.user._id,
            message
        };

        question.replies.push(reply);
        await task.save();

        // Notify the question author about the reply
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: question.user,
            sender: req.user._id,
            type: 'new_reply',
            task: task._id,
            message: `${req.user.firstName} replied to your question on "${task.title}"`,
        });

        res.status(201).json({ message: 'Reply added successfully' });
    } catch (error) {
        console.error('Add Question Reply Error:', error);
        res.status(500).json({ message: 'Server Error adding reply' });
    }
};

// @desc    Add a review to a completed task
// @route   POST /api/tasks/:id/review
// @access  Private
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Only the poster can review
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Only the task poster can leave a review' });
        }

        // Task must be completed
        if (task.status !== 'completed') {
            return res.status(400).json({ message: 'Task must be completed before leaving a review' });
        }

        // Check if review already exists
        if (task.review && task.review.rating) {
            return res.status(400).json({ message: 'You have already reviewed this task' });
        }

        if (!task.assignedTo) {
            return res.status(400).json({ message: 'No tasker assigned to review' });
        }

        // Save review on task
        task.review = {
            rating: Number(rating),
            comment,
            reviewer: req.user._id,
            createdAt: new Date(),
        };
        await task.save();

        // Add feedback to tasker's user document
        const tasker = await User.findById(task.assignedTo);
        if (tasker) {
            tasker.feedbacks.push({
                rating: Number(rating),
                comment,
                task: task._id,
                reviewer: req.user._id,
                createdAt: new Date(),
            });

            // Recalculate average rating
            const totalRatings = tasker.feedbacks.reduce((sum, f) => sum + f.rating, 0);
            tasker.rating = Number((totalRatings / tasker.feedbacks.length).toFixed(1));
            tasker.tasksCompleted = (tasker.tasksCompleted || 0) + 1;

            await tasker.save();
        }

        res.status(201).json({ message: 'Review submitted successfully' });

        // Notify the tasker about the review
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: task.assignedTo,
            sender: req.user._id,
            type: 'new_review',
            task: task._id,
            message: `${req.user.firstName} left a ${rating}-star review on "${task.title}"`,
        });
    } catch (error) {
        console.error('Add Review Error:', error);
        res.status(500).json({ message: 'Server Error adding review' });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    addOfferToTask,
    addQuestionToTask,
    getMyTasks,
    getAssignedTasks,
    acceptOffer,
    markTaskComplete,
    releasePayment,
    replyToOffer,
    replyToQuestion,
    addReview
};
