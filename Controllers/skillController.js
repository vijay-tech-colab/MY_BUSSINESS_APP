const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const {ErrorHandler} = require("../Middlewares/error");
const cloudinary = require("cloudinary");
const Skill = require("../Models/skillSchema");

exports.createSkill = catchAsyncErrors(async (req, res, next) => {
    const {title, proficiency} = req.body;
    if (!title || !proficiency) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }
    
    if(!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Please upload an image", 400));
    }
    const {image} = req.files;
    if(!image || !Object.keys(image).length || !image.mimetype.startsWith("image")) {
        return next(new ErrorHandler("Please upload a valid image file", 400));
    }

    if(image.size > process.env.MAX_IMAGE_SIZE) {
        return next(new ErrorHandler("Please upload an image less than 1mb", 400));
    }

    try {
        const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
            folder: "SKILLS",
            width: 150,
        });
        
        if(!result) {
            return next(new ErrorHandler("Something went wrong while uploading image", 500));
        }
    
        const skill = await Skill.create({
            title,
            proficiency,
            svg: {
                public_id: result.public_id,
                url: result.secure_url,
            }
        });

        res.status(201).json({
            success: true,
            skill,
            message: "Skill added successfully",
        });

    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getSkills = catchAsyncErrors(async (req, res, next) => {
    const skills = await Skill.find();
    if(!skills) {
        return next(new ErrorHandler("No skills found", 404));
    }
    res.status(200).json({
        success: true,
        skills,
    });
});

exports.getSkill = catchAsyncErrors(async (req, res, next) => {
    const skill = await Skill.findById(req.params.id);
    if(!skill) {
        return next(new ErrorHandler("Skill not found", 404));
    }
    res.status(200).json({
        success: true,
        skill,
    });
});

exports.updateSkill = catchAsyncErrors(async (req, res, next) => {
    const skill = await Skill.findById(req.params.id);
    const {title, proficiency} = req.body;
    const newSkill = {};
    if(!skill) {
        return next(new ErrorHandler("Skill not found", 404));
    }
    if(title) {
        newSkill.title = title;
    }
    if(proficiency) {
        newSkill.proficiency = proficiency;
    }
    if(req.files && req.files.image) {
        try {
            const deleteImage = await cloudinary.v2.uploader.destroy(skill.svg.public_id);
            if(!deleteImage) {
                return next(new ErrorHandler("Something went wrong while deleting image", 500));
            }
            const image = req.files.image;
            if(image.size > process.env.MAX_IMAGE_SIZE) {
                return next(new ErrorHandler("Please upload an image less than 1mb", 400));
            }
            if(!image || !Object.keys(image).length || !image.mimetype.startsWith("image")) {
                return next(new ErrorHandler("Please upload a valid image file", 400));
            }
            const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                folder: "SKILLS",
                width: 150,
            });
            if(!result) {
                return next(new ErrorHandler("Something went wrong while uploading image", 500));
            }
            newSkill.svg = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, newSkill, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        updatedSkill,
        message: "Skill updated successfully",
    });

});

exports.deleteSkill = catchAsyncErrors(async (req, res, next) => {
    const skill = await Skill.findById(req.params.id);
    if(!skill) {
        return next(new ErrorHandler("Skill not found", 404));
    }
    const deleteImage = await cloudinary.v2.uploader.destroy(skill.svg.public_id);
    if(!deleteImage) {
        return next(new ErrorHandler("Something went wrong while deleting image", 500));
    }
    await skill.deleteOne();
    res.status(200).json({
        success: true,
        message: "Skill deleted successfully",
    });
});

