const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const { ErrorHandler } = require("../Middlewares/error");
const cloudinary = require("cloudinary");
const Project = require("../Models/projectSchema");

exports.createProject = catchAsyncErrors(async (req, res, next) => {
    const { title, description, projectLink, githubLink, technologies, stack, deployed } = req.body;
    if (!title || !description || !projectLink || !githubLink || !technologies || !stack || !deployed) {
        return next(new ErrorHandler("Please fill in all fields", 400));
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Please upload an image", 400));
    }
    const { image } = req.files;
    if (image.size > process.env.MAX_IMAGE_SIZE) {
        return next(new ErrorHandler("Please upload an image less than 1mb", 400));
    }
    if (!image || !Object.keys(image).length || !image.mimetype.startsWith("image")) {
        return next(new ErrorHandler("Please upload a valid image file", 400));
    }
    try {
        const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
            folder: "PROJECT",
        });
        if (!result) {
            return next(new ErrorHandler("Something went wrong while uploading image", 500));
        }

        const project = await Project.create({
            title,
            description,
            projectLink,
            githubLink,
            technologies: technologies.split(",").map((tech) => tech.trim()),
            stack,
            deployed,
            projectImage: {
                public_id: result.public_id,
                url: result.secure_url,
            }
        });

        res.status(201).json({
            success: true,
            project,
            message: "Project added successfully",
        });
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getProjects = catchAsyncErrors(async (req, res, next) => {
    const projects = await Project.find();
    if (!projects) {
        return next(new ErrorHandler("No projects found", 404));
    }
    res.status(200).json({
        success: true,
        projects,
    });
});

exports.getProject = catchAsyncErrors(async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }
    res.status(200).json({
        success: true,
        project,
    });
});

exports.updateProject = catchAsyncErrors(async (req, res, next) => {
    const { title, description, projectLink, githubLink, technologies, stack, deployed } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    if (req.files && req.files.image) {
        try {
            const { image } = req.files;
            if (image.size > process.env.MAX_IMAGE_SIZE) {
                return next(new ErrorHandler("Please upload an image less than 1mb", 400));
            }
            if (!image.mimetype.startsWith("image")) {
                return next(new ErrorHandler("Please upload a valid image file", 400));
            }
            const deleteImage = await cloudinary.v2.uploader.destroy(project.projectImage.public_id);
            if (!deleteImage) {
                return next(new ErrorHandler("Something went wrong while uploading image", 500));
            }
            const result = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                folder: "PROJECT",
                width: 150,
            });
            if (!result) {
                return next(new ErrorHandler("Something went wrong while uploading image", 500));
            }
            project.projectImage = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.projectLink = projectLink || project.projectLink;
    project.githubLink = githubLink || project.githubLink;
    project.technologies = technologies ? technologies.split(",").map((tech) => tech.trim()) : project.technologies;
    project.stack = stack || project.stack;
    project.deployed = deployed || project.deployed;
    await project.save();

    res.status(200).json({
        success: true,
        project,
        message: "Project updated successfully",
    });
});


exports.deleteProject = catchAsyncErrors(async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }
    try {
        const deleteImage = await cloudinary.v2.uploader.destroy(project.projectImage.public_id);
        if (!deleteImage) {
            return next(new ErrorHandler("Something went wrong while deleting image", 500));
        }
        await project.deleteOne();
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
    });
});

