const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const { ErrorHandler } = require("../Middlewares/error");
const User = require("../Models/userSchema");
const cloudinary = require("cloudinary");
const sendToken = require("../Utils/sendToken");
const sendEmail = require("../Utils/sendEmail");
const crypto = require('crypto');

// Register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const {
        fullname,
        email,
        password,
        phone,
        aboutMe,
        website,
        facebook,
        twitter,
        linkedin,
        github,
        instagram,
        role,
    } = req.body;

    // tempFilePath

    if (!fullname || !email || !password || !phone || !aboutMe) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Please upload avatar and resume", 400));
    }
    const { avatar, resume } = req.files;
    console.log(avatar)
    // if (
    //     avatar.size > process.env.MAX_AVATAR_SIZE ||
    //     resume.size > process.env.MAX_RESUME_SIZE
    // ) {
    //     return next(
    //         new ErrorHandler("Please upload an avatar image less than 1mb and resume less than 1mb", 400)
    //     );
    // }
    // Validate avatar
    if (!avatar || !Object.keys(avatar).length || !avatar.mimetype.startsWith("image")) {
        return next(new ErrorHandler("Please upload a valid avatar file", 400));
    }
    // Validate resume
    if (!resume || !Object.keys(resume).length || !resume.mimetype.startsWith("application")) {
        return next(new ErrorHandler("Please upload a valid resume file", 400));
    }

    // Upload avatar to cloudinary
    const resultForAvatar = await cloudinary.v2.uploader.upload(avatar.tempFilePath, {
        folder: "AVATAR",
        width: 150
    });

    if (!resultForAvatar) {
        return next(new ErrorHandler("Something went wrong while uploading avatar", 500));
    }



    // Upload resume to cloudinary
    const resultForResume = await cloudinary.v2.uploader.upload(resume.tempFilePath, {
        folder: "RESUME"
    });

    if (!resultForResume) {
        return next(new ErrorHandler("Something went wrong while uploading resume", 500));
    }

    // Create user
    const user = await User.create({
        fullname,
        email,
        password,
        phone,
        aboutMe,
        avatar: {
            public_id: resultForAvatar.public_id,
            url: resultForAvatar.secure_url,
        },
        resume: {
            public_id: resultForResume.public_id,
            url: resultForResume.secure_url,
        },
        role,
        socialLinks: {
            website,
            facebook,
            twitter,
            linkedin,
            github,
            instagram,
        }
    });
    sendToken(res, user, 201, "User registered successfully");
});


exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(res, user, 200, "User logged in successfully");
});


exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    console.log(req.user);
    const user = await User.findById(req.user._id);
    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user
    });
});

exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        socialLinks: {
            website: req.body.website,
            facebook: req.body.facebook,
            twitter: req.body.twitter,
            linkedin: req.body.linkedin,
            github: req.body.github,
            instagram: req.body.instagram,
        }
    };

    // Update avatar
    if (req.files && req.files.avatar) {
        const user = await User.findById(req.user._id);
        const image_id = user.avatar.public_id;
        // Delete user previous avatar
        await cloudinary.v2.uploader.destroy(image_id);
        // Upload new avatar
        const result = await cloudinary.v2.uploader.upload(req.files.avatar.tempFilePath, {
            folder: "AVATAR",
            width: 150
        });
        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }

    // Update resume
    if (req.files && req.files.resume) {
        const user = await User.findById(req.user._id);
        const image_id = user.resume.public_id;
        // Delete user previous resume
        await cloudinary.v2.uploader.destroy(image_id);
        // Upload new resume
        const result = await cloudinary.v2.uploader.upload(req.files.resume.tempFilePath, {
            folder: "RESUME"
        });
        newUserData.resume = {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});


exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword , confirmPassword} = req.body;
    if(!oldPassword || !newPassword || !confirmPassword){
        return next(new ErrorHandler("Please fill the all form", 404));
    }
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect oldpassword Password !", 400));
    }
    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("New password and confirm password Do not match", 400));
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

exports.getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
    const id = "67ac97888e486e4b592e3617";

    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user
    });
});


exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.CORS_ORIGIN_DASHBOARD_URL}/password/reset/${resetToken}`;

    try {
        const options = {
            to: user.email,
            message: `Your reset password token is \n\n ${resetPasswordUrl}`,
            subject: "Reset Password!",
        };
        await sendEmail(options);
        res.status(200).json({
            success: true,
            message: "Reset token sent successfully to your email",
            resetPasswordUrl
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new ErrorHandler(error.message , 500));
    }
});


exports.resetPassword = catchAsyncErrors(async (req,res,next) => {
    const token = req.params.token;
    const {newPassword,confirmPassword} = req.body; 
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    if(!newPassword || !confirmPassword ){
        return next(new ErrorHandler("Enter new and confirm password" , 400));
    }
    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("New password and confirm password Do not match", 400));
    }

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire  : {$gt : Date.now() }
    });

    if(!user){
        return next(new ErrorHandler("reset password token is invalid" , 400));
    }
    
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(res,user,200,"Password reset successfully");
})
