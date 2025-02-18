const { ErrorHandler } = require("../Middlewares/error"); // Importing custom error handler
const Message = require("../Models/messageSchema"); // Importing Message model
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors"); // Importing async error handler middleware

// Controller to create a new message
exports.createMessage = catchAsyncErrors(async (req, res, next) => {
    const { senderName, senderEmail, subject, message } = req.body; // Destructuring request body

    // Check if all fields are provided
    if (!senderName || !senderEmail || !subject || !message) {
        return next(new ErrorHandler("Please fill in all fields" , 400)); // Return error if any field is missing
    }


    // Create a new message in the database
    const data = await Message.create({
        senderName,
        senderEmail,
        subject,
        message,
    });

    // Send success response
    res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data
    });
});

// Controller to get all messages with pagination
exports.getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
    const messages = await Message.find()
        .skip((page - 1) * limit) // Skip messages for pagination
        .limit(Number(limit)); // Limit the number of messages

    // Check if messages are found
    if (!messages.length) {
        return next(new ErrorHandler("No messages found" ,400)); // Return error if no messages found
    }

    // Send success response
    res.status(200).json({
        success: true,
        messages
    });
});

// Controller to get a message by ID
exports.getMessageById = catchAsyncErrors(async (req, res, next) => {
    const { messageId } = req.params; // Get message ID from request parameters
    if (!messageId) {
        return next(new ErrorHandler("Please provide a message id" ,400)); // Return error if message ID is not provided
    }
    const message = await Message.findById(messageId); // Find message by ID
    if (!message) {
        return next(new ErrorHandler("Message not found" ,400)); // Return error if message is not found
    }
    // Send success response
    res.status(200).json({
        success: true,
        message
    });
});

// Controller to delete a message by ID
exports.deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { messageId } = req.params; // Get message ID from request parameters
    if (!messageId) {
        return next(new ErrorHandler("Please provide a message id" , 400)); // Return error if message ID is not provided
    }
    await Message.findByIdAndDelete(messageId); // Delete message by ID
    // Send success response
    res.status(200).json({
        success: true,
        message: "Message deleted successfully"
    });
});

// Controller to delete all messages
exports.deleteAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.deleteMany(); // Delete all messages
    if (!messages) {
        return next(new ErrorHandler("No messages found" ,400)); // Return error if no messages found
    }
    // Send success response
    res.status(200).json({
        success: true,
        message: "All messages deleted successfully"
    });
});
