const express = require("express");
const skillRouter = express.Router();

const {
    createSkill,
    getSkills,
    getSkill,
    updateSkill,
    deleteSkill,
    } = require("../Controllers/skillController");
const authMiddleware = require("../Middlewares/authMiddleware");
skillRouter.route("/add-skill").post(authMiddleware ,createSkill);
skillRouter.route("/get-all-skills").get(getSkills);
skillRouter.route("/get-skill/:id").get(authMiddleware ,getSkill);
skillRouter.route("/update-skill/:id").put(authMiddleware ,updateSkill);
skillRouter.route("/delete-skill/:id").delete(authMiddleware ,deleteSkill);

module.exports = skillRouter;
