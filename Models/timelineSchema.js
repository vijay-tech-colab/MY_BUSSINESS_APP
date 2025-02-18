const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter timeline title'],
        trim: true,
        maxLength: [100, 'Timeline title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter timeline description'],
        maxLength: [500, 'Timeline description cannot exceed 500 characters']
    },
    startDate: {
        type: String,
        required: [true, 'Please enter timeline start date'],
    },
    endDate: {
        type: String,
        required: [true, 'Please enter timeline end date'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Timeline = mongoose.model('Timeline', timelineSchema);
module.exports = Timeline;