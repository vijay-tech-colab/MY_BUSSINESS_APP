const express = require("express");
const timeLineRouter = express.Router();

const {
  createTimeline,
  getTimelines,
  getTimeline,
  updateTimeline,
  deleteTimeline,
} = require("../Controllers/timelineController");
// const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/auth");
const authMiddleware = require("../Middlewares/authMiddleware");


timeLineRouter.route("/add-timeline").post(authMiddleware ,createTimeline);
timeLineRouter.route("/get-all-timelines").get(getTimelines);
timeLineRouter.route("/get-timeline/:id").get(authMiddleware ,getTimeline);
timeLineRouter.route("/update-timeline/:id").put(authMiddleware ,updateTimeline);
timeLineRouter.route("/delete-timeline/:id").delete(authMiddleware ,deleteTimeline);

module.exports = timeLineRouter;
