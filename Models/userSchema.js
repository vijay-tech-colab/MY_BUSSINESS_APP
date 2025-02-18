const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please provide a username'],
        trim: true,
        maxlength: [20, 'Username cannot be more than 20 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password cannot be less than 6 characters'],
        select: false
    },
    phone : {
        type: String,
        required: [true, 'Please provide a phone number'],
        unique: true,
        trim: true,
        validate: [validator.isMobilePhone, 'Please provide a valid phone number']
    },
    aboutMe : {
        type: String,
        required: [true, 'Please provide a brief description about yourself'],
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    avatar : {
        public_id : {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    resume : {
        public_id : {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            default: 'user',
            message: 'Please select a valid role'
        },
        default: 'user'
    },
    socialLinks: {
        website: {
            type: String,
            trim: true
        },
        facebook: {
            type: String,
            trim: true
        },
        twitter: {
            type: String,
            trim: true
        },
        linkedin: {
            type: String,
            trim: true
        },
        github: {
            type: String,
            trim: true
        },
        instagram : {
            type: String,
            trim: true
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

userSchema.pre("save", async function (next) {
    const user = this;
    try {
        if(!user.isModified('password')){
            next();
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);
