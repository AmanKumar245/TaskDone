const User = require('../models/User');
const Task = require('../models/Task');
const generateToken = require('../utils/generateToken');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Get all users
// @route   GET /api/users
// @access  Public (for now)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            phone, 
            zipCode, 
            goal, 
            marketingConsent, 
            termsAccepted 
        } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Determine role based on goal
        // 'earn_money' -> tasker
        // 'get_things_done' -> customer
        let role = 'customer';
        if (goal === 'earn_money') {
            role = 'tasker';
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password, // Password is automatically hashed by the pre-save hook in the User model
            phone,
            zipCode,
            goal,
            marketingConsent,
            termsAccepted,
            role
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                goal: user.goal,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server Error during registration' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Update lastOnline
            user.lastOnline = new Date();
            await user.save();

            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                goal: user.goal,
                avatar: user.avatar,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error during login' });
    }
};

// @desc    Get public user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -email -phone -marketingConsent -termsAccepted')
            .populate('feedbacks.reviewer', 'firstName lastName avatar');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get task stats
        const totalPosted = await Task.countDocuments({ user: user._id });
        const totalCompleted = await Task.countDocuments({ 
            $or: [
                { user: user._id, status: 'completed' },
                { assignedTo: user._id, status: 'completed' }
            ]
        });
        const totalAssigned = await Task.countDocuments({ assignedTo: user._id });

        // Calculate completion rate
        const completionRate = totalAssigned > 0 
            ? Math.round((totalCompleted / totalAssigned) * 100) 
            : 0;

        // Get recent reviews (from feedbacks on the user)
        const reviews = user.feedbacks
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        // Get task titles for reviews
        const reviewTaskIds = reviews.map(r => r.task).filter(Boolean);
        const reviewTasks = await Task.find({ _id: { $in: reviewTaskIds } }).select('title');
        const taskMap = {};
        reviewTasks.forEach(t => { taskMap[t._id.toString()] = t.title; });

        const enrichedReviews = reviews.map(r => ({
            _id: r._id,
            rating: r.rating,
            comment: r.comment,
            reviewer: r.reviewer,
            taskTitle: r.task ? (taskMap[r.task.toString()] || '') : '',
            createdAt: r.createdAt,
        }));

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            about: user.about,
            location: user.location,
            education: user.education,
            workExperience: user.workExperience,
            portfolio: user.portfolio,
            rating: Number(avgRating),
            reviewCount: reviews.length,
            reviews: enrichedReviews,
            completionRate,
            tasksCompleted: totalCompleted,
            totalTasks: totalAssigned + totalPosted,
            lastOnline: user.lastOnline,
            isVerified: user.isVerified,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error('Get User Profile Error:', error);
        res.status(500).json({ message: 'Server Error fetching profile' });
    }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Text fields
        const { about, location, education, workExperience, firstName, lastName } = req.body;

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (about !== undefined) user.about = about;
        if (location !== undefined) user.location = location;

        // Education & work experience come as JSON strings from form-data
        if (education) {
            try {
                user.education = typeof education === 'string' ? JSON.parse(education) : education;
            } catch { user.education = [education]; }
        }
        if (workExperience) {
            try {
                user.workExperience = typeof workExperience === 'string' ? JSON.parse(workExperience) : workExperience;
            } catch { user.workExperience = [workExperience]; }
        }

        // Avatar upload
        if (req.files && req.files.avatar && req.files.avatar[0]) {
            const result = await uploadToCloudinary(req.files.avatar[0].buffer, 'taskdone/avatars');
            user.avatar = result.secure_url;
        }

        // Portfolio uploads (append to existing)
        if (req.files && req.files.portfolio && req.files.portfolio.length > 0) {
            const uploadPromises = req.files.portfolio.map(file =>
                uploadToCloudinary(file.buffer, 'taskdone/portfolio')
            );
            const results = await Promise.all(uploadPromises);
            const newUrls = results.map(r => r.secure_url);
            user.portfolio = [...user.portfolio, ...newUrls];
        }

        user.lastOnline = new Date();
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            avatar: updatedUser.avatar,
            about: updatedUser.about,
            location: updatedUser.location,
            education: updatedUser.education,
            workExperience: updatedUser.workExperience,
            portfolio: updatedUser.portfolio,
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server Error updating profile' });
    }
};

module.exports = {
    getUsers,
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};
