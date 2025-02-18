const express = require("express");
const softwareApplicationRouter = express.Router();

const {
    createSoftwareApplication,
    getSoftwareApplications,
    getSoftwareApplication,
    updateSoftwareApplication,
    deleteSoftwareApplication,
    } = require("../Controllers/softwareApplicationController");
const authMiddleware = require("../Middlewares/authMiddleware");

softwareApplicationRouter.route("/add-softwareapplication").post(authMiddleware ,createSoftwareApplication);
softwareApplicationRouter.route("/get-all-softwareapplications").get(getSoftwareApplications);
softwareApplicationRouter.route("/get-softwareapplication/:id").get(authMiddleware ,getSoftwareApplication);
softwareApplicationRouter.route("/update-softwareapplication/:id").put(authMiddleware ,updateSoftwareApplication);
softwareApplicationRouter.route("/delete-softwareapplication/:id").delete(authMiddleware ,deleteSoftwareApplication);

module.exports = softwareApplicationRouter;