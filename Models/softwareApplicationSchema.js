const mongoose = require('mongoose');

const softwareApplicationSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please enter software application title'],
        trim: true,
        maxLength: [100, 'Software application title cannot exceed 100 characters']
    },
    svg : {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SoftwareApplication = mongoose.model('SoftwareApplication', softwareApplicationSchema);
module.exports = SoftwareApplication;