const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const { ErrorHandler } = require("../Middlewares/error");
const Timeline = require("../Models/timelineSchema");

// Create new timeline => /api/v1/add-timeline

exports.createTimeline = catchAsyncErrors(async (req, res, next) => {
    const { title, description, startDate, endDate } = req.body;
    if (!title || !description || !startDate || !endDate) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }
    
    const timeline = await Timeline.create({
        title,
        description,
        startDate,
        endDate,
    });
    
    res.status(201).json({
        success: true,
        message: "Timeline created successfully",
        timeline,
    });
});

exports.getTimelines = catchAsyncErrors(async (req, res, next) => {
    const timelines = await Timeline.find();
    if (!timelines) {
        return next(new ErrorHandler("No timelines found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Timelines retrieved successfully",
        timelines,
    });
});

exports.getTimeline = catchAsyncErrors(async (req, res, next) => {
    const timeline = await Timeline.findById(req.params.id);
    if (!timeline) {
        return next(new ErrorHandler("Timeline not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Timeline retrieved successfully",
        timeline,
    });
});

exports.updateTimeline = catchAsyncErrors(async (req, res, next) => {
    const { title, description, startDate, endDate } = req.body;
    const newTimeline = {
        title,
        description,
        startDate,
        endDate,
    };
    const timeline = await Timeline.findByIdAndUpdate(req.params.id, newTimeline, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    if (!timeline) {
        return next(new ErrorHandler("Timeline not found", 404));
    }
    res.status(200).json({
        success: true,
        message: "Timeline updated successfully",
        timeline,
    });
});

exports.deleteTimeline = catchAsyncErrors(async (req, res, next) => {
    const timeline = await Timeline.findById(req.params.id);
    if (!timeline) {
        return next(new ErrorHandler("Timeline not found", 404));
    }
    await timeline.deleteOne();
    res.status(200).json({
        success: true,
        message: "Timeline deleted successfully",
    });
});
