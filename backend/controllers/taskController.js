const Task = require('../models/Task');

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
            .populate('questions.replies.user', 'firstName lastName avatar rating');
        
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

        // Validate price against budget
        if (Number(price) >= task.budget) {
            return res.status(400).json({ message: 'Offer price must be less than the original budget' });
        }

        const offer = {
            user: req.user._id,
            price: Number(price),
            message
        };

        task.offers.push(offer);
        await task.save();

        res.status(201).json({ message: 'Offer added successfully' });
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

        // Check if offer exists
        const offer = task.offers.id(req.params.offerId);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        task.status = 'assigned';
        await task.save();

        res.json({ message: 'Offer accepted successfully', task });
    } catch (error) {
        console.error('Accept Offer Error:', error);
        res.status(500).json({ message: 'Server Error accepting offer' });
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

        res.status(201).json({ message: 'Reply added successfully' });
    } catch (error) {
        console.error('Add Question Reply Error:', error);
        res.status(500).json({ message: 'Server Error adding reply' });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    addOfferToTask,
    addQuestionToTask,
    getMyTasks,
    acceptOffer,
    replyToOffer,
    replyToQuestion
};
