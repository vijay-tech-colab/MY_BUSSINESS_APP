const express = require("express");
const messageRouter = express.Router();

const {
  createMessage,
  getAllMessages,
  deleteMessage,
  deleteAllMessages,
  getMessageById,
} = require("../Controllers/messageController");

const authMiddleware = require("../Middlewares/authMiddleware");

messageRouter.post("/send", createMessage);

messageRouter.get("/getall-messages", authMiddleware, getAllMessages);

messageRouter.get("/get-message/:messageId", authMiddleware, getMessageById);

messageRouter.delete(
  "/delete-message/:messageId",
  authMiddleware,
  deleteMessage
);

messageRouter.delete("/delete-all-messages", authMiddleware, deleteAllMessages);

module.exports = messageRouter;
