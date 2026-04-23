const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        goal: {
            type: String, // 'get_things_done' or 'earn_money'
        },
        marketingConsent: {
            type: Boolean,
            default: false,
        },
        termsAccepted: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['customer', 'tasker', 'admin'],
            default: 'customer'
        },
        avatar: {
            type: String,
            default: ''
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }],
        rating: {
            type: Number,
            default: 0
        },
        feedbacks: [{
            rating: { type: Number, required: true },
            comment: { type: String },
            reviewer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            createdAt: { type: Date, default: Date.now }
        }]
    },
    {
        timestamps: true,
    }
);

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hook to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
