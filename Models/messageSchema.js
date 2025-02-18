const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: true,
        minlength: [3, 'Name must be at least 3 characters long'],
    },
    senderEmail: {
        type: String,
        required: true,
        validate: {
            validator: (email) => {
                const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                return emailRegex.test(email);
            },
            message: 'Invalid email format',
        },
    },
    subject: {
        type: String,
        required: true,
        minlength: [3, 'Subject must be at least 3 characters long'],
    },
    message: {
        type: String,
        required: true,
        minlength: [10, 'Message must be at least 10 characters long'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
