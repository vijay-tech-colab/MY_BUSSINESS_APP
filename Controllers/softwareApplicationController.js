const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const SoftwareApplication = require("../Models/softwareApplicationSchema");
const {ErrorHandler} = require("../Middlewares/error");
const cloudinary = require("cloudinary");

// Create new software application => /api/v1/add-softwareApplication

exports.createSoftwareApplication = catchAsyncErrors(async (req, res, next) => {
    const {name} = req.body;
    if (!name) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }
    
    if(!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Please upload an image", 400));
    }
    const {image} = req.files;
    if(image.size > process.env.MAX_IMAGE_SIZE) {
        return next(new ErrorHandler("Please upload an image less than 1mb", 400));
    }
    if(!image || !Object.keys(image).length || !image.mimetype.startsWith("image")) {
        return next(new ErrorHandler("Please upload a valid image file", 400));
    }
    const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
        folder: "SOFTWARE_APPLICATION",
        width: 150,
    });
    if(!result) {
        return next(new ErrorHandler("Something went wrong while uploading image", 500));
    }

    const softwareApplication = await SoftwareApplication.create({
        name,
        svg: {
            public_id: result.public_id,
            url: result.secure_url,
        }
    });
    res.status(201).json({
        success: true,
        softwareApplication,
        message: "Software application added successfully",
    });
});
exports.getSoftwareApplications = catchAsyncErrors(async (req, res, next) => {
    const softwareApplications = await SoftwareApplication.find();
    if(!softwareApplications) {
        return next(new ErrorHandler("No software applications found", 404));
    }
    res.status(200).json({
        success: true,
        softwareApplications,
    });

});
exports.getSoftwareApplication = catchAsyncErrors(async (req, res, next) => {
    const softwareApplication = await SoftwareApplication.findById(req.params.id);
    if(!softwareApplication) {
        return next(new ErrorHandler("Software application not found", 404));
    }
    res.status(200).json({
        success: true,
        softwareApplication,
    });
});
exports.updateSoftwareApplication = catchAsyncErrors(async (req, res, next) => {
    const softwareApplication = await SoftwareApplication.findById(req.params.id);
    const {name} = req.body;
    const newSoftwareApplication = {};
    if(name) {
        newSoftwareApplication.name = name;
    }

    if(!softwareApplication) {
        return next(new ErrorHandler("Software application not found", 404));
    }
    if(req.files && req.files.image) {
        try {
            const deleteImage = await cloudinary.v2.uploader.destroy(softwareApplication.svg.public_id);
        if(!deleteImage) {
            return next(new ErrorHandler("Something went wrong while deleting image", 500));
        }
        const {image} = req.files;
        if(image.size > process.env.MAX_IMAGE_SIZE) {
            return next(new ErrorHandler("Please upload an image less than 1mb", 400));
        }
        if(!image || !Object.keys(image).length || !image.mimetype.startsWith("image")) {
            return next(new ErrorHandler("Please upload a valid image file", 400));
        }
        const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
            folder: "SOFTWARE_APPLICATION",
            width: 150,
        });
        if(!result) {
            return next(new ErrorHandler("Something went wrong while uploading image", 500));
        }
        newSoftwareApplication.svg = {
            public_id: result.public_id,
            url: result.secure_url,
        };
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
    const updatedSoftwareApplication = await SoftwareApplication.findByIdAndUpdate(req.params.id, newSoftwareApplication, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Software application updated successfully",
        updatedSoftwareApplication,
    });
});
exports.deleteSoftwareApplication = catchAsyncErrors(async (req, res, next) => {
    const softwareApplication = await SoftwareApplication.findById(req.params.id);
    if(!softwareApplication){
        return next(new ErrorHandler("software application not found !"));
    }
    try {
        const deleteImage = await cloudinary.v2.uploader.destroy(softwareApplication.svg.public_id);
        if(!deleteImage) {
            return next(new ErrorHandler("Something went wrong while deleting image", 500));
        }
        await softwareApplication.deleteOne();
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }

    res.status(200).json({
        success: true,
        message: "Software application deleted successfully",
    });
});

