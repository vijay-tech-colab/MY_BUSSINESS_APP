const express = require("express");
const userRouter = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  getUserForPortfolio,
  forgotPassword,
  resetPassword
} = require("../Controllers/userController");

const authMiddleware = require("../Middlewares/authMiddleware");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", authMiddleware, logoutUser);
userRouter.get("/me", authMiddleware, getUserProfile);
userRouter.put("/update-profile", authMiddleware, updateUserProfile);
userRouter.put("/update-password", authMiddleware, updateUserPassword);
userRouter.post('/forget-password',forgotPassword);
userRouter.post('/reset-password/:token',resetPassword);
userRouter.get("/get-user", getUserForPortfolio);
module.exports = userRouter;
