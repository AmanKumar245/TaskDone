const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        dateType: {
            type: String,
            required: true,
            enum: ['on_date', 'before_date', 'flexible'],
        },
        selectedDate: {
            type: String,
        },
        certainTime: {
            type: Boolean,
            default: false,
        },
        selectedTime: {
            type: String,
            enum: ['morning', 'midday', 'afternoon', 'evening', ''],
            default: '',
        },
        locationType: {
            type: String,
            required: true,
            enum: ['in_person', 'online'],
        },
        suburb: {
            type: String,
        },
        details: {
            type: String,
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['open', 'assigned', 'completed'],
            default: 'open',
        },
        images: [{
            type: String, // URLs to images if any
        }],
        offers: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User',
            },
            price: {
                type: Number,
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            replies: [{
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'User',
                },
                message: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                }
            }]
        }],
        questions: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User',
            },
            message: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            replies: [{
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'User',
                },
                message: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                }
            }]
        }],
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
