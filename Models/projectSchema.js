const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter project title"],
        trim: true,
        maxLength: [100, "Project title cannot exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please enter project description"],
    },
    projectLink: {
        type: String,
    },
    githubLink: {
        type: String,
    },
    projectImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    technologies: {
        type: [String],
    },
    stack: {
        type: String,
    },
    deployed: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Project", projectSchema);
