const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter skill name"],
        trim: true,
        maxLength: [50, "Skill name cannot exceed 50 characters"],
    },
    proficiency: {
        type: String,
        // required: [true, "Please enter skill proficiency"],
        // enum: {
        //     values: [
        //         "Beginner",
        //         "Intermediate",
        //         "Advanced",
        //         "Expert",
        //     ],
        //     message: "Please select correct skill proficiency",
        // },
    },
    svg: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Skill", skillSchema);
