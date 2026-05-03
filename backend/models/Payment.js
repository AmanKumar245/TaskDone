const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Task',
        },
        poster: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        tasker: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['held', 'released', 'refunded'],
            default: 'held',
        },
        heldAt: {
            type: Date,
            default: Date.now,
        },
        releasedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
